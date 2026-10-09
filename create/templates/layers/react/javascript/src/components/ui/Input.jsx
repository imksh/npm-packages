import React from "react";
import { X } from "lucide-react";

export const Input = React.forwardRef(
  (
    {
      icon,
      wrapperClassName = "",
      onClear,
      className = "",
      value,
      size,
      ...props
    },
    ref,
  ) => {
    const sizeClass = size ? `input-${size}` : "";
    return (
      <div className={`relative ${wrapperClassName}`}>
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none flex items-center justify-center z-10">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          value={value}
          className={`input input-bordered w-full ${sizeClass} ${icon ? "pl-10" : ""} ${
            onClear && value ? "pr-10" : ""
          } ${className}`}
          {...props}
        />

        {onClear && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors flex items-center justify-center"
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
