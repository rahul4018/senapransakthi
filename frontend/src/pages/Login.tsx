import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5000/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // =========================
  // REQUEST OTP
  // =========================
  const requestOtp = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    setDemoOtp(null);

    try {
      const res = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "OTP request failed");
      }

      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
        toast.success("Demo OTP generated");
      } else {
        toast.success("OTP sent to email");
      }

      setStep(2);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP (✅ FINAL FIX)
  // =========================
  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Invalid OTP");
      }

      if (!data.token) {
        throw new Error("Token missing from server");
      }

      // ✅ GET ROLE FROM BACKEND
      const role = data.role || "ADMIN";

      console.log("✅ ROLE:", role);

      // ✅ SAVE AUTH DATA
      login(data.token, role);

      toast.success(`Logged in as ${role}`);

      // =========================
      // 🔥 FINAL FIX HERE
      // =========================
      navigate("/dashboard"); // ✅ ALL ROLES → DASHBOARD

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800 space-y-6">

        <h2 className="text-3xl font-bold text-center">🔐 Login</h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              className="w-full p-3 bg-black border border-zinc-700 rounded"
              placeholder="Email (admin@test.com / medic@test.com / commander@test.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-white text-black p-3 rounded hover:bg-gray-200"
            >
              {loading ? "Requesting..." : "Request OTP"}
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {demoOtp && (
              <div className="text-yellow-400 text-center font-semibold">
                Demo OTP: {demoOtp}
              </div>
            )}

            <input
              className="w-full p-3 bg-black border border-zinc-700 rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-black p-3 rounded hover:bg-green-400"
            >
              {loading ? "Verifying..." : "Login"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 hover:text-white"
            >
              ← Change Email
            </button>
          </>
        )}
      </div>
    </div>
  );
}