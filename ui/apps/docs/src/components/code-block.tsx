"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
  language?: string;
  fileName?: string;
  showHeader?: boolean;
}

export function CodeBlock({
  code,
  className,
  language = "tsx",
  fileName,
  showHeader = false,
  ...props
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden"
      style={{
        background: "#0d1117",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Gradient border overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          padding: "1px",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.15), transparent 60%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Optional file header */}
      {(showHeader || fileName) && (
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
            </div>
            {fileName && (
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {fileName}
              </span>
            )}
          </div>
          {language && (
            <span
              className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                background: "rgba(99,102,241,0.15)",
                color: "rgba(129,140,248,0.8)",
              }}
            >
              {language}
            </span>
          )}
        </div>
      )}

      {/* Copy button */}
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center rounded-md h-7 w-7 transition-colors"
          style={{
            background: hasCopied
              ? "rgba(34,197,94,0.15)"
              : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: hasCopied ? "#22c55e" : "rgba(255,255,255,0.6)",
          }}
          title="Copy code"
        >
          {hasCopied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span className="sr-only">Copy code</span>
        </button>
      </div>

      {/* Code */}
      <pre
        className={`overflow-x-auto p-4 text-sm leading-relaxed ${className || ""}`}
        style={{ color: "#e2e8f0", margin: 0, background: "transparent" }}
        {...props}
      >
        <code style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
          {code}
        </code>
      </pre>
    </div>
  );
}
