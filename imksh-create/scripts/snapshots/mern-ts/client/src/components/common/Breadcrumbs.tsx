import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const Breadcrumbs = ({ items }) => {
  return (
    <div className="flex items-center gap-1.5 text-sm font-bold text-base-content/50 flex-wrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {item.path && !isLast ? (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-base font-black text-base-content tracking-tight" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={14} className="text-base-content/30 shrink-0" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};
