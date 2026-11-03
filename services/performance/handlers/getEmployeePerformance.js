const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { assertRequestTenant, TenantViolationError } = require("../lib/dynamoTenantFilter");

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.PERFORMANCE_TABLE;
const TZ_OFFSET_HOURS = Number(process.env.TZ_OFFSET_HOURS ?? -5);

const EMPLOYEE_RE = /^[A-Za-z0-9_-]{1,64}$/;
const CYCLE_RE = /^(\d{4})-(Q[1-4]|H[12]|ANUAL)$/;
const PERIOD_END = { Q1: 3, Q2: 6, Q3: 9, Q4: 12, H1: 6, H2: 12, ANUAL: 12 };
const RELATIONSHIPS = { SELF: "Autoevaluación", MANAGER: "Jefe directo", PEER: "Par", DIRECT_REPORT: "Reporte directo" };
const CHANGE_THRESHOLD = 0.25;
const LOW_SCORE = 3.5;
const HIGH_SCORE = 4;
const SELF_GAP = 0.5;
const MAX_ITEMS = 2000;
const RETRYABLE = ["ProvisionedThroughputExceededException", "ThrottlingException", "RequestLimitExceeded", "InternalServerError", "ServiceUnavailable"];

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "getEmployeePerformance", msg, ts: new Date().toISOString(), ...extra }));

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

const round2 = (n) => Math.round(n * 100) / 100;
const mean = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
const fmt = (n) => (n == null ? "-" : n.toFixed(2));
const sign = (n) => (n > 0 ? `+${fmt(n)}` : fmt(n));

const cycleType = (c) => {
  const p = CYCLE_RE.exec(c)[2];
  return p.startsWith("Q") ? "Q" : p.startsWith("H") ? "H" : "A";
};
const cycleOrder = (c) => {
  const m = CYCLE_RE.exec(c);
  return Number(m[1]) * 100 + PERIOD_END[m[2]];
};

const todayLocalStr = () => new Date(Date.now() + TZ_OFFSET_HOURS * 3600 * 1000).toISOString().slice(0, 10);

const queryAll = async (pk, prefix) => {
  const items = [];
  let lastKey;
  do {
    const page = await ddb.send(
      new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
        ExpressionAttributeValues: { ":pk": pk, ":prefix": prefix },
        ExclusiveStartKey: lastKey,
      })
    );
    items.push(...(page.Items || []));
    lastKey = page.LastEvaluatedKey;
  } while (lastKey && items.length < MAX_ITEMS);
  return { items: items.slice(0, MAX_ITEMS), truncated: !!lastKey };
};

const aggregate = (evals) => {
  const comps = {};
  const rel = {};
  for (const e of evals) {
    (rel[e.relationship] ||= []).push(e.score);
    for (const c of e.competencies || []) {
      const k = c.name.trim().toLowerCase();
      (comps[k] ||= { name: c.name.trim(), scores: [] }).scores.push(c.score);
    }
  }
  const others = evals.filter((e) => e.relationship !== "SELF").map((e) => e.score);
  return {
    count: evals.length,
    average: evals.length ? round2(mean(evals.map((e) => e.score))) : null,
    othersAverage: others.length ? round2(mean(others)) : null,
    byRelationship: Object.fromEntries(
      Object.entries(rel).map(([k, v]) => [k, { label: RELATIONSHIPS[k] || k, count: v.length, average: round2(mean(v)) }])
    ),
    competencies: Object.fromEntries(
      Object.entries(comps).map(([k, v]) => [k, { name: v.name, count: v.scores.length, average: round2(mean(v.scores)) }])
    ),
  };
};

const classify = (delta) => (delta >= CHANGE_THRESHOLD ? "IMPROVED" : delta <= -CHANGE_THRESHOLD ? "DECLINED" : "STABLE");

