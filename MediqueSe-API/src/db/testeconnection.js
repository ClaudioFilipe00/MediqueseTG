import { sequelize } from "./connection.js";

sequelize.authenticate()
  .then(() => console.log("✅ Conectado ao Neon com sucesso!"))
  .catch(err => console.error("❌ Erro de conexão:", err));
