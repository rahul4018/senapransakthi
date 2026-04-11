import { useState } from "react";
import toast from "react-hot-toast";

export default function MedicAddHealth() {
  const [soldierId, setSoldierId] = useState("");
  const [heart, setHeart] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!soldierId || !heart || !spo2 || !temp) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      console.log("📤 Sending Health Data:", {
        soldierId,
        heart,
        spo2,
        temp,
      });

      const res = await fetch("http://localhost:5000/api/health/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          soldierId: Number(soldierId),
          heart_rate: Number(heart),
          spo2: Number(spo2),
          temperature: Number(temp),
        }),
      });

      const data = await res.json();

      console.log("📥 API RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to add record");
      }

      toast.success(`Health added (${data.risk})`);

      // reset form
      setSoldierId("");
      setHeart("");
      setSpo2("");
      setTemp("");

    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-white space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">🩺 Add Health Record</h1>

      <div className="space-y-4 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="Soldier ID"
          value={soldierId}
          onChange={(e) => setSoldierId(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="Heart Rate"
          value={heart}
          onChange={(e) => setHeart(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="SpO2"
          value={spo2}
          onChange={(e) => setSpo2(e.target.value)}
        />

        <input
          className="w-full p-3 bg-black border border-zinc-700 rounded"
          placeholder="Temperature"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 text-black p-3 rounded font-semibold hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Health Data"}
        </button>
      </div>
    </div>
  );
}