import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/**
 * UI bootstrap (runs before React):
 * - Hydrate theme (light/dark/system) with zero flash
 * - Expose helpers for toggling + reading theme
 * - Syncs with OS theme + reduced-motion + other tabs
 * - Ensures <meta name="theme-color"> stays in sync
 */
(function bootstrapUI() {
  const THEME_KEY = "theme-mode";       // "light" | "dark" | "system"
  const REDUCED_KEY = "reduced-motion"; // "reduce"
  const root = document.documentElement;

  const mqDark = window.matchMedia?.("(prefers-color-scheme: dark)");
  const mqReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");

  const ensureThemeMeta = () => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    return meta;
  };

  const getStoredMode = () => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
    } catch { return "system"; }
  };
  const setStoredMode = (m) => { try { localStorage.setItem(THEME_KEY, m); } catch {} };
  const resolveTheme = (mode) => (mode === "light" || mode === "dark")
    ? mode
    : (mqDark?.matches ? "dark" : "light");

  const applyTheme = (mode) => {
    const actual = resolveTheme(mode);
    root.classList.toggle("dark", actual === "dark");
    root.setAttribute("data-theme", actual);
    root.setAttribute("data-theme-mode", mode);
    root.style.colorScheme = actual;
    try {
      const meta = ensureThemeMeta();
      meta.setAttribute("content", actual === "dark" ? "#050508" : "#ffffff");
    } catch {}
  };

  const applyReduced = () => {
    const reduced = (mqReduced && mqReduced.matches) || localStorage.getItem(REDUCED_KEY) === "reduce";
    root.classList.toggle("reduced-motion", !!reduced);
    root.setAttribute("data-reduced-motion", reduced ? "reduce" : "no-preference");
  };

  // initial (no flash)
  applyTheme(getStoredMode());
  applyReduced();
  root.style.scrollBehavior = "smooth";

  // helpers
  window.__getThemeMode = () => getStoredMode();
  window.__getResolvedTheme = () => resolveTheme(getStoredMode());
  window.__setThemeMode = (mode) => { setStoredMode(mode === "dark" || mode === "light" ? mode : "system"); applyTheme(getStoredMode()); };
  window.__toggleTheme = () => { const next = resolveTheme(getStoredMode()) === "dark" ? "light" : "dark"; setStoredMode(next); applyTheme(next); };
  window.__setReducedMotion = (reduce) => { try { reduce ? localStorage.setItem(REDUCED_KEY, "reduce") : localStorage.removeItem(REDUCED_KEY); } catch {} applyReduced(); };

  // listeners
  const onSystemThemeChange = () => { if (getStoredMode() === "system") applyTheme("system"); };
  const onReducedChange = () => applyReduced();
  mqDark?.addEventListener?.("change", onSystemThemeChange) ?? mqDark?.addListener?.(onSystemThemeChange);
  mqReduced?.addEventListener?.("change", onReducedChange) ?? mqReduced?.addListener?.(onReducedChange);

  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY) applyTheme(getStoredMode());
    if (e.key === REDUCED_KEY) applyReduced();
  });
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// fade-in after mount (pairs with html.app-ready CSS)
requestAnimationFrame(() => document.documentElement.classList.add("app-ready"));
