# HCM SaaS — Reclutamiento y Desempeño

Microservicios serverless del SaaS HCM multi-tenant (CS2032 Computación en la Nube, UTEC 2026-2).

| Microservicio | Carpeta | Tabla DynamoDB | Topic SNS |
|---|---|---|---|
| Reclutamiento | `services/recruitment` | `ms-recruitment-table-{stage}` | `hcm-recruitment-{stage}-events` |
| Desempeño | `services/performance` | `ms-performance-table-{stage}` | `hcm-performance-{stage}-events` |

Stack: Node.js 20 · API Gateway · Lambda · DynamoDB (single-table) · S3 · SNS · SQS (+DLQ) · SES · EventBridge (cron) · Serverless Framework v3.

---

## Estructura

```
services/
├── recruitment/
│   ├── handlers/
│   │   ├── createVacancy.js            POST  /vacancies
│   │   ├── updateVacancy.js            PATCH /vacancies/{vacancyId}
│   │   ├── createCandidate.js          POST  /candidates  (+ uploadUrl, submit)
│   │   ├── uploadResumePresignedUrl.js POST  /candidates/{id}/resume/upload-url
│   │   ├── updateStage.js              PATCH /candidates/{id}/stage
│   │   ├── queries.js                  Todos los GET
│   │   └── notifyStageChange.js        Worker SQS → correo
│   ├── lib/dynamoTenantFilter.js       Aislamiento multi-tenant
│   ├── package.json
│   └── serverless.yml
└── performance/
    ├── handlers/
    │   ├── createGoal.js               POST /goals (+ cron recordatorios, worker correo)
    │   ├── updateGoal.js               PATCH /goals/{employeeId}/{goalId}
    │   ├── submitEvaluation.js         POST /evaluations
    │   └── getEmployeePerformance.js   GET  /evaluations/employee/{employeeId}
    ├── lib/dynamoTenantFilter.js
    ├── package.json
    └── serverless.yml
```

---

## Arquitectura

```
Frontend (Amplify) ──JWT──► API Gateway ──► Lambda ──► DynamoDB (PK = TENANT#<id>)
                                              │──► S3 (presigned URLs, prefijo /<tenantId>/)
                                              └──► SNS ──► SQS (+DLQ) ──► Lambda worker ──► SES (correo)

EventBridge (cada hora) ──► dispatchGoalReminders ──► SNS ──► SQS ──► notifyGoal ──► SES
```

### Multi-tenant

- El `tenantId` **siempre** sale del claim `custom:tenant_id` del JWT de Cognito, nunca del body.
- Si el body, path, query o header `x-tenant-id` traen un tenant distinto al del token → **403 Acceso denegado** (`lib/dynamoTenantFilter.js → assertRequestTenant`).
- Todas las claves en DynamoDB usan `PK = TENANT#<tenantId>`.
- Archivos en S3: `s3://hcm-app-storage/{tenantId}/recruitment/...`.

---

## Requisitos

- Node.js 20+
- AWS CLI configurado (`aws configure`)
- Bucket S3 `hcm-app-storage` con CORS `POST` habilitado para el dominio de Amplify
- Correo remitente **verificado en SES** (en sandbox, también los correos destino)

## Instalación y despliegue

```bash
cd services/recruitment
npm install
npx serverless deploy --param="senderEmail=tucorreo@gmail.com" --param="storageBucket=hcm-app-storage"

cd ../performance
npm install
npx serverless deploy --param="senderEmail=tucorreo@gmail.com"
```

Cada deploy imprime su URL base:

```
https://<api-id>.execute-api.us-east-1.amazonaws.com/dev
```

## Probar en local

```bash
npx serverless offline
```

En local no hay Cognito: el tenant se envía con el header `x-tenant-id`.

```bash
curl http://localhost:3000/dev/vacancies -H "x-tenant-id: tenant_a"
```

En AWS se usa `Authorization: Bearer <JWT>`; si `x-tenant-id` no coincide con el token, responde 403.

---

## Headers comunes

| Header | Cuándo |
|---|---|
| `Authorization: Bearer <idToken>` | En AWS (cuando se active el Cognito Authorizer) |
| `x-tenant-id: tenant_a` | Solo en local (`serverless offline`) |
| `Content-Type: application/json` | En POST y PATCH |

