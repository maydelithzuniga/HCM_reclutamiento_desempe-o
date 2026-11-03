const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");
const { randomUUID } = require("crypto");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), { marshallOptions: { removeUndefinedValues: true } });
const sns = new SNSClient({});
const ses = new SESv2Client({});
const TABLE = process.env.PERFORMANCE_TABLE;
const TOPIC_ARN = process.env.PERFORMANCE_TOPIC_ARN;
const SENDER = process.env.SENDER_EMAIL;
const TZ_OFFSET_HOURS = Number(process.env.TZ_OFFSET_HOURS ?? -5);

const REMINDER_GSI = "GSI1";
const REMINDER_PK = "REMINDER";
const MAX_PER_RUN = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMPLOYEE_RE = /^[A-Za-z0-9_-]{1,64}$/;
const FREQUENCIES = { DAILY: 1, WEEKLY: 7, BIWEEKLY: 14, MONTHLY: null, CUSTOM: null };
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

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

const daysLeft = (targetDate) => {
  const p = parseLocalDate(targetDate);
  if (!p) return null;
  const t = todayLocal();
  return Math.round((Date.UTC(p.y, p.m - 1, p.d) - Date.UTC(t.y, t.m - 1, t.d)) / 86400000);
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
  const log = makeLog("createGoal");
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

    const { employeeId, employeeName, employeeEmail, title, description, targetDate, reminder } = body;

    if (!employeeId || typeof employeeId !== "string" || !EMPLOYEE_RE.test(employeeId))
      return res(400, { message: "employeeId inválido" });
    if (!employeeName || typeof employeeName !== "string" || employeeName.trim().length < 2)
      return res(400, { message: "employeeName es obligatorio" });
    if (!employeeEmail || typeof employeeEmail !== "string" || !EMAIL_RE.test(employeeEmail.trim()))
      return res(400, { message: "employeeEmail inválido" });
    if (!title || typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120)
      return res(400, { message: "title es obligatorio (3 a 120 caracteres)" });
    if (description != null && (typeof description !== "string" || description.length > 1000))
      return res(400, { message: "description máximo 1000 caracteres" });
    if (!parseLocalDate(targetDate))
      return res(400, { message: "targetDate debe tener formato YYYY-MM-DD y ser una fecha válida" });

    const now = new Date();
    const deadline = endOfLocalDay(targetDate);
    if (deadline <= now)
      return res(400, { message: "targetDate debe ser hoy o una fecha futura" });

    if (reminder != null && (typeof reminder !== "object" || Array.isArray(reminder)))
      return res(400, { message: "reminder debe ser un objeto { enabled, frequency, everyDays, hour, firstReminderAt }" });

    const r = {
      enabled: reminder ? reminder.enabled !== false : false,
      frequency: reminder?.frequency ? String(reminder.frequency).toUpperCase() : "WEEKLY",
      everyDays: reminder?.everyDays ?? null,
      hour: reminder?.hour ?? 9,
    };

    if (reminder?.enabled != null && typeof reminder.enabled !== "boolean")
      return res(400, { message: "reminder.enabled debe ser booleano" });
    if (r.enabled && !(r.frequency in FREQUENCIES))
      return res(400, { message: `reminder.frequency debe ser uno de: ${Object.keys(FREQUENCIES).join(", ")}` });
    if (r.enabled && r.frequency === "CUSTOM" && (!Number.isInteger(r.everyDays) || r.everyDays < 1 || r.everyDays > 90))
      return res(400, { message: "reminder.everyDays debe ser entero entre 1 y 90 cuando frequency es CUSTOM" });
    if (r.enabled && (!Number.isInteger(r.hour) || r.hour < 0 || r.hour > 23))
      return res(400, { message: "reminder.hour debe ser entero entre 0 y 23 (hora Perú)" });
    if (r.frequency !== "CUSTOM") r.everyDays = null;

    let firstReminder = null;
    if (r.enabled) {
      if (reminder.firstReminderAt != null) {
        const f = new Date(reminder.firstReminderAt);
        if (typeof reminder.firstReminderAt !== "string" || Number.isNaN(f.getTime()))
          return res(400, { message: "reminder.firstReminderAt debe ser fecha ISO 8601" });
        if (f <= now)
          return res(400, { message: "reminder.firstReminderAt debe ser futura" });
        if (f > deadline)
          return res(400, { message: "reminder.firstReminderAt no puede ser posterior a targetDate" });
        firstReminder = f;
      } else {
        const t = todayLocal();
        const candidate = addInterval(localToUtc(t.y, t.m, t.d, r.hour), r);
        firstReminder = candidate <= deadline ? candidate : null;
      }
    }

    const goalId = `g-${randomUUID()}`;
    const nowIso = now.toISOString();
    const pk = `TENANT#${tenantId}`;
    const nextReminderAt = firstReminder ? firstReminder.toISOString() : null;
    const assignedBy = event.requestContext?.authorizer?.claims?.email || event.requestContext?.authorizer?.jwt?.claims?.email || "system";

    const item = {
      PK: pk,
      SK: `GOAL#${employeeId}#${goalId}`,
      entityType: "GOAL",
      goalId,
      tenantId,
      employeeId,
      employeeName: employeeName.trim(),
      employeeEmail: employeeEmail.trim().toLowerCase(),
      title: title.trim(),
      description: description ? description.trim() : "",
      targetDate,
      status: "ACTIVE",
      progress: 0,
      assignedBy,
      reminder: r,
      nextReminderAt,
      lastReminderAt: null,
      remindersSent: 0,
      createdAt: nowIso,
      updatedAt: nowIso,
      GSI1PK: nextReminderAt ? REMINDER_PK : undefined,
      GSI1SK: nextReminderAt ? `${nextReminderAt}#${tenantId}#${goalId}` : undefined,
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
      })
    );

    log("INFO", "Meta creada", { requestId, tenantId, goalId, employeeId, nextReminderAt });

    let notification = "SKIPPED";
    if (TOPIC_ARN) {
      try {
        await publish("goal.assigned", tenantId, {
          tenantId,
          goalId,
          employeeId,
          employeeName: item.employeeName,
          employeeEmail: item.employeeEmail,
          title: item.title,
          description: item.description,
          targetDate,
          assignedBy,
          reminderLabel: reminderLabel(r),
          nextReminderAt,
          createdAt: nowIso,
        });
        notification = "QUEUED";
        log("INFO", "Evento publicado", { requestId, tenantId, goalId, eventType: "goal.assigned" });
      } catch (pubErr) {
        notification = "FAILED";
        log("ERROR", "Fallo al publicar evento SNS", { requestId, tenantId, goalId, errorName: pubErr.name, error: pubErr.message });
      }
    } else {
      log("WARN", "PERFORMANCE_TOPIC_ARN no definida, no se envía notificación", { requestId, tenantId, goalId });
    }

    const { PK, SK, GSI1PK, GSI1SK, ...goal } = item;
    return res(201, {
      message: "Meta creada",
      goal,
      reminderSchedule: r.enabled
        ? nextReminderAt
          ? { label: reminderLabel(r), nextReminderAt }
          : { label: "El primer recordatorio caería después de la fecha límite, no se programaron recordatorios", nextReminderAt: null }
        : { label: "Sin recordatorios", nextReminderAt: null },
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
      return res(409, { message: "La meta ya existe", requestId });
    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};

const processGoal = async (g, log, requestId) => {
  const now = new Date();
  const nowIso = now.toISOString();
  const key = { PK: g.PK, SK: g.SK };
  const deadline = parseLocalDate(g.targetDate) ? endOfLocalDay(g.targetDate) : now;

  if (g.status !== "ACTIVE" || !g.reminder?.enabled || now > deadline) {
    try {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: key,
          UpdateExpression: "SET nextReminderAt = :null, updatedAt = :now REMOVE GSI1PK, GSI1SK",
          ConditionExpression: "GSI1SK = :oldSk",
          ExpressionAttributeValues: { ":null": null, ":now": nowIso, ":oldSk": g.GSI1SK },
        })
      );
    } catch (e) {
      if (e.name !== "ConditionalCheckFailedException") throw e;
    }
    log("INFO", "Recordatorios finalizados", { requestId, tenantId: g.tenantId, goalId: g.goalId, status: g.status });
    return "FINISHED";
  }

  let next = addInterval(new Date(g.nextReminderAt), g.reminder);
  while (next <= now) next = addInterval(next, g.reminder);
  const hasNext = next <= deadline;
  const nextIso = next.toISOString();

  let updated;
  try {
    updated = await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: key,
        UpdateExpression: hasNext
          ? "SET lastReminderAt = :now, remindersSent = if_not_exists(remindersSent, :zero) + :one, updatedAt = :now, nextReminderAt = :next, GSI1SK = :newSk"
          : "SET lastReminderAt = :now, remindersSent = if_not_exists(remindersSent, :zero) + :one, updatedAt = :now, nextReminderAt = :null REMOVE GSI1PK, GSI1SK",
        ConditionExpression: "GSI1SK = :oldSk AND #st = :active",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: hasNext
          ? { ":now": nowIso, ":zero": 0, ":one": 1, ":next": nextIso, ":newSk": `${nextIso}#${g.tenantId}#${g.goalId}`, ":oldSk": g.GSI1SK, ":active": "ACTIVE" }
          : { ":now": nowIso, ":zero": 0, ":one": 1, ":null": null, ":oldSk": g.GSI1SK, ":active": "ACTIVE" },
        ReturnValues: "ALL_NEW",
      })
    );
  } catch (e) {
    if (e.name === "ConditionalCheckFailedException") {
      log("INFO", "Recordatorio ya tomado por otra ejecución o meta cambió", { requestId, tenantId: g.tenantId, goalId: g.goalId });
      return "SKIPPED";
    }
    throw e;
  }

  const a = updated.Attributes;
  await publish("goal.reminder", a.tenantId, {
    tenantId: a.tenantId,
    goalId: a.goalId,
    employeeId: a.employeeId,
    employeeName: a.employeeName,
    employeeEmail: a.employeeEmail,
    title: a.title,
    targetDate: a.targetDate,
    progress: a.progress ?? 0,
    reminderNumber: a.remindersSent,
    reminderLabel: reminderLabel(a.reminder),
    isLast: !hasNext,
    nextReminderAt: hasNext ? nextIso : null,
    sentAt: nowIso,
  });

  log("INFO", "Recordatorio publicado", { requestId, tenantId: a.tenantId, goalId: a.goalId, reminderNumber: a.remindersSent, isLast: !hasNext });
  return "SENT";
};

