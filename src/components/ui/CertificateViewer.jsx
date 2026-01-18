import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function CertificateViewer({
  title = "Certificate",
  src,
  filename = "certificate.pdf",
}) {
  const reduceMotion = useReducedMotion();

  /* ---------------- DEVICE CHECK ---------------- */
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.innerWidth < 768 ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }, []);

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

  return (
    <div className="flex flex-col gap-4">
      {/* ================= HEADER ================= */}
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
        <h3 className="font-semibold text-brand-dark">{title}</h3>

        <div className="flex items-center gap-2">
          <button
            onClick={openNewTab}
            className="px-4 py-2 rounded-lg ring-1 ring-black/10
                       dark:ring-white/10 hover:bg-black/5 transition"
          >
            Open
          </button>

          <button
            onClick={download}
            className="px-4 py-2 rounded-lg bg-brand-primary
                       text-white font-semibold hover:opacity-90 transition"
          >
            Download
          </button>
        </div>
      </motion.div>

      {/* ================= VIEWER ================= */}
      <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
        {isMobile ? (
          /* ---------- MOBILE FALLBACK ---------- */
          <div className="grid place-items-center p-8 text-center">
            <p className="text-sm text-zinc-600 mb-4">
              PDF preview is best viewed in a new tab on mobile.
            </p>
            <button
              onClick={openNewTab}
              className="px-6 py-3 rounded-xl bg-brand-primary
                         text-white font-semibold shadow-lg"
            >
              Open Certificate →
            </button>
          </div>
        ) : (
          /* ---------- DESKTOP PDF ---------- */
          <object
            data={`${src}#view=FitH`}
            type="application/pdf"
            className="w-full h-[70vh]"
          >
            <iframe
              src={src}
              title={title}
              className="w-full h-[70vh]"
            />
          </object>
        )}
      </div>

      {/* ================= FOOTNOTE ================= */}
      <p className="text-[11px] text-center text-zinc-500">
        If the preview doesn’t load, use “Open” or “Download”.
      </p>
    </div>
  );
}
