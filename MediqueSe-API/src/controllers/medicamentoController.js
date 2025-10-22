import { Medicamento } from "../models/medicamentoModel.js";
import { Usuario } from "../models/usuarioModel.js";
import { Op } from "sequelize";
import { enviarNotificacao } from "../services/notificacaoService.js";

const diasMap = { DOM: 0, SEG: 1, TER: 2, QUA: 3, QUI: 4, SEX: 5, SAB: 6 };

const agendarNotificacoes = async (med) => {
  const usuario = await Usuario.findOne({ where: { telefone: med.usuarioTelefone } });
  if (!usuario?.fcmToken) return;

  const horarios = Array.isArray(med.horarios) ? med.horarios : JSON.parse(med.horarios || "[]");
  const dias = typeof med.dias === "string" ? JSON.parse(med.dias || "{}") : med.dias;

  const now = new Date();

  for (const horarioStr of horarios) {
    const [hour, minute] = horarioStr.split(":").map(Number);

    for (const diaKey in dias) {
      if (!dias[diaKey]) continue;

      const targetDay = diasMap[diaKey];
      const triggerDate = new Date();
      triggerDate.setHours(hour, minute, 0, 0);
      let dayDiff = targetDay - triggerDate.getDay();
      if (dayDiff < 0 || (dayDiff === 0 && triggerDate <= now)) dayDiff += 7;
      triggerDate.setDate(triggerDate.getDate() + dayDiff);

      const delay = triggerDate.getTime() - now.getTime();
      if (delay <= 0) continue;

      setTimeout(() => {
        enviarNotificacao({
          token: usuario.fcmToken,
          nome: med.nome,
          dose: `${med.dose} ${med.tipo}`,
          horario: horarioStr,
          usuarioTelefone: med.usuarioTelefone,
        });
      }, delay);
    }
  }
};

export const criarMedicamento = async (req, res) => {
  try {
    const { nome, nome_medico, dose, tipo, duracao, horarios, dias, usuarioTelefone, continuo } = req.body;
    if (!nome || !usuarioTelefone) return res.status(400).json({ error: "nome e usuarioTelefone obrigatórios" });

    const usuario = await Usuario.findOne({ where: { telefone: usuarioTelefone } });
    if (!usuario) return res.status(400).json({ error: "Usuário não encontrado" });

    const med = await Medicamento.create({
      nome,
      nome_medico: nome_medico || null,
      dose: dose || null,
      tipo: tipo || null,
      duracao: continuo ? "Contínuo" : (duracao || null),
      continuo: !!continuo,
      horarios: JSON.stringify(horarios || []),
      dias: JSON.stringify(dias || {}),
      usuarioTelefone,
      usuarioId: usuario.id,
    });

    await agendarNotificacoes(med);

    return res.status(201).json(med);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar medicamento." });
  }
};

export const atualizarMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.horarios) updates.horarios = JSON.stringify(updates.horarios);
    if (updates.dias) updates.dias = JSON.stringify(updates.dias);
    if (typeof updates.continuo !== "undefined") updates.continuo = !!updates.continuo;
    if (updates.continuo) updates.duracao = "Contínuo";

    const [n] = await Medicamento.update(updates, { where: { id } });
    if (!n) return res.status(404).json({ error: "Medicamento não encontrado." });

    const updated = await Medicamento.findByPk(id);
    await agendarNotificacoes(updated);

    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar." });
  }
};

export const listarMedicamentosPorUsuario = async (req, res) => {
  try {
    const { telefone } = req.query;
    if (!telefone) return res.status(400).json({ error: "telefone query obrigatório" });

    const usuario = await Usuario.findOne({ where: { telefone } });
    const whereClause = usuario
      ? { [Op.or]: [{ usuarioId: usuario.id }, { usuarioTelefone: telefone }] }
      : { usuarioTelefone: telefone };

    const meds = await Medicamento.findAll({ where: whereClause, order: [["nome", "ASC"]] });
    const parsed = meds.map((m) => ({ ...m.toJSON(), horarios: m.horarios ? JSON.parse(m.horarios) : [], dias: m.dias ? JSON.parse(m.dias) : {} }));
    return res.json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar medicamentos." });
  }
};

export const excluirMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicamento.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Medicamento não encontrado." });
    return res.json({ message: "Medicamento excluído." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir." });
  }
};
