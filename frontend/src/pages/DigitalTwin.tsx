import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type RecordType = {
  heart_rate: number;
  spo2: number;
  temperature: number;
  created_at: string;
};

export default function DigitalTwin() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [soldier, setSoldier] = useState<any>(null);
  const [records, setRecords] = useState<RecordType[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTwin = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/digital-twin/${id}`
        );

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        if (data.success) {
          setSoldier(data.soldier);
          setRecords(data.records);
        } else throw new Error();
      } catch {
        setError("⚠️ Demo mode");

        setSoldier({
          id,
          name: "Demo Soldier",
          unit: "Infantry",
        });

        setRecords([
          { heart_rate: 80, spo2: 97, temperature: 36.5, created_at: "T1" },
          { heart_rate: 85, spo2: 96, temperature: 36.7, created_at: "T2" },
          { heart_rate: 78, spo2: 98, temperature: 36.4, created_at: "T3" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTwin();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!soldier) return <p className="text-white p-6">No data</p>;

  const latest = records[records.length - 1];

  // ======================
  // AI RISK LOGIC
  // ======================
  const getRisk = (hr?: number, spo2?: number, temp?: number) => {
    if (!hr || !spo2 || !temp) return "LOW";

    let score = 0;
    if (hr < 50 || hr > 120) score++;
    if (spo2 < 92) score++;
    if (temp > 38) score++;

    if (score === 0) return "LOW";
    if (score === 1) return "MODERATE";
    return "HIGH";
  };

  const risk = getRisk(
    latest?.heart_rate,
    latest?.spo2,
    latest?.temperature
  );

  const riskColor =
    risk === "HIGH"
      ? "bg-red-500"
      : risk === "MODERATE"
      ? "bg-yellow-500"
      : "bg-green-500";

  // ======================
  // PDF EXPORT
  // ======================
  const downloadPDF = async () => {
    const element = document.getElementById("report");
    const footer = document.getElementById("pdf-footer");

    if (!element) return;

    footer?.classList.remove("hidden");

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`health-report-${soldier.name}.pdf`);

    footer?.classList.add("hidden");
  };

  return (
    <div className="text-white p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          SENAPRANSAKTI Digital Twin
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          📄 Download Report
        </button>
      </div>

      {error && <p className="text-yellow-400">{error}</p>}

      {/* ================= REPORT ================= */}
      <div id="report">

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-400">
            SENAPRANSAKTI HEALTH REPORT
          </h1>
          <p className="text-sm text-gray-400">
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Risk Badge */}
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${riskColor}`}>
          {risk} RISK
        </div>

        {/* Soldier Info */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mt-4">
          <h2 className="text-xl font-bold mb-2">🪖 Soldier Information</h2>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Name:</strong> {soldier.name}</p>
            <p><strong>ID:</strong> {soldier.id}</p>
            <p><strong>Unit:</strong> {soldier.unit}</p>
            <p><strong>Status:</strong> {risk}</p>
          </div>
        </div>

        {/* Metrics */}
        <h2 className="text-lg font-semibold mt-6">
          📊 Current Health Metrics
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-2">
          <VitalCard title="Heart Rate" value={latest?.heart_rate} unit=" bpm" />
          <VitalCard title="SpO2" value={latest?.spo2} unit="%" />
          <VitalCard title="Temperature" value={latest?.temperature} unit="°C" />
        </div>

        {/* Charts */}
        <h2 className="text-lg font-semibold mt-6">
          📈 Health Trends
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <ChartCard title="Heart Rate" dataKey="heart_rate" data={records} />
          <ChartCard title="SpO2" dataKey="spo2" data={records} />
          <ChartCard title="Temperature" dataKey="temperature" data={records} />
        </div>

        {/* AI Analysis */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mt-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-3">
            🧠 AI Health Analysis
          </h2>

          <p>
            <strong>Risk Level:</strong>{" "}
            <span className={`font-bold ${
              risk === "HIGH" ? "text-red-500" :
              risk === "MODERATE" ? "text-yellow-400" :
              "text-green-400"
            }`}>
              {risk}
            </span>
          </p>

          <p className="mt-2">
            Based on current vitals, soldier is under <strong>{risk}</strong> risk.
          </p>

          <p className="mt-2 text-sm text-gray-300">
            HR: {latest?.heart_rate} bpm | SpO2: {latest?.spo2}% | Temp: {latest?.temperature}°C
          </p>

          {/* ✅ Recommendations Section */}
          <div className="mt-4">
            <h3 className="font-semibold">🩺 Recommendations:</h3>

            <ul className="list-disc ml-5 mt-2 text-sm">
              {risk === "HIGH" && (
                <>
                  <li>Immediate medical attention required</li>
                  <li>Continuous monitoring needed</li>
                </>
              )}
              {risk === "MODERATE" && (
                <>
                  <li>Monitor vitals regularly</li>
                  <li>Ensure hydration and rest</li>
                </>
              )}
              {risk === "LOW" && <li>Stable condition</li>}
            </ul>
          </div>
        </div>

        {/* Footer (PDF only) */}
        <div id="pdf-footer" className="hidden mt-10 text-center text-xs text-gray-400">
          <hr className="mb-2 border-zinc-700" />
          <p>Generated by Senapransakti AI System</p>
          <p>Confidential • For Authorized Use Only</p><br/>
        </div>

      </div>
    </div>
  );
}

/* COMPONENTS */

function VitalCard({ title, value, unit }: any) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl">
      <p className="text-gray-400">{title}</p>
      <p className="text-2xl font-bold">
        {value !== undefined ? `${value}${unit}` : "--"}
      </p>
    </div>
  );
}

function ChartCard({ title, data, dataKey }: any) {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl h-64">
      <h3 className="mb-2 font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis hide />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}