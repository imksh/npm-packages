import React, { useEffect, useRef } from "react";
import { Pagination } from "./Pagination";

export interface TableColumn<T = Record<string, unknown>> {
  header: React.ReactNode | string;
  accessor?: keyof T | string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  headerClass?: string;
}

interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: ((row: T) => void) | null;
  emptyMessage?: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: ((page: number) => void) | null;
  wrapperClassName?: string;
  renderCard?: (row: T, index: number) => React.ReactNode;
  pagination?: boolean; // if true, uses load more/infinite scroll on mobile
  header?: React.ReactNode; // custom header content to render above the table
}

const Table = <T extends Record<string, unknown>>({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
  emptyMessage = "No data available",
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
  wrapperClassName = "",
  renderCard,
  pagination = false,
  header,
}: TableProps<T>) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pagination || !onPageChange || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onPageChange(currentPage + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [pagination, onPageChange, currentPage, totalPages]);

  return (
    <div
      className={`flex flex-col w-full h-full md:border md:border-base-300 rounded-xl overflow-hidden bg-base-100  ${wrapperClassName}`}
    >
      {/* Optional Custom Header Area */}
      {header && (
        <div className="shrink-0 bg-base-100 border-b border-base-300">
          {header}
        </div>
      )}

      {/* Desktop Table View (hidden on mobile if renderCard provided) */}
      <div
        className={`overflow-auto w-full flex-1 ${renderCard ? "hidden md:block" : "block"}`}
      >
        <table className="table table-hover w-full min-w-full relative border-collapse">
          <thead className="bg-base-200 backdrop-blur sticky top-0 z-10 border-b border-base-300">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={(col.accessor as string) || index}
                  className={`px-6 py-4 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider bg-transparent border-none ${col.headerClass || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/60 bg-base-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                  {columns.map((col, colIndex) => {
                    const isRight = col.headerClass?.includes("text-right");
                    const isFirst = colIndex === 0;
                    const isLast = colIndex === columns.length - 1;
                    const headerText =
                      typeof col.header === "string"
                        ? col.header.toLowerCase()
                        : "";

                    return (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap align-middle border-none ${col.headerClass || ""}`}
                      >
                        {isRight ||
                        (isLast && headerText.includes("action")) ? (
                          <div className="flex justify-end items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-base-300/80"></div>
                            <div className="w-7 h-7 rounded-lg bg-base-300/80"></div>
                          </div>
                        ) : headerText.includes("assigned") ? (
                          <div className="h-6 w-28 rounded-md bg-base-200 border border-base-300/80"></div>
                        ) : isFirst ? (
                          <div className="space-y-1.5">
                            <div
                              className="h-4 bg-base-300/80 rounded"
                              style={{
                                width: `${65 + (rowIndex % 3) * 15}%`,
                                maxWidth: "140px",
                              }}
                            ></div>
                            <div
                              className="h-3 bg-base-200 rounded"
                              style={{
                                width: `${40 + (rowIndex % 2) * 15}%`,
                                maxWidth: "90px",
                              }}
                            ></div>
                          </div>
                        ) : (
                          <div
                            className={`h-4 bg-base-300/70 rounded ${isRight ? "ml-auto" : ""}`}
                            style={{
                              width: `${50 + ((rowIndex + colIndex) % 4) * 12}%`,
                              maxWidth: "160px",
                            }}
                          ></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-all duration-200 group ${
                    onRowClick
                      ? "cursor-pointer hover:bg-base-200/30"
                      : "hover:bg-base-200/10"
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const value = col.accessor
                      ? row[col.accessor as string]
                      : undefined;
                    return (
                      <td
                        key={(col.accessor as string) || colIndex}
                        className="px-6 py-4 text-[13px] text-base-content/80 whitespace-nowrap align-middle border-none"
                      >
                        {col.render ? col.render(value, row, rowIndex) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-base-content/60"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">📁</span>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (only visible if renderCard provided) */}
      {renderCard && (
        <div className="md:hidden flex flex-col divide-y divide-base-200 overflow-y-auto flex-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`card-skeleton-${i}`}
                className="p-4 flex flex-col gap-3 animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4.5 bg-base-300/80 rounded w-36"></div>
                    <div className="h-3 bg-base-200 rounded w-24"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-base-300/80"></div>
                    <div className="w-7 h-7 rounded-lg bg-base-300/80"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 bg-base-200 rounded w-48"></div>
                  <div className="h-3.5 bg-base-200 rounded w-32"></div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-base-200">
                  <div className="h-3 bg-base-200 rounded w-20"></div>
                  <div className="h-6 bg-base-300/80 rounded-lg w-28"></div>
                </div>
              </div>
            ))
          ) : data.length > 0 ? (
            <>
              {data.map((row, index) => (
                <div
                  key={row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {renderCard(row, index)}
                </div>
              ))}
              {pagination && currentPage < totalPages && (
                <div ref={observerTarget} className="p-6 flex justify-center">
                  <span className="loading loading-spinner loading-sm text-primary"></span>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-sm text-base-content/60 flex flex-col items-center gap-2">
              <span className="text-2xl">📁</span>
              <span>{emptyMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* Desktop Pagination / Load More Footer */}
      {pagination && onPageChange && totalPages > 1 && (
        <div
          className={`border-t border-base-300 px-6 py-4 bg-base-200/30 flex items-center shrink-0 ${renderCard ? "hidden md:flex justify-between" : "justify-between"}`}
        >
          <div className="text-xs text-base-content/75 font-medium">
            Showing <span className="font-bold">{data.length}</span> items
          </div>
          <div className="flex gap-2">
            {currentPage < totalPages && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                className="btn btn-sm btn-outline btn-primary rounded-lg text-xs"
              >
                Load More
              </button>
            )}
          </div>
        </div>
      )}

      {/* Standard Pagination (if pagination prop is not true) */}
      {!pagination && onPageChange && totalPages > 0 && (
        <div className="border-t border-base-300 px-3 sm:px-6 py-2.5 sm:py-4 bg-base-200/30 flex items-center justify-between shrink-0 mt-auto gap-2">
          <div className="text-xs text-base-content/75 font-medium whitespace-nowrap">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
