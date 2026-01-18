import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { projects } from "../data/projects";

const AUTO_DELAY = 5200;
const CARD_WIDTH = 360;
const GAP = 120;

export default function FeaturedProjects() {
  const reduceMotion = useReducedMotion();
  const featured = projects.filter((p) => p.featured);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(null);

  const prev = () =>
    setIndex((i) => (i - 1 + featured.length) % featured.length);
  const next = () =>
    setIndex((i) => (i + 1) % featured.length);

  /* ================= AUTO SLIDE ================= */
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
    <section
      id="projects"
      className="relative py-36 bg-brand-bg overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center mb-24">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          SELECTED WORK
        </span>
        <h2 className="text-4xl font-black">Featured Projects</h2>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div
        className="relative h-[480px] flex items-center justify-center"
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
            <motion.article
              key={project.id}
              initial={false}
              animate={{
                x,
                scale: isCenter ? 1 : 0.86,
                opacity: isCenter ? 1 : 0.45,
                filter: isCenter ? "blur(0px)" : "blur(8px)",
                zIndex: isCenter ? 3 : 1,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 22 }}
              onClick={() => (isCenter ? setActive(project) : setIndex(i))}
              className={`absolute w-[360px] rounded-3xl bg-brand-surface
                shadow-2xl ring-1 ring-black/10 overflow-hidden
                ${!isCenter ? "cursor-pointer" : ""}`}
            >
              {/* IMAGE / VIDEO */}
              <div className="relative h-52 overflow-hidden">
                {project.video && isCenter ? (
                  <video
                    src={project.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {!isCenter && (
                  <div className="absolute inset-0 bg-black/40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-xl font-black">{project.title}</h3>
                <p className="mt-2 text-sm text-text-muted">
                  {project.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs
                        bg-brand-primary/10 text-brand-primary
                        ring-1 ring-brand-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* ================= DOTS ================= */}
      <div className="mt-14 flex justify-center gap-3">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index
                ? "w-8 bg-brand-primary"
                : "w-2.5 bg-brand-primary/30"
            }`}
          />
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/60 grid place-items-center p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full rounded-3xl bg-white p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black mb-2">
                {active.title}
              </h3>
              <p className="text-text-muted mb-6">
                {active.desc}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm
                      bg-brand-primary/10 text-brand-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {active.demo && (
                  <a
                    href={active.demo}
                    target="_blank"
                    className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold"
                  >
                    Live Demo
                  </a>
                )}
                {active.repo && (
                  <a
                    href={active.repo}
                    target="_blank"
                    className="px-5 py-2 rounded-xl bg-black/5 font-semibold"
                  >
                    Source Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
