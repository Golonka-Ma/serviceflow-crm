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
          primary: "#0077B6",
          secondary: "#00B77D",
          accent: "#0096C7",
          neutral: "#1A2B4C",
          "base-100": "#FFFFFF",
          "base-200": "#F8F9FA",
          "base-300": "#E5E7EB",
          info: "#0096C7",
          success: "#00B77D",
          warning: "#FBBF24",
          error: "#EF4444",
        },
      },
      "light",
      "dark",
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
