import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool, { schema });

async function run() {
  await db.insert(schema.users).values({
    email: "admin@test.com",
    role: "ADMIN",
  });

  console.log("✅ Insert successful into Supabase DB");
  process.exit(0);
}

run();
