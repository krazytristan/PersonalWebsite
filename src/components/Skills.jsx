import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { skills } from "../data/skills";

export default function Skills() {
  const reduceMotion = useReducedMotion();

  /* Subtle parallax for depth */
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1]);

  return (
    <section
      id="skills"
      className="relative py-36 overflow-hidden bg-brand-bg"
    >
      {/* ================= AMBIENT GLOW ================= */}
      <motion.div
        style={!reduceMotion ? { scale: glowScale } : {}}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-brand-primary/15 blur-3xl" />
      </motion.div>

      {/* ================= HEADER ================= */}
      <div className="text-center mb-20">
        <span className="inline-block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          SKILLS
        </span>
        <h2 className="text-4xl xl:text-5xl font-black text-brand-dark">
          Tech Stack
        </h2>
        <p className="mt-4 text-zinc-600 max-w-xl mx-auto">
          Tools and technologies I use to design, build, and scale real-world systems.
        </p>
      </div>

      {/* ================= MARQUEE ================= */}
      <div className="relative">
        <motion.div
          className="flex gap-16 w-max mx-auto px-8"
          animate={
            !reduceMotion
              ? { x: ["0%", "-50%"] }
              : {}
          }
          transition={{
            duration: 34,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...skills, ...skills].map((skill, i) => (
            <motion.div
              key={`${skill.name}-${i}`}
              whileHover={
                !reduceMotion
                  ? {
                      y: -8,
                      scale: 1.08,
                    }
                  : {}
              }
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="group flex flex-col items-center min-w-[140px]"
            >
              {/* ================= ICON CARD ================= */}
              <div className="relative grid place-items-center w-20 h-20 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-10 h-10 object-contain z-10"
                  loading="lazy"
                />

                {/* Hover glow */}
                <motion.div
                  initial={false}
                  animate={
                    !reduceMotion
                      ? { opacity: [0.4, 0.7, 0.4] }
                      : {}
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-brand-primary/15 opacity-0 group-hover:opacity-100 transition"
                />
              </div>

              {/* ================= LABEL ================= */}
              <span className="mt-5 text-xs font-semibold tracking-wide text-zinc-700">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================= FADE EDGES ================= */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-brand-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-brand-bg to-transparent" />
    </section>
  );
}
