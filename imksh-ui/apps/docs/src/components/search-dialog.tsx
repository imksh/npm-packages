"use client";

import * as React from "react";
import { Search, FileText, Component, Command, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ALL_RESULTS = [
  { title: "Introduction", href: "/docs/introduction", icon: FileText, category: "Documentation" },
  { title: "Installation", href: "/docs/installation", icon: Command, category: "Documentation" },
  { title: "CLI", href: "/docs/cli", icon: Command, category: "Documentation" },
  { title: "Changelog", href: "/docs/changelog", icon: FileText, category: "Documentation" },
  { title: "Button", href: "/docs/components/button", icon: Component, category: "Components" },
  { title: "Badge", href: "/docs/components/badge", icon: Component, category: "Components" },
  { title: "Avatar", href: "/docs/components/avatar", icon: Component, category: "Components" },
  { title: "Card", href: "/docs/components/card", icon: Component, category: "Components" },
  { title: "Input", href: "/docs/components/input", icon: Component, category: "Components" },
  { title: "Checkbox", href: "/docs/components/checkbox", icon: Component, category: "Components" },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = ALL_RESULTS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped = results.reduce<Record<string, typeof results>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[activeIndex]) {
      onOpenChange(false);
      router.push(flatResults[activeIndex].href);
    }
  };

  if (!open) return null;

  let flatIdx = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: "rgba(10,10,24,0.95)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 0 0 1px rgba(99,102,241,0.2), 0 25px 50px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.08)",
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(139,92,246,0.7), transparent)",
          }}
        />

        {/* Search input */}
        <div
          className="flex items-center px-4 py-3 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Search className="mr-3 h-4 w-4 shrink-0" style={{ color: "rgba(129,140,248,0.8)" }} />
          <input
            ref={inputRef}
            autoFocus
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none focus:ring-0"
            placeholder="Search docs..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{ color: "var(--foreground)" }}
          />
          <kbd
            className="pointer-events-none inline-flex h-5 select-none items-center rounded px-1.5 font-mono text-[10px] font-medium shrink-0"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--muted-foreground)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[360px] overflow-y-auto p-2">
          {flatResults.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div
                    className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(129,140,248,0.6)" }}
                  >
                    {category}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {items.map((result) => {
                      const currentIdx = flatIdx++;
                      const isActive = activeIndex === currentIdx;
                      return (
                        <button
                          key={result.href}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors focus:outline-none"
                          style={{
                            background: isActive
                              ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))"
                              : "transparent",
                            color: isActive ? "#c7d2fe" : "var(--muted-foreground)",
                            border: isActive
                              ? "1px solid rgba(99,102,241,0.2)"
                              : "1px solid transparent",
                          }}
                          onMouseEnter={() => setActiveIndex(currentIdx)}
                          onClick={() => {
                            onOpenChange(false);
                            router.push(result.href);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-md shrink-0"
                              style={{
                                background: isActive
                                  ? "rgba(99,102,241,0.2)"
                                  : "rgba(255,255,255,0.05)",
                              }}
                            >
                              <result.icon
                                className="h-3.5 w-3.5"
                                style={{ color: isActive ? "#818cf8" : "var(--muted-foreground)" }}
                              />
                            </div>
                            <span className="font-medium text-sm" style={{ color: isActive ? "#e2e8f0" : "var(--foreground)" }}>
                              {result.title}
                            </span>
                          </div>
                          {isActive && (
                            <ArrowRight className="h-3.5 w-3.5 shrink-0" style={{ color: "#818cf8" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div
          className="flex items-center gap-4 px-4 py-2 border-t text-[11px]"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(255,255,255,0.02)",
            color: "var(--muted-foreground)",
          }}
        >
          <span className="flex items-center gap-1">
            <kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded px-1 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
