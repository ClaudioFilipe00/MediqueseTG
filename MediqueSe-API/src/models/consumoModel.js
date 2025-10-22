import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Usuario } from "./usuarioModel.js";
import { Medicamento } from "./medicamentoModel.js";

export const Consumo = sequelize.define("Consumo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  dose: { type: DataTypes.STRING, allowNull: false },
  horario: { type: DataTypes.STRING, allowNull: false },
  usuarioTelefone: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("Consumido", "Não consumido"), allowNull: false },
  data: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  medicamentoId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "consumos",
  timestamps: true,
  createdAt: "criado_em",
  updatedAt: false,
});

