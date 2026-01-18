import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export default function Stat({ value, label }) {
  const reduceMotion = useReducedMotion();

  /* ================= DEVICE GUARD ================= */
  const isDesktop = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover)").matches;
  }, []);

  const enableHover = !reduceMotion && isDesktop;

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
      whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={
        enableHover
          ? {
              y: -3,
              scale: 1.03,
            }
          : {}
      }
      className="group text-center will-change-transform"
    >
      {/* ================= VALUE ================= */}
      <div className="relative inline-block text-2xl font-black text-brand-dark">
        {value}

        {/* Glow underline */}
        <span
          className="
            absolute left-1/2 -bottom-1 h-[2px] w-6
            -translate-x-1/2
            bg-brand-primary/70
            scale-x-0 origin-center
            transition-transform duration-300
            group-hover:scale-x-100
          "
        />
      </div>

      {/* ================= LABEL ================= */}
      <div className="mt-1 text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
    </motion.div>
  );
}
