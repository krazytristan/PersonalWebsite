import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef(null);

  /* ================= ESC + SCROLL LOCK ================= */
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="
            fixed inset-0 z-[1000]
            bg-black/60 backdrop-blur-sm
            grid place-items-center
            px-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose?.();
          }}
        >
          {/* ================= MODAL CARD ================= */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={
              !reduceMotion
                ? { opacity: 0, scale: 0.96, y: 20 }
                : false
            }
            animate={
              !reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : false
            }
            exit={
              !reduceMotion
                ? { opacity: 0, scale: 0.96, y: 20 }
                : false
            }
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              w-full max-w-5xl
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              bg-white dark:bg-zinc-900
              shadow-2xl
              ring-1 ring-black/10 dark:ring-white/10
              p-6
            "
          >
            {/* ================= CLOSE BUTTON ================= */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="
                absolute top-4 right-4
                h-9 w-9
                rounded-full
                grid place-items-center
                text-zinc-500
                hover:bg-black/5 dark:hover:bg-white/10
                hover:text-zinc-800 dark:hover:text-white
                focus:outline-none
                focus-visible:ring-2 focus-visible:ring-brand-primary
                transition
              "
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
