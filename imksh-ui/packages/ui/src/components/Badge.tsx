import React from "react";
import { cn } from "../utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error";
  variant?: "solid" | "outline" | "soft" | "ghost";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, color = "primary", variant = "solid", ...props }, ref) => {
    
    const getClasses = () => {
      const colors = {
        primary: {
          solid: "bg-primary text-primary-content",
          outline: "border border-primary text-primary",
          soft: "bg-primary/10 text-primary",
          ghost: "text-primary",
        },
        secondary: {
          solid: "bg-secondary text-secondary-content",
          outline: "border border-secondary text-secondary",
          soft: "bg-secondary/10 text-secondary",
          ghost: "text-secondary",
        },
        neutral: {
          solid: "bg-neutral text-neutral-content",
          outline: "border border-neutral text-neutral",
          soft: "bg-neutral/10 text-neutral",
          ghost: "text-neutral",
        },
        info: {
          solid: "bg-info text-white",
          outline: "border border-info text-info",
          soft: "bg-info/10 text-info",
          ghost: "text-info",
        },
        success: {
          solid: "bg-success text-white",
          outline: "border border-success text-success",
          soft: "bg-success/10 text-success",
          ghost: "text-success",
        },
        warning: {
          solid: "bg-warning text-white",
          outline: "border border-warning text-warning",
          soft: "bg-warning/10 text-warning",
          ghost: "text-warning",
        },
        error: {
          solid: "bg-error text-white",
          outline: "border border-error text-error",
          soft: "bg-error/10 text-error",
          ghost: "text-error",
        },
      };

      return colors[color]?.[variant] || colors.primary.solid;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          getClasses(),
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";
