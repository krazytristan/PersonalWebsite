import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import BlogSection from "../components/BlogSection";
import SEO from "../components/SEO";
import CommandPalette from "../components/CommandPalette";
import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";

export default function BlogList() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      <SEO
        title="Technical Writings & Field Notes — Tristan Jorge Cuartero"
        description="Reflections on software architecture, computer science education, and real-world systems."
      />

      {/* Global Synchronized Navbar */}
      <Navbar
        onResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="relative pt-24 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </Link>
        </div>

        <BlogSection />
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
