import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import CommandPalette from "../components/CommandPalette";
import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";
import { getPost } from "../data/posts";

export default function PostPage() {
  const { slug } = useParams();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const post = getPost(slug);

  const title =
    post?.title ||
    slug
      ?.split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ") ||
    "Untitled Post";

  const Component = post?._component;

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <SEO
        title={`${title} — Tristan Jorge Cuartero`}
        description={post?.excerpt || "Technical field notes and software engineering insights."}
      />

      {/* Global Synchronized Navbar */}
      <Navbar
        onResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="relative pt-24 sm:pt-32 pb-24">
        {/* Back Link */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Writings
          </Link>
        </div>

        {/* Article Container */}
        <article className="max-w-3xl mx-auto px-4">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border mb-8 shadow-xl"
          >
            {post?.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
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

            <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-4 text-xs font-mono text-brand-muted">
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
              {post?.readingTimeText && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  {post.readingTimeText}
                </span>
              )}
            </div>
          </motion.header>

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="p-6 sm:p-10 rounded-3xl glass-card border border-brand-border shadow-xl space-y-6 text-brand-text leading-relaxed text-sm sm:text-base"
          >
            {post?.content ? (
              post.content
            ) : post?.excerpt ? (
              <p className="text-brand-muted text-base leading-relaxed">
                {post.excerpt}
              </p>
            ) : (
              <div className="space-y-4 text-brand-muted">
                <p>
                  This article is part of Tristan Jorge Cuartero’s technical writings on software architecture, fault-tolerant distributed systems, and civic technology.
                </p>
                <div className="p-4 rounded-2xl glass-panel border border-brand-primary/30 bg-brand-primary/5">
                  <p className="text-xs sm:text-sm text-brand-text font-medium">
                    Full long-form technical publication is available in the interactive modal reader on the portfolio insights page.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Footer Call to Action */}
          <div className="mt-10 p-6 sm:p-8 rounded-3xl glass-card border border-brand-border text-center shadow-lg">
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
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Get In Touch
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
