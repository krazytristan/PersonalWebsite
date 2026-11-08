import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  Bookmark,
  Layers,
} from "lucide-react";
import Modal from "./ui/Modal";
import { POSTS, getStoredPosts } from "../data/posts";
import { sounds } from "../utils/audio";

export default function BlogSection() {
  const reduceMotion = useReducedMotion();
  const [activePost, setActivePost] = useState(null);
  const [posts, setPosts] = useState(() => getStoredPosts());
  const [selectedTag, setSelectedTag] = useState("All");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setPosts(getStoredPosts());
    window.addEventListener("posts-updated", handleUpdate);
    return () => window.removeEventListener("posts-updated", handleUpdate);
  }, []);

  // Compute unique tag categories
  const allTags = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
    });
    return ["All", ...Array.from(set)];
  }, [posts]);

  // Filter posts by tag
  const filteredPosts = useMemo(() => {
    if (selectedTag === "All") return posts;
    return posts.filter((p) => p.tags?.includes(selectedTag));
  }, [posts, selectedTag]);

  // Handle article modal opening
  const handleOpenPost = (post) => {
    sounds.playPop();
    setActivePost(post);
  };

  // Next / Previous article navigation inside reader modal
  const currentIndex = activePost ? posts.findIndex((p) => p.id === activePost.id) : -1;
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const handleCopyArticleLink = (slug) => {
    const url = `${window.location.origin}/blog/${slug}`;
    navigator.clipboard.writeText(url);
    sounds.playSuccess();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section
      id="blog"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.span
            initial={!reduceMotion ? { opacity: 0, y: 10 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Field Notes & Technical Insights
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
            Field-tested takeaways on engineering high-concurrency systems, pedagogical reflections in computing, and physical hardware telemetry.
          </motion.p>

          {/* Filter Pills */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  sounds.playPop();
                  setSelectedTag(tag);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedTag === tag
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                    : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ================= EDITORIAL GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
                whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleOpenPost(post)}
                className="p-6 rounded-3xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/50 hover:shadow-xl transition-all cursor-pointer group relative"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-brand-surface border border-brand-border shadow-inner">
                    <img
                      src={post.cover || "/images/tech.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-900/85 backdrop-blur-md text-white border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 text-xs font-mono text-brand-muted mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                      {new Date(post.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime || post.readingTimeText || "5 min read"}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="font-bold text-lg sm:text-xl text-brand-text group-hover:text-brand-primary transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary group-hover:text-brand-primaryHover transition">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Read Technical Field Note</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* ================= STATE-OF-THE-ART ARTICLE READER MODAL ================= */}
      <Modal
        open={!!activePost}
        onClose={() => setActivePost(null)}
        size="xl"
      >
        {activePost && (
          <div className="space-y-6">
            
            {/* Top Bar: Meta & Share */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-brand-border/70">
              <div className="flex flex-wrap items-center gap-2">
                {activePost.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-brand-muted">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activePost.readTime || activePost.readingTimeText || "5 min read"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activePost.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <button
                  onClick={() => handleCopyArticleLink(activePost.slug || activePost.id)}
                  className="p-1.5 rounded-lg glass-panel border border-brand-border text-brand-muted hover:text-brand-text transition flex items-center gap-1"
                  title="Copy permanent article link"
                >
                  {copiedLink ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px] hidden sm:inline">{copiedLink ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
              {activePost.title}
            </h1>

            {/* Author Attribution */}
            <div className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-sm flex items-center justify-center shrink-0">
                TJ
              </div>
              <div>
                <div className="font-bold text-sm text-brand-text">
                  Tristan Jorge Cuartero
                </div>
                <div className="text-xs font-mono text-brand-muted">
                  Chief Systems Architect & Computer Science Educator
                </div>
              </div>
            </div>

            {/* Visual Cover Banner */}
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-brand-border shadow-lg">
              <img
                src={activePost.cover || "/images/tech.jpg"}
                alt={activePost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Article Content */}
            <div className="pt-2 text-brand-text leading-relaxed text-sm sm:text-base space-y-5">
              {activePost.content ? (
                activePost.content
              ) : activePost.contentString ? (
                <div className="space-y-4 whitespace-pre-line leading-relaxed text-brand-muted">
                  {activePost.contentString}
                </div>
              ) : (
                <p className="text-brand-muted leading-relaxed">
                  {activePost.excerpt}
                </p>
              )}
            </div>

            {/* Key Takeaway Callout Box */}
            <div className="p-5 rounded-2xl glass-card border border-brand-primary/30 bg-brand-primary/5">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-primary mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Core Architectural Principle</span>
              </div>
              <p className="text-xs sm:text-sm text-brand-text leading-relaxed italic">
                "{activePost.excerpt}"
              </p>
            </div>

            {/* Article Reader Footer Navigation */}
            <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {prevPost && (
                  <button
                    onClick={() => handleOpenPost(prevPost)}
                    className="px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4 text-brand-primary" />
                    <span className="hidden sm:inline truncate max-w-[140px]">{prevPost.title}</span>
                    <span className="sm:hidden">Prev Note</span>
                  </button>
                )}

                {nextPost && (
                  <button
                    onClick={() => handleOpenPost(nextPost)}
                    className="px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline truncate max-w-[140px]">{nextPost.title}</span>
                    <span className="sm:hidden">Next Note</span>
                    <ChevronRight className="w-4 h-4 text-brand-primary" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#contact"
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:opacity-95 transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discuss Regarding This Note</span>
                </a>

                <button
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 rounded-xl glass-card border border-brand-border text-brand-muted hover:text-brand-text font-semibold text-xs transition"
                >
                  Close Note
                </button>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </section>
  );
}
