import React from "react";

export const CircularProgress = ({
  value,
  label,
  color = "text-primary",
  size = "lg",
}: {
  value: number;
  label?: string;
  color?: string;
  size?: "md" | "lg" | "xl";
}) => {
  const radius = size === "xl" ? 60 : size === "lg" ? 40 : 24;
  const stroke = size === "xl" ? 10 : size === "lg" ? 6 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const dims = size === "xl" ? 140 : size === "lg" ? 96 : 56;
  const textClass =
    size === "xl" ? "text-2xl" : size === "lg" ? "text-md" : "text-[10px]";

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: dims, height: dims }}
      >
        {/* Background circle */}
        <svg
          height={dims}
          width={dims}
          className="absolute transform -rotate-90"
        >
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={dims / 2}
            cy={dims / 2}
            className="text-base-200"
          />
          {/* Progress circle */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={dims / 2}
            cy={dims / 2}
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <span className={`font-bold ${textClass}`}>{value}%</span>
      </div>
      {label && (
        <span className="mt-2 text-sm font-medium text-base-content/70">
          {label}
        </span>
      )}
    </div>
  );
};
