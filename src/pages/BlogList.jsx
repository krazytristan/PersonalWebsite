import { useReducedMotion } from "framer-motion";
import BlogSection from "../components/BlogSection";

export default function BlogList() {
  const reduceMotion = useReducedMotion();

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  return (
    <main className="relative py-28 bg-brand-bg text-brand-text">
      {/* ================= HEADER ================= */}
      <header
        className={`max-w-4xl mx-auto text-center px-6 mb-20 ${
          !reduceMotion && !isMobile ? "animate-fade-in-up" : ""
        }`}
      >
        <span className="block mb-4 text-xs font-bold tracking-widest text-brand-primary">
          WRITINGS
        </span>

        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Blog Posts
        </h1>

        <p className="text-lg text-text-muted">
          Thoughts on systems design, development, education,
          and building software that lasts.
        </p>
      </header>

      {/* ================= CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6">
        <BlogSection />
      </section>
    </main>
  );
}
