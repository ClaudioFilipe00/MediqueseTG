import { Usuario } from "../models/usuarioModel.js";
import { Medicamento } from "../models/medicamentoModel.js";
import { Consumo } from "../models/consumoModel.js";

export const criarUsuario = async (req, res) => {
  try {
    const { nome, telefone, data_nascimento } = req.body;
    if (!nome || !telefone || !data_nascimento)
      return res.status(400).json({ error: "Campos obrigatórios faltando." });

    const existing = await Usuario.findOne({ where: { telefone } });
    if (existing) return res.status(409).json({ error: "Telefone já cadastrado." });

    const user = await Usuario.create({ nome, telefone, data_nascimento });
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const obterUsuarioPorTelefone = async (req, res) => {
  try {
    const { telefone } = req.params;
    const user = await Usuario.findOne({
      where: { telefone },
      include: [
        {
          model: Medicamento,
          as: "medicamentos",
          include: [{ model: Consumo, as: "consumos" }],
        },
      ],
    });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const loginPorTelefoneData = async (req, res) => {
  try {
    const { telefone, data_nascimento } = req.params;

    const user = await Usuario.findOne({
      where: { telefone, data_nascimento },
      include: [
        {
          model: Medicamento,
          as: "Medicamentos",
          include: [
            { model: Consumo, as: "Consumos" } 
          ]
        },
        {
          model: Consumo,
          as: "Consumos" 
        }
      ]
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.telefone) delete updates.telefone;

    const [n] = await Usuario.update(updates, { where: { id } });
    if (!n) return res.status(404).json({ error: "Usuário não encontrado." });
    const updated = await Usuario.findByPk(id, {
      include: [
        {
          model: Medicamento,
          as: "medicamentos",
          include: [{ model: Consumo, as: "consumos" }],
        },
      ],
    });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usuario.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Usuário não encontrado." });
    return res.json({ message: "Usuário excluído." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};
