import { jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -8,
  },
};
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};
const PageTransition = ({ children, className = "" }) => {
  return /* @__PURE__ */ jsx(motion.div, {
    initial: "initial",
    animate: "in",
    exit: "out",
    variants: pageVariants,
    transition: pageTransition,
    className: `h-full w-full ${className}`,
    children,
  });
};
var PageTransition_default = PageTransition;
export { PageTransition_default as default };
