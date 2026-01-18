import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const items = [
  {
    year: "2018",
    title: "IT Educator",
    desc: "Started teaching IT & CS, focusing on practical systems and real-world projects.",
  },
  {
    year: "2021",
    title: "Full-Stack Developer",
    desc: "Built academic systems, dashboards, and reservation platforms.",
  },
  {
    year: "2024",
    title: "Systems Builder",
    desc: "Focused on scalable platforms, UX clarity, and IoT-enabled solutions.",
  },
];

export default function Timeline() {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  /* Scroll-linked line growth */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="relative mt-16 pl-8">
      {/* ================= VERTICAL LINE ================= */}
      <div className="absolute left-[14px] top-0 h-full w-[2px] bg-brand-primary/20" />

      {!reduceMotion && (
        <motion.div
          className="absolute left-[14px] top-0 h-full w-[2px] bg-brand-primary origin-top"
          style={{ scaleY: lineScale }}
        />
      )}

      {/* ================= ITEMS ================= */}
      {items.map((item, i) => (
        <motion.div
          key={item.year}
          initial={!reduceMotion ? { opacity: 0, x: -24 } : false}
          whileInView={!reduceMotion ? { opacity: 1, x: 0 } : false}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.6,
            delay: i * 0.12,
            ease: "easeOut",
          }}
          whileHover={
            !reduceMotion
              ? {
                  y: -4,
                }
              : {}
          }
          className="relative mb-12"
        >
          {/* ================= NODE ================= */}
          <motion.span
            initial={!reduceMotion ? { scale: 0.8, opacity: 0 } : false}
            whileInView={!reduceMotion ? { scale: 1, opacity: 1 } : false}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="absolute left-[6px] top-1.5 w-4 h-4 rounded-full bg-brand-primary ring-4 ring-brand-bg shadow-[0_0_0_6px_rgba(255,109,31,0.15)]"
          />

          {/* ================= CONTENT ================= */}
          <div className="ml-6">
            <p className="text-xs tracking-widest uppercase text-brand-primary font-semibold">
              {item.year}
            </p>

            <h4 className="mt-1 font-black text-brand-dark">
              {item.title}
            </h4>

            <p className="mt-1 text-sm text-zinc-600 max-w-md leading-relaxed">
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
