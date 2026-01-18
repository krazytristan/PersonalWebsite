import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export default function PageTransition({ children, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  /* ================= DEVICE GUARD ================= */
  const isDesktop = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 768px)").matches;
  }, []);

  if (reduceMotion) return children;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: isDesktop ? 32 : 16,
        filter: isDesktop ? "blur(6px)" : "none",
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: isDesktop ? -20 : -10,
        filter: isDesktop ? "blur(4px)" : "none",
      }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1], // cinematic
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
