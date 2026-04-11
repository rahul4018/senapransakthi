import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useTypewriter } from "react-simple-typewriter";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { useCallback } from "react";

export default function Landing() {
  const [text] = useTypewriter({
    words: [
      "AI-Driven Digital Twin Platform",
      "Real-Time Soldier Health Intelligence",
      "Command-Level Risk Prediction System",
    ],
    loop: true,
    delaySpeed: 2000,
  });

  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col justify-between">

      {/* Particle Background */}
      <Particles
        init={particlesInit}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 70 },
            color: { value: "#10b981" },
            opacity: { value: 0.12 },
            size: { value: 2 },
            move: { enable: true, speed: 0.4 },
          },
        }}
        className="absolute inset-0"
      />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-7xl w-full space-y-10 text-center"
        >

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Senapransakti
            </h1>

            <h2 className="text-lg text-gray-300 max-w-4xl mx-auto">
              Senapransakti: AI-Driven Digital Twin System for Soldier Health Review and Risk Prediction
            </h2>

            {/* Typing pill */}
            <div className="inline-block px-4 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-full text-emerald-400 font-mono text-sm">
              {text}|
            </div>

            <p className="text-gray-400 max-w-3xl mx-auto">
              A defense-grade intelligence platform combining AI analytics, digital twins, and secure architecture
              to enable real-time soldier monitoring and command-level decision intelligence.
            </p>
          </div>

          {/* CTA */}
          <div className="flex justify-center gap-5">
            <Link
              to="/login"
              className="px-8 py-3 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition shadow-lg"
            >
              Secure Login
            </Link>

            <a
              href="#"
              className="px-7 py-3 border border-zinc-700 text-gray-300 rounded-xl hover:bg-zinc-900 transition"
            >
              Explore Platform
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Stat label="Active Soldiers" value={128} />
            <Stat label="Health Records" value={1420} />
            <Stat label="Critical Alerts" value={36} />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Feature title="🧠 AI Intelligence" desc="Summaries, reasoning, predictive risk insights." />
            <Feature title="📊 Command Dashboard" desc="Operational overview with live analytics." />
            <Feature title="🧬 Digital Twin" desc="Virtual health model for every soldier." />
            <Feature title="🔐 Secure Access" desc="OTP login and role-based protection." />
            <Feature title="📂 Health Pipeline" desc="CSV uploads, processing, alert pipeline." />
            <Feature title="🤖 AI Assistant" desc="Chat-based decision support system." />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 text-xs text-gray-500 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <div>
            Developed by <span className="text-white font-medium">Rahul N</span> · Contact: rkn12476@gmail.com
          </div>

          <div className="flex gap-6">
            <a href="https://github.com/rahul4018" target="_blank" className="hover:text-white">GitHub</a>
            <a href="https://www.linkedin.com/in/rahul-n-in/" target="_blank" className="hover:text-white">LinkedIn</a>
          </div>

          <div>© 2026 Senapransakti. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Components ---------- */

function Feature({ title, desc }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-zinc-900/70 border border-zinc-800 p-6 rounded-2xl hover:border-emerald-500 hover:-translate-y-1 transition"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
      <h2 className="text-3xl font-bold text-emerald-400">
        <CountUp end={value} duration={2} />+
      </h2>
      <p className="text-gray-400 text-sm mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}
