import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      setVisible(scrollTop > 380);
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

  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={!reduceMotion ? { scale: 1.08 } : {}}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full glass-panel border border-brand-border flex items-center justify-center text-brand-text shadow-xl hover:text-brand-primary transition-colors focus:outline-none"
        >
          {/* Progress Ring */}
          <svg
            className="absolute inset-0 -rotate-90 pointer-events-none"
            width="44"
            height="44"
          >
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-brand-border opacity-30"
              strokeWidth="2.5"
            />
            <motion.circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="#FF6D1F"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </svg>

          <ArrowUp className="w-4 h-4 text-brand-primary" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
