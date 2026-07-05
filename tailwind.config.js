/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9882A",
          dark: "#A66E1E",
          light: "#E0AC5C",
        },
        espresso: {
          DEFAULT: "#2A1F14",
          light: "#473522",
        },
        cream: "#FBF6EC",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"],
      },
      backgroundImage: {
        honeycomb:
          "radial-gradient(circle at 1px 1px, rgba(201,136,42,0.15) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
