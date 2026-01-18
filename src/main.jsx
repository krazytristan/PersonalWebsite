import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/**
 * =====================================================
 * UI BOOTSTRAP (executes BEFORE React renders)
 * =====================================================
 * - Zero-flash theme hydration (light / dark / system)
 * - Reduced motion sync (OS + storage)
 * - Cross-tab + OS change sync
 * - <meta name="theme-color"> synchronization
 * - Minimal, safe global theme API
 * =====================================================
 */
(function bootstrapUI() {
  if (typeof window === "undefined") return;

  const THEME_KEY = "theme-mode";        // "light" | "dark" | "system"
  const REDUCED_KEY = "reduced-motion";  // "reduce"
  const root = document.documentElement;

  const mqDark =
    window.matchMedia?.("(prefers-color-scheme: dark)") || null;
  const mqReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)") || null;

  /* -------------------- Safe Storage -------------------- */
  const safeGet = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const safeSet = (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch {}
  };

  const safeRemove = (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  };

  /* -------------------- Theme Helpers -------------------- */
  const ensureThemeMeta = () => {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    return meta;
  };

  const getStoredMode = () => {
    const m = safeGet(THEME_KEY);
    return m === "light" || m === "dark" || m === "system"
      ? m
      : "system";
  };

  const resolveTheme = (mode) => {
    if (mode === "light" || mode === "dark") return mode;
    return mqDark?.matches ? "dark" : "light";
  };

  /* -------------------- Apply Theme -------------------- */
  const applyTheme = (mode) => {
    const resolved = resolveTheme(mode);

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.theme = resolved;
    root.dataset.themeMode = mode;
    root.style.colorScheme = resolved;

    try {
      ensureThemeMeta().setAttribute(
        "content",
        resolved === "dark" ? "#050508" : "#ffffff"
      );
    } catch {}
  };

  /* -------------------- Reduced Motion -------------------- */
  const applyReducedMotion = () => {
    const reduced =
      mqReduced?.matches || safeGet(REDUCED_KEY) === "reduce";

    root.classList.toggle("reduced-motion", reduced);
    root.dataset.reducedMotion = reduced
      ? "reduce"
      : "no-preference";

    // Disable smooth scroll if reduced motion is requested
    root.style.scrollBehavior = reduced ? "auto" : "smooth";
  };

  /* -------------------- Initial Run (NO FLASH) -------------------- */
  applyTheme(getStoredMode());
  applyReducedMotion();

  /* -------------------- Global Theme API -------------------- */
  window.__theme = Object.freeze({
    getMode: () => getStoredMode(),
    getResolved: () => resolveTheme(getStoredMode()),

    setMode: (mode) => {
      safeSet(
        THEME_KEY,
        mode === "light" || mode === "dark" ? mode : "system"
      );
      applyTheme(getStoredMode());
    },

    toggle: () => {
      const next =
        resolveTheme(getStoredMode()) === "dark"
          ? "light"
          : "dark";
      safeSet(THEME_KEY, next);
      applyTheme(next);
    },

    setReducedMotion: (reduce) => {
      reduce
        ? safeSet(REDUCED_KEY, "reduce")
        : safeRemove(REDUCED_KEY);
      applyReducedMotion();
    },
  });

  /* -------------------- System + Cross-Tab Sync -------------------- */
  const onDarkChange = () => {
    if (getStoredMode() === "system") applyTheme("system");
  };

  const onReducedChange = () => applyReducedMotion();

  try {
    mqDark?.addEventListener?.("change", onDarkChange);
    mqReduced?.addEventListener?.("change", onReducedChange);
  } catch {
    // Safari < 14 fallback
    mqDark?.addListener?.(onDarkChange);
    mqReduced?.addListener?.(onReducedChange);
  }

  window.addEventListener("storage", (e) => {
    if (e.key === THEME_KEY) applyTheme(getStoredMode());
    if (e.key === REDUCED_KEY) applyReducedMotion();
  });
})();

/* =====================================================
 * React Mount
 * ===================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

/* -------------------- App Ready (CSS Fade-in Hook) -------------------- */
requestAnimationFrame(() => {
  document.documentElement.classList.add("app-ready");
});
