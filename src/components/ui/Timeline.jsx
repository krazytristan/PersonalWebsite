import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const items = [
  {
    year: "2018",
    title: "IT Educator",
    desc: "Started teaching IT & CS, focusing on practical systems and real-world projects.",
    icon: "🎓",
  },
  {
    year: "2021",
    title: "Full-Stack Developer",
    desc: "Built academic systems, dashboards, and reservation platforms.",
    icon: "💻",
  },
  {
    year: "2024",
    title: "Systems Builder",
    desc: "Focused on scalable platforms, UX clarity, and IoT-enabled solutions.",
    icon: "🧠",
  },
];

export default function Timeline() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  /* ================= SCROLL LINE ================= */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const lineScale = reduceMotion
    ? 1
    : useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="relative mt-16"
    >
      {/* ================= CENTER LINE ================= */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-brand-primary/20 -translate-x-1/2 hidden lg:block" />

      {!reduceMotion && (
        <motion.div
          className="absolute left-1/2 top-0 h-full w-px bg-brand-primary origin-top -translate-x-1/2 hidden lg:block"
          style={{ scaleY: lineScale }}
        />
      )}

      {/* ================= ITEMS ================= */}
      <div className="flex flex-col gap-16">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;

          return (
            <motion.div
              key={item.year}
              initial={!reduceMotion ? { opacity: 0, y: 30 } : false}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: reduceMotion ? 0 : i * 0.12,
                ease: "easeOut",
              }}
              className={`
                relative grid grid-cols-1 lg:grid-cols-2 items-start
                ${isLeft ? "" : "lg:text-right"}
              `}
            >
              {/* ================= CONTENT ================= */}
              <div
                className={`
                  px-6
                  ${isLeft ? "lg:pr-16" : "lg:pl-16 lg:col-start-2"}
                `}
              >
                <p className="text-xs font-bold tracking-widest text-brand-primary">
                  {item.year}
                </p>

                <h4 className="mt-1 text-lg font-black text-brand-dark">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-zinc-600 max-w-md lg:ml-auto">
                  {item.desc}
                </p>
              </div>

              {/* ================= NODE ================= */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 hidden lg:flex">
                <motion.div
                  initial={!reduceMotion ? { scale: 0.8, opacity: 0 } : false}
                  whileInView={!reduceMotion ? { scale: 1, opacity: 1 } : false}
                  viewport={{ once: true }}
                  transition={{ delay: reduceMotion ? 0 : i * 0.15 }}
                  className="
                    h-10 w-10 rounded-full
                    bg-white
                    ring-2 ring-brand-primary
                    shadow-lg
                    flex items-center justify-center
                    text-lg
                  "
                >
                  {item.icon}
                </motion.div>
              </div>

              {/* ================= MOBILE NODE ================= */}
              <div className="flex lg:hidden items-center gap-3 px-6 mt-4">
                <span className="h-3 w-3 rounded-full bg-brand-primary" />
                <span className="text-xs text-zinc-500">Milestone</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
