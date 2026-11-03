const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { randomUUID } = require("crypto");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const sns = new SNSClient({});
const TABLE = process.env.RECRUITMENT_TABLE;
const BUCKET = process.env.STORAGE_BUCKET;
const TOPIC_ARN = process.env.RECRUITMENT_TOPIC_ARN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINKEDIN_RE = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/;
const CANDIDATE_RE = /^c-[0-9a-f-]{36}$/;
const CERT_KEY_RE = /^[a-z0-9-]{1,40}$/;
const ALLOWED = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png" };
const MAX_BYTES = 5 * 1024 * 1024;
const EXPIRES = 300;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable", "TransactionConflictException", "SlowDown"];

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

const strip = (item) => {
  if (!item) return item;
  const { PK, SK, GSI1PK, GSI1SK, ...rest } = item;
  return rest;
};

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

const parseBody = (event) => {
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body;
    const body = JSON.parse(raw || "{}");
    if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "El body debe ser un objeto JSON" };
    return { body };
  } catch (e) {
    return { error: "Body JSON inválido", detail: e.message };
  }
};

const handleError = (err, log, requestId, tenantId) => {
  if (err instanceof TenantViolationError) {
    log("ERROR", "SECURITY: violación de aislamiento multi-tenant", { requestId, tenantId, details: err.details });
    return res(403, { message: "Acceso denegado", requestId });
  }

  const reasons = (err.CancellationReasons || []).map((r) => r?.Code);

  log("ERROR", "Fallo inesperado", {
    requestId,
    tenantId,
    errorName: err.name,
    error: err.message,
    cancellationReasons: reasons.length ? reasons : undefined,
    awsStatus: err.$metadata?.httpStatusCode,
    awsRequestId: err.$metadata?.requestId,
    stack: err.stack,
  });

  if (err.name === "ConditionalCheckFailedException")
    return res(409, { message: "Conflicto: el recurso ya existe o cambió de estado", requestId });
  if (RETRYABLE.includes(err.name) || reasons.includes("TransactionConflict") || reasons.includes("ThrottlingError"))
    return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
  if (err.name === "ResourceNotFoundException" || err.name === "NoSuchBucket")
    return res(500, { message: "Recurso no encontrado en la infraestructura", requestId });
  if (err.name === "AccessDeniedException" || err.name === "AccessDenied")
    return res(500, { message: "Permisos insuficientes del servicio", requestId });

  return res(500, { message: "Error interno", requestId });
};

const publish = (eventType, tenantId, payload) =>
  sns.send(
    new PublishCommand({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify({ eventType, ...payload }),
      MessageAttributes: {
        eventType: { DataType: "String", StringValue: eventType },
        tenantId: { DataType: "String", StringValue: tenantId },
      },
    })
  );

