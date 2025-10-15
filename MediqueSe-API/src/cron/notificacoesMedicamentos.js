// src/cron/notificacoesMedicamentos.js
import cron from "node-cron";
import { enviarNotificacao } from "../controllers/pushController.js";
import { Medicamento } from "../models/medicamentoModel.js";
import { PushToken } from "../models/pushTokenModel.js";

cron.schedule("* * * * *", async () => {
  const agora = new Date();
  const hora = agora.getHours();
  const min = agora.getMinutes();

  const meds = await Medicamento.findAll({
    include: [{ model: PushToken }],
  });

  for (const med of meds) {
    const horarios = Array.isArray(med.horarios) ? med.horarios : [];
    for (const h of horarios) {
      const [hh, mm] = h.split(":").map(Number);
      if (hh === hora && mm === min && med.PushToken?.token) {
        await enviarNotificacao(
          med.PushToken.token,
          `Hora da medicação: ${med.nome}`,
          `Dose: ${med.dose} ${med.tipo}`
        );
      }
    }
  }
});
