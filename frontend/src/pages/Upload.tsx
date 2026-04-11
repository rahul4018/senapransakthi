import { useState } from "react";

export default function Upload() {
  const [soldiersFile, setSoldiersFile] = useState<File | null>(null);
  const [healthFile, setHealthFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  async function uploadFile(url: string, file: File | null) {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setMessage(data.message || "Upload completed.");
    } catch (err: any) {
      setMessage(err.message || "Upload failed.");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Upload CSV Files</h1>

      <div className="space-y-8">

        {/* Soldiers Upload */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Soldiers CSV</h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setSoldiersFile(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button
            onClick={() =>
              uploadFile(
                "http://localhost:5000/api/soldiers/upload", // ✅ FIXED
                soldiersFile
              )
            }
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Upload Soldiers
          </button>
        </div>

        {/* Health Upload */}
        <div className="bg-zinc-900 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Health CSV</h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setHealthFile(e.target.files?.[0] || null)}
            className="mb-4"
          />

          <button
            onClick={() =>
              uploadFile(
                "http://localhost:5000/api/health/upload", // ✅ FIXED
                healthFile
              )
            }
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Upload Health Data
          </button>
        </div>

        {message && (
          <div className="bg-zinc-800 p-4 rounded text-green-400">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}