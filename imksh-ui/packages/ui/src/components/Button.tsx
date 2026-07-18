"use client";

import React from "react";
import { cn } from "../utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "secondary" | "neutral" | "info" | "success" | "warning" | "error";
  variant?: "solid" | "outline" | "soft" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, color = "primary", variant = "solid", ...props }, ref) => {
    
    // Base classes based on color and variant
    const getClasses = () => {
      const colors = {
        primary: {
          solid: "bg-primary text-primary-content hover:opacity-90",
          outline: "border border-primary text-primary hover:bg-primary hover:text-primary-content",
          soft: "bg-primary/10 text-primary hover:bg-primary/20",
          ghost: "text-primary hover:bg-primary/10",
        },
        secondary: {
          solid: "bg-secondary text-secondary-content hover:opacity-90",
          outline: "border border-secondary text-secondary hover:bg-secondary hover:text-secondary-content",
          soft: "bg-secondary/10 text-secondary hover:bg-secondary/20",
          ghost: "text-secondary hover:bg-secondary/10",
        },
        neutral: {
          solid: "bg-neutral text-neutral-content hover:opacity-90",
          outline: "border border-neutral text-neutral hover:bg-neutral hover:text-neutral-content",
          soft: "bg-neutral/10 text-neutral hover:bg-neutral/20",
          ghost: "text-neutral hover:bg-neutral/10",
        },
        info: {
          solid: "bg-info text-white hover:opacity-90",
          outline: "border border-info text-info hover:bg-info hover:text-white",
          soft: "bg-info/10 text-info hover:bg-info/20",
          ghost: "text-info hover:bg-info/10",
        },
        success: {
          solid: "bg-success text-white hover:opacity-90",
          outline: "border border-success text-success hover:bg-success hover:text-white",
          soft: "bg-success/10 text-success hover:bg-success/20",
          ghost: "text-success hover:bg-success/10",
        },
        warning: {
          solid: "bg-warning text-white hover:opacity-90",
          outline: "border border-warning text-warning hover:bg-warning hover:text-white",
          soft: "bg-warning/10 text-warning hover:bg-warning/20",
          ghost: "text-warning hover:bg-warning/10",
        },
        error: {
          solid: "bg-error text-white hover:opacity-90",
          outline: "border border-error text-error hover:bg-error hover:text-white",
          soft: "bg-error/10 text-error hover:bg-error/20",
          ghost: "text-error hover:bg-error/10",
        },
      };

      return colors[color]?.[variant] || colors.primary.solid;
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "h-10 px-4 py-2",
          getClasses(),
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
