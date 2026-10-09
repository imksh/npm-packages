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

  // Desktop pagination: 5 pages with outer bounds & ellipsis
  const maxDesktopPages = 5;
  let startDesktopPage = Math.max(
    1,
    currentPage - Math.floor(maxDesktopPages / 2),
  );
  let endDesktopPage = Math.min(
    totalPages,
    startDesktopPage + maxDesktopPages - 1,
  );
  if (endDesktopPage - startDesktopPage + 1 < maxDesktopPages) {
    startDesktopPage = Math.max(1, endDesktopPage - maxDesktopPages + 1);
  }
  const desktopPages: number[] = [];
  for (let i = startDesktopPage; i <= endDesktopPage; i++) {
    desktopPages.push(i);
  }

  // Small screen pagination: exactly 3 page circles
  const maxMobilePages = 3;
  let startMobilePage = Math.max(
    1,
    currentPage - Math.floor(maxMobilePages / 2),
  );
  let endMobilePage = Math.min(
    totalPages,
    startMobilePage + maxMobilePages - 1,
  );
  if (endMobilePage - startMobilePage + 1 < maxMobilePages) {
    startMobilePage = Math.max(1, endMobilePage - maxMobilePages + 1);
  }
  const mobilePages: number[] = [];
  for (let i = startMobilePage; i <= endMobilePage; i++) {
    mobilePages.push(i);
  }

  const baseBtnClass =
    "relative inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-medium transition-all duration-200 rounded-full bg-base-100 hover:bg-base-200 text-base-content/70 hover:text-base-content focus:z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm";
  const activeBtnClass =
    "relative inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-bold transition-all duration-200 rounded-full border border-primary bg-primary text-primary-content z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm shadow-primary/20";
  const disabledBtnClass =
    "relative inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-1.5 sm:px-2 text-xs sm:text-sm font-medium transition-all duration-200 rounded-full bg-base-100 text-base-content/30 cursor-not-allowed shadow-sm";
  const ellipsisClass =
    "relative inline-flex items-center justify-center min-w-8 h-8 sm:min-w-9 sm:h-9 px-1 sm:px-2 text-xs sm:text-sm font-medium text-base-content/40 cursor-default";

  return (
    <>
      {/* Mobile / Small Screen: 3 page circles + ellipses + boundary pages */}
      <div className="flex sm:hidden items-center justify-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? disabledBtnClass : baseBtnClass}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startMobilePage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={baseBtnClass}
            >
              1
            </button>
            {startMobilePage > 2 && (
              <span className={ellipsisClass}>...</span>
            )}
          </>
        )}

        {mobilePages.map((page) => (
          <button
            key={`mobile-${page}`}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? activeBtnClass : baseBtnClass}
          >
            {page}
          </button>
        ))}

        {endMobilePage < totalPages && (
          <>
            {endMobilePage < totalPages - 1 && (
              <span className={ellipsisClass}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={baseBtnClass}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? disabledBtnClass : baseBtnClass}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Screen: 5 page circles + ellipses + boundary pages */}
      <div className="hidden sm:flex items-center justify-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? disabledBtnClass : baseBtnClass}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startDesktopPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={baseBtnClass}
            >
              1
            </button>
            {startDesktopPage > 2 && (
              <span className={ellipsisClass}>...</span>
            )}
          </>
        )}

        {desktopPages.map((page) => (
          <button
            key={`desktop-${page}`}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? activeBtnClass : baseBtnClass}
          >
            {page}
          </button>
        ))}

        {endDesktopPage < totalPages && (
          <>
            {endDesktopPage < totalPages - 1 && (
              <span className={ellipsisClass}>...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={baseBtnClass}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? disabledBtnClass : baseBtnClass}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default Pagination;
