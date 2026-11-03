const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, HeadObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const TABLE = process.env.RECRUITMENT_TABLE;
const BUCKET = process.env.STORAGE_BUCKET;

const VACANCY_RE = /^v-[0-9a-f-]{36}$/;
const CANDIDATE_RE = /^c-[0-9a-f-]{36}$/;
const CERT_KEY_RE = /^[a-z0-9-]{1,40}$/;
const STAGES = ["DRAFT", "APPLIED", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];
const VACANCY_STATUS = ["OPEN", "CLOSED"];
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_PAGES = 25;
const MAX_STATS_ITEMS = 5000;
const URL_EXPIRES = 300;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable", "SlowDown"];

const makeLog = (fn) => (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn, msg, ts: new Date().toISOString(), ...extra }));

const res = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});

const getTenantId = (event) => {
  const auth = event.requestContext?.authorizer || {};
  const claims = auth.claims || auth.jwt?.claims || {};
  const fromToken = claims["custom:tenant_id"];
  if (fromToken) return fromToken;

  if (process.env.IS_OFFLINE) {
    const h = event.headers || {};
    return h["x-tenant-id"] || h["X-Tenant-Id"];
  }
  return null;
};

const strip = (item) => {
  if (!item) return item;
  const { PK, SK, GSI1PK, GSI1SK, ...rest } = item;
  return rest;
};

const parseLimit = (v) => {
  if (v == null || v === "") return DEFAULT_LIMIT;
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= MAX_LIMIT ? n : null;
};

const encodeToken = (k) => (k ? Buffer.from(JSON.stringify(k)).toString("base64url") : null);

const decodeToken = (t, pk) => {
  if (!t) return undefined;
  try {
    const k = JSON.parse(Buffer.from(String(t), "base64url").toString("utf8"));
    if (!k || typeof k !== "object" || k.PK !== pk) return null;
    return k;
  } catch {
    return null;
  }
};

const paged = async (params, limit, startKey) => {
  const items = [];
  let lastKey = startKey;
  let pages = 0;
  do {
    const out = await ddb.send(new QueryCommand({ ...params, Limit: limit - items.length, ExclusiveStartKey: lastKey }));
    items.push(...(out.Items || []));
    lastKey = out.LastEvaluatedKey;
    pages++;
  } while (lastKey && items.length < limit && pages < MAX_PAGES);
  return { items, lastKey };
};

const buildFilter = (conds) => {
  const parts = [];
  const names = {};
  const values = {};
  for (const [expr, n, v] of conds) {
    parts.push(expr);
    Object.assign(names, n);
    Object.assign(values, v);
  }
  return { expr: parts.join(" AND "), names, values };
};

const withFilter = (base, f) => {
  const p = { ...base, ExpressionAttributeValues: { ...base.ExpressionAttributeValues, ...f.values } };
  if (f.expr) p.FilterExpression = f.expr;
  const names = { ...(base.ExpressionAttributeNames || {}), ...f.names };
  if (Object.keys(names).length) p.ExpressionAttributeNames = names;
  return p;
};

const certSummary = (certs = {}) => {
  const list = Object.values(certs);
  return {
    total: list.length,
    uploaded: list.filter((c) => c.status === "UPLOADED").length,
    mandatoryPending: list.filter((c) => c.mandatory && c.status !== "UPLOADED").length,
  };
};

