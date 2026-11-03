const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, TransactWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { randomUUID } = require("crypto");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
const sns = new SNSClient({});
const TABLE = process.env.PERFORMANCE_TABLE;
const TOPIC_ARN = process.env.PERFORMANCE_TOPIC_ARN;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPLOYEE_RE = /^[A-Za-z0-9_-]{1,64}$/;
const CYCLE_RE = /^\d{4}-(Q[1-4]|H[12]|ANUAL)$/;
const RELATIONSHIPS = { SELF: "Autoevaluación", MANAGER: "Jefe directo", PEER: "Par", DIRECT_REPORT: "Reporte directo" };
const MAX_COMPETENCIES = 10;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable", "TransactionConflictException"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "submitEvaluation", msg, ts: new Date().toISOString(), ...extra }));

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

const isValidScore = (n) => typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 5 && Number.isInteger(n * 2);

const optText = (v, max) => v == null || (typeof v === "string" && v.length <= max);

module.exports.main = async (event, context) => {
  const requestId = context?.awsRequestId || "local";
  let tenantId = null;

  try {
    if (!TABLE) {
      log("ERROR", "PERFORMANCE_TABLE no definida", { requestId });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

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

    const {
      employeeId,
      employeeName,
      employeeEmail,
      evaluatorId,
      evaluatorName,
      relationship,
      cycle,
      score,
      competencies,
      strengths,
      improvements,
      feedback,
      anonymous,
    } = body;

    const rel = typeof relationship === "string" ? relationship.trim().toUpperCase() : null;

    if (!employeeId || typeof employeeId !== "string" || !EMPLOYEE_RE.test(employeeId))
      return res(400, { message: "employeeId inválido" });
    if (!employeeName || typeof employeeName !== "string" || employeeName.trim().length < 2)
      return res(400, { message: "employeeName es obligatorio" });
    if (!employeeEmail || typeof employeeEmail !== "string" || !EMAIL_RE.test(employeeEmail.trim()))
      return res(400, { message: "employeeEmail inválido" });
    if (!evaluatorId || typeof evaluatorId !== "string" || !EMPLOYEE_RE.test(evaluatorId))
      return res(400, { message: "evaluatorId inválido" });
    if (!evaluatorName || typeof evaluatorName !== "string" || evaluatorName.trim().length < 2)
      return res(400, { message: "evaluatorName es obligatorio" });
    if (!rel || !(rel in RELATIONSHIPS))
      return res(400, { message: `relationship debe ser uno de: ${Object.keys(RELATIONSHIPS).join(", ")}` });
    if (rel === "SELF" && evaluatorId !== employeeId)
      return res(400, { message: "En una autoevaluación evaluatorId debe ser igual a employeeId" });
    if (rel !== "SELF" && evaluatorId === employeeId)
      return res(400, { message: "Un empleado no puede evaluarse a sí mismo fuera de una autoevaluación (SELF)" });
    if (!cycle || typeof cycle !== "string" || !CYCLE_RE.test(cycle))
      return res(400, { message: "cycle debe tener formato YYYY-Q1..Q4, YYYY-H1/H2 o YYYY-ANUAL" });
    if (anonymous != null && typeof anonymous !== "boolean")
      return res(400, { message: "anonymous debe ser booleano" });
    if (anonymous === true && rel !== "PEER")
      return res(400, { message: "Solo las evaluaciones de pares (PEER) pueden ser anónimas" });
    if (!optText(strengths, 1000) || !optText(improvements, 1000) || !optText(feedback, 2000))
      return res(400, { message: "strengths/improvements máximo 1000 caracteres, feedback máximo 2000" });

    if (competencies != null && !Array.isArray(competencies))
      return res(400, { message: "competencies debe ser un arreglo de { name, score }" });
    if ((competencies || []).length > MAX_COMPETENCIES)
      return res(400, { message: `Máximo ${MAX_COMPETENCIES} competencias` });

    const comps = [];
    const seen = new Set();
    for (const c of competencies || []) {
      if (!c || typeof c !== "object" || typeof c.name !== "string" || c.name.trim().length < 2 || c.name.trim().length > 60)
        return res(400, { message: "Cada competencia debe tener name (2 a 60 caracteres)" });
      const name = c.name.trim();
      if (seen.has(name.toLowerCase())) return res(400, { message: `Competencia duplicada: "${name}"` });
      seen.add(name.toLowerCase());
      if (!isValidScore(c.score))
        return res(400, { message: `score de "${name}" debe estar entre 1 y 5 en pasos de 0.5` });
      if (!optText(c.comment, 300))
        return res(400, { message: `comment de "${name}" máximo 300 caracteres` });
      comps.push({ name, score: c.score, comment: c.comment ? c.comment.trim() : null });
    }

    if (score == null && comps.length === 0)
      return res(400, { message: "Envía score general o al menos una competencia" });
    if (score != null && !isValidScore(score))
      return res(400, { message: "score debe estar entre 1 y 5 en pasos de 0.5" });

    const finalScore =
      score != null ? score : Math.round((comps.reduce((a, c) => a + c.score, 0) / comps.length) * 100) / 100;

    const evalId = `e-${randomUUID()}`;
    const now = new Date().toISOString();
    const pk = `TENANT#${tenantId}`;
    const submittedBy = event.requestContext?.authorizer?.claims?.email || event.requestContext?.authorizer?.jwt?.claims?.email || "system";

    const item = {
      PK: pk,
      SK: `EVAL#${employeeId}#${cycle}#${evaluatorId}`,
      entityType: "EVALUATION",
      evalId,
      tenantId,
      employeeId,
      employeeName: employeeName.trim(),
      employeeEmail: employeeEmail.trim().toLowerCase(),
      evaluatorId,
      evaluatorName: evaluatorName.trim(),
      relationship: rel,
      cycle,
      score: finalScore,
      competencies: comps,
      strengths: strengths ? strengths.trim() : null,
      improvements: improvements ? improvements.trim() : null,
      feedback: feedback ? feedback.trim() : null,
      anonymous: anonymous === true,
      status: "SUBMITTED",
      submittedBy,
      createdAt: now,
    };

    try {
      await ddb.send(
        new TransactWriteCommand({
          TransactItems: [
            {
              Put: {
                TableName: TABLE,
                Item: item,
                ConditionExpression: "attribute_not_exists(SK)",
              },
            },
            {
              Update: {
                TableName: TABLE,
                Key: { PK: pk, SK: `SUMMARY#${employeeId}#${cycle}` },
                UpdateExpression:
                  "ADD evaluationsCount :one, scoreSum :score SET entityType = :et, tenantId = :tid, employeeId = :eid, employeeName = :ename, cycle = :cycle, lastScore = :score, lastEvaluationAt = :now, updatedAt = :now",
                ExpressionAttributeValues: {
                  ":one": 1,
                  ":score": finalScore,
                  ":et": "EVAL_SUMMARY",
                  ":tid": tenantId,
                  ":eid": employeeId,
                  ":ename": item.employeeName,
                  ":cycle": cycle,
                  ":now": now,
                },
              },
            },
          ],
        })
      );
    } catch (txErr) {
      if (txErr.name === "TransactionCanceledException") {
        const reasons = (txErr.CancellationReasons || []).map((r) => r?.Code);
        log("WARN", "Transacción cancelada", { requestId, tenantId, employeeId, evaluatorId, cycle, reasons });
        if (reasons[0] === "ConditionalCheckFailed")
          return res(409, { message: `${item.evaluatorName} ya evaluó a ${item.employeeName} en el ciclo ${cycle}`, requestId });
        if (reasons.includes("TransactionConflict") || reasons.includes("ThrottlingError"))
          return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
      }
      throw txErr;
    }

    log("INFO", "Evaluación registrada", { requestId, tenantId, evalId, employeeId, evaluatorId, cycle, relationship: rel, score: finalScore });

    let notification = "SKIPPED";
    if (TOPIC_ARN) {
      try {
        await sns.send(
          new PublishCommand({
            TopicArn: TOPIC_ARN,
            Message: JSON.stringify({
              eventType: "evaluation.completed",
              tenantId,
              evalId,
              employeeId,
              employeeName: item.employeeName,
              employeeEmail: item.employeeEmail,
              evaluatorName: item.anonymous ? null : item.evaluatorName,
              relationship: rel,
              relationshipLabel: RELATIONSHIPS[rel],
              cycle,
              score: finalScore,
              strengths: item.strengths,
              improvements: item.improvements,
              anonymous: item.anonymous,
              notifyEmployee: rel !== "SELF",
              createdAt: now,
            }),
            MessageAttributes: {
              eventType: { DataType: "String", StringValue: "evaluation.completed" },
              tenantId: { DataType: "String", StringValue: tenantId },
            },
          })
        );
        notification = rel === "SELF" ? "EVENT_ONLY" : "QUEUED";
        log("INFO", "Evento publicado", { requestId, tenantId, evalId, eventType: "evaluation.completed" });
      } catch (pubErr) {
        notification = "FAILED";
        log("ERROR", "Fallo al publicar evento SNS", { requestId, tenantId, evalId, errorName: pubErr.name, error: pubErr.message });
      }
    } else {
      log("WARN", "PERFORMANCE_TOPIC_ARN no definida, no se publica evento", { requestId, tenantId, evalId });
    }

    const { PK, SK, ...publicItem } = item;
    return res(201, {
      message: "Evaluación registrada",
      evaluation: publicItem.anonymous ? { ...publicItem, evaluatorId: undefined, evaluatorName: undefined } : publicItem,
      notification,
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
      return res(409, { message: "La evaluación ya existe", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
