const {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  TransactWriteCommand,
} = require("@aws-sdk/lib-dynamodb");

const TENANT_RE = /^[A-Za-z0-9_-]{1,64}$/;
const RESERVED = [":__pk", ":__sk", ":__sk2", ":__g", ":__tid"];
const TENANT_FIELDS = ["tenantId", "tenant_id", "tenant", "custom:tenant_id"];

class TenantViolationError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "TenantViolationError";
    this.statusCode = 403;
    this.details = details;
  }
}

const tenantFromEvent = (event) => {
  const auth = event.requestContext?.authorizer || {};
  const claims = auth.claims || auth.jwt?.claims || {};
  const fromToken = claims["custom:tenant_id"];
  if (fromToken) return fromToken;
  if (process.env.IS_OFFLINE) {
    const h = event.headers || {};
    return h["x-tenant-id"] || h["X-Tenant-Id"] || null;
  }
  return null;
};

const createTenantDb = (tenantId, { client, table }) => {
  if (!client) throw new Error("createTenantDb: client es obligatorio");
  if (!table) throw new Error("createTenantDb: table es obligatorio");
  if (typeof tenantId !== "string" || !TENANT_RE.test(tenantId))
    throw new TenantViolationError("tenantId inválido", { tenantId });

  const pk = `TENANT#${tenantId}`;
  const gsiPrefix = `${pk}#`;

  const violation = (msg, details = {}) => new TenantViolationError(msg, { tenantId, ...details });

  const checkReserved = (values = {}) => {
    for (const k of RESERVED) if (k in values) throw violation(`Placeholder reservado no permitido: ${k}`);
  };

  const checkSk = (sk) => {
    if (typeof sk !== "string" || !sk.length) throw violation("SK inválido", { sk });
    return sk;
  };

  const scopedKey = (key) => {
    if (!key || typeof key !== "object") throw violation("Key inválida");
    if (key.PK !== undefined && key.PK !== pk) throw violation("Intento de acceso a PK de otro tenant", { attemptedPK: key.PK });
    return { PK: pk, SK: checkSk(key.SK) };
  };

  const scopedItem = (item) => {
    if (!item || typeof item !== "object") throw violation("Item inválido");
    if (item.PK !== undefined && item.PK !== pk) throw violation("Intento de escribir con PK de otro tenant", { attemptedPK: item.PK });
    if (item.tenantId !== undefined && item.tenantId !== tenantId) throw violation("tenantId del item no coincide", { attemptedTenant: item.tenantId });
    if (item.GSI1PK !== undefined && typeof item.GSI1PK === "string" && item.GSI1PK.startsWith("TENANT#") && !item.GSI1PK.startsWith(gsiPrefix))
      throw violation("GSI1PK apunta a otro tenant", { attemptedGSI1PK: item.GSI1PK });
    checkSk(item.SK);
    return { ...item, PK: pk };
  };

  const checkUpdate = (params = {}) => {
    const expr = params.UpdateExpression || "";
    const names = Object.values(params.ExpressionAttributeNames || {});
    if (/\b(PK|tenantId)\b/.test(expr) || names.includes("PK") || names.includes("tenantId"))
      throw violation("No se permite modificar PK ni tenantId");
    checkReserved(params.ExpressionAttributeValues);
  };

  const checkStartKey = (k) => {
    if (k === undefined || k === null) return undefined;
    if (typeof k !== "object" || k.PK !== pk) throw violation("ExclusiveStartKey de otro tenant", { attemptedPK: k?.PK });
    if (k.GSI1PK !== undefined && !String(k.GSI1PK).startsWith(gsiPrefix)) throw violation("ExclusiveStartKey de índice de otro tenant");
    return k;
  };

  const assertOwned = (items = []) => {
    for (const it of items) {
      if (it.PK !== undefined && it.PK !== pk) throw violation("Resultado contiene datos de otro tenant", { leakedPK: it.PK });
      if (it.tenantId !== undefined && it.tenantId !== tenantId) throw violation("Resultado contiene tenantId ajeno", { leakedTenant: it.tenantId });
    }
    return items;
  };

  const forbidRawKeys = (opts) => {
    for (const k of ["TableName", "Key", "Item", "KeyConditionExpression", "IndexName"])
      if (opts && k in opts) throw violation(`No envíes ${k}: el enforcer lo inyecta`);
  };

  return {
    tenantId,
    pk,
    gsiPk: (suffix) => `${gsiPrefix}${suffix}`,

    async get(sk, opts = {}) {
      forbidRawKeys(opts);
      const out = await client.send(new GetCommand({ ...opts, TableName: table, Key: { PK: pk, SK: checkSk(sk) } }));
      if (out.Item) assertOwned([out.Item]);
      return out.Item || null;
    },

    async put(item, opts = {}) {
      forbidRawKeys(opts);
      checkReserved(opts.ExpressionAttributeValues);
      const safe = scopedItem(item);
      await client.send(new PutCommand({ ...opts, TableName: table, Item: safe }));
      return safe;
    },

    async update(sk, params = {}) {
      forbidRawKeys(params);
      checkUpdate(params);
      const out = await client.send(new UpdateCommand({ ...params, TableName: table, Key: { PK: pk, SK: checkSk(sk) } }));
      if (out.Attributes) assertOwned([out.Attributes]);
      return out.Attributes || null;
    },

    async delete(sk, opts = {}) {
      forbidRawKeys(opts);
      checkReserved(opts.ExpressionAttributeValues);
      const out = await client.send(new DeleteCommand({ ...opts, TableName: table, Key: { PK: pk, SK: checkSk(sk) } }));
      return out.Attributes || null;
    },

    async query({ skPrefix, skBetween, index, gsiSuffix, gsiSkPrefix, startKey, ...rest } = {}) {
      forbidRawKeys(rest);
      checkReserved(rest.ExpressionAttributeValues);

      const values = { ...(rest.ExpressionAttributeValues || {}) };
      let keyExpr;
      let indexName;

      if (index) {
        if (index !== "GSI1") throw violation(`Índice no permitido: ${index}`);
        if (typeof gsiSuffix !== "string" || !gsiSuffix.length) throw violation("gsiSuffix es obligatorio para consultar GSI1");
        indexName = index;
        values[":__g"] = `${gsiPrefix}${gsiSuffix}`;
        keyExpr = "GSI1PK = :__g";
        if (gsiSkPrefix) {
          values[":__sk"] = gsiSkPrefix;
          keyExpr += " AND begins_with(GSI1SK, :__sk)";
        }
      } else {
        values[":__pk"] = pk;
        keyExpr = "PK = :__pk";
        if (skPrefix) {
          values[":__sk"] = skPrefix;
          keyExpr += " AND begins_with(SK, :__sk)";
        } else if (Array.isArray(skBetween) && skBetween.length === 2) {
          values[":__sk"] = skBetween[0];
          values[":__sk2"] = skBetween[1];
          keyExpr += " AND SK BETWEEN :__sk AND :__sk2";
        }
      }

      const params = {
        ...rest,
        TableName: table,
        KeyConditionExpression: keyExpr,
        ExpressionAttributeValues: values,
        ExclusiveStartKey: checkStartKey(startKey),
      };
      if (indexName) params.IndexName = indexName;

      const out = await client.send(new QueryCommand(params));
      const items = out.Items || [];
      if (!indexName) assertOwned(items);
      else
        for (const it of items)
          if (it.GSI1PK !== undefined && !String(it.GSI1PK).startsWith(gsiPrefix))
            throw violation("Resultado de índice contiene datos de otro tenant", { leaked: it.GSI1PK });

      return { items, lastKey: out.LastEvaluatedKey || null };
    },

    async transactWrite(ops = []) {
      if (!Array.isArray(ops) || !ops.length || ops.length > 100) throw violation("transactWrite requiere entre 1 y 100 operaciones");
      const TransactItems = ops.map((op, i) => {
        const type = Object.keys(op)[0];
        const body = op[type];
        if (!body || Object.keys(op).length !== 1) throw violation(`Operación ${i} inválida`);
        if (body.TableName && body.TableName !== table) throw violation(`Operación ${i} apunta a otra tabla`);
        checkReserved(body.ExpressionAttributeValues);

        if (type === "Put") return { Put: { ...body, TableName: table, Item: scopedItem(body.Item) } };
        if (type === "Update") {
          checkUpdate(body);
          return { Update: { ...body, TableName: table, Key: scopedKey(body.Key) } };
        }
        if (type === "Delete") return { Delete: { ...body, TableName: table, Key: scopedKey(body.Key) } };
        if (type === "ConditionCheck") return { ConditionCheck: { ...body, TableName: table, Key: scopedKey(body.Key) } };
        throw violation(`Tipo de operación no permitido: ${type}`);
      });
      await client.send(new TransactWriteCommand({ TransactItems }));
    },

    scan() {
      throw violation("Scan está prohibido en tablas multi-tenant");
    },
  };
};

