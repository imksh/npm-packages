"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "@/config/docs";
import { ThemeSwitcher } from "./theme-switcher";
import { Search } from "lucide-react";
import { FaGithub } from "react-icons/fa"
import { SearchDialog } from "./search-dialog";

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b! border-base-300 bg-panel">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4 gap-4">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-xs">
              I
            </div>
            <span className="hidden font-bold sm:inline-block">
              Imksh UI
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              v1.4
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {docsConfig.mainNav.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href.split('/').slice(0, 3).join('/')));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-foreground whitespace-nowrap ${isActive ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Middle/Right: Spacer to push everything else to the end if space permits */}
        <div className="flex ml-auto border border-base-300 rounded-xl p-2 items-center justify-end">
          <button 
            onClick={() => setSearchOpen(true)}
            className="inline-flex gap-8 items-center justify-between rounded-md bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted/80 hover:text-foreground w-full sm:w-[240px] lg:w-[280px]"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate">Search docs...</span>
            </div>
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 shrink-0">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeSwitcher />
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
          >
            <FaGithub className="mr-2 h-4 w-4 shrink-0" />
            <span className="hidden sm:inline-block">GitHub</span>
            <span className="hidden sm:inline-block ml-2 rounded-md bg-muted/50 px-1.5 py-0.5 text-xs text-muted-foreground">
              12.4k
            </span>
          </Link>
        </div>
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
