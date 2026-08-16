import { jsx, jsxs } from "react/jsx-runtime";
const CircularProgress = ({
  value,
  label,
  color = "text-primary",
  size = "lg",
}) => {
  const radius = size === "xl" ? 60 : size === "lg" ? 40 : 24;
  const stroke = size === "xl" ? 10 : size === "lg" ? 6 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const dims = size === "xl" ? 140 : size === "lg" ? 96 : 56;
  const textClass =
    size === "xl" ? "text-2xl" : size === "lg" ? "text-md" : "text-[10px]";
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center justify-center",
    children: [
      /* @__PURE__ */ jsxs("div", {
        className: "relative flex items-center justify-center",
        style: { width: dims, height: dims },
        children: [
          /* @__PURE__ */ jsxs("svg", {
            height: dims,
            width: dims,
            className: "absolute transform -rotate-90",
            children: [
              /* @__PURE__ */ jsx("circle", {
                stroke: "currentColor",
                fill: "transparent",
                strokeWidth: stroke,
                r: normalizedRadius,
                cx: dims / 2,
                cy: dims / 2,
                className: "text-base-200",
              }),
              /* @__PURE__ */ jsx("circle", {
                stroke: "currentColor",
                fill: "transparent",
                strokeWidth: stroke,
                strokeDasharray: circumference + " " + circumference,
                style: { strokeDashoffset },
                strokeLinecap: "round",
                r: normalizedRadius,
                cx: dims / 2,
                cy: dims / 2,
                className: `${color} transition-all duration-1000 ease-out`,
              }),
            ],
          }),
          /* @__PURE__ */ jsxs("span", {
            className: `font-bold ${textClass}`,
            children: [value, "%"],
          }),
        ],
      }),
      label &&
        /* @__PURE__ */ jsx("span", {
          className: "mt-2 text-sm font-medium text-base-content/70",
          children: label,
        }),
    ],
  });
};
export { CircularProgress };
