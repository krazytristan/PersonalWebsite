import { motion, useReducedMotion } from "framer-motion";

export default function StickyCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="
        fixed z-50
        bottom-[env(safe-area-inset-bottom)]
        inset-x-0 sm:inset-x-auto
        sm:bottom-6 sm:right-6
        flex justify-center sm:block
        px-4 sm:px-0
        pointer-events-none
      "
    >
      <motion.a
        href="#contact"
        whileHover={!reduceMotion ? { y: -4, scale: 1.04 } : {}}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="
          pointer-events-auto
          relative inline-flex items-center gap-2
          px-5 py-3 sm:px-6 sm:py-3
          rounded-full
          bg-brand-primary text-white font-semibold
          shadow-xl
          ring-1 ring-brand-primary/40
          overflow-hidden
          w-full sm:w-auto
          justify-center
        "
      >
        {/* Glow sweep */}
        {!reduceMotion && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r
                       from-white/0 via-white/25 to-white/0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.9 }}
          />
        )}

        {/* Grain */}
        <span className="noise-overlay rounded-full" />

        <span className="relative z-10">
          Let’s Work Together
        </span>
      </motion.a>
    </div>
  );
}