module.exports.main = async (event, context) => {
  const log = makeLog("createCandidate");
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

    const parsed = parseBody(event);
    if (parsed.error) {
      log("WARN", parsed.error, { requestId, tenantId, detail: parsed.detail });
      return res(400, { message: parsed.error });
    }
    const body = parsed.body;

    const { vacancyId, fullName, email, phone, linkedin } = body;

    if (!vacancyId || typeof vacancyId !== "string" || !vacancyId.trim())
      return res(400, { message: "vacancyId es obligatorio" });
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3)
      return res(400, { message: "fullName es obligatorio (mínimo 3 caracteres)" });
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim()))
      return res(400, { message: "email inválido" });
    if (phone != null && (typeof phone !== "string" || !/^\+?[0-9\s-]{6,20}$/.test(phone)))
      return res(400, { message: "phone inválido" });
    if (linkedin != null && (typeof linkedin !== "object" || Array.isArray(linkedin)))
      return res(400, { message: "linkedin debe ser un objeto { url, headline, yearsExperience }" });
    if (linkedin?.url != null && (typeof linkedin.url !== "string" || !LINKEDIN_RE.test(linkedin.url.trim())))
      return res(400, { message: "linkedin.url debe ser https://linkedin.com/in/<perfil>" });
    if (linkedin?.headline != null && (typeof linkedin.headline !== "string" || linkedin.headline.length > 220))
      return res(400, { message: "linkedin.headline máximo 220 caracteres" });
    if (linkedin?.yearsExperience != null && (!Number.isInteger(linkedin.yearsExperience) || linkedin.yearsExperience < 0 || linkedin.yearsExperience > 60))
      return res(400, { message: "linkedin.yearsExperience debe ser entero entre 0 y 60" });

    const vId = vacancyId.trim();
    const normEmail = email.trim().toLowerCase();
    const pk = `TENANT#${tenantId}`;

    const vac = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: `VACANCY#${vId}` } }));

    if (!vac.Item) {
      log("WARN", "Vacante no encontrada", { requestId, tenantId, vacancyId: vId });
      return res(404, { message: "Vacante no encontrada" });
    }
    if (vac.Item.status !== "OPEN") {
      log("WARN", "Vacante cerrada", { requestId, tenantId, vacancyId: vId, status: vac.Item.status });
      return res(409, { message: "La vacante no está abierta" });
    }
    if (vac.Item.requireLinkedin && !linkedin?.url)
      return res(400, { message: "Esta vacante exige la sección LinkedIn (linkedin.url)" });

    const certificates = {};
    for (const c of vac.Item.requiredCertificates || []) {
      certificates[c.key] = {
        name: c.name,
        description: c.description || "",
        mandatory: c.mandatory,
        status: "PENDING",
        s3Key: null,
        contentType: null,
        size: null,
        uploadedAt: null,
      };
    }

    const candidateId = `c-${randomUUID()}`;
    const now = new Date().toISOString();

    const item = {
      PK: pk,
      SK: `CANDIDATE#${candidateId}`,
      entityType: "CANDIDATE",
      candidateId,
      tenantId,
      vacancyId: vId,
      vacancyTitle: vac.Item.title,
      fullName: fullName.trim(),
      email: normEmail,
      phone: phone || null,
      linkedin: linkedin
        ? {
            url: linkedin.url ? linkedin.url.trim() : null,
            headline: linkedin.headline || null,
            yearsExperience: linkedin.yearsExperience ?? null,
          }
        : null,
      certificates,
      stage: "DRAFT",
      resumeS3Key: null,
      resumeStatus: "PENDING",
      stageHistory: [],
      createdAt: now,
      updatedAt: now,
      submittedAt: null,
      GSI1PK: `${pk}#VACANCY#${vId}`,
      GSI1SK: `CANDIDATE#${now}#${candidateId}`,
    };

    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: TABLE,
                Item: { PK: pk, SK: `UNIQUE#APPLICATION#${vId}#${normEmail}`, entityType: "UNIQUE_GUARD", candidateId, createdAt: now },
                ConditionExpression: "attribute_not_exists(SK)",
              },
            },
            {
              Put: {
                TableName: TABLE,
                Item: item,
                ConditionExpression: "attribute_not_exists(SK)",
              },
            },
            {
              ConditionCheck: {
                TableName: TABLE,
                Key: { PK: pk, SK: `VACANCY#${vId}` },
                ConditionExpression: "attribute_exists(SK) AND #st = :open",
                ExpressionAttributeNames: { "#st": "status" },
                ExpressionAttributeValues: { ":open": "OPEN" },
              },
            },
          ],
        })
      );
    } catch (txErr) {
      if (txErr.name === "TransactionCanceledException") {
        const reasons = (txErr.CancellationReasons || []).map((r) => r?.Code);
        log("WARN", "Transacción cancelada", { requestId, tenantId, vacancyId: vId, reasons });
        if (reasons[0] === "ConditionalCheckFailed")
          return res(409, { message: "Este email ya postuló a esta vacante", requestId });
        if (reasons[2] === "ConditionalCheckFailed")
          return res(409, { message: "La vacante fue cerrada o eliminada", requestId });
      }
      throw txErr;
    }

    const pending = [
      { key: "resume", name: "CV (PDF)" },
      ...Object.entries(certificates)
        .filter(([, c]) => c.mandatory)
        .map(([key, c]) => ({ key, name: c.name })),
    ];

    log("INFO", "Candidatura creada en borrador", { requestId, tenantId, candidateId, vacancyId: vId, pendingCerts: pending.length });
    return res(201, {
      message: "Candidatura creada en borrador. Sube tu CV y los certificados obligatorios, luego envíala.",
      candidate: strip(item),
      pendingUploads: pending,
    });
  } catch (err) {
    return handleError(err, log, requestId, tenantId);
  }
};

