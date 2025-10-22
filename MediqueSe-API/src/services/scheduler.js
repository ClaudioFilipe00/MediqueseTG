// services/scheduler.js
import cron from 'node-cron';
import { Medicamento } from '../models/medicamentoModel.js';
import { Usuario } from '../models/usuarioModel.js';
import { enviarNotificacaoFCM } from './notificationService.js';

export function iniciarAgendador() {
  // roda todo minuto
  cron.schedule('* * * * *', async () => {
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0,5); // "HH:MM"
    const diaSemana = ['DOM','SEG','TER','QUA','QUI','SEX','SAB'][agora.getDay()];

    const meds = await Medicamento.findAll({
      where: { [`dias.${diaSemana}`]: true }
    });

    for (const med of meds) {
      if (med.horarios.includes(horaAtual)) {
        const usuario = await Usuario.findOne({ where: { telefone: med.usuarioTelefone }});
        if (usuario?.fcmToken) {
          await enviarNotificacaoFCM(usuario.fcmToken, med);
        }
      }
    }
  });
}
