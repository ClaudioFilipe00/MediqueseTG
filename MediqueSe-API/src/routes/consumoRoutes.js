import express from "express";
import {
  registrarConsumo,
  listarConsumoPorMedicamento,
} from "../controllers/consumoController.js";

const router = express.Router();

router.post("/consumo", registrarConsumo);
router.get("/consumo/:medicamentoId", listarConsumoPorMedicamento);

export default router;
