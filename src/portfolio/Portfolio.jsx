import { useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import SystemSimulator from "../components/SystemSimulator";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Achievements from "../components/Achievements";
import BlogSection from "../components/BlogSection";
import Contact from "../components/Contact";

import StickyCTA from "../components/StickyCTA";
import ScrollToTop from "../components/ScrollToTop";
import CommandPalette from "../components/CommandPalette";
import IntroSplash from "../components/IntroSplash";

import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";
import ProjectModal from "../components/ProjectModal";
import CursorSpotlight from "../components/ui/CursorSpotlight";
import PageTransition from "../components/ui/PageTransition";
import SEO from "../components/SEO";

export default function Portfolio() {
  const prefersReducedMotion = useReducedMotion();

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  /* ================= STATE ================= */
  const [showIntro, setShowIntro] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden selection:bg-brand-primary/20 selection:text-brand-primary">
      {/* ================= SEO ================= */}
      <SEO
        title="Tristan Jorge Cuartero — Systems Architect & Full-Stack Engineer"
        description="Systems Architect, Full-Stack Engineer & Educator from Batangas, Philippines. Architecting high-availability cloud platforms, civic systems, and real-time IoT networks."
      />

      {/* ================= OPENING WELCOME INTRO ANIMATION ================= */}
      <AnimatePresence>
        {showIntro && (
          <IntroSplash onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* ================= GLOBAL EFFECTS ================= */}
      {!prefersReducedMotion && !isMobile && <CursorSpotlight />}

      {/* ================= NAVBAR ================= */}
      <Navbar
        onResume={() => setResumeOpen(true)}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative">
        <PageTransition>
          <Hero onOpenPalette={() => setPaletteOpen(true)} />
        </PageTransition>

        <PageTransition delay={0.05}>
          <About />
        </PageTransition>

        <PageTransition delay={0.1}>
          <SystemSimulator />
        </PageTransition>

        <PageTransition delay={0.15}>
          <Projects onOpen={setActiveProject} />
        </PageTransition>

        <PageTransition delay={0.2}>
          <Skills />
        </PageTransition>

        <PageTransition delay={0.25}>
          <Achievements />
        </PageTransition>

        <PageTransition delay={0.3}>
          <BlogSection />
        </PageTransition>

        <PageTransition delay={0.35}>
          <Contact />
        </PageTransition>
      </main>

      {/* ================= FLOATING UTILITIES ================= */}
      {/* Sticky CTA (desktop only) */}
      {!isMobile && (
        <div className="fixed bottom-6 right-6 z-50">
          <StickyCTA onResume={() => setResumeOpen(true)} />
        </div>
      )}

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* ================= COMMAND PALETTE (CTRL+K) ================= */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onResume={() => setResumeOpen(true)}
        onOpenProject={(project) => setActiveProject(project)}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* ================= RESUME MODAL ================= */}
      <AnimatePresence>
        {resumeOpen && (
          <Modal open onClose={() => setResumeOpen(false)}>
            <ResumeViewer />
          </Modal>
        )}
      </AnimatePresence>

      {/* ================= ARCHITECTURAL PROJECT DOSSIER MODAL ================= */}
      <AnimatePresence>
        {activeProject && (
          <Modal open onClose={() => setActiveProject(null)}>
            <ProjectModal
              project={activeProject}
              onClose={() => setActiveProject(null)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
