import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";

/* ================= DATA ================= */
const POSTS = [
  {
    id: "ship-fast-react",
    title: "How I Ship React Apps Fast (without the mess)",
    date: "2025-06-30",
    tags: ["React", "UX", "Architecture"],
    excerpt:
      "My practical checklist for going from idea → production with clean UX, strong structure, and minimal regrets.",
    cover: "/images/React-app.jpg",
    link: "/blog/ship-fast-react",
  },
  {
    id: "teaching-tech",
    title: "Teaching Tech: What Actually Works",
    date: "2025-04-12",
    tags: ["Education", "Career"],
    excerpt:
      "Lessons from years of teaching IT & CS — how to keep students motivated and shipping real projects.",
    cover: "/images/tech.jpg",
    link: "/blog/teaching-tech",
  },
  {
    id: "iot-in-batangas",
    title: "IoT in Batangas: Real-World Wins & Pitfalls",
    date: "2025-02-20",
    tags: ["IoT", "APIs", "Case Study"],
    excerpt:
      "A candid field note from deploying small-scale sensors — what surprised us and what to avoid.",
    cover: "/images/IoT.webp",
    link: "/blog/iot-in-batangas",
  },
];

const AUTO_DELAY = 5200;

/* ================= COMPONENT ================= */
export default function BlogSection() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const active = POSTS[index];

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    if (reduceMotion) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % POSTS.length);
    }, AUTO_DELAY);

    return () => clearInterval(id);
  }, [reduceMotion]);

  const go = (dir) => {
    setIndex((i) =>
      dir === "next"
        ? (i + 1) % POSTS.length
        : (i - 1 + POSTS.length) % POSTS.length
    );
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-28 bg-brand-bg overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="text-center mb-20">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          BLOG
        </span>
        <h2 className="text-4xl sm:text-5xl font-black mb-4">
          Writing & Insights
        </h2>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Field notes on building systems, teaching technology, and shipping
          real-world software.
        </p>
      </div>

      {/* ================= CAROUSEL ================= */}
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        {/* =================================================
            LEFT COLUMN – CONTENT
        ================================================= */}
        <div className="relative min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <time className="text-xs font-semibold text-brand-primary tracking-widest">
                {formatDate(active.date)}
              </time>

              <h3 className="mt-3 text-3xl font-black leading-tight">
                {active.title}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {active.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs bg-brand-primary/10 text-brand-primary font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-lg text-zinc-700 max-w-xl">
                {active.excerpt}
              </p>

              <a
                href={active.link}
                className="inline-flex items-center gap-2 mt-8 font-semibold text-brand-primary hover:underline"
              >
                Read article →
              </a>
            </motion.div>
          </AnimatePresence>

          {/* NAV BUTTONS */}
          <div className="mt-10 flex gap-3">
            <button
              onClick={() => go("prev")}
              className="h-10 w-10 rounded-full ring-1 ring-black/10 hover:bg-black/5 transition"
            >
              ←
            </button>
            <button
              onClick={() => go("next")}
              className="h-10 w-10 rounded-full ring-1 ring-black/10 hover:bg-black/5 transition"
            >
              →
            </button>
          </div>
        </div>

        {/* =================================================
            RIGHT COLUMN – IMAGE
        ================================================= */}
        <div className="relative h-[320px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={active.cover}
              src={active.cover}
              alt={active.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* ================= DOTS ================= */}
      <div className="flex justify-center gap-3 mt-14">
        {POSTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index
                ? "bg-brand-primary scale-125"
                : "bg-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

/* ================= UTILS ================= */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
