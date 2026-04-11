import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback";

export function generateToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
