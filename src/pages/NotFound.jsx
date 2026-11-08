import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import CommandPalette from "../components/CommandPalette";
import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";

export default function NotFound() {
  const reduceMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <SEO
        title="404 — Route Not Found | Tristan Jorge Cuartero"
        description="The architectural route you requested does not exist."
      />

      {/* Global Synchronized Navbar */}
      <Navbar
        onResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="min-h-screen grid place-items-center px-4 pt-20">
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 30, filter: "blur(6px)" }
          }
          animate={
            reduceMotion
              ? false
              : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative max-w-md w-full text-center rounded-3xl p-8 sm:p-10 glass-card border border-brand-border shadow-2xl"
        >
          {/* Ambient Glow */}
          {!reduceMotion && (
            <div className="absolute -inset-4 -z-10 rounded-full bg-brand-primary/15 blur-2xl pointer-events-none" />
          )}

          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6">
            <Compass className="w-7 h-7" />
          </div>

          <div className="text-xs font-mono font-bold uppercase tracking-widest text-brand-primary mb-2">
            HTTP 404 // ROUTE_NOT_FOUND
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-brand-text mb-4">
            Endpoint Missing
          </h1>

          <p className="text-sm text-brand-muted mb-8 leading-relaxed">
            The requested architecture node or page could not be located in this cluster.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>

            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition"
            >
              <BookOpen className="w-4 h-4" />
              Read Blog
            </Link>
          </div>
        </motion.div>
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