## Códigos de respuesta

| Código | Significado |
|---|---|
| 200 / 201 | OK / Creado |
| 400 | Validación fallida (el `message` dice qué campo) |
| 401 | No se identificó el tenant |
| 403 | Intento de acceso a otro tenant / rol sin permiso |
| 404 | No existe (o pertenece a otro tenant) |
| 409 | Duplicado, estado no válido o editado por otra persona |
| 422 | Faltan archivos obligatorios o transición de etapa inválida |
| 503 | DynamoDB/S3 ocupado, reintentar |
| 500 | Error interno (la respuesta trae `requestId` para buscar en CloudWatch) |

---

# 📁 Reclutamiento (`services/recruitment`)

## Resumen de endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/vacancies` | Crear vacante |
| GET | `/vacancies` | Listar vacantes |
| GET | `/vacancies/{vacancyId}` | Detalle + conteo por etapa |
| PATCH | `/vacancies/{vacancyId}` | Editar / cerrar / reabrir |
| POST | `/candidates` | Crear candidatura (DRAFT) |
| GET | `/candidates` | Listar candidatos |
| GET | `/candidates/{candidateId}` | Perfil completo |
| POST | `/candidates/{candidateId}/resume/upload-url` | URL para subir CV |
| POST | `/candidates/{candidateId}/certificates/{certKey}/upload-url` | URL para subir certificado |
| POST | `/candidates/{candidateId}/submit` | Enviar candidatura |
| GET | `/candidates/{candidateId}/documents/{docKey}` | Ver/descargar archivo |
| PATCH | `/candidates/{candidateId}/stage` | Cambiar etapa |

### Flujo de una candidatura

```
1. POST /vacancies                                          → crea la vacante (con certificados requeridos)
2. POST /candidates                                         → candidatura en DRAFT
3. POST /candidates/{id}/resume/upload-url                  → URL para subir el CV (PDF)
4. POST /candidates/{id}/certificates/{certKey}/upload-url  → URL por cada certificado
5. (frontend) POST directo a S3 con la URL                  → sube los archivos
6. POST /candidates/{id}/submit                             → valida archivos en S3 → APPLIED + correo
7. PATCH /candidates/{id}/stage                             → INTERVIEW / OFFER / HIRED / REJECTED + correo
```

Etapas válidas:

```
DRAFT → APPLIED → INTERVIEW → OFFER → HIRED
APPLIED, INTERVIEW u OFFER → REJECTED
```

---

### `POST /vacancies` — Crear vacante

```json
{
  "title": "Electricista Industrial",
  "department": "Mantenimiento",
  "description": "Mantenimiento de tableros",
  "location": "Arequipa",
  "employmentType": "FULL_TIME",
  "salaryMin": 2500,
  "salaryMax": 4000,
  "openings": 2,
  "requireLinkedin": true,
  "requiredCertificates": [
    { "name": "SCTR vigente", "mandatory": true },
    { "name": "Trabajos en altura", "mandatory": true },
    { "name": "Curso PLC Siemens", "mandatory": false }
  ]
}
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `title`, `department` | ✅ | texto |
| `employmentType` | | `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP` |
| `salaryMin`, `salaryMax` | | números ≥ 0, min ≤ max |
| `openings` | | entero ≥ 1 (default 1) |
| `requireLinkedin` | | booleano |
| `requiredCertificates` | | máx. 10; cada uno `{ name, mandatory, description? }` |

La respuesta trae cada certificado con su `key` (ej. `sctr-vigente`), que se usa para subir el archivo.

---

### `GET /vacancies` — Listar vacantes

| Param | Ejemplo |
|---|---|
| `status` | `OPEN` / `CLOSED` |
| `department` | `TI` |
| `limit` | `20` (1–100) |
| `nextToken` | valor devuelto por la página anterior |

Respuesta: `{ items, count, nextToken }`.

### `GET /vacancies/{vacancyId}` — Detalle + conteo para Kanban

Query: `withStats=false` para no contar candidatos.

```json
{
  "vacancy": { "...": "..." },
  "stats": {
    "byStage": { "DRAFT": 2, "APPLIED": 10, "INTERVIEW": 3, "OFFER": 1, "HIRED": 0, "REJECTED": 4 },
    "totalSubmitted": 18,
    "totalDrafts": 2
  }
}
```

### `PATCH /vacancies/{vacancyId}` — Editar / cerrar / reabrir

```json
{ "status": "CLOSED", "closeReason": "Puesto cubierto" }
```

- Editables: `status`, `closeReason`, `title`, `department`, `description`, `location`, `employmentType`, `salaryMin`, `salaryMax`, `openings`.
- **No editables:** `requiredCertificates`, `requireLinkedin` (romperían candidaturas en curso).
- Al cerrar, ya no se aceptan candidaturas nuevas.

---

### `POST /candidates` — Crear candidatura (DRAFT)

```json
{
  "vacancyId": "v-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "fullName": "María García",
  "email": "maria@gmail.com",
  "phone": "+51 987654321",
  "linkedin": {
    "url": "https://linkedin.com/in/mariagarcia",
    "headline": "Electricista industrial",
    "yearsExperience": 4
  }
}
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `vacancyId`, `fullName`, `email` | ✅ | la vacante debe estar `OPEN` |
| `linkedin.url` | si la vacante tiene `requireLinkedin: true` | `https://linkedin.com/in/<perfil>` |

