import express from "express";
import * as usuarioCtrl from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", usuarioCtrl.criarUsuario);
router.post("/login", usuarioCtrl.loginUsuario);
router.put("/:id", usuarioCtrl.atualizarUsuario);
router.delete("/:id", usuarioCtrl.excluirUsuario);

export default router;
