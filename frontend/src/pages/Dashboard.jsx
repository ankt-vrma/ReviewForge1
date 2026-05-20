import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Code2, FolderOpen, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${token}` };
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/api/user/profile`, { headers }).then((r) => setStats(r.data));
    axios.get(`${API}/api/user/reviews`, { headers }).then((r) => setRecent(r.data));
  }, []);

  const statCards = [
    {
      label: "Total Reviews",
      value: stats?.reviewCount ?? 0,
      icon: Code2,
      accent: "blue",
      desc: "Code snippets reviewed",
    },
    {
      label: "Saved Snippets",
      value: stats?.snippetCount ?? 0,
      icon: FolderOpen,
      accent: "violet",
      desc: "Snippets in workspace",
    },
  ];

  return (
    <div className="flex bg-[#0a0a0f] min-h-screen text-white">
      <Sidebar />
      <main className="ml-56 flex-1 p-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Good to see you, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Here's a summary of your activity.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, accent, desc }) => (
            <div
              key={label}
              className="bg-[#111118] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden group hover:border-white/[0.1] transition-all duration-200"
            >
              {/* glow */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${accent === "blue" ? "bg-blue-500" : "bg-violet-500"}`} />
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg mb-4 ${accent === "blue" ? "bg-blue-500/10 border border-blue-500/20" : "bg-violet-500/10 border border-violet-500/20"}`}>
                  <Icon size={16} className={accent === "blue" ? "text-blue-400" : "text-violet-400"} />
                </div>
                <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
                <p className="text-sm font-medium text-white mt-0.5">{label}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={() => navigate("/reviewer")}
            className="flex items-center justify-between px-4 py-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-sm font-medium text-blue-400 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group"
          >
            <span className="flex items-center gap-2">
              <Code2 size={15} />
              Start a review
            </span>
            <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
          <button
            onClick={() => navigate("/workspace")}
            className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm font-medium text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 transition-all group"
          >
            <span className="flex items-center gap-2">
              <FolderOpen size={15} />
              Open workspace
            </span>
            <ArrowRight size={14} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        {/* Recent reviews */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-2">
            <Clock size={14} className="text-zinc-500" />
            <span className="text-sm font-medium text-zinc-300">Recent Reviews</span>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-zinc-600 text-sm">No reviews yet.</p>
              <button
                onClick={() => navigate("/reviewer")}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Submit your first review →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recent.map((r) => (
                <div key={r._id} className="px-5 py-3.5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm text-zinc-400 truncate max-w-lg font-mono">{r.prompt}</p>
                  <p className="text-xs text-zinc-600 ml-4 flex-shrink-0">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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