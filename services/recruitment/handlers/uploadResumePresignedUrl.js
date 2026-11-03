const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");
const { createPresignedPost } = require("@aws-sdk/s3-presigned-post");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});
const TABLE = process.env.RECRUITMENT_TABLE;
const BUCKET = process.env.STORAGE_BUCKET;

const CANDIDATE_RE = /^c-[0-9a-f-]{36}$/;
const CONTENT_TYPE = "application/pdf";
const MAX_BYTES = 5 * 1024 * 1024;
const EXPIRES = 300;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable", "SlowDown"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "uploadResumePresignedUrl", msg, ts: new Date().toISOString(), ...extra }));

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

module.exports.main = async (event, context) => {
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
    if (!candidateId || !CANDIDATE_RE.test(candidateId)) {
      log("WARN", "candidateId inválido", { requestId, tenantId, candidateId });
      return res(400, { message: "candidateId inválido" });
    }

    let body = {};
    if (event.body) {
      try {
        const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
        body = JSON.parse(raw);
      } catch (parseErr) {
        log("WARN", "Body JSON inválido", { requestId, tenantId, error: parseErr.message });
        return res(400, { message: "Body JSON inválido" });
      }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        log("WARN", "Body no es un objeto", { requestId, tenantId });
        return res(400, { message: "El body debe ser un objeto JSON" });
      }
    }

    if (body.contentType && body.contentType !== CONTENT_TYPE)
      return res(400, { message: "El CV debe ser un PDF (application/pdf)" });

    const pk = `TENANT#${tenantId}`;
    const sk = `CANDIDATE#${candidateId}`;

    const cand = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
    if (!cand.Item) {
      log("WARN", "Candidato no encontrado", { requestId, tenantId, candidateId });
      return res(404, { message: "Candidato no encontrado" });
    }
    if (cand.Item.stage !== "DRAFT") {
      log("WARN", "Candidatura ya enviada", { requestId, tenantId, candidateId, stage: cand.Item.stage });
      return res(409, { message: "La candidatura ya fue enviada, no se puede cambiar el CV" });
    }

    const s3Key = `${tenantId}/recruitment/resumes/${candidateId}.pdf`;

    const post = await createPresignedPost(s3, {
      Bucket: BUCKET,
      Key: s3Key,
      Conditions: [
        ["content-length-range", 1, MAX_BYTES],
        ["eq", "$Content-Type", CONTENT_TYPE],
      ],
      Fields: { "Content-Type": CONTENT_TYPE },
      Expires: EXPIRES,
    });

    const now = new Date().toISOString();
    await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: pk, SK: sk },
        UpdateExpression: "SET resumeS3Key = :key, resumeStatus = :st, updatedAt = :now",
        ConditionExpression: "attribute_exists(SK) AND #stage = :draft",
        ExpressionAttributeNames: { "#stage": "stage" },
        ExpressionAttributeValues: { ":key": s3Key, ":st": "URL_ISSUED", ":now": now, ":draft": "DRAFT" },
      })
    );

    log("INFO", "URL de subida de CV emitida", { requestId, tenantId, candidateId, s3Key });
    return res(200, { uploadUrl: post.url, fields: post.fields, s3Key, expiresIn: EXPIRES, maxBytes: MAX_BYTES });
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
      return res(409, { message: "La candidatura cambió de estado, no se puede subir el CV", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException" || err.name === "NoSuchBucket")
      return res(500, { message: "Recurso no encontrado en la infraestructura", requestId });
    if (err.name === "AccessDeniedException" || err.name === "AccessDenied")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
