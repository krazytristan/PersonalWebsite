import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import CommandPalette from "../components/CommandPalette";
import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";
import { getPost, getStoredPosts } from "../data/posts";
import { sounds } from "../utils/audio";

export default function PostPage() {
  const { slug } = useParams();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [allPosts, setAllPosts] = useState(() => getStoredPosts());

  useEffect(() => {
    const onUpdate = () => setAllPosts(getStoredPosts());
    window.addEventListener("posts-updated", onUpdate);
    return () => window.removeEventListener("posts-updated", onUpdate);
  }, []);

  const post = allPosts.find((p) => p.slug === slug || p.id === slug) || getPost(slug);

  const currentIndex = post ? allPosts.findIndex((p) => p.id === post.id || p.slug === post.slug) : -1;
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const title =
    post?.title ||
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") ||
    "Untitled Post";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    sounds.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary flex flex-col">
      <SEO
        title={`${title} — Tristan Jorge Cuartero`}
        description={post?.excerpt || "Technical field notes and software engineering insights."}
      />

      {/* Global Synchronized Navbar */}
      <Navbar
        onResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="relative pt-24 sm:pt-32 pb-24 flex-1">
        {/* Top Navigation & Share Bar */}
        <div className="max-w-3xl mx-auto px-4 mb-6 flex items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Writings</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-brand-primary" />
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl mx-auto px-4 space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border shadow-xl space-y-5"
          >
            {post?.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-brand-text leading-tight">
              {title}
            </h1>

            {/* Author & Date Meta */}
            <div className="pt-4 border-t border-brand-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center">
                  TJ
                </div>
                <div>
                  <div className="text-xs font-bold text-brand-text">Tristan Jorge Cuartero</div>
                  <div className="text-[11px] font-mono text-brand-muted">Chief Systems Architect & Educator</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-brand-muted">
                {post?.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                    {new Date(post.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
                {(post?.readTime || post?.readingTimeText) && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-primary" />
                    {post.readTime || post.readingTimeText}
                  </span>
                )}
              </div>
            </div>

            {/* Cover Banner */}
            {post?.cover && (
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-brand-border mt-4">
                <img
                  src={post.cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </motion.header>

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45 }}
            className="p-6 sm:p-10 rounded-3xl glass-card border border-brand-border shadow-xl space-y-6 text-brand-text leading-relaxed text-sm sm:text-base"
          >
            {post?.content ? (
              post.content
            ) : post?.contentString ? (
              <div className="space-y-4 whitespace-pre-line leading-relaxed text-brand-muted">
                {post.contentString}
              </div>
            ) : post?.excerpt ? (
              <p className="text-brand-muted text-base leading-relaxed">
                {post.excerpt}
              </p>
            ) : (
              <div className="space-y-4 text-brand-muted">
                <p>
                  This article is part of Tristan Jorge Cuartero’s technical writings on software architecture, fault-tolerant distributed systems, and civic technology.
                </p>
              </div>
            )}

            {post?.excerpt && (
              <div className="p-5 rounded-2xl glass-panel border border-brand-primary/30 bg-brand-primary/5 mt-6">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-primary mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Architectural Summary</span>
                </div>
                <p className="text-xs sm:text-sm text-brand-text italic">
                  "{post.excerpt}"
                </p>
              </div>
            )}
          </motion.div>

          {/* Prev / Next Article Switcher */}
          {(prevPost || nextPost) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug || prevPost.id}`}
                  className="p-4 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition flex items-center gap-3 group"
                >
                  <ChevronLeft className="w-5 h-5 text-brand-primary group-hover:-translate-x-1 transition-transform shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase text-brand-muted">Previous Note</div>
                    <div className="text-xs sm:text-sm font-bold text-brand-text truncate">{prevPost.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug || nextPost.id}`}
                  className="p-4 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition flex items-center justify-end gap-3 text-right group"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase text-brand-muted">Next Note</div>
                    <div className="text-xs sm:text-sm font-bold text-brand-text truncate">{nextPost.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-brand-primary group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ) : <div />}
            </div>
          )}

          {/* Footer Call to Action */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border text-center shadow-lg">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-primary font-bold">
              Discussion & Consultation
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-brand-text mt-2">
              Interested in discussing this architecture?
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-lg mx-auto">
              Feel free to connect for software consultations, engineering lectures, or civic GovTech partnerships.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/#contact"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </Link>
              <Link
                to="/blog"
                className="px-5 py-2.5 rounded-full glass-card border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition"
              >
                Browse All Writings
              </Link>
            </div>
          </div>
        </article>
      </main>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onResume={() => setResumeOpen(true)}
      />

      {/* Resume Modal */}
      <Modal open={resumeOpen} onClose={() => setResumeOpen(false)}>
        <ResumeViewer />
      </Modal>
    </div>
  );
}
