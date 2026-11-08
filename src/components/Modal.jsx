import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            p-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* 🌌 PREMIUM BACKDROP */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          {/* ✨ MODAL CARD */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={
              !reduceMotion
                ? { scale: 0.9, opacity: 0, y: 30 }
                : false
            }
            animate={
              !reduceMotion
                ? { scale: 1, opacity: 1, y: 0 }
                : false
            }
            exit={
              !reduceMotion
                ? { scale: 0.9, opacity: 0, y: 20 }
                : false
            }
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="
              relative
              w-full max-w-3xl
              h-[85vh] max-h-[85vh]

              bg-brand-surface text-brand-text
              backdrop-blur-xl

              border border-brand-border
              rounded-2xl shadow-2xl

              overflow-hidden
              flex flex-col
            "
          >
            {/* 🔥 GLOW BORDER EFFECT */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-white/10" />

            {/* ================= HEADER ================= */}
            <div className="
              flex items-center justify-between
              px-5 py-3
              border-b border-brand-border
              shrink-0
            ">
              <span className="text-sm font-semibold text-brand-text">
                Preview
              </span>

              {/* ✖ CLOSE BUTTON */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="
                  w-9 h-9
                  flex items-center justify-center
                  rounded-full

                  border border-brand-border
                  text-brand-muted hover:text-brand-text
                  hover:bg-white/10 dark:hover:bg-white/5

                  text-lg
                  transition
                  active:scale-90
                "
              >
                ✕
              </button>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="flex-1 overflow-hidden p-4 sm:p-5">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}