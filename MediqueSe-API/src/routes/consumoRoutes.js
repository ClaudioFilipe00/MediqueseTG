import express from "express";
import {
  registrarConsumo,
  atualizarConsumo,
  listarConsumoPorMedicamento,
} from "../controllers/consumoController.js";

const router = express.Router();

router.post("/consumo", registrarConsumo);
router.put("/consumo/:id", atualizarConsumo);
router.get("/consumo/:medicamentoId", listarConsumoPorMedicamento);

export default router;