module.exports.uploadUrl = async (event, context) => {
  const log = makeLog("getCertificateUploadUrl");
  const requestId = context?.awsRequestId || "local";
  let tenantId = null;

  try {
    if (!TABLE || !BUCKET) {
      log("ERROR", "Variables de entorno faltantes", { requestId, TABLE: !!TABLE, BUCKET: !!BUCKET });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

    const candidateId = event.pathParameters?.candidateId;
    const certKey = event.pathParameters?.certKey;
    if (!candidateId || !CANDIDATE_RE.test(candidateId))
      return res(400, { message: "candidateId inválido" });
    if (!certKey || !CERT_KEY_RE.test(certKey))
      return res(400, { message: "certKey inválido" });

    const parsed = parseBody(event);
    if (parsed.error) {
      log("WARN", parsed.error, { requestId, tenantId, detail: parsed.detail });
      return res(400, { message: parsed.error });
    }
    const { contentType } = parsed.body;
    if (!ALLOWED[contentType])
      return res(400, { message: `contentType debe ser uno de: ${Object.keys(ALLOWED).join(", ")}` });

    const pk = `TENANT#${tenantId}`;
    const sk = `CANDIDATE#${candidateId}`;

    const cand = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
    if (!cand.Item) {
      log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
      return res(404, { message: "Candidato no encontrado" });
    }
    if (cand.Item.stage !== "DRAFT")
      return res(409, { message: "La candidatura ya fue enviada, no se pueden modificar certificados" });
    if (!cand.Item.certificates?.[certKey])
      return res(404, { message: "Este certificado no es requerido por la vacante" });

    const s3Key = `${tenantId}/recruitment/certificates/${candidateId}/${certKey}.${ALLOWED[contentType]}`;

    const post = await createPresignedPost(s3, {
      Bucket: BUCKET,
      Key: s3Key,
      Conditions: [
        ["content-length-range", 1, MAX_BYTES],
        ["eq", "$Content-Type", contentType],
      ],
      Fields: { "Content-Type": contentType },
      Expires: EXPIRES,
    });

    const now = new Date().toISOString();
    await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: pk, SK: sk },
        UpdateExpression: "SET certificates.#k.s3Key = :key, certificates.#k.contentType = :ct, certificates.#k.#s = :st, updatedAt = :now",
        ConditionExpression: "#stage = :draft",
        ExpressionAttributeNames: { "#k": certKey, "#s": "status", "#stage": "stage" },
        ExpressionAttributeValues: { ":key": s3Key, ":ct": contentType, ":st": "URL_ISSUED", ":now": now, ":draft": "DRAFT" },
      })
    );

    log("INFO", "URL de subida emitida", { requestId, tenantId, candidateId, certKey });
    return res(200, { uploadUrl: post.url, fields: post.fields, s3Key, expiresIn: EXPIRES, maxBytes: MAX_BYTES });
  } catch (err) {
    return handleError(err, log, requestId, tenantId);
  }
};

