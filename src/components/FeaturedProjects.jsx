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
    window.matchMedia("(max-width: 768px)").matches;

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
  const [slowMo, setSlowMo] = useState(false);

  const containerRef = useRef(null);
  const hoverSound = useRef(null);
  const playedRef = useRef(false);

  /* ================= SCROLL PARALLAX ================= */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const driftY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  /* ================= MAGNETIC ================= */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magneticX = useSpring(mx, { stiffness: 120, damping: 18 });
  const magneticY = useSpring(my, { stiffness: 120, damping: 18 });

  /* ================= AUTO SLIDE ================= */
  const next = () =>
    setIndex((i) => (i + 1) % featured.length);
  const prev = () =>
    setIndex((i) => (i - 1 + featured.length) % featured.length);

  useEffect(() => {
    if (reduceMotion || paused || active) return;
    const id = setInterval(next, AUTO_DELAY);
    return () => clearInterval(id);
  }, [paused, reduceMotion, active]);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const onKey = (e) => {
      if (active && e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <motion.section
      ref={containerRef}
      id="projects"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.9 }}
      className="relative py-36 bg-brand-bg overflow-hidden"
    >
      {!reduceMotion && (
        <audio ref={hoverSound} src="/sounds/hover.mp3" preload="auto" />
      )}

      {/* ================= BACKGROUND ================= */}
      <motion.div
        style={!reduceMotion ? { y: driftY } : {}}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-240px] w-[520px] h-[520px] rounded-full bg-brand-secondary/20 blur-3xl" />
      </motion.div>

      {/* ================= HEADER ================= */}
      <div className="text-center mb-24">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          SELECTED WORK
        </span>
        <h2 className="text-4xl font-black">Featured Projects</h2>
      </div>

      {/* ================= CAROUSEL ================= */}
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
              {/* REFLECTION */}
              {isCenter && !isMobile && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[300px] h-[120px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
                    filter: "blur(14px)",
                    transform: "scaleY(-1)",
                    opacity: 0.3,
                  }}
                />
              )}

              <motion.article
                animate={{
                  x,
                  scale: isCenter ? 1 : 0.82,
                  opacity: isCenter ? 1 : 0.35,
                  filter:
                    !isMobile && !reduceMotion
                      ? isCenter
                        ? "blur(0px)"
                        : "blur(14px)"
                      : "none",
                  zIndex: isCenter ? 3 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: slowMo ? 60 : 140,
                  damping: slowMo ? 30 : 22,
                }}
                onDoubleClick={() =>
                  isCenter && setSlowMo((s) => !s)
                }
                onMouseMove={(e) => {
                  if (!isCenter || reduceMotion || isMobile) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  mx.set(e.clientX - r.left - r.width / 2);
                  my.set(e.clientY - r.top - r.height / 2);
                }}
                onMouseEnter={() => {
                  if (
                    isCenter &&
                    hoverSound.current &&
                    !playedRef.current
                  ) {
                    hoverSound.current.currentTime = 0;
                    hoverSound.current.play();
                    playedRef.current = true;
                  }
                }}
                onMouseLeave={() => {
                  mx.set(0);
                  my.set(0);
                  playedRef.current = false;
                }}
                style={
                  isCenter && !reduceMotion && !isMobile
                    ? { x: magneticX, y: magneticY }
                    : {}
                }
                onClick={() =>
                  isCenter ? setActive(project) : setIndex(i)
                }
                className="
                  w-[360px] rounded-3xl overflow-hidden
                  backdrop-blur-2xl
                  bg-white/20 dark:bg-white/10
                  ring-1 ring-white/30
                  shadow-[0_35px_70px_rgba(0,0,0,0.35)]
                  cursor-pointer
                "
              >
                {/* LIQUID GLASS */}
                {isCenter && !reduceMotion && !isMobile && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ opacity: [0.25, 0.5, 0.25] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    style={{
                      background:
                        "radial-gradient(320px at 30% 20%, rgba(255,255,255,0.45), transparent 65%)",
                    }}
                  />
                )}

                {/* IMAGE */}
                <div className="relative h-52">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                {/* CONTENT */}
                <div className="p-6 backdrop-blur-xl bg-white/30 dark:bg-white/10">
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

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md grid place-items-center p-6"
            onClick={() => setActive(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 40 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="max-w-3xl w-full rounded-3xl bg-white/70 dark:bg-white/20 backdrop-blur-2xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-2">
                {active.title}
              </h3>
              <p className="text-text-muted mb-6">
                {active.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
