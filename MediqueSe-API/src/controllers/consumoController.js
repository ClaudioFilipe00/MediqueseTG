import { Op } from "sequelize";
import { Consumo } from "../models/consumoModel.js";
import { Medicamento } from "../models/medicamentoModel.js";

export const registrarConsumo = async (req, res) => {
  try {
    const { medicamentoId, status, horario } = req.body;

    if (!medicamentoId || !status || !horario)
      return res.status(400).json({ error: "Campos obrigatórios: medicamentoId, status e horario" });

    const med = await Medicamento.findByPk(medicamentoId);
    if (!med) return res.status(404).json({ error: "Medicamento não encontrado" });

    const agora = new Date();
    const [h, m] = horario.split(":").map(Number);
    const dataAlvo = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate(),
      h, m, 0, 0
    );

    const existente = await Consumo.findOne({
      where: {
        medicamentoId,
        dataHora: { [Op.between]: [new Date(dataAlvo.getTime() - 2 * 60 * 1000), new Date(dataAlvo.getTime() + 2 * 60 * 1000)] },
      },
    });

    if (existente) {
      await existente.update({ status });
      return res.status(200).json({ message: "Status atualizado.", existente });
    }

    const novo = await Consumo.create({
      medicamentoId,
      status,
      dataHora: dataAlvo,
    });

    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar consumo." });
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
    return res.status(500).json({ error: "Erro ao listar consumos." });
  }
};
