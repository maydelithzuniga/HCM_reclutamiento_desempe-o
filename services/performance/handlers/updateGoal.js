const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
const TABLE = process.env.PERFORMANCE_TABLE;
const TZ_OFFSET_HOURS = Number(process.env.TZ_OFFSET_HOURS ?? -5);

const REMINDER_PK = "REMINDER";
const EMPLOYEE_RE = /^[A-Za-z0-9_-]{1,64}$/;
const GOAL_RE = /^g-[0-9a-f-]{36}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"];
const FREQUENCIES = { DAILY: 1, WEEKLY: 7, BIWEEKLY: 14, MONTHLY: null, CUSTOM: null };
const EDITABLE = ["progress", "progressNote", "status", "title", "description", "targetDate", "reminder"];
const EMPLOYEE_EDITABLE = ["progress", "progressNote"];
const REACTIVATE_EDITABLE = ["status", "progress", "progressNote", "targetDate"];
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "updateGoal", msg, ts: new Date().toISOString(), ...extra }));

const res = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});

const getClaims = (event) => {
  const auth = event.requestContext?.authorizer || {};
  return auth.claims || auth.jwt?.claims || {};
};

const getTenantId = (event) => {
  const fromToken = getClaims(event)["custom:tenant_id"];
  if (fromToken) return fromToken;

  if (process.env.IS_OFFLINE) {
    const h = event.headers || {};
    return h["x-tenant-id"] || h["X-Tenant-Id"];
  }
  return null;
};