- El mismo email no puede postular dos veces a la misma vacante → 409.
- La respuesta incluye `pendingUploads`: CV + certificados obligatorios.

### `POST /candidates/{candidateId}/resume/upload-url` — URL para subir CV

Body opcional: `{ "contentType": "application/pdf" }`. Solo PDF, máx. 5 MB, URL válida 5 min.

Ruta en S3: `{tenantId}/recruitment/resumes/{candidateId}.pdf`

Respuesta: `{ uploadUrl, fields, s3Key, expiresIn, maxBytes }`.

### `POST /candidates/{candidateId}/certificates/{certKey}/upload-url` — URL para subir certificado

```json
{ "contentType": "application/pdf" }
```

`contentType`: `application/pdf`, `image/jpeg` o `image/png`. Máx. 5 MB.

Ruta en S3: `{tenantId}/recruitment/certificates/{candidateId}/{certKey}.{ext}`

#### Cómo sube el frontend (CV o certificado)

```javascript
const fd = new FormData();
Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
fd.append("file", archivo);              // SIEMPRE al final
await fetch(uploadUrl, { method: "POST", body: fd });
```

### `POST /candidates/{candidateId}/submit` — Enviar candidatura

Sin body. Verifica **en S3** que estén el CV y todos los certificados obligatorios.

- Faltan archivos → **422** con `missing: [{ key, name, reason }]`.
- OK → etapa `APPLIED`, suma `candidatesCount` en la vacante y envía el correo "Recibimos tu postulación".

---

### `GET /candidates` — Listar candidatos

| Param | Ejemplo |
|---|---|
| `vacancyId` | filtra por vacante (usa GSI1) |
| `stage` | `INTERVIEW` |
| `includeDrafts` | `true` (por defecto se ocultan los DRAFT) |
| `limit`, `nextToken` | paginación |

Cada ítem trae resumen de certificados: `{ total, uploaded, mandatoryPending }`.

### `GET /candidates/{candidateId}` — Perfil completo

Devuelve `candidate` (LinkedIn, certificados, `stageHistory`) y `documents` con el estado de cada archivo.

### `GET /candidates/{candidateId}/documents/{docKey}` — Ver/descargar archivo

- `docKey`: `resume` o la `key` del certificado.
- Query: `download=true` para descargar en vez de ver inline.
- Respuesta: `{ url, expiresIn: 300, filename }` (URL firmada de S3).

---

### `PATCH /candidates/{candidateId}/stage` — Cambiar etapa

```json
{ "stage": "INTERVIEW", "note": "Entrevista el lunes 10am" }
```

- Transición inválida → 422 con `allowed`.
- Publica `candidate.stage_changed` → correo al candidato.
- Si pasa a `HIRED`, además publica `candidate.hired` (para Core HR / Nóminas).

### Eventos SNS que publica Reclutamiento

| Evento | Cuándo | Payload principal |
|---|---|---|
| `candidate.stage_changed` | submit y cada cambio de etapa | `tenantId, candidateId, vacancyId, vacancyTitle, fullName, email, fromStage, toStage, note, changedAt` |
| `candidate.hired` | etapa `HIRED` | mismo payload |

