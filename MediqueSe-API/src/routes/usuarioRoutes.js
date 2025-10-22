import express from "express";
import * as usuarioCtrl from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", usuarioCtrl.criarUsuario);

router.put("/:id", usuarioCtrl.atualizarUsuario);
router.delete("/:id", usuarioCtrl.excluirUsuario);
router.get("/telefone/:telefone", usuarioCtrl.obterUsuarioPorTelefone);
router.get("/login/:telefone/:data_nascimento", usuarioCtrl.loginPorTelefoneData);

export default router;
