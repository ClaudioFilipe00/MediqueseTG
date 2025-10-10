import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Medicamento } from "./medicamentoModel.js";

export const Consumo = sequelize.define("Consumo", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  medicamentoId: { type: DataTypes.INTEGER, allowNull: false },
  status: { // "Consumido" ou "Não consumido"
    type: DataTypes.ENUM("Consumido", "Não consumido"),
    allowNull: false,
  },
  dataHora: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: "consumos",
  timestamps: true,
  createdAt: "criado_em",
  updatedAt: false
});

Medicamento.hasMany(Consumo, {
  foreignKey: "medicamentoId",
  onDelete: "CASCADE",
});

Consumo.belongsTo(Medicamento, { foreignKey: "medicamentoId" });
