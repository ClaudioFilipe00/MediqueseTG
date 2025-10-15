import express from "express";
import cors from "cors";
import { sequelize } from "./db/connection.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import consumoRoutes from "./routes/consumoRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import "./models/usuarioModel.js";
import "./models/medicamentoModel.js";
import "./cron/notificacoesMedicamentos.js";
import "./models/pushTokenModel.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/usuarios", usuarioRoutes);
app.use("/push", pushRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/consumo", consumoRoutes);
app.get("/ping", (req, res) => res.send("pong"));

// Rota de teste para verificar acesso do celular
app.get("/rota-de-teste", (req, res) => {
  res.send("Backend acessível!");
});

const PORT = process.env.PORT || 3000;

// Sincroniza banco e inicia servidor aceitando conexões externas
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Banco sincronizado com sucesso!");
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar:", err);
  });
