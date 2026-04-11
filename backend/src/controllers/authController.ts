import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";

const DEMO_MODE = process.env.DEMO_MODE === "true";

// 🔐 In-memory OTP store
const otpStore: Record<
  string,
  { otp: string; expires: number }
> = {};

// ============================
// REQUEST OTP
// ============================
export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔥 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ⏳ Expiry (5 minutes)
    const expiry = Date.now() + 5 * 60 * 1000;

    // Save OTP
    otpStore[email] = {
      otp,
      expires: expiry,
    };

    console.log(`📩 OTP for ${email}: ${otp}`);

    // =========================
    // DEMO MODE
    // =========================
    if (DEMO_MODE) {
      return res.json({
        success: true,
        message: "OTP generated (demo mode)",
        demoOtp: otp,
      });
    }

    // =========================
    // REAL MODE → EMAIL
    // =========================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Senapransakti" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (err) {
    console.error("❌ OTP Error:", err);
    next(err);
  }
};

// ============================
// VERIFY OTP
// ============================
export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;

    // =========================
    // VALIDATION
    // =========================
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 🔥 STRICT 6-DIGIT CHECK
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be exactly 6 digits",
      });
    }

    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: "OTP not requested",
      });
    }

    // ⏳ EXPIRY CHECK
    if (Date.now() > stored.expires) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // ❌ WRONG OTP
    if (stored.otp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ SUCCESS → REMOVE OTP (one-time use)
    delete otpStore[email];

    // =========================
    // ROLE LOGIC
    // =========================
    let role = "ADMIN";

    if (email === "medic@test.com") role = "MEDIC";
    else if (email === "commander@test.com") role = "COMMANDER";
    else if (email === "admin@test.com") role = "ADMIN";

    console.log("✅ LOGIN ROLE:", role);

    // =========================
    // TOKEN
    // =========================
    const token = Buffer.from(
      JSON.stringify({ email, role })
    ).toString("base64");

    return res.json({
      success: true,
      message: "Login successful",
      token,
      role,
    });

  } catch (err) {
    next(err);
  }
};