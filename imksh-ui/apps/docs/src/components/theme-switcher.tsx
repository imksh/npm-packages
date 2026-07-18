"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Palette, Check } from "lucide-react";

const themes = [
  { name: "Light", value: "light", icon: Sun },
  { name: "Dark", value: "dark", icon: Moon },
  { name: "Cyberpunk", value: "cyberpunk", icon: Palette },
  { name: "Forest", value: "forest", icon: Palette },
  { name: "Aqua", value: "aqua", icon: Palette },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = React.useState(false);

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

  if (!mounted) {
    return (
      <div className="relative">
        <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-9 px-3 border border-border/40 bg-background/50 backdrop-blur-sm opacity-50 cursor-not-allowed">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline-block capitalize">Theme</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground h-9 px-3 border border-border/40 bg-background/50 backdrop-blur-sm"
      >
        <Palette className="h-4 w-4" />
        <span className="hidden sm:inline-block capitalize">{theme || "Theme"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border border-border bg-background shadow-md z-50 overflow-hidden">
          <div className="p-1">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setTheme(t.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground ${
                  theme === t.value ? "bg-muted/50 text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <t.icon className="h-4 w-4" />
                  <span>{t.name}</span>
                </div>
                {theme === t.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
