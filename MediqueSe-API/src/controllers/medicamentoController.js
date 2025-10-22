import { Medicamento } from "../models/medicamentoModel.js";
import { Consumo } from "../models/consumoModel.js";
import { enviarNotificacaoFCM } from "../services/notificacaoService.js";

// Criar novo medicamento e agendar notificações
export const criarMedicamento = async (req, res) => {
  try {
    const { nome, dose, tipo, duracao, horarios, dias, usuarioTelefone, tokenFCM } = req.body;
    if (!nome || !dose || !tipo || !horarios || !dias || !usuarioTelefone) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    const novo = await Medicamento.create({
      nome,
      dose,
      tipo,
      duracao,
      horarios,
      dias,
      usuarioTelefone,
    });

    // Agendar notificações para cada horário
    if (tokenFCM && Array.isArray(horarios)) {
      horarios.forEach((horario) => {
        setTimeout(() => {
          enviarNotificacaoFCM(tokenFCM, { nome, dose, tipo, horario, usuarioTelefone });
        }, 0); // Aqui você pode integrar com um scheduler real depois
      });
    }

    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar medicamento." });
  }
};

// Listar medicamentos por usuário
export const listarMedicamentosPorUsuario = async (req, res) => {
  try {
    const { usuarioTelefone } = req.params;

    const medicamentos = await Medicamento.findAll({
      where: { usuarioTelefone },
      order: [["createdAt", "DESC"]],
    });

    return res.json(medicamentos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar medicamentos." });
  }
};

// Atualizar medicamento
export const atualizarMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const atualizado = await Medicamento.update(req.body, { where: { id } });
    return res.json({ atualizado });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar medicamento." });
  }
};

// Excluir medicamento
export const excluirMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    await Medicamento.destroy({ where: { id } });
    return res.json({ mensagem: "Medicamento excluído." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir medicamento." });
  }
};

// Registrar consumo
export const registrarConsumo = async (req, res) => {
  try {
    const { nome, dose, horario, usuarioTelefone, status } = req.body;
    if (!nome || !dose || !horario || !usuarioTelefone || !status) {
      return res.status(400).json({ error: "Campos obrigatórios: nome, dose, horario, usuarioTelefone, status" });
    }

    const novo = await Consumo.create({ nome, dose, horario, usuarioTelefone, status });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar consumo." });
  }
};

// Listar consumo por usuário
export const listarConsumoPorUsuario = async (req, res) => {
  try {
    const { usuarioTelefone } = req.params;

    const consumos = await Consumo.findAll({
      where: { usuarioTelefone },
      include: [
        {
          model: Medicamento,
          required: false,
          attributes: ["nome"],
        },
      ],
      order: [["data", "DESC"]],
    });

    const resultado = consumos.map((c) => {
      const medicamentoNome = c.Medicamento && c.Medicamento.nome ? c.Medicamento.nome : null;
      const nomeFinal = medicamentoNome || (c.nome ? c.nome : "(sem nome)");
      return {
        id: c.id,
        nome: nomeFinal,
        dose: c.dose,
        horario: c.horario,
        usuarioTelefone: c.usuarioTelefone,
        status: c.status,
        data: c.data,
      };
    });

    return res.json(resultado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar consumos." });
  }
};
