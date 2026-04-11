import { useState } from "react";
import toast from "react-hot-toast";

export default function MedicPanel() {
  const [soldier, setSoldier] = useState({ name: "", unit: "" });
  const [health, setHealth] = useState({
    soldierId: "",
    heartRate: "",
    spo2: "",
    temperature: "",
  });
  const [loading, setLoading] = useState(false);

  // =========================
  // Add Soldier
  // =========================
  const addSoldier = async () => {
    if (!soldier.name || !soldier.unit) {
      toast.error("Name and unit required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/soldiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(soldier),
      });

      if (!res.ok) throw new Error("Failed to add soldier");

      toast.success("✅ Soldier added successfully");

      setSoldier({ name: "", unit: "" });

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Add Health
  // =========================
  const addHealth = async () => {
    const { soldierId, heartRate, spo2, temperature } = health;

    if (!soldierId || !heartRate || !spo2 || !temperature) {
      toast.error("All health fields required");
      return;
    }

    try {
      setLoading(true);

      console.log("📤 Sending:", health);

      const res = await fetch("http://localhost:5000/api/health/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soldierId: Number(soldierId),
          heart_rate: Number(heartRate),   // ✅ FIXED
          spo2: Number(spo2),
          temperature: Number(temperature),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed");

      toast.success(`🩺 Health added (Risk: ${data.risk})`);

      setHealth({
        soldierId: "",
        heartRate: "",
        spo2: "",
        temperature: "",
      });

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-8">
      <h1 className="text-3xl font-bold">👨‍⚕️ Medic Control Panel</h1>

      {/* Add Soldier */}
      <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Add New Soldier</h2>

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="Soldier Name"
          value={soldier.name}
          onChange={(e) =>
            setSoldier({ ...soldier, name: e.target.value })
          }
        />

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="Unit (Infantry, Signals...)"
          value={soldier.unit}
          onChange={(e) =>
            setSoldier({ ...soldier, unit: e.target.value })
          }
        />

        <button
          onClick={addSoldier}
          disabled={loading}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          ➕ Add Soldier
        </button>
      </div>

      {/* Add Health */}
      <div className="bg-zinc-900 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold">Add Health Record</h2>

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="Soldier ID"
          value={health.soldierId}
          onChange={(e) =>
            setHealth({ ...health, soldierId: e.target.value })
          }
        />

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="Heart Rate"
          value={health.heartRate}
          onChange={(e) =>
            setHealth({ ...health, heartRate: e.target.value })
          }
        />

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="SpO2"
          value={health.spo2}
          onChange={(e) =>
            setHealth({ ...health, spo2: e.target.value })
          }
        />

        <input
          className="w-full p-2 bg-black border border-zinc-700 rounded"
          placeholder="Temperature"
          value={health.temperature}
          onChange={(e) =>
            setHealth({ ...health, temperature: e.target.value })
          }
        />

        <button
          onClick={addHealth}
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          🩺 Submit Health
        </button>
      </div>
    </div>
  );
}