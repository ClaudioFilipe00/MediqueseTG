import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export function enviarNotificacao(token, mensagem) {
  return admin.messaging().send({
    token,
    notification: {
      title: mensagem.titulo,
      body: mensagem.corpo,
    },
  });
}

export default admin;
