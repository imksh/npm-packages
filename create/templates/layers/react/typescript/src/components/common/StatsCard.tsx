import React, { ReactNode } from "react";

export type StatsCardColor =
  | "blue"
  | "emerald"
  | "amber"
  | "purple"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "info"
  | "error";

export interface StatsCardTrend {
  value: string | number;
  isPositive?: boolean;
  label?: string;
}

export interface StatsCardBadge {
  label: string | number;
  variant?:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "neutral"
    | "ghost"
    | "secondary"
    | "primary";
}

export interface StatsCardProps {
  /** Main title or label of the stat card */
  title: ReactNode;
  /** Primary metric value (e.g. number, count, currency) */
  value: ReactNode;
  /** Secondary value displayed beside the main value (e.g. "75%", "Queue", "USD") */
  subValue?: ReactNode;
  /** Trend indicator with direction and value */
  trend?: StatsCardTrend | ReactNode;
  /** Badge displayed in the bottom footer row */
  badge?: StatsCardBadge | ReactNode;
  /** Descriptive subtext displayed in the footer row */
  description?: ReactNode;
  /** Icon displayed in the top-right corner */
  icon?: ReactNode;
  /** Color theme for icon container and active selection border */
  color?: StatsCardColor;
  /** Active selection state with highlighting ring */
  active?: boolean;
  /** Displays a loading spinner in place of value */
  loading?: boolean;
  /** Click handler for interactive selection / drill-down */
  onClick?: () => void;
  /** Custom additional container classes */
  className?: string;
  /** @deprecated use `subValue` instead */
  percentage?: number | string;
}

const COLOR_STYLES: Record<
  StatsCardColor,
  {
    icon: string;
    activeBorder: string;
  }
> = {
  blue: {
    icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    activeBorder:
      "border-blue-500/50 shadow-sm ring-1 ring-blue-500/20 bg-gradient-to-br from-base-100 to-blue-500/[0.03]",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    activeBorder:
      "border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/20 bg-gradient-to-br from-base-100 to-emerald-500/[0.03]",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    activeBorder:
      "border-amber-500/50 shadow-sm ring-1 ring-amber-500/20 bg-gradient-to-br from-base-100 to-amber-500/[0.03]",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    activeBorder:
      "border-purple-500/50 shadow-sm ring-1 ring-purple-500/20 bg-gradient-to-br from-base-100 to-purple-500/[0.03]",
  },
  primary: {
    icon: "bg-primary/10 text-primary",
    activeBorder:
      "border-primary/50 shadow-sm ring-1 ring-primary/20 bg-gradient-to-br from-base-100 to-primary/[0.03]",
  },
  secondary: {
    icon: "bg-secondary/10 text-secondary",
    activeBorder:
      "border-secondary/50 shadow-sm ring-1 ring-secondary/20 bg-gradient-to-br from-base-100 to-secondary/[0.03]",
  },
  success: {
    icon: "bg-success/10 text-success",
    activeBorder:
      "border-success/50 shadow-sm ring-1 ring-success/20 bg-gradient-to-br from-base-100 to-success/[0.03]",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    activeBorder:
      "border-warning/50 shadow-sm ring-1 ring-warning/20 bg-gradient-to-br from-base-100 to-warning/[0.03]",
  },
  info: {
    icon: "bg-info/10 text-info",
    activeBorder:
      "border-info/50 shadow-sm ring-1 ring-info/20 bg-gradient-to-br from-base-100 to-info/[0.03]",
  },
  error: {
    icon: "bg-error/10 text-error",
    activeBorder:
      "border-error/50 shadow-sm ring-1 ring-error/20 bg-gradient-to-br from-base-100 to-error/[0.03]",
  },
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon,
  color = "primary",
  percentage,
  badge,
  description,
  active = false,
  loading = false,
  onClick,
  className = "",
}) => {
  const styles = COLOR_STYLES[color] || COLOR_STYLES.primary;

  // Support both new `subValue` prop and deprecated `percentage` prop
  const displaySubValue =
    subValue !== undefined
      ? subValue
      : percentage !== undefined && percentage !== null
        ? typeof percentage === "number"
          ? `${percentage}%`
          : percentage
        : null;

  const renderBadge = () => {
    if (!badge) return null;
    if (React.isValidElement(badge)) return badge;
    const b = badge as StatsCardBadge;
    return (
      <span className={`badge badge-xs font-medium ${b.variant ? `badge-${b.variant}` : "badge-ghost"}`}>
        {b.label}
      </span>
    );
  };

  const renderTrend = () => {
    if (!trend) return null;
    if (React.isValidElement(trend)) return trend;
    const t = trend as StatsCardTrend;
    const isPos = t.isPositive ?? true;
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
          isPos ? "text-success" : "text-error"
        }`}
      >
        <span>{isPos ? "↑" : "↓"}</span>
        <span>{t.value}</span>
        {t.label && <span className="opacity-70 font-normal ml-0.5">{t.label}</span>}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`card bg-base-100 border transition-all duration-200 p-4 rounded-2xl ${
        onClick ? "cursor-pointer hover:shadow-sm active:scale-[0.99]" : ""
      } ${
        active
          ? styles.activeBorder
          : "border-base-200 hover:border-base-300"
      } ${className}`}
    >
      {/* Top row: Title and Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60 truncate">
          {title}
        </span>
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.icon}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Middle row: Value and optional SubValue/Trend */}
      <div className="mt-2 flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl md:text-3xl font-bold tracking-tight text-base-content">
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            value
          )}
        </span>
        {displaySubValue !== null && !loading && (
          <span className="text-xs font-semibold opacity-80">
            {displaySubValue}
          </span>
        )}
        {!loading && renderTrend()}
      </div>

      {/* Bottom row: Badge and description */}
      {(badge || description) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-base-content/60 min-w-0">
          {renderBadge()}
          {description && <span className="truncate">{description}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
