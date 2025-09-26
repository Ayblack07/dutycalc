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
          DEFAULT: "#09607B", // Deep teal
          dark: "#074C62",
        },
        secondary: {
          DEFAULT: "#607B09", // Olive-green
          dark: "#4C6007",
        },
        accent: {
          DEFAULT: "#1B8B77", // Vibrant green
          dark: "#166B5D",
        },
        background: "#F6F7F9", // Light background
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
        glow: "0 0 12px rgba(9, 96, 123, 0.3)",
      },
    },
  },
  plugins: [tailwindAnimate, forms, typography],
};