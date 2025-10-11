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

    const dataAtual = new Date();
    const data = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate(),
      Number(horario.split(":")[0]),
      Number(horario.split(":")[1]),
      0,
      0
    );

    const inicioIntervalo = new Date(data.getTime() - 5 * 60 * 1000); // 5 minutos antes
    const fimIntervalo = new Date(data.getTime() + 5 * 60 * 1000); // 5 minutos depois

    const existente = await Consumo.findOne({
      where: {
        medicamentoId,
        dataHora: { [Op.between]: [inicioIntervalo, fimIntervalo] },
      },
    });

    if (existente) {
      if (existente.status === status)
        return res.status(200).json({ message: "Registro já existente.", existente });

      await existente.update({ status });
      return res.status(200).json({ message: "Status atualizado.", existente });
    }

    const novo = await Consumo.create({ medicamentoId, status, dataHora: data });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar consumo." });
  }
};

export const atualizarConsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [n] = await Consumo.update({ status }, { where: { id } });
    if (!n) return res.status(404).json({ error: "Registro não encontrado." });

    const atualizado = await Consumo.findByPk(id);
    return res.json(atualizado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar consumo." });
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
