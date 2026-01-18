import { motion, useReducedMotion } from "framer-motion";

export default function Highlight({ title, items }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
      whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={!reduceMotion ? { y: -6 } : {}}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative rounded-2xl bg-white/90 backdrop-blur shadow-lg ring-1 ring-black/5 overflow-hidden group"
    >
      {/* Top accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-brand-primary" />

      {/* Corner glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-brand-primary/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <h3 className="font-black tracking-tight mb-4 text-brand-dark">
          {title}
        </h3>

        <ul className="space-y-2 text-sm text-zinc-600">
          {items.map((item, i) => (
            <motion.li
              key={item}
              initial={!reduceMotion ? { opacity: 0, x: -8 } : false}
              whileInView={!reduceMotion ? { opacity: 1, x: 0 } : false}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex items-start gap-2"
            >
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-primary flex-shrink-0" />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
