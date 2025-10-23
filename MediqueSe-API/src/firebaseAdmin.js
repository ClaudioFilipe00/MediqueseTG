import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("./serviceAccountKey.json"); // chave do FCM

if (!fs.existsSync(serviceAccountPath)) {
  console.error("Coloque o arquivo serviceAccountKey.json na raiz do backend!");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

export const sendPushNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data,
      android: { priority: "high" },
      apns: { headers: { "apns-priority": "10" } },
    };
    await admin.messaging().send(message);
  } catch (err) {
    console.error("Erro ao enviar push:", err);
  }
};
