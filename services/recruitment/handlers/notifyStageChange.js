const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const ses = new SESv2Client({});
const SENDER = process.env.SENDER_EMAIL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, fn: "notifyStageChange", msg, ts: new Date().toISOString(), ...extra }));

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const TEMPLATES = {
  APPLIED: {
    subject: (m) => `Recibimos tu postulación – ${m.vacancyTitle}`,
    text: (m) => `Tu postulación a "${m.vacancyTitle}" fue recibida correctamente junto con tu CV y certificados. Te avisaremos por este medio cuando avances de etapa.`,
  },
  INTERVIEW: {
    subject: (m) => `Avanzaste a la etapa de entrevista – ${m.vacancyTitle}`,
    text: (m) => `¡Felicitaciones! Tu postulación a "${m.vacancyTitle}" pasó a la etapa de ENTREVISTA. Pronto te contactaremos para coordinar fecha y hora.`,
  },
  OFFER: {
    subject: (m) => `Tienes una oferta – ${m.vacancyTitle}`,
    text: (m) => `¡Excelentes noticias! Pasaste a la etapa de OFERTA para "${m.vacancyTitle}". El equipo de RR.HH. te enviará los detalles de la propuesta.`,
  },
  HIRED: {
    subject: (m) => `¡Bienvenido(a) al equipo! – ${m.vacancyTitle}`,
    text: (m) => `¡Has sido CONTRATADO(A) para "${m.vacancyTitle}"! RR.HH. se comunicará contigo para tu proceso de incorporación.`,
  },
  REJECTED: {
    subject: (m) => `Actualización de tu postulación – ${m.vacancyTitle}`,
    text: (m) => `Gracias por tu interés en "${m.vacancyTitle}". En esta oportunidad decidimos continuar con otros perfiles. Te animamos a postular a futuras vacantes.`,
  },
};

const buildHtml = (m, text) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;background:#111827;color:#e5e7eb;border-radius:12px">
  <h2 style="color:#60a5fa;margin-top:0">Hola ${esc(m.fullName)},</h2>
  <p style="font-size:15px;line-height:1.6">${esc(text)}</p>
  ${m.note ? `<p style="font-size:14px;color:#9ca3af"><b>Comentario del reclutador:</b> ${esc(m.note)}</p>` : ""}
  <hr style="border:none;border-top:1px solid #374151;margin:20px 0">
  <p style="font-size:12px;color:#6b7280">Etapa: ${esc(m.fromStage)} → <b>${esc(m.toStage)}</b> · ${esc(m.changedAt)}</p>
</div>`;

module.exports.main = async (event) => {
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
      if (msg.eventType !== "candidate.stage_changed") {
        log("INFO", "Evento ignorado", { messageId, eventType: msg.eventType });
        continue;
      }
      if (!msg.email || !EMAIL_RE.test(msg.email)) {
        log("WARN", "Email inválido, se descarta", { messageId, tenantId: msg.tenantId, candidateId: msg.candidateId });
        continue;
      }

      const tpl = TEMPLATES[msg.toStage];
      if (!tpl) {
        log("INFO", "Etapa sin plantilla de correo", { messageId, toStage: msg.toStage });
        continue;
      }

      const text = tpl.text(msg);
      const out = await ses.send(
        new SendEmailCommand({
          FromEmailAddress: SENDER,
          Destination: { ToAddresses: [msg.email] },
          Content: {
            Simple: {
              Subject: { Data: tpl.subject(msg), Charset: "UTF-8" },
              Body: {
                Text: { Data: `Hola ${msg.fullName},\n\n${text}${msg.note ? `\n\nComentario: ${msg.note}` : ""}`, Charset: "UTF-8" },
                Html: { Data: buildHtml(msg, text), Charset: "UTF-8" },
              },
            },
          },
        })
      );

      log("INFO", "Correo enviado", { messageId, tenantId: msg.tenantId, candidateId: msg.candidateId, toStage: msg.toStage, sesMessageId: out.MessageId });
    } catch (err) {
      log("ERROR", "Fallo al enviar correo", {
        messageId,
        tenantId: msg?.tenantId,
        candidateId: msg?.candidateId,
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
