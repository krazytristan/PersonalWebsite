import { motion, useReducedMotion } from "framer-motion";

export default function StickyCTA({ onResume }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.a
        href="#contact"
        whileHover={!reduceMotion ? { y: -4, scale: 1.04 } : {}}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full 
                   bg-brand-primary text-white font-semibold shadow-lg 
                   ring-1 ring-brand-primary/40
                   overflow-hidden"
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

        <span className="relative z-10">Let’s Work Together</span>
      </motion.a>
    </div>
  );
}
