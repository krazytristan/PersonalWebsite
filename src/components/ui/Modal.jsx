import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  const reduceMotion = useReducedMotion();

  /* ================= ESC + SCROLL LOCK ================= */
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur
                     flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={
              !reduceMotion ? { scale: 0.94, y: 24, opacity: 0 } : false
            }
            animate={
              !reduceMotion ? { scale: 1, y: 0, opacity: 1 } : false
            }
            exit={
              !reduceMotion ? { scale: 0.94, y: 24, opacity: 0 } : false
            }
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="relative bg-white dark:bg-zinc-900
                       rounded-2xl shadow-2xl
                       max-w-5xl w-full max-h-[90vh]
                       overflow-auto p-6
                       focus:outline-none"
          >
            {/* ================= CLOSE BUTTON ================= */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 h-9 w-9 rounded-full
                         grid place-items-center text-zinc-500
                         hover:bg-black/5 dark:hover:bg-white/10
                         hover:text-zinc-800 dark:hover:text-white
                         transition"
            >
              ✕
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
