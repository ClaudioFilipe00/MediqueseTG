// src/cron/notificacoesMedicamentos.js
import cron from "node-cron";
import { Medicamento } from "../models/medicamentoModel.js";
import { enviarNotificacao } from "../controllers/pushController.js";

// Roda a cada minuto
cron.schedule("* * * * *", async () => {
  const agora = new Date();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();

  const meds = await Medicamento.findAll();
  meds.forEach((med) => {
    const horarios = med.horarios ? JSON.parse(med.horarios) : [];
    horarios.forEach(async (hStr) => {
      const [h, m] = hStr.split(":").map(Number);
      if (h === hora && m === minuto) {
        await enviarNotificacao({
          telefone: med.usuarioTelefone,
          titulo: `Hora da medicação: ${med.nome}`,
          corpo: `Dose: ${med.dose} ${med.tipo}`,
        });
      }
    });
  });
});
