"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Palette, Check } from "lucide-react";

const themes = [
  { name: "System", value: "system", icon: Monitor, swatch: null },
  { name: "Light", value: "light", icon: Sun, swatch: "#f8fafc" },
  { name: "Dark", value: "dark", icon: Moon, swatch: "#060611" },
  { name: "Cyberpunk", value: "cyberpunk", icon: Palette, swatch: "#ff00ff" },
  { name: "Forest", value: "forest", icon: Palette, swatch: "#166534" },
  { name: "Aqua", value: "aqua", icon: Palette, swatch: "#0ea5e9" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground opacity-50 cursor-not-allowed"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150"
        style={{
          background: isOpen ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.04)",
          border: isOpen
            ? "1px solid rgba(99,102,241,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          color: isOpen ? "#818cf8" : "var(--muted-foreground)",
        }}
        title="Switch theme"
      >
        <currentTheme.icon className="h-4 w-4" />
        <span className="hidden sm:inline-block text-xs capitalize">
          {currentTheme.name}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl overflow-hidden animate-slide-in"
          style={{
            background: "rgba(10,10,24,0.97)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)",
            backdropFilter: "blur(16px)",
            zIndex: 60,
          }}
        >
          {/* Top gradient line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)",
            }}
          />
          <div className="p-1.5">
            {themes.map((t) => {
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => {
                    setTheme(t.value);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))"
                      : "transparent",
                    color: isActive ? "#c7d2fe" : "var(--muted-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(255,255,255,0.04)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--foreground)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--muted-foreground)";
                    }
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Color swatch */}
                    {t.swatch ? (
                      <div
                        className="h-4 w-4 rounded-full border shrink-0"
                        style={{
                          background: t.swatch,
                          borderColor: isActive
                            ? "rgba(99,102,241,0.4)"
                            : "rgba(255,255,255,0.15)",
                          boxShadow: isActive ? `0 0 6px ${t.swatch}66` : "none",
                        }}
                      />
                    ) : (
                      <t.icon
                        className="h-4 w-4 shrink-0"
                        style={{ color: isActive ? "#818cf8" : "inherit" }}
                      />
                    )}
                    <span className="font-medium text-xs">{t.name}</span>
                  </div>
                  {isActive && (
                    <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#818cf8" }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
