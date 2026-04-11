import { Request, Response } from "express";
import { db } from "../db";
import { alerts, healthRecords } from "../db/schema";

// ============================
// GET ALL ALERTS (FINAL FIXED)
// ============================
export const getAllAlerts = async (_req: Request, res: Response) => {
  try {
    console.log("🚨 Fetching alerts");

    const data = await db.select().from(alerts);

    console.log(`✅ Alerts found: ${data.length}`);

    return res.json({
      success: true,
      data: data || [],
    });

  } catch (error) {
    console.error("❌ Alerts DB ERROR:", error);

    return res.json({
      success: true,
      data: [],
    });
  }
};

// ============================
// 🔥 FIX OLD DATA (IMPORTANT)
// ============================
export const fixAlerts = async (_req: Request, res: Response) => {
  try {
    console.log("🔧 Fixing alerts from health records...");

    const records = await db.select().from(healthRecords);

    let count = 0;

    for (const r of records as any[]) {
      let score = 0;

      if (r.heartRate < 50 || r.heartRate > 120) score++;
      if (r.spo2 < 92) score++;
      if (r.temperature > 38) score++;

      // 🔥 Only HIGH risk alerts
      if (score >= 2) {
        await db.insert(alerts).values({
          soldierId: r.soldierId,
          level: "HIGH",
          message: "Auto generated alert (sync)",
          createdAt: new Date(),
        });

        count++;
      }
    }

    console.log(`✅ Alerts created: ${count}`);

    return res.json({
      success: true,
      message: "Alerts synced successfully",
      created: count,
    });

  } catch (err) {
    console.error("❌ Fix Alerts Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to sync alerts",
    });
  }
};