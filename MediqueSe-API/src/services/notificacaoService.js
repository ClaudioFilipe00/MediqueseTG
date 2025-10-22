import admin from "firebase-admin";
import serviceAccount from "../firebase-service-account.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function enviarNotificacao(token, titulo, corpo) {
  const message = {
    notification: {
      title: titulo,
      body: corpo,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notificação enviada com sucesso:", response);
    return response;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    throw error;
  }
}

export async function enviarNotificacaoTodos(tokens, titulo, corpo) {
  const messages = tokens.map((token) => ({
    notification: { title: titulo, body: corpo },
    token,
  }));

  try {
    const response = await admin.messaging().sendAll(messages);
    console.log("Notificações enviadas com sucesso:", response.successCount);
    return response;
  } catch (error) {
    console.error("Erro ao enviar notificações:", error);
    throw error;
  }
}
