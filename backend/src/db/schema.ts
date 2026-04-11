import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp
} from "drizzle-orm/pg-core";

/*
========================
USERS TABLE
========================
*/
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: varchar("role", { length: 50 }).notNull(),
});

/*
========================
SOLDIERS TABLE
========================
*/
export const soldiers = pgTable("soldiers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 255 }).notNull(),

  // ✅ FIXED
  status: varchar("status", { length: 50 }).default("ACTIVE"),
});

/*
========================
HEALTH RECORDS TABLE
========================
*/
export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),

  soldierId: integer("soldier_id").notNull(),

  heartRate: integer("heart_rate"),
  spo2: integer("spo2"),
  temperature: integer("temperature"),

  risk: varchar("risk", { length: 50 }),
  score: integer("score"),

  createdAt: timestamp("created_at").defaultNow(),
});

/*
========================
ALERTS TABLE
========================
*/
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),

  soldierId: integer("soldier_id").notNull(),

  level: varchar("level", { length: 50 }),
  message: varchar("message", { length: 500 }),

  createdAt: timestamp("created_at").defaultNow(),
});