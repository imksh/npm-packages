"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
}

export function CodeBlock({ code, className, ...props }: CodeBlockProps) {
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
    <div className="relative group rounded-lg overflow-hidden bg-[#1e1e1e] border border-border">
      <div className="absolute right-4 top-4 z-10 flex h-8 items-center gap-2">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 text-zinc-100 hover:bg-zinc-700/50"
        >
          {hasCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </button>
      </div>
      <pre
        className={`overflow-x-auto p-4 text-sm text-zinc-50 ${className || ""}`}
        {...props}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
