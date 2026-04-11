import { Request, Response } from "express";
import Groq from "groq-sdk";
import { db } from "../db";
import { healthRecords } from "../db/schema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // ✅ STRICT LIMIT (CRITICAL FIX)
    const recent = await db
      .select()
      .from(healthRecords)
      .limit(20); // 🔥 VERY SMALL

    // ✅ SMALL SUMMARY ONLY
    const summary = recent
      .map(
        (r) =>
          `HR:${r.heartRate || 0}, SpO2:${r.spo2 || 0}, Temp:${r.temperature || 0}`
      )
      .join("; ");

    const prompt = `
You are a military health AI assistant.

Data (latest records):
${summary}

User question:
${message}

Answer shortly in 3-4 lines.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150, // 🔥 HARD LIMIT
    });

    res.json({
      reply:
        completion.choices?.[0]?.message?.content ||
        "AI could not generate response",
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.json({
      reply: "AI temporarily unavailable (token limit fixed)",
    });
  }
};