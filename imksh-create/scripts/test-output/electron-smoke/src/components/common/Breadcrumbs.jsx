import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
const Breadcrumbs = ({ items }) => {
  return /* @__PURE__ */ jsx("div", {
    className:
      "flex items-center gap-1.5 text-sm font-bold text-base-content/50 flex-wrap",
    children: items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      return /* @__PURE__ */ jsxs(
        React.Fragment,
        {
          children: [
            item.path && !isLast
              ? /* @__PURE__ */ jsx(Link, {
                  to: item.path,
                  onClick: item.onClick,
                  className:
                    "hover:text-primary transition-colors hidden sm:flex items-center gap-1",
                  children: item.label,
                })
              : item.onClick && !isLast
                ? /* @__PURE__ */ jsx("button", {
                    type: "button",
                    onClick: item.onClick,
                    className:
                      "hover:text-primary transition-colors hidden sm:flex items-center gap-1",
                    children: item.label,
                  })
                : /* @__PURE__ */ jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsx("span", {
                        className: isLast
                          ? "text-lg md:text-xl font-bold leading-tight text-base-content tracking-tight truncate max-w-[200px] md:max-w-none"
                          : "",
                        children: item.label,
                      }),
                      item.subtitle &&
                        /* @__PURE__ */ jsx("span", {
                          className:
                            "text-xs text-base-content/60 font-normal truncate",
                          children: item.subtitle,
                        }),
                    ],
                  }),
            !isLast &&
              /* @__PURE__ */ jsx(ChevronRight, {
                size: 14,
                className: "text-base-content/30 shrink-0 hidden sm:block",
              }),
          ],
        },
        idx,
      );
    }),
  });
};
export { Breadcrumbs };
