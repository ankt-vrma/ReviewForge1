import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Plus, Trash2, X, FolderOpen, Tag } from "lucide-react";

const LANGUAGES = ["javascript", "typescript", "python", "cpp", "java", "go", "rust", "html", "css", "other"];

const LANG_COLORS = {
  javascript: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  typescript: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  python:     "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  cpp:        "text-purple-400 bg-purple-400/10 border-purple-400/20",
  java:       "text-orange-400 bg-orange-400/10 border-orange-400/20",
  go:         "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  rust:       "text-red-400 bg-red-400/10 border-red-400/20",
  html:       "text-rose-400 bg-rose-400/10 border-rose-400/20",
  css:        "text-pink-400 bg-pink-400/10 border-pink-400/20",
  other:      "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

export default function Workspace() {
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  const headers = { Authorization: `Bearer ${token}` };

  const [snippets, setSnippets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", language: "javascript", code: "", tags: "" });
  const [selected, setSelected] = useState(null);

  const fetchSnippets = () =>
    axios.get(`${API}/api/snippets`, { headers }).then((r) => setSnippets(r.data));

  useEffect(() => { fetchSnippets(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.code) return;
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    await axios.post(`${API}/api/snippets`, { ...form, tags }, { headers });
    setForm({ title: "", language: "javascript", code: "", tags: "" });
    setShowModal(false);
    fetchSnippets();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/snippets/${id}`, { headers });
    if (selected?._id === id) setSelected(null);
    fetchSnippets();
  };

  return (
    <div className="flex bg-[#0a0a0f] h-screen text-white overflow-hidden">
      <Sidebar />

      <main className="ml-56 flex-1 flex min-w-0">
        {/* ── List panel ── */}
        <div className="w-64 border-r border-white/[0.05] flex flex-col flex-shrink-0">
          <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Snippets</span>
            <button
              onClick={() => setShowModal(true)}
              className="w-6 h-6 bg-blue-600 hover:bg-blue-500 rounded-md flex items-center justify-center transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {snippets.length === 0 && (
              <div className="text-center pt-12 px-4">
                <FolderOpen size={24} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-600 text-xs">No snippets yet</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Add one
                </button>
              </div>
            )}
            {snippets.map((s) => (
              <div
                key={s._id}
                onClick={() => setSelected(s)}
                className={`px-3 py-2.5 rounded-lg cursor-pointer group flex items-center justify-between transition-all ${
                  selected?._id === s._id
                    ? "bg-blue-600/15 border border-blue-500/20"
                    : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.05]"
                }`}
              >
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium truncate ${selected?._id === s._id ? "text-blue-200" : "text-zinc-300"}`}>
                    {s.title}
                  </p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border mt-1 inline-block ${LANG_COLORS[s.language] || LANG_COLORS.other}`}>
                    {s.language}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded hover:bg-red-500/10 text-red-400 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {selected ? (
            <>
              {/* Header */}
              <div className="px-6 py-3.5 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-sm font-medium text-zinc-200 truncate">{selected.title}</h2>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border flex-shrink-0 ${LANG_COLORS[selected.language] || LANG_COLORS.other}`}>
                    {selected.language}
                  </span>
                </div>
                {selected.tags?.length > 0 && (
                  <div className="flex items-center gap-1.5 ml-4 flex-shrink-0">
                    <Tag size={11} className="text-zinc-600" />
                    {selected.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-white/[0.04] text-zinc-500 border border-white/[0.06] px-1.5 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Code */}
              <div className="flex-1 overflow-auto p-6">
                <pre className="bg-[#0d0d14] border border-white/[0.06] rounded-xl p-5 text-[13px] text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap overflow-auto h-full">
                  {selected.code}
                </pre>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <FolderOpen size={20} className="text-zinc-600" />
              </div>
              <p className="text-zinc-500 text-sm font-medium">Select a snippet to view</p>
              <p className="text-zinc-700 text-xs mt-1">Your code will appear here</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Create Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-black/60">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-zinc-100">New Snippet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Binary Search"
                  className="w-full bg-[#0d0d14] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full bg-[#0d0d14] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all appearance-none"
                >
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">Code</label>
                <textarea
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Paste your code..."
                  rows={8}
                  className="w-full bg-[#0d0d14] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-mono resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">Tags</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="sorting, array, dp  (comma separated)"
                  className="w-full bg-[#0d0d14] border border-white/[0.07] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!form.title || !form.code}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20"
              >
                Save snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}