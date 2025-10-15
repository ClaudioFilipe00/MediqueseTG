// src/routes/pushRoutes.js
import express from "express";
import * as pushCtrl from "../controllers/pushController.js";
const router = express.Router();

router.post("/push-token", pushCtrl.registrarPushToken);

export default router;
