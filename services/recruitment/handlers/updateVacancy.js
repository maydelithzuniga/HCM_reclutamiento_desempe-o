const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { createTenantDb, assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.RECRUITMENT_TABLE;

const VACANCY_RE = /^v-[0-9a-f-]{36}$/;
const VALID_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const STATUSES = ["OPEN", "CLOSED"];
const EDITABLE = ["status", "closeReason", "title", "department", "description", "location", "employmentType", "salaryMin", "salaryMax", "openings"];
const LOCKED = ["requiredCertificates", "requireLinkedin", "candidatesCount", "vacancyId", "createdAt", "createdBy", "entityType", "updatedAt", "PK", "SK", "GSI1PK", "GSI1SK"];
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "updateVacancy", msg, ts: new Date().toISOString(), ...extra }));

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

const toNumberOrNull = (v) => {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const strip = (item) => {
  if (!item) return item;
  const { PK, SK, GSI1PK, GSI1SK, ...rest } = item;
  return rest;
};

module.exports.main = async (event, context) => {
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
    const db = createTenantDb(tenantId, { client: ddb, table: TABLE });

    const vacancyId = event.pathParameters?.vacancyId;
    if (!vacancyId || !VACANCY_RE.test(vacancyId)) {
      log("WARN", "vacancyId inválido", { requestId, tenantId, vacancyId });
      return res(400, { message: "vacancyId inválido" });
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

    const keys = Object.keys(body).filter((k) => k !== "tenantId");
    const locked = keys.filter((k) => LOCKED.includes(k));
    if (locked.length)
      return res(400, { message: `No se pueden modificar: ${locked.join(", ")}` });
    const unknown = keys.filter((k) => !EDITABLE.includes(k));
    if (unknown.length)
      return res(400, { message: `Campos no permitidos: ${unknown.join(", ")}`, allowed: EDITABLE });
    if (!keys.length)
      return res(400, { message: "Envía al menos un campo a modificar", allowed: EDITABLE });

    const { status, closeReason, title, department, description, location, employmentType, salaryMin, salaryMax, openings } = body;
    const newStatus = status !== undefined ? String(status).toUpperCase() : undefined;

    if (newStatus !== undefined && !STATUSES.includes(newStatus))
      return res(400, { message: `status debe ser uno de: ${STATUSES.join(", ")}` });
    if (closeReason !== undefined && (typeof closeReason !== "string" || closeReason.length > 300))
      return res(400, { message: "closeReason debe ser texto de máximo 300 caracteres" });
    if (title !== undefined && (typeof title !== "string" || !title.trim() || title.trim().length > 120))
      return res(400, { message: "title debe tener entre 1 y 120 caracteres" });
    if (department !== undefined && (typeof department !== "string" || !department.trim() || department.trim().length > 100))
      return res(400, { message: "department debe tener entre 1 y 100 caracteres" });
    if (description !== undefined && (typeof description !== "string" || description.length > 5000))
      return res(400, { message: "description máximo 5000 caracteres" });
    if (location !== undefined && (typeof location !== "string" || !location.trim() || location.trim().length > 100))
      return res(400, { message: "location debe tener entre 1 y 100 caracteres" });
    if (employmentType !== undefined && !VALID_TYPES.includes(employmentType))
      return res(400, { message: `employmentType debe ser uno de: ${VALID_TYPES.join(", ")}` });

    const sMin = salaryMin !== undefined ? toNumberOrNull(salaryMin) : undefined;
    const sMax = salaryMax !== undefined ? toNumberOrNull(salaryMax) : undefined;
    const nOpen = openings !== undefined ? toNumberOrNull(openings) : undefined;

    if (Number.isNaN(sMin) || Number.isNaN(sMax) || Number.isNaN(nOpen))
      return res(400, { message: "salaryMin, salaryMax y openings deben ser numéricos" });
    if ((sMin != null && sMin < 0) || (sMax != null && sMax < 0))
      return res(400, { message: "El salario no puede ser negativo" });
    if (nOpen !== undefined && (nOpen === null || !Number.isInteger(nOpen) || nOpen < 1))
      return res(400, { message: "openings debe ser un entero >= 1" });

    const sk = `VACANCY#${vacancyId}`;
    const current = await db.get(sk);
    if (!current) {
      log("WARN", "Vacante no encontrada", { requestId, tenantId, vacancyId });
      return res(404, { message: "Vacante no encontrada" });
    }

    if (newStatus !== undefined && newStatus === current.status)
      return res(409, { message: `La vacante ya está ${newStatus}` });

    const finalStatus = newStatus ?? current.status;
    if (closeReason !== undefined && finalStatus !== "CLOSED")
      return res(400, { message: "closeReason solo aplica al cerrar la vacante (status CLOSED)" });

    const finalMin = sMin !== undefined ? sMin : current.salaryMin ?? null;
    const finalMax = sMax !== undefined ? sMax : current.salaryMax ?? null;
    if (finalMin != null && finalMax != null && finalMin > finalMax)
      return res(400, { message: "salaryMin no puede ser mayor que salaryMax" });

    const now = new Date().toISOString();
    const by = event.requestContext?.authorizer?.claims?.email || event.requestContext?.authorizer?.jwt?.claims?.email || "system";

    const sets = ["updatedAt = :now", "updatedBy = :by"];
    const removes = [];
    const names = {};
    const values = { ":now": now, ":by": by };

    const setField = (attr, val) => {
      names[`#${attr}`] = attr;
      values[`:${attr}`] = val;
      sets.push(`#${attr} = :${attr}`);
    };

    if (title !== undefined) setField("title", title.trim());
    if (department !== undefined) setField("department", department.trim());
    if (description !== undefined) setField("description", description);
    if (location !== undefined) setField("location", location.trim());
    if (employmentType !== undefined) setField("employmentType", employmentType);
    if (sMin !== undefined) setField("salaryMin", sMin);
    if (sMax !== undefined) setField("salaryMax", sMax);
    if (nOpen !== undefined) setField("openings", nOpen);

    if (newStatus === "CLOSED") {
      setField("status", "CLOSED");
      setField("closedAt", now);
      setField("closedBy", by);
      setField("closeReason", closeReason ? closeReason.trim() : null);
    } else if (newStatus === "OPEN") {
      setField("status", "OPEN");
      setField("reopenedAt", now);
      removes.push("closedAt", "closedBy", "closeReason");
    } else if (closeReason !== undefined) {
      setField("closeReason", closeReason.trim());
    }

    let condition = "attribute_exists(SK)";
    if (current.updatedAt) {
      condition += " AND updatedAt = :prev";
      values[":prev"] = current.updatedAt;
    } else {
      condition += " AND attribute_not_exists(updatedAt)";
    }

    const params = {
      UpdateExpression: `SET ${sets.join(", ")}${removes.length ? ` REMOVE ${removes.join(", ")}` : ""}`,
      ConditionExpression: condition,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    };
    if (Object.keys(names).length) params.ExpressionAttributeNames = names;

    const updated = await db.update(sk, params);

    log("INFO", "Vacante actualizada", {
      requestId,
      tenantId,
      vacancyId,
      changed: keys,
      fromStatus: current.status,
      toStatus: updated.status,
    });

    return res(200, { message: "Vacante actualizada", vacancy: strip(updated), changed: keys, requestId });
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
      return res(409, { message: "La vacante fue modificada por otra persona, recarga e intenta de nuevo", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
