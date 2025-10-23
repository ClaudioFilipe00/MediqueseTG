import express from "express";
import { sendPushNotification } from "../firebaseAdmin.js";
const router = express.Router();

router.post("/push", async (req, res) => {
  const { token, nome, dose, horario } = req.body;
  if (!token || !nome || !dose || !horario) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  await sendPushNotification(token, "Hora do medicamento", `Tome seu medicamento: ${nome} (${dose})`, {
    nome,
    dose,
    horario,
  });

  res.json({ message: "Notificação enviada" });
});

export default router;
