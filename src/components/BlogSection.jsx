import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Share2,
} from "lucide-react";
import Modal from "./ui/Modal";
import { POSTS, getStoredPosts } from "../data/posts";

export default function BlogSection() {
  const reduceMotion = useReducedMotion();
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState(() => getStoredPosts());

  useEffect(() => {
    const handleUpdate = () => setPosts(getStoredPosts());
    window.addEventListener("posts-updated", handleUpdate);
    return () => window.removeEventListener("posts-updated", handleUpdate);
  }, []);

  return (
    <section
      id="blog"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={!reduceMotion ? { opacity: 0, y: 10 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Field Notes & Insights
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Technical Writings &{" "}
            <span className="gradient-brand">Architectural Notes</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            Practical takeaways on engineering scalable software, teaching computer science, and deploying physical hardware systems.
          </motion.p>
        </div>

        {/* ================= EDITORIAL GRID ================= */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActivePost(post)}
              className="p-6 rounded-3xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/40 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-brand-surface border border-brand-border">
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-brand-muted mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-brand-text group-hover:text-brand-primary transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-primary group-hover:text-brand-primaryHover transition">
                <span>Read Full Field Note</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* ================= ARTICLE READER MODAL ================= */}
      <Modal open={!!activePost} onClose={() => setActivePost(null)}>
        {activePost && (
          <div className="max-h-[85vh] overflow-y-auto pr-2">
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-6 border border-brand-border">
              <img
                src={activePost.cover}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {activePost.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                >
                  {t}
                </span>
              ))}
              <span className="text-xs font-mono text-brand-muted ml-auto">
                {activePost.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-4">
              {activePost.title}
            </h2>

            <div className="pt-4 border-t border-brand-border">
              {activePost.content}
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border flex items-center justify-between">
              <span className="text-xs font-mono text-brand-muted">
                Author: Tristan Jorge Cuartero
              </span>

              <button
                onClick={() => setActivePost(null)}
                className="px-4 py-2 rounded-xl glass-card text-brand-text font-semibold text-xs hover:border-brand-primary transition"
              >
                Close Article
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
