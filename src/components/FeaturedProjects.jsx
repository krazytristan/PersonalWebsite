import { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { projects } from "../data/projects";

const AUTO_DELAY = 5200;
const CARD_WIDTH = 360;
const GAP = 120;

export default function FeaturedProjects() {
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ================= SMART ORDER ================= */
  const featured = useMemo(() => {
    return projects
      .filter((p) => p.featured)
      .sort((a, b) => {
        const score = (p) =>
          (p.year || 0) * 2 +
          (p.tags?.length || 0) * 3 +
          (p.demo ? 5 : 0);
        return score(b) - score(a);
      });
  }, []);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(null);

  const containerRef = useRef(null);

  /* ================= DESKTOP PARALLAX ================= */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const driftY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  /* ================= MAGNETIC (DESKTOP ONLY) ================= */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magneticX = useSpring(mx, { stiffness: 120, damping: 18 });
  const magneticY = useSpring(my, { stiffness: 120, damping: 18 });

  /* ================= AUTO SLIDE (DESKTOP ONLY) ================= */
  useEffect(() => {
    if (reduceMotion || paused || active || isMobile) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % featured.length),
      AUTO_DELAY
    );
    return () => clearInterval(id);
  }, [paused, reduceMotion, active, isMobile]);

  /* ================= MOBILE LAYOUT ================= */
  if (isMobile) {
    return (
      <section
        id="projects"
        className="py-24 bg-brand-bg"
      >
        <div className="text-center mb-14">
          <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
            SELECTED WORK
          </span>
          <h2 className="text-4xl font-black">Featured Projects</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
          {featured.map((project) => (
            <div
              key={project.id}
              className="min-w-[85%] snap-center rounded-2xl bg-white/90 shadow-lg ring-1 ring-black/5"
              onClick={() => setActive(project)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-48 w-full object-cover rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-lg font-black">{project.title}</h3>
                <p className="mt-2 text-sm text-text-muted">
                  {project.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {active && (
            <motion.div
              className="fixed inset-0 z-[999] bg-black/60 grid place-items-center p-6"
              onClick={() => setActive(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="w-full max-w-md rounded-2xl bg-white p-6"
              >
                <h3 className="text-xl font-black mb-2">
                  {active.title}
                </h3>
                <p className="text-text-muted">
                  {active.desc}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  }

  /* ================= DESKTOP CAROUSEL ================= */
  return (
    <motion.section
      ref={containerRef}
      id="projects"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9 }}
      className="relative py-36 bg-brand-bg"
    >
      {/* BACKGROUND */}
      {!reduceMotion && (
        <motion.div
          style={{ y: driftY }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-[-240px] w-[520px] h-[520px] rounded-full bg-brand-secondary/20 blur-3xl" />
        </motion.div>
      )}

      <div className="text-center mb-24">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          SELECTED WORK
        </span>
        <h2 className="text-4xl font-black">Featured Projects</h2>
      </div>

      <div
        className="relative h-[520px] flex items-center justify-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {featured.map((project, i) => {
          const offset = i - index;
          if (Math.abs(offset) > 1) return null;

          const isCenter = offset === 0;
          const x =
            offset === 0
              ? 0
              : offset * (CARD_WIDTH / 2 + GAP);

          return (
            <motion.div key={project.id} className="absolute">
              <motion.article
                animate={{
                  x,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isCenter ? 1 : 0.35,
                  filter: isCenter ? "blur(0px)" : "blur(14px)",
                  zIndex: isCenter ? 3 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 22,
                }}
                onMouseMove={(e) => {
                  if (!isCenter || reduceMotion) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  mx.set(e.clientX - r.left - r.width / 2);
                  my.set(e.clientY - r.top - r.height / 2);
                }}
                onMouseLeave={() => {
                  mx.set(0);
                  my.set(0);
                }}
                style={isCenter ? { x: magneticX, y: magneticY } : {}}
                onClick={() =>
                  isCenter ? setActive(project) : setIndex(i)
                }
                className="w-[360px] rounded-3xl overflow-hidden bg-white/20 ring-1 ring-white/30 shadow-2xl cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-52 w-full object-cover"
                />
                <div className="p-6 bg-white/30 backdrop-blur-xl">
                  <h3 className="text-xl font-black">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">
                    {project.desc}
                  </p>
                </div>
              </motion.article>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 grid place-items-center p-6"
            onClick={() => setActive(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              className="max-w-3xl w-full rounded-3xl bg-white/80 backdrop-blur-xl p-8"
            >
              <h3 className="text-2xl font-black mb-2">
                {active.title}
              </h3>
              <p className="text-text-muted">
                {active.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
