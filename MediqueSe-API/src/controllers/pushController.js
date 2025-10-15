// src/controllers/pushController.js
import axios from "axios";

const userTokens = {}; // Armazenamento simples; pode migrar para DB depois

export const registrarPushToken = async (req, res) => {
  const { telefone, token } = req.body;
  if (!telefone || !token) return res.status(400).json({ error: "Telefone e token obrigatórios" });
  userTokens[telefone] = token;
  return res.json({ message: "Token registrado" });
};

export const enviarNotificacao = async ({ telefone, titulo, corpo }) => {
  const token = userTokens[telefone];
  if (!token) return console.log("Token não encontrado para", telefone);

  try {
    await axios.post("https://exp.host/--/api/v2/push/send", {
      to: token,
      title: titulo,
      body: corpo,
      sound: "default",
    });
  } catch (err) {
    console.error("Erro ao enviar notificação:", err.response?.data || err.message);
  }
};
