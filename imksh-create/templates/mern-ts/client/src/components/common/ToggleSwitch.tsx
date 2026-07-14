import React from "react";
import { motion } from "motion/react";

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <div
      className="flex items-center gap-3 cursor-pointer select-none w-fit group"
      onClick={() => onChange(!checked)}
    >
      <span className="text-sm font-bold">{label}</span>
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 shadow-inner border ${
          checked
            ? "bg-gradient-to-r from-emerald-400 to-cyan-500 border-transparent shadow-emerald-500/20"
            : "bg-base-300 border-base-300/50"
        }`}
      >
        <motion.div
          className={`w-4 h-4 rounded-full shadow-sm ${
            checked ? "bg-white" : "bg-base-content/40"
          }`}
          layout
          initial={false}
          animate={{
            x: checked ? 24 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
