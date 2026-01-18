import { useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Achievements from "../components/Achievements";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import BlogSection from "../components/BlogSection";
import Contact from "../components/Contact";
import StickyCTA from "../components/StickyCTA";
import ScrollToTop from "../components/ScrollToTop";

import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";
import CursorSpotlight from "../components/ui/CursorSpotlight";
import PageTransition from "../components/ui/PageTransition";
import SEO from "../components/SEO";

export default function Portfolio() {
  const prefersReducedMotion = useReducedMotion();

  /* ================= MODAL STATE ================= */
  const [resumeOpen, setResumeOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div className="relative min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">
      {/* ================= SEO ================= */}
      <SEO
        title="Tristan Cuartero | Systems Architect & Educator"
        description="I design and build scalable systems, dashboards, and human-centered platforms."
      />

      {/* ================= GLOBAL EFFECTS ================= */}
      {!prefersReducedMotion && <CursorSpotlight />}

      {/* ================= NAVBAR ================= */}
      <Navbar onResume={() => setResumeOpen(true)} />

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative">
        <PageTransition>
          <Hero />
        </PageTransition>

        <PageTransition delay={0.05}>
          <About />
        </PageTransition>

        <PageTransition delay={0.1}>
          <Achievements />
        </PageTransition>

        <PageTransition delay={0.15}>
          <Projects onOpen={(project) => setActiveProject(project)} />
        </PageTransition>

        <PageTransition delay={0.2}>
          <Skills />
        </PageTransition>

        <PageTransition delay={0.25}>
          <section className="py-28">
            <BlogSection />
          </section>
        </PageTransition>

        <PageTransition delay={0.3}>
          <Contact />
        </PageTransition>
      </main>

      {/* ================= UTILITIES ================= */}
      <ScrollToTop />
      <StickyCTA onResume={() => setResumeOpen(true)} />

      {/* ================= RESUME MODAL ================= */}
      <AnimatePresence>
        <Modal open={resumeOpen} onClose={() => setResumeOpen(false)}>
          <ResumeViewer />
        </Modal>
      </AnimatePresence>

      {/* ================= PROJECT MODAL ================= */}
      <AnimatePresence>
        <Modal
          open={!!activeProject}
          onClose={() => setActiveProject(null)}
        >
          {activeProject && (
            <div className="p-6 max-w-lg">
              <h2 className="text-2xl font-black mb-2">
                {activeProject.title}
              </h2>

              <p className="text-text-muted">
                {activeProject.desc}
              </p>

              {activeProject.stack && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-full text-xs
                        bg-brand-primary/10 text-brand-primary
                        ring-1 ring-brand-primary/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      </AnimatePresence>
    </div>
  );
}
