import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function PostPage() {
  const { slug } = useParams();

  const title =
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") || "Untitled Post";

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 transition-colors">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative border-b border-black/5 dark:border-white/10"
      >
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            ← Back to Blog
          </Link>

          <h1 className="mt-6 text-3xl md:text-4xl font-black leading-tight">
            {title}
          </h1>

          <p className="mt-4 text-zinc-600 dark:text-zinc-300 max-w-2xl">
            This is a placeholder post page. Replace this with MDX, CMS,
            or a static content source when ready.
          </p>
        </div>
      </motion.header>

      {/* Article */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="max-w-3xl mx-auto px-4 py-14"
      >
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p>
            This area is intentionally styled using <code>prose</code> so your
            future content (Markdown / MDX / CMS HTML) will automatically look
            polished and readable.
          </p>

          <h2>Why this layout works</h2>
          <ul>
            <li>Comfortable line width for long reads</li>
            <li>Clear visual hierarchy</li>
            <li>Dark mode optimized</li>
            <li>Drop-in ready for MDX or CMS</li>
          </ul>

          <blockquote>
            “Good writing deserves good spacing.”
          </blockquote>

          <p>
            When you’re ready, replace this block with your real article body.
          </p>
        </div>
      </motion.article>

      {/* Footer CTA */}
      <footer className="border-t border-black/5 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Want to discuss this post or collaborate?
          </p>
          <Link
            to="/#contact"
            className="inline-block mt-3 px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow"
          >
            Get in touch
          </Link>
        </div>
      </footer>
    </main>
  );
}
