import express from "express";
import { getAllAlerts, fixAlerts } from "../controllers/alertController";

const router = express.Router();

// ============================
// GET ALL ALERTS
// ============================
router.get("/", getAllAlerts);

// ============================
// 🔥 FIX ALERTS (IMPORTANT)
// ============================
router.get("/fix-alerts", fixAlerts);

export default router;