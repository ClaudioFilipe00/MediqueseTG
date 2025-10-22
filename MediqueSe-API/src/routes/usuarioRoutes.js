import express from "express";
import * as usuarioCtrl from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", usuarioCtrl.criarUsuario);
router.get("/:telefone", usuarioCtrl.obterUsuarioPorTelefone);
router.put("/:id", usuarioCtrl.atualizarUsuario);
router.delete("/:id", usuarioCtrl.excluirUsuario);
router.get("/telefone/:telefone", usuarioCtrl.obterUsuarioPorTelefone);

router.post('/atualizarToken', async (req, res) => {
  const { telefone, fcmToken } = req.body;
  if (!telefone || !fcmToken) return res.status(400).json({ error: "Dados obrigatórios" });
  await Usuario.update({ fcmToken }, { where: { telefone } });
  res.json({ sucesso: true });
});

export default router;
