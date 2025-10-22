import admin from "firebase-admin";
import { Medicamento } from "../models/medicamentoModel.js";
import { Usuario } from "../models/usuarioModel.js";

const serviceAccount = require("../firebase-service-account.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function enviarNotificacao(telefone, titulo, corpo, dados = {}) {
  try {
    const usuario = await Usuario.findOne({ where: { telefone } });
    if (!usuario || !usuario.fcmToken) return;

    const message = {
      token: usuario.fcmToken,
      notification: {
        title: titulo,
        body: corpo,
      },
      data: dados,
    };

    await admin.messaging().send(message);
    console.log(`Notificação enviada para ${telefone}`);
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
}

export async function agendarNotificacoesDoUsuario(telefone) {
  try {
    const medicamentos = await Medicamento.findAll({ where: { usuarioTelefone: telefone } });

    medicamentos.forEach((med) => {
      if (!med.horarios || med.horarios.length === 0) return;

      med.horarios.forEach((horario) => {
        const [hora, min] = horario.split(":").map(Number);
        const agora = new Date();
        const agendamento = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), hora, min, 0, 0);

        if (agendamento < agora) agendamento.setDate(agendamento.getDate() + 1);

        setTimeout(() => {
          enviarNotificacao(
            telefone,
            "Hora do medicamento",
            `Tome ${med.nome} - ${med.dose} ${med.tipo}`,
            { nome: med.nome, dose: med.dose, horario, usuarioTelefone: telefone }
          );
        }, agendamento.getTime() - agora.getTime());
      });
    });
  } catch (err) {
    console.error("Erro ao agendar notificações:", err);
  }
}