const findTenantClaims = (obj, source) => {
  const found = [];
  if (!obj || typeof obj !== "object") return found;
  for (const f of TENANT_FIELDS) {
    if (obj[f] !== undefined && obj[f] !== null && obj[f] !== "") found.push({ source, field: f, value: String(obj[f]) });
  }
  return found;
};

const parseBodySafe = (event) => {
  if (!event?.body) return null;
  try {
    const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const assertRequestTenant = (event, tenantId) => {
  if (typeof tenantId !== "string" || !TENANT_RE.test(tenantId))
    throw new TenantViolationError("tenantId del token inválido", { tenantId });

  const headers = Object.fromEntries(Object.entries(event?.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
  const body = parseBodySafe(event);

  const claims = [
    ...(Array.isArray(body) ? body.flatMap((b, i) => findTenantClaims(b, `body[${i}]`)) : findTenantClaims(body, "body")),
    ...findTenantClaims(event?.pathParameters, "path"),
    ...findTenantClaims(event?.queryStringParameters, "query"),
  ];

  if (headers["x-tenant-id"] !== undefined) claims.push({ source: "header", field: "x-tenant-id", value: String(headers["x-tenant-id"]) });

  const mismatches = claims.filter((c) => c.value !== tenantId);
  if (mismatches.length)
    throw new TenantViolationError("El tenant de la solicitud no coincide con el token JWT", { tenantId, mismatches });

  return true;
};

module.exports = { createTenantDb, tenantFromEvent, assertRequestTenant, TenantViolationError };
