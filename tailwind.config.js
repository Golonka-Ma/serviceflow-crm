/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0077B6",
          light: "#0096C7",
        },
        secondary: {
          DEFAULT: "#00B77D",
          light: "#38B000",
        },
        dark: {
          DEFAULT: "#1A2B4C",
        },
        background: {
          DEFAULT: "#FFFFFF",
          light: "#F8F9FA",
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#6D28D9",
          "primary-focus": "#5B21B6",
          "primary-content": "#FFFFFF",
          secondary: "#00B77D",
          accent: "#0096C7",
          neutral: "#1f2937",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#E5E7EB",
          "base-content": "#1f2937",
          info: "#0077B6",
          success: "#10B981",
          warning: "#FBBF24",
          error: "#F43F5E",
        },
      },
      {
        dark: {
          primary: "#6D28D9",
          "primary-focus": "#5B21B6",
          "primary-content": "#FFFFFF",
          secondary: "#00B77D",
          accent: "#0096C7",
          neutral: "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          "base-content": "#f3f4f6",
          info: "#0077B6",
          success: "#10B981",
          warning: "#FBBF24",
          error: "#F43F5E",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
};
