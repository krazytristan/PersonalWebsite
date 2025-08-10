// Collect all MDX files and expose metadata + link
export function getAllPosts() {
  const modules = import.meta.glob("../posts/*.mdx", { eager: true });
  const items = Object.entries(modules).map(([path, mod]) => {
    const slug = path.split("/").pop().replace(/\.mdx$/, "");
    const fm = mod.frontmatter || {};
    return {
      id: slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      tags: fm.tags ?? [],
      excerpt: fm.excerpt ?? "",
      cover: fm.cover ?? "",
      link: `/blog/${slug}`,
      _component: mod.default,       // MDX component for detail page
      _frontmatter: fm,
    };
  });

  return items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getPost(slug) {
  const match = getAllPosts().find((p) => p.id === slug);
  return match || null;
}
