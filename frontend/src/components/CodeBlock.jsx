import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match?.[1] || "javascript"}
              PreTag="div"
              customStyle={{
                margin: "12px 0",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "12.5px",
                background: "#0d0d14",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-white/[0.07] text-blue-300 px-1.5 py-0.5 rounded text-[12px] font-mono">
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-3 last:mb-0 leading-relaxed text-zinc-300">{children}</p>;
        },
        h1({ children }) {
          return <h1 className="text-base font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-sm font-semibold text-white mb-2 mt-4 first:mt-0">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-sm font-medium text-zinc-200 mb-1.5 mt-3 first:mt-0">{children}</h3>;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside space-y-1 mb-3 text-zinc-400 text-sm">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside space-y-1 mb-3 text-zinc-400 text-sm">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-zinc-400">{children}</li>;
        },
        strong({ children }) {
          return <strong className="text-zinc-200 font-semibold">{children}</strong>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-2 border-blue-500/40 pl-3 text-zinc-500 italic my-2">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}