const wrap = (fn, handler) => async (event, context) => {
  const log = makeLog(fn);
  const requestId = context?.awsRequestId || "local";
  let tenantId = null;

  try {
    if (!TABLE) {
      log("ERROR", "RECRUITMENT_TABLE no definida", { requestId });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

    return await handler({
      event,
      log,
      requestId,
      tenantId,
      pk: `TENANT#${tenantId}`,
      qs: event.queryStringParameters || {},
      path: event.pathParameters || {},
    });
  } catch (err) {
    if (err instanceof TenantViolationError) {
      log("ERROR", "SECURITY: violación de aislamiento multi-tenant", { requestId, tenantId, details: err.details });
      return res(403, { message: "Acceso denegado", requestId });
    }

    log("ERROR", "Fallo inesperado", {
      requestId,
      tenantId,
      errorName: err.name,
      error: err.message,
      awsStatus: err.$metadata?.httpStatusCode,
      awsRequestId: err.$metadata?.requestId,
      stack: err.stack,
    });

    if (err.name === "ValidationException")
      return res(400, { message: "Parámetros de consulta inválidos", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException" || err.name === "NoSuchBucket")
      return res(500, { message: "Recurso no encontrado en la infraestructura", requestId });
    if (err.name === "AccessDeniedException" || err.name === "AccessDenied")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};

module.exports.listVacancies = wrap("listVacancies", async ({ log, requestId, tenantId, pk, qs }) => {
  const limit = parseLimit(qs.limit);
  if (limit === null) return res(400, { message: `limit debe ser entero entre 1 y ${MAX_LIMIT}` });

  const startKey = decodeToken(qs.nextToken, pk);
  if (startKey === null) {
    log("WARN", "nextToken inválido o de otro tenant", { requestId, tenantId });
    return res(400, { message: "nextToken inválido" });
  }

  const status = qs.status ? String(qs.status).toUpperCase() : null;
  if (status && !VACANCY_STATUS.includes(status))
    return res(400, { message: `status debe ser uno de: ${VACANCY_STATUS.join(", ")}` });

  const department = qs.department ? String(qs.department).trim() : null;
  if (department !== null && (department.length < 1 || department.length > 100))
    return res(400, { message: "department inválido" });

  const conds = [];
  if (status) conds.push(["#status = :status", { "#status": "status" }, { ":status": status }]);
  if (department) conds.push(["department = :dep", {}, { ":dep": department }]);

  const params = withFilter(
    {
      TableName: TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
      ExpressionAttributeValues: { ":pk": pk, ":prefix": "VACANCY#" },
    },
    buildFilter(conds)
  );

  const { items, lastKey } = await paged(params, limit, startKey);

  log("INFO", "Vacantes listadas", { requestId, tenantId, count: items.length, status, department, hasMore: !!lastKey });
  return res(200, { items: items.map(strip), count: items.length, nextToken: encodeToken(lastKey) });
});

module.exports.getVacancy = wrap("getVacancy", async ({ log, requestId, tenantId, pk, qs, path }) => {
  const vacancyId = path.vacancyId;
  if (!vacancyId || !VACANCY_RE.test(vacancyId)) return res(400, { message: "vacancyId inválido" });

  const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: `VACANCY#${vacancyId}` } }));
  if (!out.Item) {
    log("WARN", "Vacante no encontrada", { requestId, tenantId, vacancyId });
    return res(404, { message: "Vacante no encontrada" });
  }

  let stats;
  if (qs.withStats !== "false") {
    const byStage = Object.fromEntries(STAGES.map((s) => [s, 0]));
    let lastKey;
    let counted = 0;
    do {
      const page = await ddb.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: "GSI1",
          KeyConditionExpression: "GSI1PK = :g",
          ProjectionExpression: "#stage",
          ExpressionAttributeNames: { "#stage": "stage" },
          ExpressionAttributeValues: { ":g": `${pk}#VACANCY#${vacancyId}` },
          ExclusiveStartKey: lastKey,
        })
      );
      for (const it of page.Items || []) {
        if (it.stage in byStage) byStage[it.stage]++;
        counted++;
      }
      lastKey = page.LastEvaluatedKey;
    } while (lastKey && counted < MAX_STATS_ITEMS);

    stats = {
      byStage,
      totalSubmitted: counted - byStage.DRAFT,
      totalDrafts: byStage.DRAFT,
      truncated: !!lastKey,
    };
  }

  log("INFO", "Vacante consultada", { requestId, tenantId, vacancyId });
  return res(200, { vacancy: strip(out.Item), stats });
});

