import express from "express";
import { registerPushToken } from "../controllers/pushController.js";
const router = express.Router();

router.post("/register", registerPushToken);

export default router;
