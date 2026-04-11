import { useEffect, useRef, useState } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Record = {
  heart_rate: number;
  spo2: number;
  temperature: number;
  created_at: string;
};

export default function SoldierProfile() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [aiData, setAiData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const fetchData = () => {
    fetch(`http://localhost:5000/digital-twin/${id}`)
      .then((res) => res.json())
      .then(setData);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!data) return <div className="text-white p-6">Loading Digital Twin...</div>;

  const records: Record[] = data.records;

  const formatted = records.map((r) => ({
    time: new Date(r.created_at).toLocaleTimeString(),
    heart: r.heart_rate,
    spo2: r.spo2,
    temp: r.temperature,
  }));

  const latest = formatted[formatted.length - 1];

  const critical =
    latest.heart > 120 || latest.spo2 < 90 || latest.temp > 38;

  // 📄 PDF Export
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`Soldier_${data.soldier.id}_Health_Report.pdf`);
  };

  // 🧠 Fetch AI analysis
  const generateAI = async () => {
    setAiLoading(true);
    const res = await fetch(`http://localhost:5000/ai/${id}`);
    const result = await res.json();
    setAiData(result);
    setAiLoading(false);
  };

  return (
    <div className="p-6 text-white space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🧠 Digital Twin</h1>

        <div className="flex gap-3">
          <button
            onClick={generateAI}
            className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
          >
            {aiLoading ? "Analyzing..." : "Generate AI Analysis"}
          </button>

          <button
            onClick={downloadPDF}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Everything inside PDF */}
      <div ref={reportRef} className="space-y-6">

        {/* Status */}
        <span
          className={`inline-block px-4 py-1 rounded font-bold ${
            critical ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {critical ? "🔴 CRITICAL" : "🟢 STABLE"}
        </span>

        {/* Info */}
        <div className="bg-zinc-900 p-4 rounded-xl space-y-2">
          <p>ID: {data.soldier.id}</p>
          <p>Name: {data.soldier.name}</p>
          <p>Unit: {data.soldier.unit}</p>
        </div>

        {/* Vitals */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl">❤️ HR: {latest.heart}</div>
          <div className="bg-zinc-900 p-4 rounded-xl">🫁 SpO2: {latest.spo2}%</div>
          <div className="bg-zinc-900 p-4 rounded-xl">🌡️ Temp: {latest.temp}°C</div>
        </div>

        {/* AI Section */}
        {aiData && (
          <div className="bg-zinc-900 p-5 rounded-xl border border-purple-500 space-y-3">
            <h2 className="text-xl font-bold text-purple-400">🧠 AI Health Intelligence</h2>

            <p><b>Risk Level:</b> <span className="text-red-400">{aiData.risk}</span></p>

            <p><b>Summary:</b> {aiData.summary}</p>

            <div>
              <b>Recommendations:</b>
              <ul className="list-disc list-inside text-gray-300">
                {aiData.recommendations?.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Charts */}
        {["heart", "spo2", "temp"].map((key, i) => (
          <div key={i} className="bg-zinc-900 p-4 rounded-xl h-64">
            <h2 className="mb-2 capitalize">{key} Trend</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey={key} stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
