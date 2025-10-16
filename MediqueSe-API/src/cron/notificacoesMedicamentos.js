import cron from "node-cron";
import { enviarNotificacao } from "../controllers/pushController.js";
import { Medicamento } from "../models/medicamentoModel.js";
import { PushToken } from "../models/pushTokenModel.js";

cron.schedule("* * * * *", async () => {
  try {
    const agora = new Date();
    const hora = agora.getHours();
    const min = agora.getMinutes();

    const meds = await Medicamento.findAll({
      include: [{
        model: PushToken,
        foreignKey: "telefone",
        as: "PushToken"
      }],
    });

    for (const med of meds) {
      const horarios = med.horarios ? JSON.parse(med.horarios) : [];
      for (const h of horarios) {
        const [hh, mm] = h.split(":").map(Number);
        // Tolerância de 1 minuto para não perder notificações
        if (hh === hora && Math.abs(mm - min) <= 1) {
          if (med.PushToken?.token) {
            await enviarNotificacao(
              med.PushToken.token,
              `Hora da medicação: ${med.nome}`,
              `Dose: ${med.dose} ${med.tipo}`
            );
            console.log(`[NOTIF] ${med.nome} enviado para ${med.PushToken.token} às ${hh}:${mm}`);
          } else {
            console.log(`[ALERTA] Sem token para medicamento ${med.nome}`);
          }
        }
      }
    }
  } catch (err) {
    console.error("Erro no cron de notificações:", err);
  }
});