module.exports.dispatchReminders = async (event, context) => {
  const log = makeLog("dispatchGoalReminders");
  const requestId = context?.awsRequestId || "local";

  if (!TABLE || !TOPIC_ARN) {
    log("ERROR", "Variables de entorno faltantes", { requestId, TABLE: !!TABLE, TOPIC_ARN: !!TOPIC_ARN });
    throw new Error("Configuración incompleta: PERFORMANCE_TABLE / PERFORMANCE_TOPIC_ARN");
  }

  const nowIso = new Date().toISOString();
  const stats = { processed: 0, sent: 0, finished: 0, skipped: 0, failed: 0 };
  let lastKey;

  try {
    do {
      const page = await ddb.send(
        new QueryCommand({
          TableName: TABLE,
          IndexName: REMINDER_GSI,
          KeyConditionExpression: "GSI1PK = :pk AND GSI1SK <= :now",
          ExpressionAttributeValues: { ":pk": REMINDER_PK, ":now": `${nowIso}~` },
          ExclusiveStartKey: lastKey,
          Limit: 100,
        })
      );

      for (const g of page.Items || []) {
        if (stats.processed >= MAX_PER_RUN) break;
        stats.processed++;
        try {
          const r = await processGoal(g, log, requestId);
          if (r === "SENT") stats.sent++;
          else if (r === "FINISHED") stats.finished++;
          else stats.skipped++;
        } catch (err) {
          stats.failed++;
          log("ERROR", "Fallo procesando recordatorio", {
            requestId,
            tenantId: g.tenantId,
            goalId: g.goalId,
            errorName: err.name,
            error: err.message,
            stack: err.stack,
          });
        }
      }

      lastKey = page.LastEvaluatedKey;
    } while (lastKey && stats.processed < MAX_PER_RUN);
  } catch (err) {
    log("ERROR", "Fallo consultando recordatorios", { requestId, errorName: err.name, error: err.message, stack: err.stack, ...stats });
    throw err;
  }

  log("INFO", "Ejecución de recordatorios terminada", { requestId, ...stats, pendingMore: !!lastKey });
  return stats;
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const TEMPLATES = {
  "goal.assigned": {
    subject: (m) => `Nueva meta asignada: ${m.title}`,
    text: (m) =>
      `Se te asignó la meta "${m.title}" con fecha límite ${m.targetDate}.` +
      (m.description ? `\n\nDetalle: ${m.description}` : "") +
      `\n\nRecordatorios: ${m.reminderLabel}.`,
  },
  "goal.reminder": {
    subject: (m) => {
      const dl = daysLeft(m.targetDate);
      return `Recordatorio: ${m.title} (${dl === 0 ? "vence hoy" : `${dl} días restantes`})`;
    },
    text: (m) => {
      const dl = daysLeft(m.targetDate);
      return (
        `Te recordamos tu meta "${m.title}".\n\nProgreso actual: ${m.progress}%.\nFecha límite: ${m.targetDate} (${dl === 0 ? "vence hoy" : `faltan ${dl} días`}).` +
        (m.isLast ? "\n\nEste es el último recordatorio antes de la fecha límite." : "")
      );
    },
  },
  "evaluation.completed": {
    subject: (m) => `Recibiste una evaluación de desempeño – ${m.cycle}`,
    text: (m) =>
      `${m.anonymous ? "Un compañero (anónimo)" : m.evaluatorName} registró tu evaluación (${m.relationshipLabel}) del ciclo ${m.cycle}.\n\nPuntaje general: ${m.score}/5.` +
      (m.strengths ? `\n\nFortalezas: ${m.strengths}` : "") +
      (m.improvements ? `\n\nOportunidades de mejora: ${m.improvements}` : ""),
  },
};

const buildHtml = (m, text) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#111827;color:#e5e7eb;border-radius:12px">
  <h2 style="color:#34d399;margin-top:0">Hola ${esc(m.employeeName)},</h2>
  <p style="font-size:15px;line-height:1.6;white-space:pre-line">${esc(text)}</p>
  ${m.eventType === "goal.reminder" ? `
  <div style="background:#1f2937;border-radius:8px;height:12px;overflow:hidden;margin:16px 0">
    <div style="background:#34d399;height:12px;width:${Math.max(0, Math.min(100, Number(m.progress) || 0))}%"></div>
  </div>` : ""}
  <hr style="border:none;border-top:1px solid #374151;margin:20px 0">
  <p style="font-size:12px;color:#6b7280">${esc(m.reminderLabel || m.cycle || "")}</p>
</div>`;

module.exports.notify = async (event) => {
  const log = makeLog("notifyGoal");
  const failures = [];

  if (!SENDER) {
    log("ERROR", "SENDER_EMAIL no definida");
    return { batchItemFailures: (event.Records || []).map((r) => ({ itemIdentifier: r.messageId })) };
  }

  for (const record of event.Records || []) {
    const messageId = record.messageId;
    let msg;

    try {
      msg = JSON.parse(record.body);
      if (msg.Type === "Notification" && msg.Message) msg = JSON.parse(msg.Message);
    } catch (parseErr) {
      log("ERROR", "Mensaje no es JSON, se descarta", { messageId, error: parseErr.message });
      continue;
    }

    try {
      const tpl = TEMPLATES[msg.eventType];
      if (!tpl) {
        log("INFO", "Evento sin plantilla, ignorado", { messageId, eventType: msg.eventType });
        continue;
      }
      if (msg.notifyEmployee === false) {
        log("INFO", "Notificación omitida (autoevaluación)", { messageId, tenantId: msg.tenantId });
        continue;
      }
      if (!msg.employeeEmail || !EMAIL_RE.test(msg.employeeEmail)) {
        log("WARN", "Email inválido, se descarta", { messageId, tenantId: msg.tenantId, goalId: msg.goalId });
        continue;
      }

      const text = tpl.text(msg);
      const out = await ses.send(
        new SendEmailCommand({
          FromEmailAddress: SENDER,
          Destination: { ToAddresses: [msg.employeeEmail] },
          Content: {
            Simple: {
              Subject: { Data: tpl.subject(msg), Charset: "UTF-8" },
              Body: {
                Text: { Data: `Hola ${msg.employeeName},\n\n${text}`, Charset: "UTF-8" },
                Html: { Data: buildHtml(msg, text), Charset: "UTF-8" },
              },
            },
          },
        })
      );

      log("INFO", "Correo enviado", { messageId, eventType: msg.eventType, tenantId: msg.tenantId, goalId: msg.goalId, evalId: msg.evalId, sesMessageId: out.MessageId });
    } catch (err) {
      log("ERROR", "Fallo al enviar correo", {
        messageId,
        eventType: msg?.eventType,
        tenantId: msg?.tenantId,
        goalId: msg?.goalId,
        errorName: err.name,
        error: err.message,
        awsStatus: err.$metadata?.httpStatusCode,
        stack: err.stack,
      });

      if (err.name === "MessageRejected" || err.name === "BadRequestException") continue;
      failures.push({ itemIdentifier: messageId });
    }
  }

  return { batchItemFailures: failures };
};
