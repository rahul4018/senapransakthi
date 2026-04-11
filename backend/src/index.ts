import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes";
import soldierRoutes from "./routes/soldierRoutes";
import healthRoutes from "./routes/healthRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import alertRoutes from "./routes/alertRoutes";
import chatRoutes from "./routes/chatRoutes";
import digitalTwinRoutes from "./routes/digitalTwinRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();

// ============================
// 🔥 MIDDLEWARE
// ============================

// CORS (IMPORTANT for frontend)
app.use(cors({
  origin: "*", // allow all (safe for exam demo)
}));

// JSON parser
app.use(express.json({ limit: "10mb" }));

// Request Logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);
  next();
});

// ============================
// ✅ HEALTH CHECK
// ============================
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Senapransakti Backend Running Successfully");
});

// ============================
// ✅ API ROUTES (IMPORTANT FIX)
// ============================

// 🔥 ALL ROUTES UNDER /api
app.use("/api/auth", authRoutes);
app.use("/api/soldiers", soldierRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/digital-twin", digitalTwinRoutes);
app.use("/api/ai", aiRoutes);

// ============================
// 🔥 DEBUG ROUTE (VERY USEFUL)
// ============================
app.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "Server working perfectly ✅" });
});

// ============================
// ❌ 404 HANDLER
// ============================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ============================
// ❌ GLOBAL ERROR HANDLER
// ============================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Unhandled Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ============================
// 🚀 SERVER START
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`👉 Test: http://localhost:${PORT}/test`);
});