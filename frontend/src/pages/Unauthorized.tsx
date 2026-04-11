import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl text-center w-96">
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          Access Denied
        </h1>

        <p className="text-gray-400 mb-6">
          You do not have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
