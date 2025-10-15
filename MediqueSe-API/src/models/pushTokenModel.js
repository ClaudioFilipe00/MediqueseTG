// src/models/pushTokenModel.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Usuario } from "./usuarioModel.js";

export const PushToken = sequelize.define("PushToken", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  telefone: { type: DataTypes.STRING, allowNull: false, unique: true },
  token: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "pushtokens",
  timestamps: true,
  createdAt: "criado_em",
  updatedAt: false,
});

Usuario.hasOne(PushToken, { foreignKey: "telefone", sourceKey: "telefone", onDelete: "CASCADE" });
PushToken.belongsTo(Usuario, { foreignKey: "telefone", targetKey: "telefone" });
