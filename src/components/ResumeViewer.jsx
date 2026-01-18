import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ResumeViewer({
  src = "/resume.pdf",
  filename = "Tristan-Cuartero-Resume.pdf",
  thumbnail = "/images/resume-thumb.jpg",
  forceFallback = false,
}) {
  const reduceMotion = useReducedMotion();
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- DEVICE DETECTION (RESPONSIVE) ---------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      const isTouch =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const smallScreen = window.innerWidth < 768;
      setIsMobile(isTouch && smallScreen);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  const inlineAllowed = !forceFallback && !isMobile;

  /* ---------------- FILE EXISTS ---------------- */
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(src, { method: "HEAD", signal: controller.signal })
      .then((r) => {
        setExists(r.ok);
        setLoading(false);
      })
      .catch(() => {
        setExists(false);
        setLoading(false);
      });

    return () => controller.abort();
  }, [src]);

  /* ---------------- ACTIONS ---------------- */
  const openNewTab = () => {
    window.open(src, "_blank", "noopener,noreferrer");
  };

  const download = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      openNewTab();
    }
  };

  /* ---------------- TOOLBAR ---------------- */
  const Toolbar = () => (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: -10 } : false}
      animate={!reduceMotion ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.3 }}
      className="
        flex flex-wrap items-center justify-between gap-3
        p-4 rounded-xl
        bg-white/90 dark:bg-zinc-900/90 backdrop-blur
        ring-1 ring-black/10 dark:ring-white/10
      "
    >
      <div>
        <h3 className="font-semibold">Resume</h3>
        <p className="text-xs text-zinc-500">{filename}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openNewTab}
          className="px-4 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 transition"
        >
          Open
        </button>

        <button
          onClick={download}
          className="px-4 py-2 rounded-lg bg-brand-primary text-white font-semibold hover:opacity-90 transition"
        >
          Download
        </button>
      </div>
    </motion.div>
  );

  /* ---------------- FALLBACK ---------------- */
  const Fallback = () => (
    <div className="grid place-items-center p-6 text-center">
      {thumbnail ? (
        <button
          onClick={openNewTab}
          className="focus:outline-none active:scale-[0.98] transition"
        >
          <img
            src={thumbnail}
            alt="Resume preview"
            className="rounded-xl shadow-lg ring-1 ring-black/10 hover:scale-[1.01] transition"
          />
          <p className="mt-4 text-sm text-brand-primary font-semibold">
            Tap to open resume →
          </p>
        </button>
      ) : (
        <p className="text-sm opacity-70">
          Inline preview unavailable on this device.
        </p>
      )}
    </div>
  );

  /* ---------------- ERROR ---------------- */
  if (!loading && !exists) {
    return (
      <div className="p-6 rounded-xl ring-1 ring-red-400/30 text-sm text-red-600">
        Resume not found at <code className="font-mono">{src}</code>.
        Place the file inside <code className="font-mono">/public</code>.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Toolbar />

      {/* Loading skeleton */}
      {loading && (
        <div className="h-[50vh] rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
      )}

      {!loading && exists && (
        inlineAllowed ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
            <object
              data={`${src}#view=FitH`}
              type="application/pdf"
              className="w-full h-[65vh]"
            >
              <Fallback />
            </object>
          </div>
        ) : (
          <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
            <Fallback />
          </div>
        )
      )}

      <p className="text-[11px] text-center text-zinc-500">
        On mobile, the resume opens in a new tab for the best experience.
      </p>
    </div>
  );
}
