export type Role = "ADMIN" | "COMMANDER" | "MEDIC";

export interface User {
  email: string;
  role: Role;
  otp?: string;
  otpExpiry?: number;
}

/*
====================================
USER STORE (Supports DEMO + REAL)
====================================
- DEMO_MODE=true  → use test users
- DEMO_MODE=false → use real email users
====================================
*/

const DEMO_MODE = process.env.DEMO_MODE === "true";

/*
====================================
DEMO USERS (Only for testing UI)
====================================
*/
const demoUsers: User[] = [
  { email: "admin@test.com", role: "ADMIN" },
  { email: "commander@test.com", role: "COMMANDER" },
  { email: "medic@test.com", role: "MEDIC" },
];

/*
====================================
REAL USERS (Production / Gmail OTP)
====================================
*/
const realUsers: User[] = [
  { email: "rkn12476@gmail.com", role: "ADMIN" },
];

/*
====================================
ACTIVE USER LIST
====================================
*/
export const users: User[] = DEMO_MODE ? demoUsers : realUsers;

/*
====================================
Find user by email (case-insensitive)
====================================
*/
export function findUserByEmail(email: string): User | undefined {
  return users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

/*
====================================
Store OTP
====================================
*/
export function storeOtp(user: User, otp: string, expiry: number) {
  user.otp = otp;
  user.otpExpiry = expiry;
}

/*
====================================
Clear OTP after verification
====================================
*/
export function clearOtp(user: User) {
  user.otp = undefined;
  user.otpExpiry = undefined;
}