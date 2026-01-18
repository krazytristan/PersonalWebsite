import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { projects } from "../data/projects";

const INTERVAL = 4000;
const CARD_WIDTH = 360; // includes gap

export default function Projects({ onOpen }) {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  /* -------------------- AUTO SLIDE -------------------- */
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) {
        setActive((i) => (i + 1) % projects.length);
      }
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="projects"
      className="relative py-32 bg-[#FAF3E1] overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#FF6D1F]/20 blur-3xl" />
      </div>

      <h2 className="text-4xl font-black text-center mb-14 text-[#222222]">
        Featured Projects
      </h2>

      {/* VIEWPORT */}
      <div className="relative max-w-6xl mx-auto overflow-hidden">
        {/* TRACK */}
        <motion.div
          animate={{
            x: `calc(50% - ${(active + 0.5) * CARD_WIDTH}px)`,
          }}
          transition={{ type: "spring", stiffness: 160, damping: 25 }}
          className="flex gap-5"
        >
          {projects.map((p, i) => {
            const distance = Math.abs(i - active);
            const isActive = i === active;

            return (
              <motion.div
                key={p.title}
                onClick={() => isActive && onOpen?.(p)}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  opacity: isActive ? 1 : 0.6,
                  filter: isActive ? "blur(0px)" : "blur(1.5px)",
                }}
                transition={{ duration: 0.4 }}
                className="w-[340px] flex-shrink-0 cursor-pointer rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5"
              >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-1 rounded-t-3xl bg-[#FF6D1F]" />

                <h3 className="font-bold text-lg text-[#222222]">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-600">
                  {p.desc}
                </p>

                {isActive && (
                  <span className="inline-block mt-4 text-xs font-semibold px-3 py-1 rounded-full bg-[#F5E7C6] text-[#222222]">
                    Auto-sliding • Click to view
                  </span>
                )}
              </motion.div>
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
                ? "bg-[#FF6D1F] scale-125"
                : "bg-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
