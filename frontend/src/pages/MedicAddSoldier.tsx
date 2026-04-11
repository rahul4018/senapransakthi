import { useState } from "react";
import toast from "react-hot-toast";

const API_BASE = "http://localhost:5000/api";

export default function MedicAddSoldier() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !unit) {
      toast.error("All fields required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/soldiers`, { // ✅ FIXED
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, unit }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to add soldier");
      }

      toast.success("✅ Soldier added successfully");

      // Reset form
      setName("");
      setUnit("");

    } catch (err: any) {
      toast.error(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">➕ Add New Soldier</h1>

      <div className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="Soldier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="Unit (Infantry, Medical...)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 text-black p-3 rounded font-semibold hover:bg-green-400"
        >
          {loading ? "Adding..." : "Add Soldier"}
        </button>
      </div>
    </div>
  );
}