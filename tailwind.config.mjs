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
          DEFAULT: "#09607B", // Deep Teal Blue (Main Brand Color)
          dark: "#074C62",
        },
        secondary: {
          DEFAULT: "#F5B700", // Warm Amber Yellow (Highlight / Action)
          dark: "#C48F00",
        },
        accent: {
          DEFAULT: "#20C997", // Fresh Mint Green (Balance)
          dark: "#18A77D",
        },
        neutral: {
          dark: "#2C3E50", // Charcoal Navy (Text / Contrast)
          light: "#F8F9FA", // Soft Gray White (Background / Calm Areas)
        },
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