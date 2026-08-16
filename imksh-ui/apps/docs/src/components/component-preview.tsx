"use client";

import * as React from "react";
import { CodeBlock } from "./code-block";
import { ChevronDown, Copy, Check } from "lucide-react";

interface ComponentPreviewProps {
  preview: React.ReactNode;
  code: string;
  controls?: React.ReactNode;
  fileName?: string;
}

export function ComponentPreview({
  preview,
  code,
  controls,
  fileName = "component.tsx",
}: ComponentPreviewProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="relative my-8 flex flex-col rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      {/* Gradient border top accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)",
        }}
      />

      {/* Preview area */}
      <div
        className="relative flex min-h-[320px] w-full items-center justify-center p-10 overflow-hidden"
        style={{ background: "var(--muted)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.08), transparent)",
          }}
        />

        {/* Component */}
        <div className="relative z-10 w-full flex items-center justify-center">
          {preview}
        </div>
      </div>

      {/* Controls section */}
      {controls && (
        <div
          className="border-t p-5 text-sm"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {controls}
        </div>
      )}

      {/* Code toggle bar */}
      <div
        className="border-t px-4 py-2.5 flex items-center justify-between"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2 text-xs font-medium transition-colors"
          style={{ color: "var(--muted-foreground)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
          }}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${showCode ? "rotate-180" : ""}`}
          />
          {showCode ? "Hide code" : "View code"}
        </button>
        {showCode && (
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded-md"
            style={{
              color: copied ? "#22c55e" : "var(--muted-foreground)",
              background: copied ? "rgba(34,197,94,0.1)" : "transparent",
            }}
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </button>
        )}
      </div>

      {/* Code block */}
      {showCode && (
        <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {/* Mac window chrome */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "#0d1117",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {fileName}
              </span>
            </div>
          </div>
          <div className="[&_pre]:my-0 [&_pre]:max-h-[420px] [&_pre]:overflow-auto [&_.relative]:rounded-none [&_.relative]:border-0 [&_.relative]:shadow-none">
            <CodeBlock code={code} className="bg-transparent !p-0 border-none" />
          </div>
        </div>
      )}
    </div>
  );
}
