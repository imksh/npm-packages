"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "@/config/docs";

import { ChevronDown, Box, LayoutGrid } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {docsConfig.sidebarNav.map((item, index) => (
        <div key={index} className="pb-8">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {index === 0 ? <Box className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
              {item.title}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
          </div>
          {item.items?.length && (
            <div className="grid grid-flow-row auto-rows-max text-sm space-y-1">
              {item.items.map((subItem, index) => {
                const isActive = pathname === subItem.href || (pathname === '/' && subItem.href === '/');
                return (
                  <Link
                    key={index}
                    href={subItem.href}
                    className={`group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-blue-500/10 text-blue-500 relative"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-3 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    )}
                    <span className={isActive ? "ml-4" : ""}>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
