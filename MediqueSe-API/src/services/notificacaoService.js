import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import serviceAccount from "../firebase-service-account.json" assert { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function enviarNotificacao(token, titulo, corpo) {
  const message = {
    token,
    notification: {
      title: titulo,
      body: corpo,
    },
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
