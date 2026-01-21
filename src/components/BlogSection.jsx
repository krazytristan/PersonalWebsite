import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const POSTS = [
  {
    id: "ship-fast-react",
    title: "How I Ship React Apps Fast (without the mess)",
    date: "2025-06-30",
    tags: ["React", "UX", "Architecture"],
    excerpt:
      "My practical checklist for going from idea → production with clean UX, strong structure, and minimal regrets.",
    cover: "/images/React-app.jpg",
    link: "#",
    featured: true,
  },
  {
    id: "teaching-tech",
    title: "Teaching Tech: What Actually Works",
    date: "2025-04-12",
    tags: ["Education", "Career"],
    excerpt:
      "Lessons from years of teaching IT & CS — how to keep students motivated and shipping real projects.",
    cover: "/images/tech.jpg",
    link: "#",
  },
  {
    id: "iot-in-batangas",
    title: "IoT in Batangas: Real-World Wins & Pitfalls",
    date: "2025-02-20",
    tags: ["IoT", "APIs", "Case Study"],
    excerpt:
      "A candid field note from deploying small-scale sensors — what surprised us and what to avoid.",
    cover: "/images/IoT.webp",
    link: "#",
  },
];

export default function BlogSection() {
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const inputRef = useRef(null);

  /* ⌘K / Ctrl+K focus */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tags = useMemo(() => {
    const t = new Set(["All"]);
    POSTS.forEach((p) => p.tags.forEach((tag) => t.add(tag)));
    return Array.from(t);
  }, []);

  const results = POSTS.filter((p) => {
    const matchesTag = activeTag === "All" || p.tags.includes(activeTag);
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  const featured = results.find((p) => p.featured);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24 bg-brand-bg">
      {/* ================= HEADER ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="inline-block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          BLOG
        </span>

        <h2 className="text-4xl xl:text-5xl font-black mb-4">
          Writing & Insights
        </h2>

        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Field notes on building systems, teaching technology, and shipping
          real-world software.
        </p>
      </motion.div>

      {/* ================= CONTROLS ================= */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-14">
        <div className="relative w-full sm:max-w-sm">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full px-4 py-3 rounded-xl bg-white ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <span className="absolute right-3 top-3 text-xs opacity-50">
            ⌘K
          </span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ring-1 ${
                activeTag === t
                  ? "bg-brand-primary text-white ring-transparent"
                  : "bg-white ring-black/10 hover:bg-black/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ================= FEATURED ================= */}
      {featured && (
        <article className="mb-20 rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-black/5">
          <div className="grid md:grid-cols-2">
            <img
              src={featured.cover}
              alt=""
              className="w-full h-64 md:h-full object-cover"
            />

            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest text-brand-primary">
                FEATURED
              </span>

              <h3 className="mt-3 text-2xl font-black">
                {featured.title}
              </h3>

              <p className="mt-4 text-zinc-600">
                {featured.excerpt}
              </p>

              <a
                href={featured.link}
                className="mt-6 inline-flex font-semibold text-brand-primary"
              >
                Read article →
              </a>
            </div>
          </div>
        </article>
      )}

      {/* ================= GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results
          .filter((p) => !p.featured)
          .map((p) => (
            <article
              key={p.id}
              className="rounded-3xl overflow-hidden bg-white shadow-lg ring-1 ring-black/5"
            >
              <div className="h-44">
                <img
                  src={p.cover}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <time className="text-xs text-zinc-500">
                  {formatDate(p.date)}
                </time>

                <h3 className="mt-1 text-lg font-bold">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-600">
                  {p.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs bg-brand-primary/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={p.link}
                  className="inline-block mt-5 font-medium text-brand-primary"
                >
                  Read article →
                </a>
              </div>
            </article>
          ))}
      </div>

      {results.length === 0 && (
        <p className="text-center opacity-70 mt-20">
          No posts match your search.
        </p>
      )}
    </section>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
