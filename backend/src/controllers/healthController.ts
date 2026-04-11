import { Request, Response } from "express";
import { db } from "../db";
import { healthRecords, alerts } from "../db/schema";
import fs from "fs";
import csv from "csv-parser";
import { eq } from "drizzle-orm";

// ------------------
// Risk logic (fallback)
// ------------------
function calculateRisk(hr: number, spo2: number, temp: number) {
  let score = 0;

  if (hr < 50 || hr > 120) score++;
  if (spo2 < 92) score++;
  if (temp > 38) score++;

  if (score === 0) return "LOW";
  if (score === 1) return "MODERATE";
  return "HIGH";
}

// ------------------
// 🧠 AI Risk Prediction (SAFE)
// ------------------
async function predictRiskAI(hr: number, spo2: number, temp: number) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "Return ONLY one word: LOW, MODERATE, or HIGH based on vitals.",
          },
          {
            role: "user",
            content: `HR: ${hr}, SpO2: ${spo2}, Temp: ${temp}`,
          },
        ],
      }),
    });

    const data = await response.json();

    const result =
      data?.choices?.[0]?.message?.content?.trim().toUpperCase();

    if (["LOW", "MODERATE", "HIGH"].includes(result)) {
      return result;
    }

    return null;
  } catch (err) {
    console.error("AI Risk Error:", err);
    return null;
  }
}

// ------------------
// ✅ Add single health record (FINAL FIXED)
// ------------------
export const addHealthRecord = async (req: Request, res: Response) => {
  try {
    const { soldierId, heart_rate, spo2, temperature } = req.body;

    if (!soldierId || !heart_rate || !spo2 || !temperature) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hr = Number(heart_rate);
    const s = Number(spo2);
    const temp = Math.round(Number(temperature));

    if (isNaN(hr) || isNaN(s) || isNaN(temp)) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }

    // =========================
    // 🔥 RULE BASED RISK
    // =========================
    let risk = calculateRisk(hr, s, temp);

    // =========================
    // 🤖 AI RISK (SAFE)
    // =========================
    const aiRisk = await predictRiskAI(hr, s, temp);

    if (aiRisk && ["LOW", "MODERATE", "HIGH"].includes(aiRisk)) {
      console.log("🤖 AI Risk:", aiRisk);
      risk = aiRisk;
    }

    console.log("✅ FINAL RISK:", risk);

    // =========================
    // 💾 INSERT HEALTH RECORD
    // =========================
    await db.insert(healthRecords).values({
      soldierId: Number(soldierId),
      heartRate: hr,
      spo2: s,
      temperature: temp,
    });

    // =========================
    // 🚨 INSERT ALERT (FIXED)
    // =========================
    if (risk === "HIGH") {
      console.log("🚨 HIGH RISK DETECTED → inserting alert");

      await db.insert(alerts).values({
        soldierId: Number(soldierId),
        level: "HIGH",
        message: `Critical condition (HR:${hr}, SpO2:${s}, Temp:${temp})`,
        createdAt: new Date(), // 🔥 IMPORTANT
      });
    }

    return res.json({
      success: true,
      message: "Health record added successfully",
      risk,
    });

  } catch (err) {
    console.error("❌ Add health error:", err);
    res.status(500).json({ message: "Failed to add health record" });
  }
};

// ------------------
// ✅ Upload CSV (FIXED)
// ------------------
export const uploadHealthCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results: any[] = [];
    let alertsCreated = 0;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const soldierId = Number(row.soldierId);
        const heartRate = Number(row.heartRate);
        const spo2 = Number(row.spo2);
        const temperature = Math.round(Number(row.temperature));

        if (
          !isNaN(soldierId) &&
          !isNaN(heartRate) &&
          !isNaN(spo2) &&
          !isNaN(temperature)
        ) {
          results.push({ soldierId, heartRate, spo2, temperature });
        }
      })
      .on("end", async () => {
        for (const record of results) {
          let risk = calculateRisk(
            record.heartRate,
            record.spo2,
            record.temperature
          );

          const aiRisk = await predictRiskAI(
            record.heartRate,
            record.spo2,
            record.temperature
          );

          if (aiRisk) risk = aiRisk;

          await db.insert(healthRecords).values(record);

          if (risk === "HIGH") {
            console.log("🚨 CSV HIGH RISK → inserting alert");

            await db.insert(alerts).values({
              soldierId: record.soldierId,
              level: "HIGH",
              message: "Critical health risk detected (CSV upload)",
              createdAt: new Date(), // 🔥 IMPORTANT
            });

            alertsCreated++;
          }
        }

        fs.unlinkSync(req.file!.path);

        res.json({
          success: true,
          message: "Health CSV processed successfully",
          recordsInserted: results.length,
          alertsGenerated: alertsCreated,
        });
      });

  } catch (err) {
    console.error("❌ CSV upload error:", err);
    res.status(500).json({ message: "Failed to process CSV" });
  }
};

// ------------------
// Get all health records
// ------------------
export const getAllHealth = async (_req: Request, res: Response) => {
  try {
    const records = await db.select().from(healthRecords);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch health records" });
  }
};

// ------------------
// Get health by soldierId
// ------------------
export const getHealthBySoldier = async (req: Request, res: Response) => {
  try {
    const soldierId = Number(req.params.soldierId);

    const records = await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.soldierId, soldierId));

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch soldier health" });
  }
};