import admin from './firebaseConfig.js';

// Envia notificação FCM para o token do usuário
export async function enviarNotificacaoFCM(token, med) {
  const message = {
    token,
    notification: {
      title: 'Hora do medicamento',
      body: `Tome seu medicamento: ${med.nome} (${med.dose} ${med.tipo})`,
    },
    data: {
      nome: med.nome,
      dose: `${med.dose} ${med.tipo}`,
      horario: med.horario,
      usuarioTelefone: med.usuarioTelefone,
    },
    android: { priority: 'high', notification: { channelId: 'medicamentos' } },
  };

  try {
    await admin.messaging().send(message);
  } catch (err) {
    console.error('Erro ao enviar notificação FCM:', err);
  }
}
