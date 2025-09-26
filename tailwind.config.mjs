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
          DEFAULT: "#D4AF37", // elegant gold
          dark: "#B28C1D", // richer gold
        },
        brand: {
          navy: "#0A192F", // deep navy
          blue: "#1E3A8A", // royal blue
          darkbg: "#111827", // near black
          accent: "#374151", // grayish accent
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.25)", // deeper shadow
        glow: "0 0 12px rgba(212, 175, 55, 0.5)", // subtle gold glow
      },
    },
  },
  plugins: [tailwindAnimate, forms, typography],
};