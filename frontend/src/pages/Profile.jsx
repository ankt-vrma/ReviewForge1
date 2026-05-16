import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Profile() {
  const { user, token, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSave = async () => {
    const res = await axios.put(
      `${API}/api/user/profile`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    login({ ...user, name: res.data.name }, token);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex bg-gray-950 min-h-screen text-white">
      <Sidebar />
      <main className="ml-16 flex-1 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-8">Profile</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-500 outline-none cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}