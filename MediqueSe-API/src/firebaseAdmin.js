import admin from "firebase-admin";

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error("⚠️ Variável FIREBASE_SERVICE_ACCOUNT não encontrada!");
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (token, title, body, data = {}) => {
  try {
    await admin.messaging().send({
      token,
      notification: { title, body },
      data: Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, String(v)])
      ),
    });
    console.log("Notificação enviada com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar notificação:", err);
  }
};

export default admin;
