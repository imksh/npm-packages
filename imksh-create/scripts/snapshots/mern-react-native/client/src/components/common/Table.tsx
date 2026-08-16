import React from "react";
import TableSkeleton from "../skeletons/common/TableSkeleton";

export interface TableColumn<T = any> {
  header: string;
  accessor?: keyof T | string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: ((row: T) => void) | null;
  emptyMessage?: React.ReactNode;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: ((page: number) => void) | null;
}

const Table = <T extends Record<string, any>>({
  columns = [],
  data = [],
  loading = false,
  onRowClick = null,
  emptyMessage = "No data available",
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
}: TableProps<T>) => {
  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length || 4} />;
  }

  return (
    <div className="flex flex-col w-full border border-base-300 rounded-xl overflow-hidden bg-base-100 shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="table table-hover w-full min-w-full">
          <thead className="bg-base-200/60 border-b border-base-300">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={(col.accessor as string) || index}
                  className="px-6 py-4 text-left text-xs font-bold text-base-content/80 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300 bg-base-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer hover:bg-base-200" : ""
                  }`}
                >
                  {columns.map((col, colIndex) => {
                    const value = col.accessor ? row[col.accessor as string] : undefined;
                    return (
                      <td
                        key={(col.accessor as string) || colIndex}
                        className="px-6 py-4 text-sm text-base-content/90 whitespace-nowrap align-middle"
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
      {totalPages > 1 && onPageChange && (
        <div className="border-t border-base-300 px-6 py-4 bg-base-200/30 flex items-center justify-between shrink-0">
          <div className="text-xs text-base-content/75 font-medium">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn btn-sm btn-outline rounded-lg text-xs"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn btn-sm btn-outline rounded-lg text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
