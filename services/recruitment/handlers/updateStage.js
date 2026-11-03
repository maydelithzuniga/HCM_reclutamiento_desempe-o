const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sns = new SNSClient({});
const TABLE = process.env.RECRUITMENT_TABLE;
const TOPIC_ARN = process.env.RECRUITMENT_TOPIC_ARN;

const CANDIDATE_RE = /^c-[0-9a-f-]{36}$/;
const TRANSITIONS = {
  DRAFT: [],
  APPLIED: ["INTERVIEW", "REJECTED"],
  INTERVIEW: ["OFFER", "REJECTED"],
  OFFER: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
};
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "updateStage", msg, ts: new Date().toISOString(), ...extra }));

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
  const requestId = context?.awsRequestId || "local";
  let tenantId = null;

  try {
    if (!TABLE || !TOPIC_ARN) {
      log("ERROR", "Variables de entorno faltantes", { requestId, TABLE: !!TABLE, TOPIC_ARN: !!TOPIC_ARN });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

    const candidateId = event.pathParameters?.candidateId;
    if (!candidateId || !CANDIDATE_RE.test(candidateId)) {
      log("WARN", "candidateId inválido", { requestId, tenantId, candidateId });
      return res(400, { message: "candidateId inválido" });
    }

    let body;
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body;
      body = JSON.parse(raw || "{}");
    } catch (parseErr) {
      log("WARN", "Body JSON inválido", { requestId, tenantId, error: parseErr.message });
      return res(400, { message: "Body JSON inválido" });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      log("WARN", "Body no es un objeto", { requestId, tenantId });
      return res(400, { message: "El body debe ser un objeto JSON" });
    }

    const { stage, note } = body;
    const toStage = typeof stage === "string" ? stage.trim().toUpperCase() : null;

    if (!toStage || !(toStage in TRANSITIONS))
      return res(400, { message: `stage debe ser uno de: ${Object.keys(TRANSITIONS).filter((s) => s !== "DRAFT").join(", ")}` });
    if (note != null && (typeof note !== "string" || note.length > 500))
      return res(400, { message: "note debe ser texto de máximo 500 caracteres" });

    const pk = `TENANT#${tenantId}`;
    const sk = `CANDIDATE#${candidateId}`;

    const cand = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
    if (!cand.Item) {
      log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
      return res(404, { message: "Candidato no encontrado" });
    }

    const fromStage = cand.Item.stage;
    if (fromStage === "DRAFT")
      return res(409, { message: "La candidatura aún no fue enviada" });
    if (fromStage === toStage)
      return res(409, { message: `El candidato ya está en ${toStage}` });

    const allowed = TRANSITIONS[fromStage] || [];
    if (!allowed.includes(toStage)) {
      log("WARN", "Transición inválida", { requestId, tenantId, candidateId, fromStage, toStage });
      return res(422, { message: `No se puede pasar de ${fromStage} a ${toStage}`, allowed });
    }

    const now = new Date().toISOString();
    const changedBy = event.requestContext?.authorizer?.claims?.email || event.requestContext?.authorizer?.jwt?.claims?.email || "system";
    const entry = { from: fromStage, to: toStage, at: now, by: changedBy, note: note ? note.trim() : null };

    const updated = await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: pk, SK: sk },
        UpdateExpression: "SET #stage = :to, updatedAt = :now, stageHistory = list_append(if_not_exists(stageHistory, :empty), :entry)",
        ConditionExpression: "attribute_exists(SK) AND #stage = :from",
        ExpressionAttributeNames: { "#stage": "stage" },
        ExpressionAttributeValues: { ":to": toStage, ":from": fromStage, ":now": now, ":empty": [], ":entry": [entry] },
        ReturnValues: "ALL_NEW",
      })
    );

    log("INFO", "Etapa actualizada", { requestId, tenantId, candidateId, fromStage, toStage });

    const payload = {
      tenantId,
      candidateId,
      vacancyId: cand.Item.vacancyId,
      vacancyTitle: cand.Item.vacancyTitle,
      fullName: cand.Item.fullName,
      email: cand.Item.email,
      fromStage,
      toStage,
      note: entry.note,
      changedBy,
      changedAt: now,
    };

    const pubs = [publish("candidate.stage_changed", tenantId, payload)];
    if (toStage === "HIRED") pubs.push(publish("candidate.hired", tenantId, payload));

    const results = await Promise.allSettled(pubs);
    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      log("ERROR", "Fallo al publicar evento SNS", {
        requestId,
        tenantId,
        candidateId,
        errors: failed.map((f) => ({ name: f.reason?.name, message: f.reason?.message })),
      });
    } else {
      log("INFO", "Eventos publicados", { requestId, tenantId, candidateId, events: pubs.length });
    }

    return res(200, {
      message: "Etapa actualizada",
      candidate: strip(updated.Attributes),
      notification: failed.length ? "FAILED" : "QUEUED",
      requestId,
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

    if (err.name === "ConditionalCheckFailedException")
      return res(409, { message: "La etapa cambió mientras se procesaba, recarga e intenta de nuevo", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
