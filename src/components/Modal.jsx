import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  const reduceMotion = useReducedMotion();

  /* ================= ESC + iOS SAFE SCROLL LOCK ================= */
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const scrollY = window.scrollY;
    const body = document.body;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);

      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="
            fixed inset-0 z-[100]
            bg-black/60 backdrop-blur
            flex items-end sm:items-center justify-center
            px-3 sm:px-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={
              !reduceMotion
                ? { scale: 0.96, y: 32, opacity: 0 }
                : false
            }
            animate={
              !reduceMotion
                ? { scale: 1, y: 0, opacity: 1 }
                : false
            }
            exit={
              !reduceMotion
                ? { scale: 0.96, y: 32, opacity: 0 }
                : false
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              relative w-full max-w-5xl
              bg-white dark:bg-zinc-900
              rounded-t-3xl sm:rounded-2xl
              shadow-2xl
              max-h-[85svh] sm:max-h-[90vh]
              overflow-hidden
              flex flex-col
            "
          >
            {/* ================= HEADER ================= */}
            <div className="sticky top-0 z-10 flex items-center justify-end
                            p-4 bg-white/90 dark:bg-zinc-900/90
                            backdrop-blur ring-b ring-black/5 dark:ring-white/10">
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="
                  h-10 w-10 rounded-full
                  grid place-items-center
                  text-zinc-500
                  hover:bg-black/5 dark:hover:bg-white/10
                  hover:text-zinc-800 dark:hover:text-white
                  transition
                "
              >
                ✕
              </button>
            </div>

            {/* ================= CONTENT ================= */}
            <div
              className="
                flex-1 overflow-y-auto overscroll-contain
                p-5 sm:p-6
              "
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