module.exports.listCandidates = wrap("listCandidates", async ({ log, requestId, tenantId, pk, qs }) => {
  const limit = parseLimit(qs.limit);
  if (limit === null) return res(400, { message: `limit debe ser entero entre 1 y ${MAX_LIMIT}` });

  const startKey = decodeToken(qs.nextToken, pk);
  if (startKey === null) {
    log("WARN", "nextToken inválido o de otro tenant", { requestId, tenantId });
    return res(400, { message: "nextToken inválido" });
  }

  const vacancyId = qs.vacancyId || null;
  if (vacancyId && !VACANCY_RE.test(vacancyId)) return res(400, { message: "vacancyId inválido" });

  const stage = qs.stage ? String(qs.stage).toUpperCase() : null;
  if (stage && !STAGES.includes(stage)) return res(400, { message: `stage debe ser uno de: ${STAGES.join(", ")}` });

  const includeDrafts = qs.includeDrafts === "true";

  const conds = [];
  if (stage) conds.push(["#stage = :stage", { "#stage": "stage" }, { ":stage": stage }]);
  else if (!includeDrafts) conds.push(["#stage <> :draft", { "#stage": "stage" }, { ":draft": "DRAFT" }]);

  const base = vacancyId
    ? {
        TableName: TABLE,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :g",
        ExpressionAttributeValues: { ":g": `${pk}#VACANCY#${vacancyId}` },
        ScanIndexForward: false,
      }
    : {
        TableName: TABLE,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
        ExpressionAttributeValues: { ":pk": pk, ":prefix": "CANDIDATE#" },
      };

  const { items, lastKey } = await paged(withFilter(base, buildFilter(conds)), limit, startKey);

  const list = items.map((c) => ({
    candidateId: c.candidateId,
    fullName: c.fullName,
    email: c.email,
    phone: c.phone,
    vacancyId: c.vacancyId,
    vacancyTitle: c.vacancyTitle,
    stage: c.stage,
    linkedinUrl: c.linkedin?.url || null,
    resumeStatus: c.resumeStatus || (c.resumeS3Key ? "URL_ISSUED" : "PENDING"),
    certificates: certSummary(c.certificates),
    submittedAt: c.submittedAt || null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  log("INFO", "Candidatos listados", { requestId, tenantId, vacancyId, stage, count: list.length, hasMore: !!lastKey });
  return res(200, { items: list, count: list.length, nextToken: encodeToken(lastKey) });
});

module.exports.getCandidate = wrap("getCandidate", async ({ log, requestId, tenantId, pk, path }) => {
  const candidateId = path.candidateId;
  if (!candidateId || !CANDIDATE_RE.test(candidateId)) return res(400, { message: "candidateId inválido" });

  const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: `CANDIDATE#${candidateId}` } }));
  if (!out.Item) {
    log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
    return res(404, { message: "Candidato no encontrado" });
  }

  const c = out.Item;
  const documents = [
    {
      docKey: "resume",
      name: "CV (PDF)",
      mandatory: true,
      status: c.resumeStatus || (c.resumeS3Key ? "URL_ISSUED" : "PENDING"),
      available: !!c.resumeS3Key,
    },
    ...Object.entries(c.certificates || {}).map(([key, cert]) => ({
      docKey: key,
      name: cert.name,
      mandatory: !!cert.mandatory,
      status: cert.status,
      available: !!cert.s3Key,
      size: cert.size ?? null,
      uploadedAt: cert.uploadedAt ?? null,
    })),
  ];

  log("INFO", "Candidato consultado", { requestId, tenantId, candidateId });
  return res(200, { candidate: strip(c), documents, certificatesSummary: certSummary(c.certificates) });
});

module.exports.getDocumentUrl = wrap("getDocumentUrl", async ({ log, requestId, tenantId, pk, path, qs }) => {
  if (!BUCKET) {
    log("ERROR", "STORAGE_BUCKET no definida", { requestId });
    return res(500, { message: "Error de configuración del servicio", requestId });
  }

  const { candidateId, docKey } = path;
  if (!candidateId || !CANDIDATE_RE.test(candidateId)) return res(400, { message: "candidateId inválido" });
  if (!docKey || (docKey !== "resume" && !CERT_KEY_RE.test(docKey))) return res(400, { message: "docKey inválido" });

  const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: `CANDIDATE#${candidateId}` } }));
  if (!out.Item) {
    log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
    return res(404, { message: "Candidato no encontrado" });
  }

  const s3Key = docKey === "resume" ? out.Item.resumeS3Key : out.Item.certificates?.[docKey]?.s3Key;
  if (!s3Key) return res(404, { message: "El documento no ha sido subido" });

  if (!s3Key.startsWith(`${tenantId}/recruitment/`)) {
    log("ERROR", "s3Key fuera del prefijo del tenant", { requestId, tenantId, candidateId, docKey, s3Key });
    return res(403, { message: "Acceso denegado al documento" });
  }

  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: s3Key }));
  } catch (e) {
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404)
      return res(404, { message: "El archivo aún no existe en el almacenamiento" });
    throw e;
  }

  const disposition = qs.download === "true" ? "attachment" : "inline";
  const filename = `${candidateId}_${docKey}.${s3Key.split(".").pop()}`;

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      ResponseContentDisposition: `${disposition}; filename="${filename}"`,
    }),
    { expiresIn: URL_EXPIRES }
  );

  log("INFO", "URL de documento emitida", { requestId, tenantId, candidateId, docKey, disposition });
  return res(200, { url, expiresIn: URL_EXPIRES, docKey, filename });
});
