import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";

export default function StickyCTA({ onResume }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="pointer-events-auto"
    >
      <motion.a
        href="#contact"
        whileHover={!reduceMotion ? { y: -3, scale: 1.03 } : {}}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs tracking-wide shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 border border-white/20 transition-all overflow-hidden"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Initiate Contact</span>
      </motion.a>
    </motion.div>
  );
}
