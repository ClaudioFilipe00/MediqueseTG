import express from "express";
import cors from "cors";
import { sequelize } from "./db/connection.js";
import { Usuario } from "./models/usuarioModel.js";
import { Medicamento } from "./models/medicamentoModel.js";
import { Consumo } from "./models/consumoModel.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import consumoRoutes from "./routes/consumoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Definição das associações

// Relacionamento Consumo  Usuario
Usuario.hasMany(Consumo, {
  foreignKey: "usuarioTelefone",
  sourceKey: "telefone",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Consumo.belongsTo(Usuario, {
  foreignKey: "usuarioTelefone",
  targetKey: "telefone",
});

// Relacionamento Consumo  Medicamento
Medicamento.hasMany(Consumo, {
  foreignKey: "medicamentoId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Consumo.belongsTo(Medicamento, {
  foreignKey: "medicamentoId",
});

// Rotas

app.use("/usuarios", usuarioRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/consumo", consumoRoutes);

// Rota de teste
app.get("/ping", (req, res) => res.send("pong"));
app.get("/rota-de-teste", (req, res) => res.send("Backend acessível!"));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco sincronizado com sucesso!");
    app.listen(PORT, "0.0.0.0", () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao sincronizar:", err);
  });
