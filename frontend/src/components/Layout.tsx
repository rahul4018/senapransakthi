import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 p-6 border-r border-zinc-800 flex flex-col justify-between">
        
        <div>
          <h1 className="text-2xl font-bold mb-6">Senapransakti</h1>

          {/* User info */}
          <div className="bg-zinc-800 p-3 rounded mb-6 text-sm">
            <p className="text-gray-400">Logged in as</p>
            <p className="font-semibold">{role}</p>
          </div>

          <nav className="space-y-3 text-sm">
            <Link to="/dashboard" className="block hover:text-gray-300">📊 Dashboard</Link>

            {(role === "ADMIN" || role === "COMMANDER") && (
              <Link to="/soldiers" className="block hover:text-gray-300">🪖 Soldiers</Link>
            )}

            {role === "ADMIN" && (
              <Link to="/upload" className="block hover:text-gray-300">📂 Upload</Link>
            )}

            {(role === "ADMIN" || role === "COMMANDER" || role === "MEDIC") && (
              <Link to="/alerts" className="block hover:text-gray-300">🚨 Alerts</Link>
            )}

            {(role === "ADMIN" || role === "COMMANDER" || role === "MEDIC") && (
              <Link to="/chat" className="block hover:text-gray-300">🤖 AI Chat</Link>
            )}

            {/* 👨‍⚕️ MEDIC-only features */}
            {role === "MEDIC" && (
              <>
                <div className="pt-3 border-t border-zinc-800 text-xs text-gray-500 uppercase">
                  Medic Tools
                </div>

                <Link
                  to="/medic/add-soldier"
                  className="block hover:text-gray-300"
                >
                  ➕ Add Soldier
                </Link>

                <Link
                  to="/medic/add-health"
                  className="block hover:text-gray-300"
                >
                  🩺 Add Health Record
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
