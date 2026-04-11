import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState("");

  const role = localStorage.getItem("role") || "ADMIN";
  const token = localStorage.getItem("token");

  // =========================
  // FETCH DASHBOARD
  // =========================
  const fetchDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/summary`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setStats(data);
      setError("");

    } catch {
      setError("Failed to load dashboard");
    }
  };

  // =========================
  // 🔥 AUTO REFRESH FIX
  // =========================
  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 3000); // auto refresh

    return () => clearInterval(interval);
  }, []);

  // =========================
  // AI SUMMARY
  // =========================
  const loadAISummary = async () => {
    if (aiOpen) return setAiOpen(false);

    setAiOpen(true);
    setAiSummary("Generating summary...");

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          message: `Give a short military health report:
Soldiers: ${stats?.totalSoldiers}
Records: ${stats?.totalRecords}
High Risk: ${stats?.highRisk}
Alerts: ${stats?.totalAlerts}`
        })
      });

      const data = await res.json();
      setAiSummary(data.reply || "No response");

    } catch {
      setAiSummary("Failed to generate AI summary");
    }
  };

  // =========================
  // STATES
  // =========================
  if (error) return <div className="text-red-500 p-6">{error}</div>;
  if (!stats) return <div className="p-6 text-white">Loading dashboard...</div>;

  const riskData = [
    { name: "High Risk", value: stats.highRisk },
    { name: "Moderate", value: stats.moderateRisk },
    { name: "Low Risk", value: stats.lowRisk },
  ];

  const volumeData = [
    { name: "Soldiers", value: stats.totalSoldiers },
    { name: "Records", value: stats.totalRecords },
    { name: "Alerts", value: stats.totalAlerts },
  ];

  // =========================
  // HEALTH SCORE COLOR
  // =========================
  const getHealthColor = () => {
    if (stats.healthScore > 75) return "text-green-400";
    if (stats.healthScore > 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-8 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          📊 {role} Dashboard
        </h1>

        <button
          onClick={loadAISummary}
          className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
        >
          {aiOpen ? "Close AI" : "🧠 AI Summary"}
        </button>
      </div>

      {/* AI BOX */}
      {aiOpen && (
        <div className="bg-zinc-900 p-4 rounded border border-indigo-600">
          {aiSummary}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-5 gap-4">
        <Stat label="👨‍✈️ Soldiers" value={stats.totalSoldiers} />
        <Stat label="📊 Records" value={stats.totalRecords} />
        <Stat label="🚨 High Risk" value={stats.highRisk} danger />
        <Stat label="⚠️ Alerts" value={stats.totalAlerts} />
        <Stat
          label="❤️ Health Score"
          value={`${stats.healthScore}/100`}
          customColor={getHealthColor()}
        />
      </div>

      {/* ALERTS */}
      <div className="bg-zinc-900 p-4 rounded border border-red-500">
        <h3 className="text-red-400 font-bold mb-3">🚨 Top Alerts</h3>

        {stats.recentAlerts?.length === 0 && (
          <p className="text-green-400 font-semibold">
            ✅ No active high-risk alerts
          </p>
        )}

        {stats.recentAlerts?.map((a: any, index: number) => (
          <div key={index} className="py-2 border-b flex justify-between">
            <span className="text-red-400 font-semibold">
              🔴 {a.level}
            </span>
            <span>Soldier {a.soldierId}</span>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-zinc-900 p-4 rounded">
          <h3 className="mb-2">Risk Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskData} dataKey="value" nameKey="name">
                <Cell fill="#ef4444" />
                <Cell fill="#facc15" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-zinc-900 p-4 rounded">
          <h3 className="mb-2">System Volume</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

// =========================
// COMPONENT
// =========================
function Stat({ label, value, danger, customColor }: any) {
  return (
    <div className={`bg-zinc-900 p-4 rounded ${danger ? "text-red-500" : ""}`}>
      <p className="text-sm opacity-70">{label}</p>
      <h2 className={`text-3xl font-bold ${customColor || ""}`}>
        {value}
      </h2>
    </div>
  );
}