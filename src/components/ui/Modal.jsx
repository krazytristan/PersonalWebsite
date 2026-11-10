import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { sounds } from "../../utils/audio";

export default function Modal({
  open,
  onClose,
  children,
  size = "xl", // sm | md | lg | xl | full
  showCloseButton = true,
  className = "",
}) {
  const reduceMotion = useReducedMotion();
  const overlayRef = useRef(null);

  /* ================= ESC KEY + BODY SCROLL LOCK ================= */
  useEffect(() => {
    if (!open) return;

    sounds.playPop();

    const onKey = (e) => {
      if (e.key === "Escape") {
        sounds.playClick();
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;

    // Prevent layout jitter when scrollbar is hidden
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

  if (typeof window === "undefined") return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-6xl",
  }[size] || "max-w-5xl";

  const handleClose = () => {
    sounds.playClick();
    onClose?.();
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => {
            if (e.target === overlayRef.current) handleClose();
          }}
        >
          {/* Backdrop with High-Tech Frosted Blur */}
          <div className="fixed inset-0 bg-black/75 dark:bg-black/85 backdrop-blur-md transition-opacity pointer-events-none" />

          {/* Modal Container Card */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={
              !reduceMotion
                ? { opacity: 0, scale: 0.94, y: 16 }
                : { opacity: 0 }
            }
            animate={
              !reduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1 }
            }
            exit={
              !reduceMotion
                ? { opacity: 0, scale: 0.95, y: 12 }
                : { opacity: 0 }
            }
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 300,
            }}
            className={`
              relative w-full ${sizeClasses}
              max-h-[94vh] sm:max-h-[92vh] flex flex-col
              rounded-2xl sm:rounded-3xl
              bg-brand-surface text-brand-text
              border border-brand-border
              shadow-2xl shadow-black/50
              overflow-hidden
              z-10
              ${className}
            `}
          >
            {/* Top Close Button Bar */}
            {showCloseButton && (
              <button
                onClick={handleClose}
                aria-label="Close modal dialog"
                className="
                  absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-40
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full
                  glass-panel border border-brand-border
                  text-brand-muted hover:text-brand-text
                  hover:scale-105 active:scale-95
                  flex items-center justify-center
                  shadow-md transition-all
                  focus:outline-none focus:ring-2 focus:ring-brand-primary
                "
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Modal Body with Custom Clean Scrolling */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
