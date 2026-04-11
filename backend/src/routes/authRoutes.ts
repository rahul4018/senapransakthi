import express from "express";
import { requestOtp, verifyOtp } from "../controllers/authController";

const router = express.Router();

/**
 * 🔐 AUTH ROUTES
 */

// ✅ NO middleware (fixes your error)
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

export default router;