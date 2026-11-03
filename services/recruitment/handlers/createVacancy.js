const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const { createTenantDb, assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.RECRUITMENT_TABLE;

const VALID_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const MAX_CERTS = 10;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "createVacancy", msg, ts: new Date().toISOString(), ...extra }));

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

const slugify = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

const strip = (item) => {
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

    const { title, department, description, location, employmentType, salaryMin, salaryMax, openings, requireLinkedin, requiredCertificates } = body;

    const sMin = toNumberOrNull(salaryMin);
    const sMax = toNumberOrNull(salaryMax);
    const nOpen = toNumberOrNull(openings);

    if (!title || typeof title !== "string" || !title.trim())
      return res(400, { message: "title es obligatorio" });
    if (!department || typeof department !== "string" || !department.trim())
      return res(400, { message: "department es obligatorio" });
    if (employmentType && !VALID_TYPES.includes(employmentType))
      return res(400, { message: `employmentType debe ser uno de: ${VALID_TYPES.join(", ")}` });
    if (Number.isNaN(sMin) || Number.isNaN(sMax) || Number.isNaN(nOpen))
      return res(400, { message: "salaryMin, salaryMax y openings deben ser numéricos" });
    if ((sMin !== null && sMin < 0) || (sMax !== null && sMax < 0))
      return res(400, { message: "El salario no puede ser negativo" });
    if (nOpen !== null && (!Number.isInteger(nOpen) || nOpen < 1))
      return res(400, { message: "openings debe ser un entero >= 1" });
    if (sMin !== null && sMax !== null && sMin > sMax)
      return res(400, { message: "salaryMin no puede ser mayor que salaryMax" });
    if (requireLinkedin != null && typeof requireLinkedin !== "boolean")
      return res(400, { message: "requireLinkedin debe ser booleano" });
    if (requiredCertificates != null && !Array.isArray(requiredCertificates))
      return res(400, { message: "requiredCertificates debe ser un arreglo" });
    if ((requiredCertificates || []).length > MAX_CERTS)
      return res(400, { message: `Máximo ${MAX_CERTS} certificados por vacante` });

    const certificates = [];
    const seen = new Set();
    for (const c of requiredCertificates || []) {
      if (!c || typeof c !== "object" || typeof c.name !== "string" || c.name.trim().length < 2)
        return res(400, { message: "Cada certificado debe tener name (mínimo 2 caracteres)" });
      if (c.mandatory != null && typeof c.mandatory !== "boolean")
        return res(400, { message: `mandatory de "${c.name}" debe ser booleano` });
      const key = slugify(typeof c.key === "string" && c.key.trim() ? c.key : c.name);
      if (!key) return res(400, { message: `Nombre de certificado inválido: "${c.name}"` });
      if (seen.has(key)) return res(400, { message: `Certificado duplicado: "${c.name}"` });
      seen.add(key);
      certificates.push({
        key,
        name: c.name.trim(),
        description: typeof c.description === "string" ? c.description.trim() : "",
        mandatory: c.mandatory !== false,
      });
    }

    const vacancyId = `v-${randomUUID()}`;
    const now = new Date().toISOString();

    const item = {
      SK: `VACANCY#${vacancyId}`,
      entityType: "VACANCY",
      vacancyId,
      tenantId,
      title: title.trim(),
      department: department.trim(),
      description: description || "",
      location: location || "Remoto",
      employmentType: employmentType || "FULL_TIME",
      salaryMin: sMin,
      salaryMax: sMax,
      openings: nOpen ?? 1,
      requireLinkedin: requireLinkedin === true,
      requiredCertificates: certificates,
      status: "OPEN",
      candidatesCount: 0,
      createdBy: event.requestContext?.authorizer?.claims?.email || "system",
      createdAt: now,
      updatedAt: now,
    };

    const saved = await db.put(item, {
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    });

    log("INFO", "Vacante creada", { requestId, tenantId, vacancyId, certs: certificates.length });
    return res(201, { message: "Vacante creada", vacancy: strip(saved) });
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
      return res(409, { message: "La vacante ya existe", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
