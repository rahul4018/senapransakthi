import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Soldier = {
  id: number;
  name: string;
  unit: string;
};

const ITEMS_PER_PAGE = 10;

export default function Soldiers() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [search, setSearch] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSoldiers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/soldiers");
        const data = await res.json();
        setSoldiers(data.data);
      } catch {
        setSoldiers([
          { id: 1, name: "Rahul Singh", unit: "Infantry" },
          { id: 2, name: "Arjun Kumar", unit: "Artillery" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldiers();
  }, []);

  // 🔍 Filter
  const filtered = soldiers.filter((s) => {
    const matchName = s.name.toLowerCase().includes(search.toLowerCase());
    const matchUnit = unitFilter ? s.unit === unitFilter : true;
    return matchName && matchUnit;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const units = Array.from(new Set(soldiers.map((s) => s.unit)));

  if (loading) return <p className="p-6">Loading soldiers...</p>;

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">👥 Soldiers</h1>

      {/* Search + Filter */}
      <div className="flex gap-4">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-900 border border-zinc-700 p-2 rounded w-64"
        />

        <select
          value={unitFilter}
          onChange={(e) => {
            setUnitFilter(e.target.value);
            setPage(1);
          }}
          className="bg-zinc-900 border border-zinc-700 p-2 rounded"
        >
          <option value="">All Units</option>
          {units.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Profile</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((s) => (
              <tr key={s.id} className="border-t border-zinc-800">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.unit}</td>
                <td className="p-3">
                  <Link
                    to={`/soldiers/${s.id}`}
                    className="text-green-400 hover:underline"
                  >
                    View Digital Twin →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-zinc-800 rounded"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-zinc-800 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}