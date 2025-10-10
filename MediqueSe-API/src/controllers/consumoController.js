import { Consumo } from "../models/consumoModel.js";
import { Medicamento } from "../models/medicamentoModel.js";

export const registrarConsumo = async (req, res) => {
  try {
    const { medicamentoId, status } = req.body;

    if (!medicamentoId || !status)
      return res.status(400).json({ error: "Campos obrigatórios: medicamentoId e status" });

    const med = await Medicamento.findByPk(medicamentoId);
    if (!med) return res.status(404).json({ error: "Medicamento não encontrado" });

    const novo = await Consumo.create({ medicamentoId, status });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar consumo" });
  }
};

export const atualizarConsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [n] = await Consumo.update({ status }, { where: { id } });
    if (!n) return res.status(404).json({ error: "Registro não encontrado" });

    const atualizado = await Consumo.findByPk(id);
    return res.json(atualizado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar consumo" });
  }
};

export const listarConsumoPorMedicamento = async (req, res) => {
  try {
    const { medicamentoId } = req.params;
    const consumos = await Consumo.findAll({
      where: { medicamentoId },
      order: [["dataHora", "DESC"]],
    });
    return res.json(consumos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar consumos" });
  }
};
