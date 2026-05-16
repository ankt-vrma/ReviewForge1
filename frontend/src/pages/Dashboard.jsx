import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Code2, FolderOpen, Clock } from "lucide-react";

export default function Dashboard() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API}/api/user/profile`, { headers })
      .then((r) => setStats(r.data));

    axios
      .get(`${API}/api/user/reviews`, { headers })
      .then((r) => setRecent(r.data));
  }, []);

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar />

      <main className="ml-16 flex-1 p-8 overflow-hidden">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-gray-400 mb-8">
          Here's what's been happening.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Reviews",
              value: stats?.reviewCount ?? 0,
              icon: Code2,
              color: "blue",
            },
            {
              label: "Saved Snippets",
              value: stats?.snippetCount ?? 0,
              icon: FolderOpen,
              color: "purple",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div
                className={`w-10 h-10 bg-${color}-600/20 rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon
                  size={20}
                  className={`text-${color}-400`}
                />
              </div>

              <p className="text-3xl font-bold">{value}</p>

              <p className="text-gray-400 text-sm mt-1">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-hidden">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            Recent Reviews
          </h2>

          {recent.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No reviews yet. Head to the Reviewer page!
            </p>
          ) : (
            <div className="space-y-3">
              {recent.map((r) => (
                <div
                  key={r._id}
                  className="bg-gray-800 rounded-lg p-4 overflow-hidden"
                >
                  <p className="text-sm text-gray-300">
                    {r.prompt
                      .replace(/\s+/g, " ")
                      .slice(0, 99)}
                    ...
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}