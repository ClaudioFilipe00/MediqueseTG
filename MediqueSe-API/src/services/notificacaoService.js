import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("./src/firebase-service-account.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

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
    console.log("Notificação enviada:", response);
    return response;
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    throw error;
  }
}
