import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
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

  return (
    <div className="flex items-center justify-center gap-2 mt-10 p-2 rounded-2xl bg-base-100/50 backdrop-blur-sm border border-base-200/50 w-fit mx-auto shadow-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-base-content/70 hover:bg-base-content/10 hover:text-base-content disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 font-medium text-base-content/70 hover:bg-base-content/10 hover:text-base-content"
          >
            1
          </button>
          {startPage > 2 && <span className="px-1 text-base-content/40">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 font-semibold ${
            currentPage === page
              ? "bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105"
              : "text-base-content/70 hover:bg-base-content/10 hover:text-base-content"
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-1 text-base-content/40">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 font-medium text-base-content/70 hover:bg-base-content/10 hover:text-base-content"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 text-base-content/70 hover:bg-base-content/10 hover:text-base-content disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