const compareCompetencies = (cur, prev) => {
  const keys = new Set([...Object.keys(cur.competencies), ...Object.keys(prev?.competencies || {})]);
  const out = [];
  for (const k of keys) {
    const c = cur.competencies[k];
    const p = prev?.competencies?.[k];
    let status;
    let delta = null;
    if (c && p) {
      delta = round2(c.average - p.average);
      status = classify(delta);
    } else if (c) {
      status = prev ? "NEW" : "NO_COMPARISON";
    } else {
      status = "NOT_EVALUATED";
    }
    out.push({
      name: (c || p).name,
      current: c ? c.average : null,
      previous: p ? p.average : null,
      delta,
      status,
      needsImprovement: !!c && (c.average < LOW_SCORE || status === "DECLINED"),
      isStrength: !!c && c.average >= HIGH_SCORE,
    });
  }
  return out.sort((a, b) => (b.delta ?? -99) - (a.delta ?? -99));
};

const textFeedback = (evals, field) =>
  evals
    .filter((e) => e[field])
    .map((e) => ({
      from: e.anonymous ? "Par (anónimo)" : `${e.evaluatorName} · ${RELATIONSHIPS[e.relationship] || e.relationship}`,
      text: e[field],
    }));

const sanitizeEval = (e) => ({
  evalId: e.evalId,
  cycle: e.cycle,
  relationship: e.relationship,
  relationshipLabel: RELATIONSHIPS[e.relationship] || e.relationship,
  evaluatorId: e.anonymous ? null : e.evaluatorId,
  evaluatorName: e.anonymous ? null : e.evaluatorName,
  anonymous: !!e.anonymous,
  score: e.score,
  competencies: e.competencies || [],
  strengths: e.strengths || null,
  improvements: e.improvements || null,
  feedback: e.feedback || null,
  createdAt: e.createdAt,
});

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
    if (!employeeId || !EMPLOYEE_RE.test(employeeId)) {
      log("WARN", "employeeId inválido", { requestId, tenantId, employeeId });
      return res(400, { message: "employeeId inválido" });
    }

    const claims = getClaims(event);
    const role = String(claims["custom:role"] || "").toUpperCase();
    const myEmployeeId = claims["custom:employee_id"];
    if (role === "EMPLOYEE" && myEmployeeId !== employeeId) {
      log("WARN", "Empleado intentando ver desempeño ajeno", { requestId, tenantId, employeeId, myEmployeeId });
      return res(403, { message: "Solo puedes ver tu propio desempeño" });
    }

    const qs = event.queryStringParameters || {};
    const cycleParam = qs.cycle ? String(qs.cycle).toUpperCase() : null;
    const compareParam = qs.compareWith ? String(qs.compareWith).toUpperCase() : null;
    const includeEvaluations = qs.includeEvaluations !== "false";

    if (cycleParam && !CYCLE_RE.test(cycleParam))
      return res(400, { message: "cycle debe tener formato YYYY-Q1..Q4, YYYY-H1/H2 o YYYY-ANUAL" });
    if (compareParam && !CYCLE_RE.test(compareParam))
      return res(400, { message: "compareWith debe tener formato YYYY-Q1..Q4, YYYY-H1/H2 o YYYY-ANUAL" });
    if (cycleParam && compareParam && cycleParam === compareParam)
      return res(400, { message: "cycle y compareWith no pueden ser iguales" });

    const pk = `TENANT#${tenantId}`;

    const [summariesQ, goalsQ] = await Promise.all([
      queryAll(pk, `SUMMARY#${employeeId}#`),
      queryAll(pk, `GOAL#${employeeId}#`),
    ]);

    const summaries = summariesQ.items
      .filter((s) => CYCLE_RE.test(s.cycle))
      .sort((a, b) => cycleOrder(a.cycle) - cycleOrder(b.cycle) || a.cycle.localeCompare(b.cycle));

    if (!summaries.length && !goalsQ.items.length) {
      log("INFO", "Empleado sin datos de desempeño", { requestId, tenantId, employeeId });
      return res(404, { message: "El empleado no tiene evaluaciones ni metas registradas" });
    }

    const cycle = cycleParam || (summaries.length ? summaries[summaries.length - 1].cycle : null);

    let compareWith = compareParam;
    if (!compareWith && cycle) {
      const prev = summaries.filter((s) => cycleType(s.cycle) === cycleType(cycle) && cycleOrder(s.cycle) < cycleOrder(cycle));
      compareWith = prev.length ? prev[prev.length - 1].cycle : null;
    }

    const [curQ, prevQ] = await Promise.all([
      cycle ? queryAll(pk, `EVAL#${employeeId}#${cycle}#`) : Promise.resolve({ items: [], truncated: false }),
      compareWith ? queryAll(pk, `EVAL#${employeeId}#${compareWith}#`) : Promise.resolve({ items: [], truncated: false }),
    ]);

    const curEvals = curQ.items.filter((e) => e.entityType === "EVALUATION");
    const prevEvals = prevQ.items.filter((e) => e.entityType === "EVALUATION");

    if (cycleParam && !curEvals.length) {
      log("INFO", "Ciclo sin evaluaciones", { requestId, tenantId, employeeId, cycle });
      return res(404, { message: `No hay evaluaciones del ciclo ${cycle}` });
    }

    const cur = aggregate(curEvals);
    const prev = prevEvals.length ? aggregate(prevEvals) : null;
    const competencies = compareCompetencies(cur, prev);

    const overallDelta = prev && cur.average != null && prev.average != null ? round2(cur.average - prev.average) : null;
    const overall = {
      current: cur.average,
      previous: prev ? prev.average : null,
      delta: overallDelta,
      status: overallDelta == null ? "NO_COMPARISON" : classify(overallDelta),
      evaluationsCurrent: cur.count,
      evaluationsPrevious: prev ? prev.count : 0,
    };

    const selfScore = cur.byRelationship.SELF?.average ?? null;
    const selfGap = selfScore != null && cur.othersAverage != null ? round2(selfScore - cur.othersAverage) : null;

    const improved = competencies.filter((c) => c.status === "IMPROVED");
    const declined = competencies.filter((c) => c.status === "DECLINED").sort((a, b) => a.delta - b.delta);
    const strengths = competencies.filter((c) => c.isStrength).sort((a, b) => b.current - a.current);
    const toImprove = competencies.filter((c) => c.needsImprovement).sort((a, b) => a.current - b.current);

    const messages = [];
    if (overall.status === "IMPROVED")
      messages.push(`Tu puntaje general subió de ${fmt(overall.previous)} a ${fmt(overall.current)} (${sign(overall.delta)}) respecto a ${compareWith}.`);
    if (overall.status === "DECLINED")
      messages.push(`Tu puntaje general bajó de ${fmt(overall.previous)} a ${fmt(overall.current)} (${sign(overall.delta)}) respecto a ${compareWith}.`);
    if (overall.status === "STABLE")
      messages.push(`Tu puntaje general se mantuvo estable (${fmt(overall.previous)} → ${fmt(overall.current)}).`);
    for (const c of improved) messages.push(`Mejoraste en "${c.name}": ${fmt(c.previous)} → ${fmt(c.current)} (${sign(c.delta)}).`);
    for (const c of declined) messages.push(`Bajaste en "${c.name}": ${fmt(c.previous)} → ${fmt(c.current)} (${sign(c.delta)}). Requiere atención.`);
    for (const c of toImprove.filter((x) => x.status !== "DECLINED"))
      messages.push(`"${c.name}" sigue por debajo de ${LOW_SCORE} (${fmt(c.current)}). Es un área a reforzar.`);
    for (const c of strengths.slice(0, 3)) messages.push(`Fortaleza destacada: "${c.name}" (${fmt(c.current)}).`);
    if (selfGap != null && selfGap >= SELF_GAP)
      messages.push(`Te autoevaluaste ${fmt(selfGap)} puntos por encima de cómo te ven los demás. Conviene contrastar percepciones con tu jefe.`);
    if (selfGap != null && selfGap <= -SELF_GAP)
      messages.push(`Te autoevaluaste ${fmt(Math.abs(selfGap))} puntos por debajo de cómo te ven los demás. Tu desempeño es mejor de lo que percibes.`);
    if (!prev && cycle) messages.push(`No hay un ciclo anterior comparable a ${cycle}; esta es tu línea base.`);

    const today = todayLocalStr();
    const goals = goalsQ.items
      .filter((g) => g.entityType === "GOAL")
      .map((g) => ({
        goalId: g.goalId,
        title: g.title,
        targetDate: g.targetDate,
        status: g.status,
        progress: g.progress ?? 0,
        overdue: g.status === "ACTIVE" && g.targetDate < today,
        nextReminderAt: g.nextReminderAt || null,
      }))
      .sort((a, b) => a.targetDate.localeCompare(b.targetDate));

    const goalsSummary = {
      total: goals.length,
      active: goals.filter((g) => g.status === "ACTIVE").length,
      completed: goals.filter((g) => g.status === "COMPLETED").length,
      overdue: goals.filter((g) => g.overdue).length,
      averageProgress: goals.length ? round2(mean(goals.map((g) => g.progress))) : null,
    };

    const trend = summaries.map((s) => ({
      cycle: s.cycle,
      average: s.evaluationsCount ? round2(s.scoreSum / s.evaluationsCount) : null,
      evaluations: s.evaluationsCount || 0,
    }));

    const employeeName = curEvals[0]?.employeeName || summaries[summaries.length - 1]?.employeeName || goalsQ.items[0]?.employeeName || null;
    const truncated = summariesQ.truncated || goalsQ.truncated || curQ.truncated || prevQ.truncated;

    log("INFO", "Desempeño consultado", {
      requestId,
      tenantId,
      employeeId,
      cycle,
      compareWith,
      evalsCurrent: curEvals.length,
      evalsPrevious: prevEvals.length,
      goals: goals.length,
      truncated,
    });

    return res(200, {
      employeeId,
      employeeName,
      cycle,
      compareWith,
      overall,
      competencies,
      byRelationship: { current: cur.byRelationship, previous: prev ? prev.byRelationship : null },
      insights: {
        improved: improved.map(({ name, previous, current, delta }) => ({ name, previous, current, delta })),
        declined: declined.map(({ name, previous, current, delta }) => ({ name, previous, current, delta })),
        strengths: strengths.map(({ name, current }) => ({ name, score: current })),
        toImprove: toImprove.map(({ name, current, status }) => ({ name, score: current, reason: status === "DECLINED" ? "BAJÓ" : "PUNTAJE_BAJO" })),
        selfPerception: { self: selfScore, others: cur.othersAverage, gap: selfGap },
        messages,
      },
      feedback: {
        currentStrengths: textFeedback(curEvals, "strengths"),
        currentImprovements: textFeedback(curEvals, "improvements"),
        previousImprovements: textFeedback(prevEvals, "improvements"),
      },
      trend,
      goals: { summary: goalsSummary, items: goals },
      evaluations: includeEvaluations ? curEvals.map(sanitizeEval) : undefined,
      truncated,
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

    if (RETRYABLE.includes(err.name))
      return res(503, { message: "Servicio ocupado, reintenta en unos segundos", requestId });
    if (err.name === "ResourceNotFoundException")
      return res(500, { message: "Recurso de base de datos no encontrado", requestId });
    if (err.name === "AccessDeniedException")
      return res(500, { message: "Permisos insuficientes del servicio", requestId });

    return res(500, { message: "Error interno", requestId });
  }
};
