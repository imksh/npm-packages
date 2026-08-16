import { jsx, jsxs } from "react/jsx-runtime";
import TableSkeleton from "../skeletons/common/TableSkeleton";
const Table = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
  emptyMessage = "No data available",
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
}) => {
  if (loading) {
    return /* @__PURE__ */ jsx(TableSkeleton, {
      rows: 5,
      columns: columns.length || 4,
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className:
      "flex flex-col w-full border border-base-300 rounded-xl overflow-hidden bg-base-100 shadow",
    children: [
      /* @__PURE__ */ jsx("div", {
        className: "overflow-x-auto w-full",
        children: /* @__PURE__ */ jsxs("table", {
          className: "table table-hover w-full min-w-full",
          children: [
            /* @__PURE__ */ jsx("thead", {
              className: "bg-base-200/60 border-b border-base-300",
              children: /* @__PURE__ */ jsx("tr", {
                children: columns.map((col, index) =>
                  /* @__PURE__ */ jsx(
                    "th",
                    {
                      className:
                        "px-6 py-4 text-left text-xs font-bold text-base-content/80 uppercase tracking-wider",
                      children: col.header,
                    },
                    col.accessor || index,
                  ),
                ),
              }),
            }),
            /* @__PURE__ */ jsx("tbody", {
              className: "divide-y divide-base-300 bg-base-100",
              children:
                data.length > 0
                  ? data.map((row, rowIndex) =>
                      /* @__PURE__ */ jsx(
                        "tr",
                        {
                          onClick: () => onRowClick && onRowClick(row),
                          className: `transition-colors duration-150 ${onRowClick ? "cursor-pointer hover:bg-base-200" : ""}`,
                          children: columns.map((col, colIndex) => {
                            const value = col.accessor
                              ? row[col.accessor]
                              : void 0;
                            return /* @__PURE__ */ jsx(
                              "td",
                              {
                                className:
                                  "px-6 py-4 text-sm text-base-content/90 whitespace-nowrap align-middle",
                                children: col.render
                                  ? col.render(value, row, rowIndex)
                                  : value,
                              },
                              col.accessor || colIndex,
                            );
                          }),
                        },
                        row.id || rowIndex,
                      ),
                    )
                  : /* @__PURE__ */ jsx("tr", {
                      children: /* @__PURE__ */ jsx("td", {
                        colSpan: columns.length,
                        className:
                          "px-6 py-12 text-center text-sm text-base-content/60",
                        children: /* @__PURE__ */ jsxs("div", {
                          className:
                            "flex flex-col items-center justify-center gap-2",
                          children: [
                            /* @__PURE__ */ jsx("span", {
                              className: "text-2xl",
                              children: "\u{1F4C1}",
                            }),
                            /* @__PURE__ */ jsx("span", {
                              children: emptyMessage,
                            }),
                          ],
                        }),
                      }),
                    }),
            }),
          ],
        }),
      }),
      totalPages > 1 &&
        onPageChange &&
        /* @__PURE__ */ jsxs("div", {
          className:
            "border-t border-base-300 px-6 py-4 bg-base-200/30 flex items-center justify-between shrink-0",
          children: [
            /* @__PURE__ */ jsxs("div", {
              className: "text-xs text-base-content/75 font-medium",
              children: [
                "Page ",
                /* @__PURE__ */ jsx("span", {
                  className: "font-bold",
                  children: currentPage,
                }),
                " of",
                " ",
                /* @__PURE__ */ jsx("span", {
                  className: "font-bold",
                  children: totalPages,
                }),
              ],
            }),
            /* @__PURE__ */ jsxs("div", {
              className: "flex gap-2",
              children: [
                /* @__PURE__ */ jsx("button", {
                  onClick: () => onPageChange(currentPage - 1),
                  disabled: currentPage <= 1,
                  className: "btn btn-sm btn-outline rounded-lg text-xs",
                  children: "Previous",
                }),
                /* @__PURE__ */ jsx("button", {
                  onClick: () => onPageChange(currentPage + 1),
                  disabled: currentPage >= totalPages,
                  className: "btn btn-sm btn-outline rounded-lg text-xs",
                  children: "Next",
                }),
              ],
            }),
          ],
        }),
    ],
  });
};
var Table_default = Table;
export { Table_default as default };
