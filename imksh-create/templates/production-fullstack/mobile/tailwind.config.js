/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        floatUp: {
          "0%": { transform: "translateY(50%)", opacity: "0" },
          "50%": { transform: "translateY(-50%)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        dice: {
          "0%": { transform: "rotate(0deg)"},
          "100%": { transform: "rotate(360deg)" },
        },
        flip: {
          "0%": { transform: "rotatey(0deg)"},
          "100%": { transform: "rotatey(360deg)" },
        },
      },
      animation: {
        bounce: "bounce 1s infinite",
        "float-up": "floatUp 2s ease-in-out forwards",
        "dice1": "dice 0.3s ease-in-out forwards infinite",
        "dice2": "dice 0.3s ease-in-out forwards infinite",
        "flip": "dice 0.8s ease-in-out forwards infinite",
      },
      colors: {
        base: {
          100: "rgb(var(--color-base-100) / <alpha-value>)",
          200: "rgb(var(--color-base-200) / <alpha-value>)",
          300: "rgb(var(--color-base-300) / <alpha-value>)",
          content: "rgb(var(--color-base-content) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          content: "rgb(var(--color-primary-content) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
          content: "rgb(var(--color-secondary-content) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          content: "rgb(var(--color-accent-content) / <alpha-value>)",
        },
        neutral: {
          DEFAULT: "rgb(var(--color-neutral) / <alpha-value>)",
          content: "rgb(var(--color-neutral-content) / <alpha-value>)",
        },
        info: "rgb(var(--color-info) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
