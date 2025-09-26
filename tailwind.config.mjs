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
          DEFAULT: "#1E3A8A", // Midnight Blue
          light: "#243C96",   // lighter hover tone
        },
        accent: {
          DEFAULT: "#F59E0B", // Gold
          dark: "#e0a020",    // darker hover tone
        },
        highlight: "#9CA3AF", // Silver/Gray
        background: "#F3F4F6", // Light Slate
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [tailwindAnimate, forms, typography],
};