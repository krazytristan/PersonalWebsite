import { motion, useReducedMotion } from "framer-motion";

export default function Stat({ value, label }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 16 } : false}
      whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={
        !reduceMotion
          ? {
              y: -4,
              scale: 1.04,
            }
          : {}
      }
      className="group text-center transition"
    >
      {/* ================= VALUE ================= */}
      <div className="relative text-2xl font-black text-brand-dark">
        {value}

        {/* Glow underline */}
        <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 -translate-x-1/2 bg-brand-primary/70 transition-all duration-300 group-hover:w-8" />
      </div>

      {/* ================= LABEL ================= */}
      <div className="mt-1 text-xs font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
    </motion.div>
  );
}
