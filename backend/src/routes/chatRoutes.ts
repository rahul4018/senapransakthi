import express from "express";
import { chatWithAI } from "../controllers/chatController";

const router = express.Router();

// ✅ POST /api/chat
router.post("/", async (req, res, next) => {
  try {
    await chatWithAI(req, res);
  } catch (error) {
    console.error("❌ Chat Route Error:", error);
    next(error);
  }
});

export default router;