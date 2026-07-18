"use client";

import * as React from "react";
import { CodeBlock } from "./code-block";
import { Code, Copy, Check } from "lucide-react";

interface ComponentPreviewProps {
  preview: React.ReactNode;
  code: string;
  controls?: React.ReactNode;
  fileName?: string;
}

export function ComponentPreview({ preview, code, controls, fileName = "component.tsx" }: ComponentPreviewProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-8 flex flex-col rounded-xl border border-border bg-base-100 shadow-md overflow-hidden">
      
      {/* Description / Header (if any) could go here, but usually it's just the preview */}
      <div className="relative flex min-h-[350px] w-full items-center justify-center p-10 bg-base-200">
        {/* Dot matrix background pattern */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--color-base-content)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-base-content)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.05]"></div>
        
        {/* Center Glow */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500/20 opacity-20 blur-[100px]"></div>
        
        <div className="relative z-10 w-full flex items-center justify-center">
          {preview}
        </div>
      </div>

      {/* Controls Section (Dynamic) */}
      {controls && (
        <div className="border-t border-border bg-base-300 p-6 text-sm">
          {controls}
        </div>
      )}

      {/* Code Toggle Bar */}
      <div className="border-t border-border bg-base-300 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Code className="h-4 w-4" />
          {showCode ? "Hide code" : "Show code"}
        </button>
      </div>

      {/* Code Block */}
      {showCode && (
        <div className="border-t border-border bg-base-100">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-base-200">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs font-medium text-muted-foreground">{fileName}</span>
            </div>
            <button
              onClick={onCopy}
              className="flex items-center justify-center h-6 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <div className="p-4 text-sm [&_pre]:my-0 [&_pre]:max-h-[450px] [&_pre]:overflow-auto">
            <CodeBlock code={code} className="bg-transparent !p-0 border-none" />
          </div>
        </div>
      )}
    </div>
  );
}
