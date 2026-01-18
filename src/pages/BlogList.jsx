import { motion, useReducedMotion } from "framer-motion";
import BlogSection from "../components/BlogSection.jsx";

export default function BlogList() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative py-28 bg-brand-bg text-brand-text">
      {/* ================= HEADER ================= */}
      <motion.header
        initial={!reduceMotion ? { opacity: 0, y: 30 } : false}
        animate={!reduceMotion ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center px-6 mb-20"
      >
        <span className="block mb-4 text-xs font-bold tracking-widest text-brand-primary">
          WRITINGS
        </span>

        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Blog Posts
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Thoughts on systems design, development, education,
          and building software that lasts.
        </p>
      </motion.header>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6">
        <BlogSection />
      </section>
    </main>
  );
}
