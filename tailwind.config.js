// tailwind.config.js
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FAF3E1",        // main background
          surface: "#F5E7C6",   // cards / sections
          primary: "#FF6D1F",   // CTA / highlights
          text: "#222222",      // main text
        },

        // semantic aliases (VERY important)
        surface: {
          DEFAULT: "#FAF3E1",
          soft: "#F5E7C6",
          dark: "#222222",
        },

        text: {
          primary: "#222222",
          inverse: "#FAF3E1",
          muted: "#6B6B6B",
        },
      },
    },
  },
  plugins: [],
};
