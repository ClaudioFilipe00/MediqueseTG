import express from "express";
import { sendPushNotification } from "../firebaseAdmin.js";
const router = express.Router();

router.post("/push", async (req, res) => {
  const { token, nome, dose, horario, usuarioTelefone } = req.body;
  if (!token || !nome || !dose || !horario || !usuarioTelefone) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  await sendPushNotification(token, {
    nome,
    dose,
    horario,
    usuarioTelefone
  });

  res.json({ message: "Notificação enviada" });
});

export default router;
