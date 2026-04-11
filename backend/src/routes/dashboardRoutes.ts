import express, { Request, Response, NextFunction } from "express";
import { getStats } from "../controllers/dashboardController";

const router = express.Router();

/*
========================================
📊 DASHBOARD ROUTES
Base Path: /api/dashboard
========================================
*/

// ============================
// 📊 GET SUMMARY (MAIN API)
// ============================
router.get("/summary", async (req: Request, res: Response, next: NextFunction) => {
  console.log("📊 Dashboard summary requested");

  try {
    await getStats(req, res); // ✅ FIX: added await
  } catch (error) {
    next(error);
  }
});

// ============================
// ⚠️ LEGACY ROUTE (OPTIONAL)
// ============================
router.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  console.log("📊 Dashboard stats (legacy)");

  try {
    await getStats(req, res); // ✅ FIX: added await
  } catch (error) {
    next(error);
  }
});

export default router;