"use client";

import * as React from "react";
import { Search, Command, FileText, Component } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const results = [
    { title: "Introduction", href: "/docs/introduction", icon: FileText, category: "Documentation" },
    { title: "Installation", href: "/docs/installation", icon: Command, category: "Documentation" },
    { title: "Button", href: "/docs/components/button", icon: Component, category: "Components" },
    { title: "Badge", href: "/docs/components/badge", icon: Component, category: "Components" },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] sm:pt-[10vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)} 
      />
      
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-panel shadow-2xl animate-in fade-in zoom-in-95 duration-200 mx-4">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="mr-2 h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none focus:ring-0"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onOpenChange(false);
            }}
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shrink-0">
            ESC
          </kbd>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-14 text-center text-sm text-muted-foreground">
              No results found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, i) => (
                <button
                  key={i}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors focus:bg-muted focus:outline-none"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(result.href);
                  }}
                >
                  <result.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{result.title}</span>
                    <span className="text-[10px] text-muted-foreground">{result.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
