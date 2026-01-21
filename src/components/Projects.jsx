import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../data/projects";

const INTERVAL = 4200;
const CARD_WIDTH = 360;
const GAP = 24;

export default function Projects({ onOpen }) {
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const [active, setActive] = useState(0);
  const paused = useRef(false);

  /* ================= DESKTOP AUTO SLIDE ================= */
  useEffect(() => {
    if (reduceMotion || isMobile) return;

    const id = setInterval(() => {
      if (!paused.current) {
        setActive((i) => (i + 1) % projects.length);
      }
    }, INTERVAL);

    return () => clearInterval(id);
  }, [reduceMotion, isMobile]);

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <section id="projects" className="py-24 bg-brand-bg">
        <h2 className="text-4xl font-black text-center mb-12">
          Featured Projects
        </h2>

        <div className="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpen?.(p)}
              className="min-w-[85%] snap-center rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-44 w-full object-cover"
                loading="lazy"
              />

              <div className="p-5">
                <h3 className="font-black text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-text-muted">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ================= DESKTOP ================= */
  return (
    <section
      id="projects"
      className="relative py-32 bg-brand-bg overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-primary/20 blur-3xl" />
      </div>

      <h2 className="text-4xl font-black text-center mb-16">
        Featured Projects
      </h2>

      <div className="relative max-w-6xl mx-auto overflow-hidden">
        <motion.div
          animate={{
            x: `calc(50% - ${(active + 0.5) * (CARD_WIDTH + GAP)}px)`,
          }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="flex gap-6"
        >
          {projects.map((p, i) => {
            const isActive = i === active;

            return (
              <motion.article
                key={p.id}
                onClick={() => (isActive ? onOpen?.(p) : setActive(i))}
                animate={{
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.4,
                  filter: isActive ? "blur(0px)" : "blur(12px)",
                }}
                transition={{ duration: 0.4 }}
                className="relative w-[360px] flex-shrink-0 rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden cursor-pointer"
              >
                {/* MEDIA */}
                <div className="relative h-48 overflow-hidden">
                  {p.video && !reduceMotion ? (
                    <video
                      src={p.video}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img
                      src={p.image}
                      alt={p.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isActive ? "scale-105" : ""
                      }`}
                      loading="lazy"
                    />
                  )}

                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary" />
                </div>

                {/* CONTENT */}
                <div className="p-6 relative">
                  <h3 className="font-black text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-text-muted">{p.desc}</p>

                  {/* STACK */}
                  {isActive && p.stack && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-full text-xs font-semibold
                                     bg-brand-primary/10 text-brand-primary
                                     ring-1 ring-brand-primary/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-12">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === active
                ? "bg-brand-primary scale-125"
                : "bg-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
