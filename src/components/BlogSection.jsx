import { useMemo, useState } from "react";

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

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            aria-label="Search posts"
          />
          <span className="absolute right-3 top-2.5 opacity-60 text-xs select-none">⌘K</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={`rounded-full px-3 py-1 text-sm ring-1 ring-black/10 dark:ring-white/20 transition ${
                activeTag === t ? "bg-indigo-600 text-white" : "bg-white/70 dark:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {results.map((p) => (
          <article
            key={p.id}
            className="card overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition"
          >
            <div className="h-40 bg-zinc-100 dark:bg-zinc-800">
              <img
                src={p.cover}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
            <div className="p-5">
              <time className="text-xs opacity-60">{formatDate(p.date)}</time>
              <h3 className="text-lg font-semibold mt-1">{p.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">{p.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="badge bg-white/70 dark:bg-white/10 text-zinc-700 dark:text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={p.link}
                className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Read →
              </a>
            </div>
          </article>
        ))}
      </div>

      {results.length === 0 && (
        <p className="text-center opacity-70 mt-10">No posts match your search.</p>
      )}
    </div>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
