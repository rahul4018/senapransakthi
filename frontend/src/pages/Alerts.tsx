import { useEffect, useState } from "react";

type Alert = {
  id: number;
  soldierId: number;
  message: string;
  level: string; // ✅ FIXED (was risk)
  createdAt?: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // ✅ added

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/alerts"); // ✅ FIXED URL
        const data = await res.json();

        // ✅ FIXED: correct data extraction
        setAlerts(data.data);

      } catch (err) {
        console.error("Alerts fetch failed → fallback");

        // 🔥 frontend fallback
        setAlerts([
          {
            id: 1,
            soldierId: 101,
            level: "HIGH",
            message: "Critical risk detected",
          },
          {
            id: 2,
            soldierId: 202,
            level: "MODERATE",
            message: "Vitals unstable",
          },
        ]);

        setError("Running in demo mode");

      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  function riskColor(level: string) {
    if (level === "HIGH") return "text-red-500";
    if (level === "MODERATE") return "text-yellow-400";
    return "text-green-400";
  }

  // ✅ prevent blank screen
  if (loading) return <p className="p-6">Loading alerts...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      {error && <p className="text-yellow-400 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-zinc-900 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Soldier ID</th>
              <th className="p-4">Message</th>
              <th className="p-4">Risk</th>
            </tr>
          </thead>

          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No alerts available
                </td>
              </tr>
            ) : (
              alerts.map((a) => (
                <tr
                  key={a.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800"
                >
                  <td className="p-4">{a.id}</td>
                  <td className="p-4">{a.soldierId}</td>
                  <td className="p-4">{a.message}</td>
                  <td className={`p-4 font-bold ${riskColor(a.level)}`}>
                    {a.level}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}