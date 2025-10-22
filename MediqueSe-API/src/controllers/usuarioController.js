import { Usuario } from "../models/usuarioModel.js";
import { Medicamento } from "../models/medicamentoModel.js";

// Função para converter DD/MM/YYYY -> YYYY-MM-DD
const formatarDataParaBD = (data) => {
  const [dia, mes, ano] = data.split("/");
  return `${ano}-${mes}-${dia}`;
};

export const criarUsuario = async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const { nome, telefone, data_nascimento } = req.body;
    if (!nome || !telefone || !data_nascimento) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }
    
    const existing = await Usuario.findOne({ where: { telefone } });
    if (existing) return res.status(409).json({ error: "Telefone já cadastrado." });

    const user = await Usuario.create({ nome, telefone, data_nascimento });
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    let { telefone, data_nascimento } = req.body;

    if (!telefone || !data_nascimento)
      return res.status(400).json({ erro: "Telefone e data de nascimento são obrigatórios." });

    data_nascimento = formatarDataParaBD(data_nascimento);

    const usuario = await Usuario.findOne({
      where: { telefone, data_nascimento },
      include: [{ model: Medicamento, as: "medicamentos" }],
      attributes: ["id", "nome", "telefone", "data_nascimento"],
    });

    if (!usuario) {
      return res.status(401).json({ erro: "Erro ao efetuar login. Verifique suas credenciais." });
    }

    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      telefone: usuario.telefone,
      data_nascimento: usuario.data_nascimento,
      medicamentos: usuario.medicamentos || [],
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro ao efetuar login" });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.telefone) delete updates.telefone;

    const [n] = await Usuario.update(updates, { where: { id } });
    if (!n) return res.status(404).json({ error: "Usuário não encontrado." });
    const updated = await Usuario.findByPk(id);
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
