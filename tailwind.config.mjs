// tailwind.config.mjs
import tailwindAnimate from "tailwindcss-animate";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F7D234", // our calculator yellow
          dark: "#d4b100",
        },
        darkbg: "#1c1c1c", // background for cards/pages
        accent: "#3f3f3f", // subtle gray accent
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [tailwindAnimate, forms, typography],
};