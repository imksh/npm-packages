/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-base-100)",
        foreground: "var(--color-base-content)",
        primary: {
          DEFAULT: "var(--color-primary)",
          content: "var(--color-primary-content)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          content: "var(--color-secondary-content)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          content: "var(--color-accent-content)",
        },
        neutral: {
          DEFAULT: "var(--color-neutral)",
          content: "var(--color-neutral-content)",
        },
        base: {
          100: "var(--color-base-100)",
          200: "var(--color-base-200)",
          300: "var(--color-base-300)",
          content: "var(--color-base-content)",
        },
        info: "var(--color-info)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      borderRadius: {
        box: "var(--rounded-box)",
        btn: "var(--rounded-btn)",
        badge: "var(--rounded-badge)",
      },
    },
  },
  plugins: [],
}
