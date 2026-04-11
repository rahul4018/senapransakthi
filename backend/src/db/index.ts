import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// 🔥 FINAL STABLE CONFIG (SUPABASE SAFE)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false, // ✅ REQUIRED for Supabase
  },

  max: 5, // ✅ limit connections (prevents crashes)
  idleTimeoutMillis: 30000, // ✅ avoid idle disconnects
  connectionTimeoutMillis: 10000, // ✅ fail fast if DB not reachable
});

// 🔥 HANDLE UNEXPECTED ERRORS (VERY IMPORTANT)
pool.on("error", (err) => {
  console.error("❌ Unexpected DB Pool Error:", err.message);
});

// 🔥 TEST CONNECTION ON START (SAFE)
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully");
    client.release();
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ✅ DRIZZLE ORM
export const db = drizzle(pool, { schema });