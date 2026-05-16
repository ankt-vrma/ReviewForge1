import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { Plus, Trash2, X } from "lucide-react";

const LANGUAGES = ["javascript", "python", "cpp", "java", "typescript", "go", "rust", "html", "css", "other"];

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
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar />
      <main className="ml-16 flex-1 flex">
        {/* List panel */}
        <div className="w-72 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <span className="font-semibold">Snippets</span>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 rounded-lg p-1.5 hover:bg-blue-700">
              <Plus size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {snippets.length === 0 && (
              <p className="text-gray-600 text-sm text-center mt-10">No snippets yet</p>
            )}
            {snippets.map((s) => (
              <div
                key={s._id}
                onClick={() => setSelected(s)}
                className={`p-3 rounded-lg cursor-pointer group flex justify-between items-start ${selected?._id === s._id ? "bg-blue-600" : "hover:bg-gray-800"}`}
              >
                <div>
                  <p className="text-sm font-medium truncate">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.language}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="flex-1 p-6">
          {selected ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selected.title}</h2>
                  <p className="text-gray-400 text-sm">{selected.language}</p>
                </div>
                {selected.tags?.length > 0 && (
                  <div className="flex gap-2">
                    {selected.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-auto text-sm text-gray-300 whitespace-pre-wrap">
                {selected.code}
              </pre>
            </>
          ) : (
            <div className="text-center text-gray-600 mt-24">
              <p className="text-4xl mb-3">📁</p>
              <p>Select a snippet to view it</p>
            </div>
          )}
        </div>
      </main>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">New Snippet</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none"
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
              <textarea
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="Paste your code..."
                rows={8}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none resize-none font-mono text-sm"
              />
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Tags (comma separated)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">Save Snippet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}