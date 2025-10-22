import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Usuario } from "./usuarioModel.js";
import { Consumo } from "./consumoModel.js";

export const Medicamento = sequelize.define("Medicamento", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  nome_medico: { type: DataTypes.STRING, allowNull: true },
  dose: { type: DataTypes.STRING, allowNull: false },
  tipo: { type: DataTypes.STRING, allowNull: false },
  duracao: { type: DataTypes.STRING, allowNull: true },
  continuo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  horarios: { type: DataTypes.TEXT, allowNull: true },
  dias: { type: DataTypes.TEXT, allowNull: true },
  usuarioTelefone: { type: DataTypes.STRING, allowNull: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "medicamentos",
  timestamps: true
});

Medicamento.belongsTo(Usuario, { as: "Usuario", foreignKey: "usuarioId" });
Medicamento.hasMany(Consumo, { as: "Consumos", foreignKey: "medicamentoId", onDelete: "SET NULL", onUpdate: "CASCADE" });
