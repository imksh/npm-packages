import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronLeft, ChevronRight } from "lucide-react";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return /* @__PURE__ */ jsxs("div", {
    className:
      "flex items-center justify-center gap-2 mt-10 p-2 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-200/50 w-fit mx-auto shadow-sm",
    children: [
      /* @__PURE__ */ jsx("button", {
        onClick: () => onPageChange(currentPage - 1),
        disabled: currentPage === 1,
        className:
          "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-base-content/70 hover:bg-base-content/10 hover:text-base-content disabled:opacity-30 disabled:hover:bg-transparent",
        "aria-label": "Previous Page",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
      }),
      startPage > 1 &&
        /* @__PURE__ */ jsxs(Fragment, {
          children: [
            /* @__PURE__ */ jsx("button", {
              onClick: () => onPageChange(1),
              className:
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 font-medium text-base-content/70 hover:bg-base-content/10 hover:text-base-content",
              children: "1",
            }),
            startPage > 2 &&
              /* @__PURE__ */ jsx("span", {
                className: "px-1 text-base-content/40",
                children: "...",
              }),
          ],
        }),
      pages.map((page) =>
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onPageChange(page),
            className: `flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 font-semibold ${currentPage === page ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105" : "text-base-content/70 hover:bg-base-content/10 hover:text-base-content"}`,
            children: page,
          },
          page,
        ),
      ),
      endPage < totalPages &&
        /* @__PURE__ */ jsxs(Fragment, {
          children: [
            endPage < totalPages - 1 &&
              /* @__PURE__ */ jsx("span", {
                className: "px-1 text-base-content/40",
                children: "...",
              }),
            /* @__PURE__ */ jsx("button", {
              onClick: () => onPageChange(totalPages),
              className:
                "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 font-medium text-base-content/70 hover:bg-base-content/10 hover:text-base-content",
              children: totalPages,
            }),
          ],
        }),
      /* @__PURE__ */ jsx("button", {
        onClick: () => onPageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        className:
          "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-base-content/70 hover:bg-base-content/10 hover:text-base-content disabled:opacity-30 disabled:hover:bg-transparent",
        "aria-label": "Next Page",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" }),
      }),
    ],
  });
};
export { Pagination };
