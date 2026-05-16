import { useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import { Send } from "lucide-react";

export default function Reviewer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);

  const { token } = useAuth();

  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentInput },
    ]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API}/api/ai/review`,
        { prompt: currentInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: res.data.response,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            err.response?.data?.message || "Error getting review",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height =
      Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="flex bg-gray-950 h-screen text-white">
      <Sidebar />

      <main className="ml-16 flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-800 font-semibold">
          AI Code Reviewer
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-600 mt-20">
              <p className="text-4xl mb-3">💬</p>
              <p>Paste your code and get an instant review.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-3xl p-4 rounded-xl ${
                msg.role === "user"
                  ? "bg-blue-600 ml-auto"
                  : "bg-gray-800"
              }`}
            >
              {msg.role === "bot" ? (
                <CodeBlock content={msg.content} />
              ) : (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm">
                  {msg.content}
                </pre>
              )}
            </div>
          ))}

          {loading && (
            <div className="bg-gray-800 p-3 rounded-xl w-fit text-gray-400 text-sm">
              Reviewing...
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste your code here..."
            rows={1}
            className="flex-1 p-3 rounded-lg bg-gray-800 outline-none resize-none overflow-y-auto max-h-[150px] text-sm"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}