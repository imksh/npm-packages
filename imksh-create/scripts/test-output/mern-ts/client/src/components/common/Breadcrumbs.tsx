import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: React.ReactNode;
  path?: string;
  subtitle?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-base-content/50 flex-wrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.path && !isLast ? (
              <Link to={item.path} onClick={item.onClick} className="hover:text-primary transition-colors hidden sm:flex items-center gap-1">
                {item.label}
              </Link>
            ) : item.onClick && !isLast ? (
              <button type="button" onClick={item.onClick} className="hover:text-primary transition-colors hidden sm:flex items-center gap-1">
                {item.label}
              </button>
            ) : (
              <div className="flex flex-col">
                <span className={isLast ? "text-lg md:text-xl font-bold leading-tight text-base-content tracking-tight truncate max-w-[200px] md:max-w-none" : ""}>
                  {item.label}
                </span>
                {item.subtitle && (
                  <span className="text-xs text-base-content/60 font-normal truncate">
                    {item.subtitle}
                  </span>
                )}
              </div>
            )}
            {!isLast && <ChevronRight size={14} className="text-base-content/30 shrink-0 hidden sm:block" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
