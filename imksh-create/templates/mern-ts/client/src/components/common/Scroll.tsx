import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollRestoration() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    if (navigationType === "POP") {
      main.scrollTop = positions.current.get(key) ?? 0;
    } else {
      main.scrollTop = 0;
    }

    return () => {
      positions.current.set(key, main.scrollTop);
    };
  }, [key, pathname, navigationType]);

  return null;
}