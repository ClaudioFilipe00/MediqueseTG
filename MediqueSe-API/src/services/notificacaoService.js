import admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const enviarNotificacao = async ({ token, nome, dose, horario, usuarioTelefone }) => {
  if (!token) return;

  const message = {
    token,
    notification: {
      title: "Hora do medicamento",
      body: `Tome seu medicamento: ${nome} (${dose})`,
    },
    data: { nome, dose, horario, usuarioTelefone },
    android: { priority: "high", notification: { channelId: "medicamentos" } },
  };

  try {
    await admin.messaging().send(message);
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
};
