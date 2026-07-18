"use client";

import * as React from "react";
import { useEffect, useState } from "react";

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
    // 1. Find all h2 and h3 elements inside the main content area
    const elements = Array.from(document.querySelectorAll("main h2, main h3"));
    
    // 2. Map elements to Heading objects and assign IDs if missing
    const newHeadings: Heading[] = elements.map((elem) => {
      let id = elem.id;
      const text = elem.textContent || "";
      if (!id) {
        id = slugify(text);
        elem.id = id;
      }
      return {
        id,
        text,
        level: Number(elem.tagName.charAt(1)), // 2 or 3
      };
    });
    
    setHeadings(newHeadings);

    // 3. Set up IntersectionObserver to highlight active link
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0% 0% -80% 0%" }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) {
    return null; // Don't render TOC if no headings found
  }

  return (
    <div className="sticky top-0 pt-4 space-y-12">
      <div className="space-y-4">
        <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-widest">
          On This Page
        </h4>
        <div className="flex flex-col space-y-3">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                className={`transition-colors pl-4 border-l-[2px] -ml-[2px] font-medium text-sm ${
                  isActive
                    ? "text-blue-500 border-blue-500"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
                } ${heading.level === 3 ? "pl-8 text-xs font-normal" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${heading.id}`)?.scrollIntoView({
                    behavior: "smooth",
                  });
                  setActiveId(heading.id);
                }}
              >
                {heading.text}
              </a>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5 shadow-sm space-y-3">
        <h4 className="font-semibold text-foreground text-sm">Contributing</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Found an issue? Help improve these docs.
        </p>
        <a href="#" className="text-xs text-blue-500 hover:underline flex items-center font-medium">
          Open a PR{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
