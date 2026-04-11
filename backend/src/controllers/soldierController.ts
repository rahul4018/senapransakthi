import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { db } from "../db";
import { soldiers } from "../db/schema";
import { eq } from "drizzle-orm";

// ============================
// GET ALL SOLDIERS
// ============================
export const getAllSoldiers = async (_req: Request, res: Response) => {
  try {
    console.log("🪖 Fetching soldiers");

    const data = await db.select().from(soldiers);

    console.log("✅ DB RESULT COUNT:", data.length);

    return res.json({
      success: true,
      data: data ?? [],
    });

  } catch (error: any) {
    console.error("❌ REAL DB ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

// ============================
// ADD SOLDIER
// ============================
export const addSoldier = async (req: Request, res: Response) => {
  try {
    const { name, unit, status } = req.body;

    if (!name || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name and unit are required",
      });
    }

    await db.insert(soldiers).values({
      name: String(name),
      unit: String(unit),
      status: status ? String(status) : "ACTIVE",
    });

    return res.json({
      success: true,
      message: "Soldier added",
    });

  } catch (error: any) {
    console.error("❌ Add error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to add soldier",
    });
  }
};

// ============================
// UPDATE SOLDIER
// ============================
export const updateSoldier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, unit, status } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = String(name);
    if (unit !== undefined) updateData.unit = String(unit);
    if (status !== undefined) updateData.status = String(status);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    await db
      .update(soldiers)
      .set(updateData)
      .where(eq(soldiers.id, Number(id)));

    return res.json({
      success: true,
      message: "Soldier updated",
    });

  } catch (error: any) {
    console.error("❌ Update error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update soldier",
    });
  }
};

// ============================
// DELETE SOLDIER
// ============================
export const deleteSoldier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db
      .delete(soldiers)
      .where(eq(soldiers.id, Number(id)));

    return res.json({
      success: true,
      message: "Soldier deleted",
    });

  } catch (error: any) {
    console.error("❌ Delete error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete soldier",
    });
  }
};

// ============================
// UPLOAD CSV
// ============================
export const uploadSoldiersCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file required",
      });
    }

    const filePath = req.file.path;
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: any) => {
        if (row.name && row.unit) {
          results.push({
            name: String(row.name),
            unit: String(row.unit),
            status: row.status ? String(row.status) : "ACTIVE",
          });
        }
      })
      .on("end", async () => {
        try {
          console.log("📄 Parsed:", results.length);

          if (results.length > 0) {
            await db.insert(soldiers).values(results);
            console.log("✅ Inserted:", results.length);
          }

          fs.unlinkSync(filePath);

          return res.json({
            success: true,
            message: "CSV uploaded successfully",
            inserted: results.length,
          });

        } catch (dbError: any) {
          console.error("❌ CSV DB error:", dbError.message);

          return res.status(500).json({
            success: false,
            message: "Failed to insert CSV data",
          });
        }
      });

  } catch (error: any) {
    console.error("❌ Upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "CSV upload failed",
    });
  }
};