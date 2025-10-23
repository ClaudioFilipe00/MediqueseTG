import admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("⚠️ Variável FIREBASE_SERVICE_ACCOUNT não encontrada!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (token, data = {}) => {
  try {
    await admin.messaging().send({
      token,
      android: { priority: "high" }, // data-only
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
    });
    console.log("Notificação enviada com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
};

export default admin;
