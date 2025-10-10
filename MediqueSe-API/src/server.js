import express from "express";
import cors from "cors";
import { sequelize } from "./db/connection.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
// importa models para serem registrados no sequelize
import "./models/usuarioModel.js";
import "./models/medicamentoModel.js";
import consumoRoutes from "./routes/consumoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use(consumoRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Banco sincronizado com sucesso!");
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Erro ao sincronizar:", err);
  });
