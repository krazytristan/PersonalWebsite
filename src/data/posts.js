// src/lib/posts.js

let CACHE = null;

/* -------------------- UTIL -------------------- */
function estimateReadingTime(text = "") {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200)); // ~200 wpm
  return {
    minutes,
    text: `${minutes} min read`,
    words,
  };
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((t) => String(t).toLowerCase()))];
}

function parseDate(date) {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}

/* -------------------- ALL POSTS -------------------- */
export function getAllPosts() {
  if (CACHE) return CACHE;

  const modules = import.meta.glob("../posts/*.mdx", { eager: true });

  const items = Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/").pop().replace(/\.mdx$/, "");
    const fm = mod.frontmatter ?? {};

    const dateObj = parseDate(fm.date);
    const reading = estimateReadingTime(
      typeof mod.default === "function"
        ? fm.excerpt || ""
        : ""
    );

    return {
      /* ================= PUBLIC ================= */
      id: slug,
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      dateObj,
      year: dateObj ? dateObj.getFullYear() : null,
      tags: normalizeTags(fm.tags),
      excerpt: fm.excerpt ?? "",
      summary: fm.excerpt ?? "",
      cover: fm.cover ?? "",
      featured: Boolean(fm.featured),
      published: fm.published !== false,

      readingTime: reading.minutes,
      readingTimeText: reading.text,
      wordCount: reading.words,

      link: `/blog/${slug}`,

      /* ================= INTERNAL ================= */
      _component: mod.default,
      _frontmatter: fm,
    };
  });

  CACHE = Object.freeze(
    items
      .filter((p) => p.published)
      .sort((a, b) => {
        // Featured first, then newest
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }
        return (b.dateObj?.getTime() || 0) - (a.dateObj?.getTime() || 0);
      })
  );

  return CACHE;
}

/* -------------------- SINGLE POST -------------------- */
export function getPost(slug) {
  if (!slug) return null;
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}
