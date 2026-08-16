"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "@/config/docs";
import { Sparkles, Layers } from "lucide-react";

const SECTION_ICONS = [Sparkles, Layers];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full py-2">
      {docsConfig.sidebarNav.map((item, index) => {
        const Icon = SECTION_ICONS[index % SECTION_ICONS.length];
        return (
          <div key={index} className="pb-6">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-2 px-3 py-1">
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(99,102,241,0.7)" }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "var(--muted-foreground)" }}
              >
                {item.title}
              </span>
            </div>

            {/* Nav items */}
            {item.items?.length && (
              <div className="grid grid-flow-row auto-rows-max text-sm space-y-0.5">
                {item.items.map((subItem, i) => {
                  const isActive =
                    pathname === subItem.href ||
                    (pathname === "/" && subItem.href === "/");
                  return (
                    <Link
                      key={i}
                      href={subItem.href}
                      className="relative group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150"
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
                              color: "#818cf8",
                            }
                          : {
                              color: "var(--muted-foreground)",
                            }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "var(--foreground)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLAnchorElement).style.background =
                            "transparent";
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            "var(--muted-foreground)";
                        }
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 inset-y-1 w-0.5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(180deg, #6366f1, #8b5cf6)",
                          }}
                        />
                      )}
                      <span className={isActive ? "ml-2" : ""}>{subItem.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
