import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * 1) Hydrate theme BEFORE React mounts (no flash)
 * 2) Expose a tiny global theme API for any component: window.__toggleTheme()
 * 3) Respect prefers-reduced-motion for people who disable animations
 * 4) Mark app as ready so CSS can fade content in smoothly
 */
(function bootstrapUI() {
  try {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

    const theme =
      saved === "dark" || saved === "light"
        ? saved
        : prefersDark
        ? "dark"
        : "light";

    root.classList.toggle("dark", theme === "dark");

    // Global helpers (use anywhere, even outside React)
    window.__setTheme = (t) => {
      const next = t === "dark" ? "dark" : "light";
      root.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    };
    window.__toggleTheme = () => {
      const next = root.classList.contains("dark") ? "light" : "dark";
      window.__setTheme(next);
    };

    // Respect reduced motion: add class React/Tailwind can target if needed
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    root.classList.toggle("reduced-motion", !!reduced);

    // Smooth anchor scrolling for hash links (native + fallback)
    root.style.scrollBehavior = "smooth";
  } catch {
    /* ignore */
  }
})();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// When React is mounted, mark app as ready to fade in UI
window.requestAnimationFrame(() => {
  document.documentElement.classList.add("app-ready");
});
