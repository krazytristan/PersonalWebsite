import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function ResumeViewer({
  src = "/resume.pdf",
  filename = "Tristan-Cuartero-Resume.pdf",
  thumbnail = "/images/resume-thumb.jpg",
  height = "72vh",
  forceFallback = false,
}) {
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inlineAllowed, setInlineAllowed] = useState(true);
  const [viewer, setViewer] = useState("object"); // object | iframe | fallback
  const styleInjected = useRef(false);

  /* ---------------- UA CHECK ---------------- */
  const problematicUA = useMemo(() => {
    const ua = navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const androidFirefox = /Android/.test(ua) && /Firefox/.test(ua);
    return iOS || androidFirefox;
  }, []);

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

  /* ---------------- INLINE DECISION ---------------- */
  useEffect(() => {
    if (forceFallback || problematicUA) {
      setInlineAllowed(false);
      setViewer("fallback");
      return;
    }

    if (navigator.pdfViewerEnabled === false) {
      setInlineAllowed(false);
      setViewer("fallback");
    } else {
      setInlineAllowed(true);
      setViewer("object");
    }
  }, [forceFallback, problematicUA]);

  /* ---------------- ACTIONS ---------------- */
  const openNewTab = () => {
    try {
      window.open(src, "_blank", "noopener,noreferrer");
    } catch {}
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

  const printPdf = () => {
    const w = window.open(src, "_blank", "noopener,noreferrer");
    setTimeout(() => {
      try {
        w?.focus();
        w?.print();
      } catch {}
    }, 800);
  };

  /* ---------------- SCROLLBAR HIDE ---------------- */
  useEffect(() => {
    if (styleInjected.current) return;

    const style = document.createElement("style");
    style.textContent = `
      object::-webkit-scrollbar,
      iframe::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    styleInjected.current = true;
  }, []);

  /* ---------------- UI ---------------- */
  const Toolbar = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl
        bg-white/80 dark:bg-zinc-900/80 backdrop-blur
        ring-1 ring-black/10 dark:ring-white/10"
    >
      <div>
        <h3 className="font-semibold leading-tight">Resume</h3>
        <p className="text-xs text-zinc-500">{filename}</p>
      </div>

      <div className="flex items-center gap-2">
        {inlineAllowed && (
          <div className="hidden sm:flex rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
            {["object", "iframe"].map((v) => (
              <button
                key={v}
                onClick={() => setViewer(v)}
                aria-label={`Use ${v} viewer`}
                className={`px-3 py-2 text-sm transition ${
                  viewer === v
                    ? "bg-black/5 dark:bg-white/10 font-medium"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={openNewTab}
          className="px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 transition"
        >
          Open
        </button>

        <button
          onClick={download}
          className="px-3 py-2 rounded-lg bg-brand-primary text-white font-semibold hover:opacity-90 transition"
        >
          Download
        </button>

        <button
          onClick={printPdf}
          className="px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 transition"
        >
          Print
        </button>
      </div>
    </motion.div>
  );

  const Fallback = ({ reason }) => (
    <div className="grid place-items-center p-6 text-center">
      {thumbnail ? (
        <a href={src} target="_blank" rel="noreferrer">
          <img
            src={thumbnail}
            alt="Resume preview"
            className="rounded-xl shadow-lg ring-1 ring-black/10 dark:ring-white/10 hover:scale-[1.01] transition"
          />
        </a>
      ) : (
        <p className="text-sm opacity-70">{reason}</p>
      )}
    </div>
  );

  if (!loading && !exists) {
    return (
      <div className="p-6 rounded-xl ring-1 ring-red-400/30 text-sm text-red-600">
        Resume not found at <code className="font-mono">{src}</code>.  
        Place the file inside <code className="font-mono">/public</code> and restart Vite.
      </div>
    );
  }

  const viewerStyle = {
    height,
    border: 0,
    overflow: "hidden",
    scrollbarWidth: "none",
  };

  return (
    <div className="flex flex-col gap-4">
      <Toolbar />

      {/* Loading skeleton */}
      {loading && (
        <div
          className="rounded-xl ring-1 ring-black/10 dark:ring-white/10
            bg-zinc-100 dark:bg-zinc-900 animate-pulse"
          style={{ height }}
        />
      )}

      {!loading && exists && (
        inlineAllowed ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
            {viewer === "object" && (
              <object
                data={`${src}#view=FitH`}
                type="application/pdf"
                className="w-full"
                style={viewerStyle}
              >
                <iframe
                  src={src}
                  title="Resume PDF"
                  className="w-full"
                  style={viewerStyle}
                />
                <Fallback reason="Inline preview unavailable." />
              </object>
            )}

            {viewer === "iframe" && (
              <iframe
                src={src}
                title="Resume PDF"
                className="w-full"
                style={viewerStyle}
              />
            )}
          </div>
        ) : (
          <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
            <Fallback reason="This browser blocks inline PDF previews." />
          </div>
        )
      )}

      <p className="text-[11px] text-center text-zinc-500">
        If the preview doesn’t load, use “Open” or “Download”.
      </p>
    </div>
  );
}
