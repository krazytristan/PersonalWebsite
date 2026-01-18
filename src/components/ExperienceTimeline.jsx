import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../data/projects"; // can be replaced with experience data

export default function ExperienceTimeline() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  const next = () =>
    setIndex((i) => Math.min(i + 1, projects.length - 1));

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="experience"
      className="relative py-36 bg-brand-bg overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center mb-24">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          EXPERIENCE
        </span>
        <h2 className="text-4xl font-black text-brand-dark">
          Professional Journey
        </h2>
        <p className="mt-4 text-zinc-600 max-w-xl mx-auto">
          Roles and projects that shaped my approach to building scalable,
          human-centered systems.
        </p>
      </div>

      {/* ================= TIMELINE ================= */}
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-primary/20 -translate-x-1/2 hidden md:block" />

        <div className="relative flex items-center justify-center h-[420px]">
          {projects.map((item, i) => {
            const offset = i - index;
            if (Math.abs(offset) > 1) return null;

            const isCenter = offset === 0;

            return (
              <motion.article
                key={item.title}
                initial={false}
                animate={{
                  x: offset * 420,
                  scale: isCenter ? 1 : 0.88,
                  opacity: isCenter ? 1 : 0.45,
                  filter: isCenter ? "blur(0px)" : "blur(6px)",
                  zIndex: isCenter ? 3 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 22,
                }}
                onClick={() => !isCenter && setIndex(i)}
                className={`absolute w-[360px] rounded-3xl bg-white/90
                  backdrop-blur shadow-2xl ring-1 ring-black/10 p-7
                  ${!isCenter ? "cursor-pointer" : ""}`}
              >
                {/* Year / Phase */}
                {item.year && (
                  <span className="text-xs font-semibold tracking-widest text-brand-primary">
                    {item.year}
                  </span>
                )}

                <h3 className="mt-2 text-xl font-black text-brand-dark">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                  {item.desc || item.description}
                </p>

                {item.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
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
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="mt-20 flex justify-center gap-10">
        <button
          onClick={prev}
          aria-label="Previous experience"
          className="h-11 w-11 rounded-full bg-brand-surface
            ring-1 ring-black/10 hover:bg-black/5 transition"
        >
          ◀
        </button>

        <button
          onClick={next}
          aria-label="Next experience"
          className="h-11 w-11 rounded-full bg-brand-surface
            ring-1 ring-black/10 hover:bg-black/5 transition"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
