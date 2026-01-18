import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const POSTS = [
  {
    id: "ship-fast-react",
    title: "How I Ship React Apps Fast (without the mess)",
    date: "2025-06-30",
    tags: ["React", "UX", "Architecture"],
    excerpt:
      "My practical checklist for going from idea → production with clean UX, strong structure, and minimal regrets.",
    cover: "/images/blog/react-ship.jpg",
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
    cover: "/images/blog/teaching.jpg",
    link: "#",
  },
  {
    id: "iot-in-batangas",
    title: "IoT in Batangas: Real-World Wins & Pitfalls",
    date: "2025-02-20",
    tags: ["IoT", "APIs", "Case Study"],
    excerpt:
      "A candid field note from deploying small-scale sensors — what surprised us and what to avoid.",
    cover: "/images/blog/iot.jpg",
    link: "#",
  },
];

export default function BlogSection() {
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
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.join(" ").toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  const featured = results.find((p) => p.featured);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-36 bg-brand-bg">
      {/* Ambient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-brand-primary/15 blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <span className="inline-block mb-3 text-sm font-semibold tracking-wide text-brand-primary">
          BLOG
        </span>
        <h2 className="text-4xl xl:text-5xl font-black text-brand-dark mb-4">
          Writing & Insights
        </h2>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Field notes on building systems, teaching technology, and shipping
          real-world software.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full px-4 py-3 rounded-xl bg-white/80 backdrop-blur ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
          <span className="absolute right-3 top-3 text-xs opacity-50">
            ⌘K / Ctrl+K
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ring-1 ${
                activeTag === t
                  ? "bg-brand-primary text-white shadow ring-transparent"
                  : "bg-white/80 ring-black/10 hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <motion.article
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 mb-24 grid md:grid-cols-2 gap-12 rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden"
        >
          <img
            src={featured.cover}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="p-10 flex flex-col justify-center">
            <span className="text-sm font-semibold text-brand-primary">
              Featured Article
            </span>
            <h3 className="mt-3 text-2xl xl:text-3xl font-black text-brand-dark">
              {featured.title}
            </h3>
            <p className="mt-4 text-zinc-600">
              {featured.excerpt}
            </p>
            <a
              href={featured.link}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"
            >
              Read article →
            </a>
          </div>
        </motion.article>
      )}

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {results
          .filter((p) => !p.featured)
          .map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-3xl overflow-hidden bg-white ring-1 ring-black/5 shadow-lg hover:shadow-2xl transition"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.cover}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <time className="text-xs text-zinc-500">
                  {formatDate(p.date)}
                </time>

                <h3 className="mt-1 text-lg font-bold text-brand-dark">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-600">
                  {p.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs bg-brand-primary/10 text-brand-dark"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={p.link}
                  className="inline-block mt-5 font-medium text-brand-primary group-hover:underline"
                >
                  Read article →
                </a>
              </div>

              {/* Hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-brand-primary/5" />
            </motion.article>
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