Otros microservicios se suscriben al topic `hcm-recruitment-{stage}-events` con `FilterPolicy: { eventType: ["candidate.hired"] }`. El ARN sale en el output `RecruitmentTopicArn`.

---

# 📁 Desempeño (`services/performance`)

## Resumen de endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/goals` | Asignar meta con recordatorios |
| PATCH | `/goals/{employeeId}/{goalId}` | Progreso / completar / cancelar |
| POST | `/evaluations` | Registrar evaluación 360° |
| GET | `/evaluations/employee/{employeeId}` | Desempeño + comparación entre ciclos |

### `POST /goals` — Asignar meta

```json
{
  "employeeId": "emp-102",
  "employeeName": "Carlos Ruiz",
  "employeeEmail": "carlos@empresa.com",
  "title": "Certificación AWS Solutions Architect",
  "description": "Aprobar el SAA-C03",
  "targetDate": "2026-12-15",
  "reminder": { "enabled": true, "frequency": "WEEKLY", "hour": 9 }
}
```

| Campo | Obligatorio | Regla |
|---|---|---|
| `employeeId`, `employeeName`, `employeeEmail`, `title`, `targetDate` | ✅ | `targetDate` en `YYYY-MM-DD`, hoy o futura |
| `reminder.frequency` | | `DAILY`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`, `CUSTOM` |
| `reminder.everyDays` | si `CUSTOM` | 1–90 |
| `reminder.hour` | | 0–23 (hora Perú) |
| `reminder.firstReminderAt` | | ISO 8601, fuerza el primer recordatorio (útil en demo) |

Envía el correo "Nueva meta asignada". Los recordatorios los envía un cron cada hora hasta la fecha límite o hasta que la meta se complete/cancele.

### `PATCH /goals/{employeeId}/{goalId}` — Progreso / completar / cancelar

```json
{ "progress": 60, "progressNote": "Aprobé el simulacro" }
```

```json
{ "status": "COMPLETED" }
```

```json
{ "reminder": { "frequency": "CUSTOM", "everyDays": 3, "hour": 8 } }
```

- Campos: `progress` (0–100), `progressNote`, `status` (`ACTIVE`, `COMPLETED`, `CANCELLED`), `title`, `description`, `targetDate`, `reminder`.
- `progress: 100` completa la meta automáticamente.
- Completar o cancelar **detiene los recordatorios**.
- Rol `EMPLOYEE` (claim `custom:role`): solo puede actualizar `progress` de **sus propias** metas.

---

### `POST /evaluations` — Registrar evaluación 360°

```json
{
  "employeeId": "emp-102",
  "employeeName": "Carlos Ruiz",
  "employeeEmail": "carlos@empresa.com",
  "evaluatorId": "emp-005",
  "evaluatorName": "Lucía Torres",
  "relationship": "MANAGER",
  "cycle": "2026-Q4",
  "competencies": [
    { "name": "Trabajo en equipo", "score": 4.5 },
    { "name": "Calidad técnica", "score": 5, "comment": "Excelente migración" }
  ],
  "strengths": "Liderazgo técnico",
  "improvements": "Documentar mejor",
  "anonymous": false
}
```

| Campo | Regla |
|---|---|
| `relationship` | `SELF`, `MANAGER`, `PEER`, `DIRECT_REPORT` |
| `cycle` | `YYYY-Q1..Q4`, `YYYY-H1/H2`, `YYYY-ANUAL` |
| `score` / `competencies[].score` | 1 a 5 en pasos de 0.5 |
| `anonymous` | solo permitido para `PEER` |

- Si no se manda `score`, se calcula como promedio de competencias.
- Un evaluador solo puede evaluar una vez al mismo empleado por ciclo → 409.
- Publica `evaluation.completed` y envía correo al evaluado (excepto autoevaluación).

### `GET /evaluations/employee/{employeeId}` — Desempeño + comparación

| Param | Ejemplo | Default |
|---|---|---|
| `cycle` | `2026-Q4` | último ciclo con evaluaciones |
| `compareWith` | `2026-Q3` | ciclo anterior del mismo tipo |
| `includeEvaluations` | `false` | `true` |

Respuesta (resumen):

```json
{
  "overall": { "current": 4.33, "previous": 3.8, "delta": 0.53, "status": "IMPROVED" },
  "competencies": [ { "name": "Puntualidad", "current": 3.5, "previous": 2.5, "delta": 1, "status": "IMPROVED" } ],
  "insights": {
    "improved": [], "declined": [], "strengths": [], "toImprove": [],
    "selfPerception": { "self": 4.8, "others": 4.1, "gap": 0.7 },
    "messages": ["Tu puntaje general subió de 3.80 a 4.33 (+0.53)…"]
  },
  "feedback": { "currentStrengths": [], "currentImprovements": [], "previousImprovements": [] },
  "trend": [ { "cycle": "2026-Q3", "average": 3.8 }, { "cycle": "2026-Q4", "average": 4.33 } ],
  "goals": { "summary": { "total": 3, "active": 2, "completed": 1, "overdue": 0 }, "items": [] }
}
```

Rol `EMPLOYEE`: solo puede ver su propio `employeeId` (claim `custom:employee_id`).

### Procesos internos (no HTTP)

| Lambda | Disparador | Qué hace |
|---|---|---|
| `dispatchGoalReminders` | EventBridge cada hora | Publica `goal.reminder` de metas con recordatorio vencido |
| `notifyGoal` | SQS | Envía correos de `goal.assigned`, `goal.reminder`, `evaluation.completed` |

Forzar recordatorios sin esperar la hora (demo):

```bash
npx serverless invoke -f dispatchGoalReminders
```

---

## Modelo de datos (DynamoDB single-table)

### `ms-recruitment-table-{stage}`

| Entidad | PK | SK | GSI1PK | GSI1SK |
|---|---|---|---|---|
| Vacante | `TENANT#<t>` | `VACANCY#<vacancyId>` | — | — |
| Candidato | `TENANT#<t>` | `CANDIDATE#<candidateId>` | `TENANT#<t>#VACANCY#<vacancyId>` | `CANDIDATE#<createdAt>#<candidateId>` |
| Guard de duplicado | `TENANT#<t>` | `UNIQUE#APPLICATION#<vacancyId>#<email>` | — | — |

