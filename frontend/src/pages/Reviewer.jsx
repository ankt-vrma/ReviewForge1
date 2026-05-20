import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import { Send, Code2 } from "lucide-react";

export default function Reviewer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    setMessages((prev) => [...prev, { role: "user", content: currentInput }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      setLoading(true);
      const res = await axios.post(
        `${API}/api/ai/review`,
        { prompt: currentInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { role: "bot", content: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: err.response?.data?.message || "Something went wrong." },
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
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="flex bg-[#0a0a0f] h-screen text-white">
      <Sidebar />
      <main className="ml-56 flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <div className="px-6 py-3.5 border-b border-white/[0.05] flex items-center gap-2.5 flex-shrink-0">
          <Code2 size={15} className="text-blue-400" />
          <span className="text-sm font-medium text-zinc-200">AI Code Reviewer</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-600">Gemini</span>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full pb-20 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Code2 size={22} className="text-blue-400" />
              </div>
              <p className="text-zinc-300 font-medium">Paste your code for a review</p>
              <p className="text-zinc-600 text-sm mt-1 max-w-xs">
                The AI will identify issues, explain them, and give you improved code.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4h10M3 8h7M3 12h5" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="13" cy="12" r="2" fill="#60A5FA"/>
                  </svg>
                </div>
              )}
              <div
                className={`max-w-3xl rounded-xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white px-4 py-3 rounded-br-sm"
                    : "bg-[#111118] border border-white/[0.06] text-zinc-300 px-4 py-3 rounded-bl-sm"
                }`}
              >
                {msg.role === "bot" ? (
                  <CodeBlock content={msg.content} />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-[13px]">{msg.content}</pre>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-400 text-[10px] font-bold">U</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 4h10M3 8h7M3 12h5" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round"/>
                  <circle cx="13" cy="12" r="2" fill="#60A5FA"/>
                </svg>
              </div>
              <div className="bg-[#111118] border border-white/[0.06] rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/[0.05] flex-shrink-0">
          <div className="flex gap-2.5 items-end bg-[#111118] border border-white/[0.07] rounded-xl px-4 py-3 focus-within:border-blue-500/40 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Paste your code here... (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="flex-1 bg-transparent outline-none resize-none text-sm text-zinc-200 placeholder-zinc-600 font-mono overflow-y-auto max-h-[160px] leading-relaxed"
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-8 h-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all shadow-lg shadow-blue-600/20"
            >
              <Send size={13} />
            </button>
          </div>
          <p className="text-xs text-zinc-700 mt-2 text-center">
            Powered by Google Gemini · Reviews are saved to your history
          </p>
        </div>
      </main>
    </div>
  );
}