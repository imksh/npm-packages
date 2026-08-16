"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { GitPullRequestArrow } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("main h2, main h3"));
    const newHeadings: Heading[] = elements.map((elem) => {
      let id = elem.id;
      const text = elem.textContent || "";
      if (!id) {
        id = slugify(text);
        elem.id = id;
      }
      return { id, text, level: Number(elem.tagName.charAt(1)) };
    });
    setHeadings(newHeadings);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );
    elements.forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-6 space-y-8">
      {/* On This Page */}
      <div className="space-y-3">
        <h4
          className="text-[11px] font-semibold uppercase tracking-widest px-1"
          style={{ color: "var(--muted-foreground)" }}
        >
          On This Page
        </h4>
        <div className="relative flex flex-col space-y-1">
          {/* Left track */}
          <div
            className="absolute left-0 top-0 bottom-0 w-px rounded-full"
            style={{ background: "var(--border)" }}
          />
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(`#${heading.id}`)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(heading.id);
                }}
                className={`relative transition-all duration-200 text-sm leading-snug ${
                  heading.level === 3 ? "pl-8 text-xs" : "pl-5"
                } ${
                  isActive
                    ? "font-semibold"
                    : "font-normal hover:text-foreground"
                }`}
                style={{
                  color: isActive ? "#818cf8" : "var(--muted-foreground)",
                  paddingTop: "4px",
                  paddingBottom: "4px",
                }}
              >
                {/* Active highlight bar */}
                {isActive && (
                  <span
                    className="absolute left-0 inset-y-0 w-px rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #6366f1, #8b5cf6)",
                    }}
                  />
                )}
                {heading.text}
              </a>
            );
          })}
        </div>
      </div>

      {/* Contributing card */}
      <div
        className="rounded-xl p-4 space-y-2.5"
        style={{
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{
              background: "rgba(99,102,241,0.15)",
            }}
          >
            <GitPullRequestArrow className="h-3.5 w-3.5" style={{ color: "#818cf8" }} />
          </div>
          <h4 className="font-semibold text-sm text-foreground">Contributing</h4>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Found an issue? Help improve these docs by opening a PR.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
          style={{ color: "#818cf8" }}
        >
          Open a Pull Request
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
