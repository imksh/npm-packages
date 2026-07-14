"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const positions = useRef(new Map());

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    // A simple scroll to top on navigation
    main.scrollTop = 0;
  }, [pathname]);

  return null;
}