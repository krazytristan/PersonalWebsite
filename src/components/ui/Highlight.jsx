import { motion, useReducedMotion } from "framer-motion";

export default function Highlight({ title, items = [] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
      whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={!reduceMotion ? { y: -4 } : {}}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="
        group relative
        rounded-2xl
        bg-white/90 backdrop-blur
        shadow-lg
        ring-1 ring-black/5
        overflow-hidden
      "
    >
      {/* ================= TOP ACCENT ================= */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-primary" />

      {/* ================= CORNER GLOW ================= */}
      {!reduceMotion && (
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute -top-16 -right-16
            w-40 h-40
            rounded-full
            bg-brand-primary/15
            blur-3xl
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500
          "
        />
      )}

      {/* ================= CONTENT ================= */}
      <div className="relative p-6 sm:p-7">
        <h3 className="mb-5 text-lg font-black tracking-tight text-brand-dark">
          {title}
        </h3>

        <ul className="space-y-3 text-sm text-zinc-600">
          {items.map((item, i) => (
            <motion.li
              key={`${title}-${i}`}
              initial={!reduceMotion ? { opacity: 0, x: -8 } : false}
              whileInView={!reduceMotion ? { opacity: 1, x: 0 } : false}
              transition={{
                duration: 0.35,
                delay: reduceMotion ? 0 : i * 0.05,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="flex items-start gap-3"
            >
              {/* Bullet */}
              <span
                aria-hidden
                className="
                  mt-[6px]
                  h-1.5 w-1.5
                  rounded-full
                  bg-brand-primary
                  flex-shrink-0
                "
              />

              <span className="leading-relaxed">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
