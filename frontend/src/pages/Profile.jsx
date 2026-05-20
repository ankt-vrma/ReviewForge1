import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { User, Mail, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API}/api/user/profile`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login({ ...user, name: res.data.name }, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#0a0a0f] min-h-screen text-white">
      <Sidebar />
      <main className="ml-56 flex-1 p-8 max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-1">Account</p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Profile</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your account information.</p>
        </div>

        {/* Avatar card */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-xl p-6 mb-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-400 text-xl font-bold uppercase">
              {user?.name?.[0] ?? "U"}
            </span>
          </div>
          <div>
            <p className="font-medium text-zinc-100">{user?.name}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-[#111118] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.05]">
            <p className="text-sm font-medium text-zinc-300">Personal information</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Name field */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <User size={11} />
                Display name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0d0d14] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Email field (read only) */}
            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail size={11} />
                Email address
                <span className="text-[10px] bg-white/[0.04] text-zinc-600 border border-white/[0.06] px-1.5 py-0.5 rounded ml-1">read-only</span>
              </label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full bg-[#0a0a0f] border border-white/[0.04] rounded-lg px-3.5 py-2.5 text-sm text-zinc-600 outline-none cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-zinc-700">Changes are saved to your account immediately.</p>
              <button
                onClick={handleSave}
                disabled={loading || saved}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  saved
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50"
                }`}
              >
                {saved ? (
                  <>
                    <Check size={14} />
                    Saved
                  </>
                ) : loading ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving...
                  </>
                ) : "Save changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="mt-5 bg-[#111118] border border-red-500/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-500/10">
            <p className="text-sm font-medium text-red-400/70">Danger zone</p>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Sign out of ReviewForge</p>
              <p className="text-xs text-zinc-600 mt-0.5">You can sign back in anytime.</p>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="px-4 py-2 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}