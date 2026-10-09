"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "@/config/docs";
import { ThemeSwitcher } from "./theme-switcher";
import { Search } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SearchDialog } from "./search-dialog";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "rgba(var(--background-rgb, 6,6,17), 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Subtle top gradient line */}
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent)",
          }}
        />

        <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-sm shadow-lg transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 0 12px rgba(99,102,241,0.4)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="currentColor" opacity="0.9"/>
              </svg>
            </div>
            <span className="hidden font-semibold sm:inline-block text-sm tracking-tight">
              Imksh UI
            </span>
            <span
              className="hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "#818cf8",
              }}
            >
              v1.4
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium ml-2">
            {docsConfig.mainNav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" &&
                  pathname.startsWith(
                    item.href.split("/").slice(0, 3).join("/")
                  ));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {item.title}
                  {isActive && (
                    <span
                      className="absolute inset-x-1 -bottom-px h-px rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:inline-flex items-center justify-between rounded-lg text-sm text-muted-foreground transition-all w-[220px] lg:w-[260px] px-3 py-1.5 gap-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.border =
                "1px solid rgba(99,102,241,0.4)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(99,102,241,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.border =
                "1px solid rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate text-xs">Search docs...</span>
            </div>
            <kbd
              className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded px-1.5 font-mono text-[10px] font-medium shrink-0"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--muted-foreground)",
              }}
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ThemeSwitcher />
            <a
              href="https://github.com/imksh"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
            >
              <FaGithub className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline-block text-xs">GitHub</span>
            </a>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
