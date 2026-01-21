import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { skills } from "../data/skills";

/* ================= HEADER PRESETS ================= */
const HEADER_PRESETS = {
  it: {
    label: "Skills & Tools",
    title: (
      <>
        Technologies I Use
        <span className="block text-brand-primary">
          to Build Modern Systems
        </span>
      </>
    ),
    desc:
      "A focused set of technologies and tools I use to design, develop, and maintain scalable, real-world applications.",
  },
  engineering: {
    label: "Technical Skills",
    title: (
      <>
        Engineering Tools
        <span className="block text-brand-primary">
          & Technical Proficiency
        </span>
      </>
    ),
    desc:
      "A collection of engineering-focused tools and technologies applied in system development, analysis, and implementation.",
  },
};

export default function Skills({ headerVariant = "it" }) {
  const reduceMotion = useReducedMotion();
  const header = HEADER_PRESETS[headerVariant];

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ================= PARALLAX GLOW (DESKTOP) ================= */
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
  });
  const glowScale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <section id="skills" className="py-24 bg-brand-bg overflow-hidden">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 px-4"
        >
          <span className="inline-block mb-3 px-4 py-1.5 rounded-full
            bg-brand-primary/10 text-brand-primary
            text-xs font-semibold tracking-wide">
            {header.label}
          </span>

          <h2 className="text-4xl font-black text-text-primary">
            {header.title}
          </h2>

          <p className="mt-4 text-text-muted max-w-md mx-auto">
            {header.desc}
          </p>
        </motion.div>

        {/* HORIZONTAL SKILLS */}
        <div className="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              whileTap={{ scale: 0.95 }}
              className="min-w-[120px] snap-center flex flex-col items-center"
            >
              <div className="grid place-items-center w-16 h-16 rounded-xl
                bg-brand-surface shadow ring-1 ring-brand-text/10">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="mt-3 text-xs font-semibold text-text-muted">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <section
      id="skills"
      className="relative py-36 bg-brand-bg overflow-hidden"
    >
      {/* AMBIENT GLOW */}
      {!reduceMotion && (
        <motion.div
          style={{ scale: glowScale }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <div
            className="absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[720px] h-[720px]
            rounded-full bg-brand-primary/15 blur-3xl"
          />
        </motion.div>
      )}

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 max-w-3xl mx-auto px-4"
      >
        <span
          className="inline-block mb-4 px-4 py-1.5 rounded-full
          bg-brand-primary/10 text-brand-primary
          text-xs md:text-sm font-semibold tracking-wide"
        >
          {header.label}
        </span>

        <h2
          className="text-4xl md:text-5xl lg:text-6xl
          font-black text-text-primary leading-tight"
        >
          {header.title}
        </h2>

        <p className="mt-6 text-sm md:text-base text-text-muted leading-relaxed">
          {header.desc}
        </p>
      </motion.div>

      {/* MARQUEE */}
      <div className="relative">
        <motion.div
          className="flex gap-16 w-max mx-auto px-8"
          animate={
            !reduceMotion ? { x: ["0%", "-50%"] } : {}
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
                  ? { y: -10, scale: 1.1 }
                  : {}
              }
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="flex flex-col items-center min-w-[140px]"
            >
              <div
                className="grid place-items-center w-20 h-20 rounded-2xl
                bg-brand-surface shadow-lg ring-1 ring-brand-text/10"
              >
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
              <span
                className="mt-5 text-xs font-semibold tracking-wide text-text-muted"
              >
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* FADE EDGES */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-brand-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-brand-bg to-transparent" />
    </section>
  );
}
