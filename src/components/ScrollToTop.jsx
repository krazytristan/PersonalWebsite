import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function ScrollToTop() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      setVisible(scrollTop > 420);
      setProgress(height > 0 ? Math.min(scrollTop / height, 1) : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          whileHover={!reduceMotion ? { scale: 1.08 } : {}}
          whileTap={{ scale: 0.95 }}
          className="
            fixed z-[51]
            right-4
            bottom-[calc(env(safe-area-inset-bottom)+76px)]
            h-12 w-12 rounded-full
            bg-brand-surface ring-1 ring-black/10 shadow-xl
            grid place-items-center
            focus:outline-none
            focus-visible:ring-2 focus-visible:ring-brand-primary
          "
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 -rotate-90"
            width="48"
            height="48"
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="3"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </svg>

          <span className="relative z-10 text-brand-primary text-lg font-bold">
            ↑
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