### `ms-performance-table-{stage}`

| Entidad | PK | SK | GSI1PK | GSI1SK |
|---|---|---|---|---|
| Meta | `TENANT#<t>` | `GOAL#<employeeId>#<goalId>` | `REMINDER` (solo con recordatorio activo) | `<nextReminderAt>#<t>#<goalId>` |
| Evaluación | `TENANT#<t>` | `EVAL#<employeeId>#<cycle>#<evaluatorId>` | — | — |
| Resumen | `TENANT#<t>` | `SUMMARY#<employeeId>#<cycle>` | — | — |

> Para contar registros (seed de 30k), filtrar por `entityType` (`VACANCY`, `CANDIDATE`, `GOAL`, `EVALUATION`): los guards y summaries también son ítems.

---

## Dependencias con otros integrantes

| Necesito / Entrego | Quién | Para |
|---|---|---|
| ARN del Cognito User Pool | Infraestructura | Activar el authorizer en los `serverless.yml` |
| Claims `custom:tenant_id`, `custom:role`, `custom:employee_id` | Infraestructura | Aislamiento y permisos por rol |
| Bucket `hcm-app-storage` con CORS `POST` | Infraestructura | Subida de CV y certificados |
| URLs base de ambas APIs | → Frontend | Consumir los endpoints |
| ARN `RecruitmentTopicArn` | → Core HR / Nóminas | Suscribirse a `candidate.hired` |

## Troubleshooting

| Síntoma | Causa probable |
|---|---|
| 403 en todo | El tenant del body/query/header no coincide con el JWT |
| 500 "Permisos insuficientes" | Falta permiso IAM o el bucket no existe |
| 422 al enviar candidatura | Falta CV o certificado obligatorio en S3 |
| La subida a S3 falla desde el navegador | Falta CORS en el bucket o `file` no va al final del FormData |
| No llega el correo | Correo no verificado en SES (sandbox) o está en spam; revisar la DLQ |
| Buscar un error | CloudWatch Logs Insights: `fields @timestamp, level, msg, tenantId \| filter requestId = "<id>"` |
