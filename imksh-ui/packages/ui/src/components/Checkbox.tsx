"use client";

import React from "react";
import { cn } from "../utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-base-300 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 checked:bg-primary checked:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors accent-primary",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
