import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export default function CertificateViewer({ title, src }) {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 16 } : false}
      animate={!reduceMotion ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full flex flex-col"
    >
      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-black text-brand-dark">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500">
          Scroll to view • Pinch to zoom
        </p>
      </div>

      {/* ================= PDF CONTAINER ================= */}
      <div
        className="
          relative w-full
          flex-1
          min-h-[55vh]
          sm:min-h-[65vh]
          lg:min-h-[70vh]
          rounded-2xl
          overflow-hidden
          ring-1 ring-black/10
          bg-zinc-100
        "
      >
        {/* ================= LOADING OVERLAY ================= */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center text-sm text-zinc-500">
            Loading certificate…
          </div>
        )}

        {/* ================= PDF IFRAME ================= */}
        <iframe
          src={`${src}#view=FitH&toolbar=0&navpanes=0`}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* ================= MOBILE ACTION ================= */}
      <div className="mt-4 flex justify-center sm:hidden">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="
            px-5 py-2.5
            rounded-xl
            text-sm font-semibold
            bg-brand-primary
            text-white
            shadow-md
            active:scale-95
            transition
          "
        >
          Open Fullscreen
        </a>
      </div>

      {/* ================= DESKTOP FALLBACK ================= */}
      <div className="mt-4 hidden sm:block text-center">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-primary hover:underline"
        >
          Open in new tab →
        </a>
      </div>
    </motion.div>
  );
}
