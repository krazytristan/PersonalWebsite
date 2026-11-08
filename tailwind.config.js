// tailwind.config.js
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          bg: "var(--brand-bg)",
          surface: "var(--brand-surface)",
          card: "var(--brand-card)",
          cardHover: "var(--brand-card-hover)",
          primary: "#FF6D1F",
          primaryHover: "#FF843D",
          primaryLight: "rgba(255, 109, 31, 0.12)",
          accent: "#38BDF8",
          text: "var(--brand-text)",
          muted: "var(--brand-muted)",
          border: "var(--brand-border)",
          subtle: "var(--brand-subtle)",
        },
        surface: {
          DEFAULT: "var(--brand-surface)",
          soft: "var(--brand-card)",
          dark: "#080B11",
        },
        text: {
          primary: "var(--brand-text)",
          inverse: "var(--brand-inverse)",
          muted: "var(--brand-muted)",
        },
      },
      boxShadow: {
        'glow-primary': '0 0 35px -5px rgba(255, 109, 31, 0.35)',
        'glow-cyan': '0 0 35px -5px rgba(56, 189, 248, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
