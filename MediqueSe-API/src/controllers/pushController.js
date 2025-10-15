import { PushToken } from "../models/pushTokenModel.js"; // modelo com telefone + token
import axios from "axios";

export const registerPushToken = async (req, res) => {
  const { telefone, token } = req.body;
  if (!telefone || !token) return res.status(400).send("Telefone ou token faltando");

  try {
    await PushToken.upsert({ telefone, token }); // cria ou atualiza
    res.send("Token registrado");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar token");
  }
};

export const enviarNotificacao = async (token, titulo, corpo) => {
  try {
    await axios.post("https://exp.host/--/api/v2/push/send", {
      to: token,
      title: titulo,
      body: corpo,
      sound: "default",
      categoryIdentifier: "CONSUMO_MEDICAMENTO",
    });
  } catch (err) {
    console.log("Erro ao enviar push:", err.response?.data || err.message);
  }
};