module.exports.submit = async (event, context) => {
  const log = makeLog("submitCandidate");
  const requestId = context?.awsRequestId || "local";
  let tenantId = null;

  try {
    if (!TABLE || !BUCKET) {
      log("ERROR", "Variables de entorno faltantes", { requestId, TABLE: !!TABLE, BUCKET: !!BUCKET });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

    const candidateId = event.pathParameters?.candidateId;
    if (!candidateId || !CANDIDATE_RE.test(candidateId))
      return res(400, { message: "candidateId inválido" });

    const pk = `TENANT#${tenantId}`;
    const sk = `CANDIDATE#${candidateId}`;

    const cand = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
    if (!cand.Item) {
      log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
      return res(404, { message: "Candidato no encontrado" });
    }
    if (cand.Item.stage !== "DRAFT")
      return res(409, { message: "La candidatura ya fue enviada" });

    const prefix = `${tenantId}/recruitment/certificates/${candidateId}/`;
    const entries = Object.entries(cand.Item.certificates || {});

    const checks = await Promise.all(
      entries.map(async ([key, c]) => {
        if (!c.s3Key || !c.s3Key.startsWith(prefix)) return { key, c, ok: false, reason: "NO_SUBIDO" };
        try {
          const h = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: c.s3Key }));
          if (!h.ContentLength || h.ContentLength > MAX_BYTES) return { key, c, ok: false, reason: "TAMANO_INVALIDO" };
          return { key, c, ok: true, size: h.ContentLength, uploadedAt: h.LastModified ? h.LastModified.toISOString() : null };
        } catch (e) {
          if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) return { key, c, ok: false, reason: "NO_SUBIDO" };
          throw e;
        }
      })
    );

    let resumeOk = false;
    if (cand.Item.resumeS3Key && cand.Item.resumeS3Key === `${tenantId}/recruitment/resumes/${candidateId}.pdf`) {
      try {
        const h = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: cand.Item.resumeS3Key }));
        resumeOk = !!h.ContentLength && h.ContentLength <= MAX_BYTES;
      } catch (e) {
        if (!(e.name === "NotFound" || e.$metadata?.httpStatusCode === 404)) throw e;
      }
    }

    const missing = checks.filter((x) => x.c.mandatory && !x.ok).map((x) => ({ key: x.key, name: x.c.name, reason: x.reason }));
    if (!resumeOk) missing.unshift({ key: "resume", name: "CV (PDF)", reason: "NO_SUBIDO" });

    if (missing.length) {
      log("WARN", "Faltan archivos obligatorios", { requestId, tenantId, candidateId, missing });
      return res(422, { message: "No se puede enviar la candidatura: faltan archivos obligatorios", missing });
    }

    const now = new Date().toISOString();
    const certificates = {};
    for (const x of checks) {
      certificates[x.key] = {
        ...x.c,
        status: x.ok ? "UPLOADED" : "PENDING",
        size: x.ok ? x.size : null,
        uploadedAt: x.ok ? x.uploadedAt : null,
      };
    }

    const entry = { from: "DRAFT", to: "APPLIED", at: now, by: cand.Item.email, note: null };

    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Update: {
                TableName: TABLE,
                Key: { PK: pk, SK: sk },
                UpdateExpression: "SET #stage = :applied, certificates = :certs, resumeStatus = :rs, submittedAt = :now, updatedAt = :now, stageHistory = list_append(if_not_exists(stageHistory, :empty), :entry)",
                ConditionExpression: "#stage = :draft",
                ExpressionAttributeNames: { "#stage": "stage" },
                ExpressionAttributeValues: { ":applied": "APPLIED", ":draft": "DRAFT", ":certs": certificates, ":rs": "UPLOADED", ":now": now, ":empty": [], ":entry": [entry] },
              },
            },
            {
              Update: {
                TableName: TABLE,
                Key: { PK: pk, SK: `VACANCY#${cand.Item.vacancyId}` },
                UpdateExpression: "ADD candidatesCount :one SET updatedAt = :now",
                ConditionExpression: "attribute_exists(SK) AND #st = :open",
                ExpressionAttributeNames: { "#st": "status" },
                ExpressionAttributeValues: { ":one": 1, ":now": now, ":open": "OPEN" },
              },
            },
          ],
        })
      );
    } catch (txErr) {
      if (txErr.name === "TransactionCanceledException") {
        const reasons = (txErr.CancellationReasons || []).map((r) => r?.Code);
        log("WARN", "Transacción cancelada", { requestId, tenantId, candidateId, reasons });
        if (reasons[0] === "ConditionalCheckFailed")
          return res(409, { message: "La candidatura ya fue enviada", requestId });
        if (reasons[1] === "ConditionalCheckFailed")
          return res(409, { message: "La vacante fue cerrada o eliminada", requestId });
      }
      throw txErr;
    }

    log("INFO", "Candidatura enviada", { requestId, tenantId, candidateId, vacancyId: cand.Item.vacancyId });

    let notification = "SKIPPED";
    if (TOPIC_ARN) {
      try {
        await publish("candidate.stage_changed", tenantId, {
          tenantId,
          candidateId,
          vacancyId: cand.Item.vacancyId,
          vacancyTitle: cand.Item.vacancyTitle,
          fullName: cand.Item.fullName,
          email: cand.Item.email,
          fromStage: "DRAFT",
          toStage: "APPLIED",
          note: null,
          changedBy: cand.Item.email,
          changedAt: now,
        });
        notification = "QUEUED";
        log("INFO", "Evento publicado", { requestId, tenantId, candidateId, eventType: "candidate.stage_changed" });
      } catch (pubErr) {
        notification = "FAILED";
        log("ERROR", "Fallo al publicar evento SNS", { requestId, tenantId, candidateId, errorName: pubErr.name, error: pubErr.message });
      }
    } else {
      log("WARN", "RECRUITMENT_TOPIC_ARN no definida, no se envía notificación", { requestId, tenantId, candidateId });
    }

    return res(200, { message: "Candidatura enviada", candidateId, stage: "APPLIED", resumeStatus: "UPLOADED", certificates, notification, requestId });
  } catch (err) {
    return handleError(err, log, requestId, tenantId);
  }
};