const parseLocalDate = (s) => {
  if (typeof s !== "string" || !DATE_RE.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return { y, m, d };
};

const localToUtc = (y, m, d, hour) => new Date(Date.UTC(y, m - 1, d, hour - TZ_OFFSET_HOURS));

const endOfLocalDay = (dateStr) => {
  const p = parseLocalDate(dateStr);
  return new Date(localToUtc(p.y, p.m, p.d + 1, 0).getTime() - 1);
};

const todayLocal = () => {
  const n = new Date(Date.now() + TZ_OFFSET_HOURS * 3600 * 1000);
  return { y: n.getUTCFullYear(), m: n.getUTCMonth() + 1, d: n.getUTCDate() };
};

const addInterval = (date, r) => {
  const n = new Date(date.getTime());
  if (r.frequency === "MONTHLY") {
    n.setUTCMonth(n.getUTCMonth() + 1);
    return n;
  }
  const days = r.frequency === "CUSTOM" ? r.everyDays : FREQUENCIES[r.frequency];
  n.setUTCDate(n.getUTCDate() + days);
  return n;
};

const reminderLabel = (r) => {
  if (!r?.enabled) return "Sin recordatorios";
  const map = { DAILY: "todos los días", WEEKLY: "cada semana", BIWEEKLY: "cada 2 semanas", MONTHLY: "cada mes" };
  const every = r.frequency === "CUSTOM" ? `cada ${r.everyDays} días` : map[r.frequency];
  return `${every} a las ${String(r.hour).padStart(2, "0")}:00`;
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
      log("ERROR", "PERFORMANCE_TABLE no definida", { requestId });
      return res(500, { message: "Error de configuración del servicio", requestId });
    }

    tenantId = getTenantId(event);
    if (!tenantId) {
      log("WARN", "Tenant no identificado", { requestId });
      return res(401, { message: "Tenant no identificado" });
    }

    assertRequestTenant(event, tenantId);

    const employeeId = event.pathParameters?.employeeId;
    const goalId = event.pathParameters?.goalId;
    if (!employeeId || !EMPLOYEE_RE.test(employeeId)) return res(400, { message: "employeeId inválido" });
    if (!goalId || !GOAL_RE.test(goalId)) return res(400, { message: "goalId inválido" });

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
    const unknown = keys.filter((k) => !EDITABLE.includes(k));
    if (unknown.length) return res(400, { message: `Campos no permitidos: ${unknown.join(", ")}`, allowed: EDITABLE });
    if (!keys.length) return res(400, { message: "Envía al menos un campo a modificar", allowed: EDITABLE });

    const claims = getClaims(event);
    const role = String(claims["custom:role"] || "").toUpperCase();
    const myEmployeeId = claims["custom:employee_id"];
    if (role === "EMPLOYEE") {
      if (myEmployeeId !== employeeId) {
        log("WARN", "Empleado intentando modificar meta ajena", { requestId, tenantId, employeeId, myEmployeeId });
        return res(403, { message: "Solo puedes actualizar tus propias metas" });
      }
      const forbidden = keys.filter((k) => !EMPLOYEE_EDITABLE.includes(k));
      if (forbidden.length) return res(403, { message: `Como empleado solo puedes modificar: ${EMPLOYEE_EDITABLE.join(", ")}` });
    }

    const { progress, progressNote, status, title, description, targetDate, reminder } = body;
    const reqStatus = status !== undefined ? String(status).toUpperCase() : undefined;

    if (progress !== undefined && (!Number.isInteger(progress) || progress < 0 || progress > 100))
      return res(400, { message: "progress debe ser entero entre 0 y 100" });
    if (progressNote !== undefined && (typeof progressNote !== "string" || progressNote.length > 300))
      return res(400, { message: "progressNote máximo 300 caracteres" });
    if (progressNote !== undefined && progress === undefined)
      return res(400, { message: "progressNote solo se envía junto con progress" });
    if (reqStatus !== undefined && !STATUSES.includes(reqStatus))
      return res(400, { message: `status debe ser uno de: ${STATUSES.join(", ")}` });
    if (title !== undefined && (typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120))
      return res(400, { message: "title debe tener entre 3 y 120 caracteres" });
    if (description !== undefined && (typeof description !== "string" || description.length > 1000))
      return res(400, { message: "description máximo 1000 caracteres" });
    if (targetDate !== undefined && !parseLocalDate(targetDate))
      return res(400, { message: "targetDate debe tener formato YYYY-MM-DD y ser una fecha válida" });
    if (reminder !== undefined && (reminder === null || typeof reminder !== "object" || Array.isArray(reminder)))
      return res(400, { message: "reminder debe ser un objeto { enabled, frequency, everyDays, hour, firstReminderAt }" });

    const pk = `TENANT#${tenantId}`;
    const sk = `GOAL#${employeeId}#${goalId}`;

    const out = await ddb.send(new GetCommand({ TableName: TABLE, Key: { PK: pk, SK: sk } }));
    const g = out.Item;
    if (!g) {
      log("WARN", "Meta no encontrada", { requestId, tenantId, employeeId, goalId });
      return res(404, { message: "Meta no encontrada" });
    }

    if (g.status !== "ACTIVE") {
      const notAllowed = keys.filter((k) => !REACTIVATE_EDITABLE.includes(k));
      if (reqStatus !== "ACTIVE" || notAllowed.length)
        return res(409, { message: `La meta está ${g.status}. Solo se puede reactivar enviando status ACTIVE (opcional: progress, targetDate)` });
    }

    const prevProgress = g.progress ?? 0;
    let newProgress = progress !== undefined ? progress : prevProgress;
    let newStatus = reqStatus ?? g.status;

    if (progress === 100 && reqStatus === undefined) newStatus = "COMPLETED";
    if (newStatus === "COMPLETED") newProgress = 100;
    if (newStatus === "ACTIVE" && newProgress === 100)
      return res(400, { message: "Una meta ACTIVE no puede tener progress 100. Envía progress menor o status COMPLETED" });

    const now = new Date();
    const nowIso = now.toISOString();
    const newTargetDate = targetDate ?? g.targetDate;
    const deadline = endOfLocalDay(newTargetDate);
    if (newStatus === "ACTIVE" && deadline <= now)
      return res(400, { message: "La fecha límite ya pasó. Envía un targetDate de hoy o futuro para mantener la meta activa" });

    const baseR = g.reminder || { enabled: false, frequency: "WEEKLY", everyDays: null, hour: 9 };
    const r = reminder
      ? {
          enabled: typeof reminder.enabled === "boolean" ? reminder.enabled : true,
          frequency: reminder.frequency ? String(reminder.frequency).toUpperCase() : baseR.frequency,
          everyDays: reminder.everyDays !== undefined ? reminder.everyDays : baseR.everyDays,
          hour: reminder.hour !== undefined ? reminder.hour : baseR.hour,
        }
      : { ...baseR };

    if (reminder) {
      if (reminder.enabled !== undefined && typeof reminder.enabled !== "boolean")
        return res(400, { message: "reminder.enabled debe ser booleano" });
      if (r.enabled && !(r.frequency in FREQUENCIES))
        return res(400, { message: `reminder.frequency debe ser uno de: ${Object.keys(FREQUENCIES).join(", ")}` });
      if (r.enabled && r.frequency === "CUSTOM" && (!Number.isInteger(r.everyDays) || r.everyDays < 1 || r.everyDays > 90))
        return res(400, { message: "reminder.everyDays debe ser entero entre 1 y 90 cuando frequency es CUSTOM" });
      if (r.enabled && (!Number.isInteger(r.hour) || r.hour < 0 || r.hour > 23))
        return res(400, { message: "reminder.hour debe ser entero entre 0 y 23 (hora Perú)" });
      if (r.frequency !== "CUSTOM") r.everyDays = null;
    }

    const reactivated = g.status !== "ACTIVE" && newStatus === "ACTIVE";
    const dateChanged = targetDate !== undefined && targetDate !== g.targetDate;
    let nextReminderAt = g.nextReminderAt || null;

    if (newStatus !== "ACTIVE" || !r.enabled) {
      nextReminderAt = null;
    } else if (reminder?.firstReminderAt != null) {
      const f = new Date(reminder.firstReminderAt);
      if (typeof reminder.firstReminderAt !== "string" || Number.isNaN(f.getTime()))
        return res(400, { message: "reminder.firstReminderAt debe ser fecha ISO 8601" });
      if (f <= now) return res(400, { message: "reminder.firstReminderAt debe ser futura" });
      if (f > deadline) return res(400, { message: "reminder.firstReminderAt no puede ser posterior a targetDate" });
      nextReminderAt = f.toISOString();
    } else if (reminder || dateChanged || reactivated || !nextReminderAt) {
      const t = todayLocal();
      const candidate = addInterval(localToUtc(t.y, t.m, t.d, r.hour), r);
      nextReminderAt = candidate <= deadline ? candidate.toISOString() : null;
    } else if (new Date(nextReminderAt) > deadline) {
      nextReminderAt = null;
    }

    const by = claims.email || "system";
    const sets = ["updatedAt = :now", "updatedBy = :by"];
    const removes = [];
    const names = {};
    const values = { ":now": nowIso, ":by": by };

    const setField = (attr, val) => {
      names[`#${attr}`] = attr;
      values[`:${attr}`] = val;
      sets.push(`#${attr} = :${attr}`);
    };

    if (title !== undefined) setField("title", title.trim());
    if (description !== undefined) setField("description", description.trim());
    if (targetDate !== undefined) setField("targetDate", targetDate);
    if (reminder !== undefined) setField("reminder", r);

    if (newProgress !== prevProgress) {
      setField("progress", newProgress);
      values[":empty"] = [];
      values[":histEntry"] = [{ from: prevProgress, to: newProgress, at: nowIso, by, note: progressNote ? progressNote.trim() : null }];
      sets.push("progressHistory = list_append(if_not_exists(progressHistory, :empty), :histEntry)");
    }

    if (newStatus !== g.status) {
      setField("status", newStatus);
      if (newStatus === "COMPLETED") setField("completedAt", nowIso);
      if (newStatus === "CANCELLED") setField("cancelledAt", nowIso);
      if (newStatus === "ACTIVE") {
        setField("reactivatedAt", nowIso);
        removes.push("completedAt", "cancelledAt");
      }
    }

    if (nextReminderAt) {
      setField("nextReminderAt", nextReminderAt);
      setField("GSI1PK", REMINDER_PK);
      setField("GSI1SK", `${nextReminderAt}#${tenantId}#${goalId}`);
    } else {
      setField("nextReminderAt", null);
      removes.push("GSI1PK", "GSI1SK");
    }

    let condition = "attribute_exists(SK)";
    if (g.updatedAt) {
      condition += " AND updatedAt = :prev";
      values[":prev"] = g.updatedAt;
    } else {
      condition += " AND attribute_not_exists(updatedAt)";
    }

    const updated = await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { PK: pk, SK: sk },
        UpdateExpression: `SET ${sets.join(", ")}${removes.length ? ` REMOVE ${removes.join(", ")}` : ""}`,
        ConditionExpression: condition,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW",
      })
    );

    const a = updated.Attributes;

    log("INFO", "Meta actualizada", {
      requestId,
      tenantId,
      employeeId,
      goalId,
      changed: keys,
      fromStatus: g.status,
      toStatus: a.status,
      fromProgress: prevProgress,
      toProgress: a.progress,
      nextReminderAt: a.nextReminderAt,
    });

    return res(200, {
      message: a.status === "COMPLETED" && g.status !== "COMPLETED" ? "¡Meta completada!" : "Meta actualizada",
      goal: strip(a),
      reminderSchedule: a.nextReminderAt
        ? { label: reminderLabel(a.reminder), nextReminderAt: a.nextReminderAt }
        : { label: a.status !== "ACTIVE" ? `Recordatorios detenidos (meta ${a.status})` : reminderLabel(a.reminder), nextReminderAt: null },
      changed: keys,
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
      return res(409, { message: "La meta fue modificada por otra persona o por un recordatorio, recarga e intenta de nuevo", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
