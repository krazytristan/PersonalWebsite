import {
  motion,
  useReducedMotion,
} from "framer-motion";

export default function Highlight({ title, items = [] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 28 } : false}
      whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={
        !reduceMotion
          ? { y: -4 }
          : {}
      }
      className="
        relative
        rounded-2xl
        bg-white/90 backdrop-blur
        shadow-lg
        ring-1 ring-black/5
        p-7
      "
    >
      {/* LEFT ACCENT (matches timeline spine) */}
      <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-l-2xl" />

      {/* CONTENT */}
      <h3 className="mb-4 text-lg font-black text-brand-dark">
        {title}
      </h3>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={`${title}-${i}`}
            initial={!reduceMotion ? { opacity: 0, x: -12 } : false}
            whileInView={!reduceMotion ? { opacity: 1, x: 0 } : false}
            transition={{
              duration: 0.45,
              delay: reduceMotion ? 0 : i * 0.08,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex items-start gap-3 text-sm text-zinc-600 leading-relaxed"
          >
            {/* NODE (same size & tone as timeline) */}
            <span
              aria-hidden
              className="
                mt-[7px]
                h-1.5 w-1.5
                rounded-full
                bg-brand-primary
                flex-shrink-0
              "
            />

            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
