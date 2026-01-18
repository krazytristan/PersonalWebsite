import { useState } from "react";
import { useReducedMotion } from "framer-motion";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Philosophy from "../components/Philosophy";
import ExperienceTimeline from "../components/ExperienceTimeline";
import FeaturedProjects from "../components/FeaturedProjects";
import Achievements from "../components/Achievements";
import Skills from "../components/Skills";
import BlogSection from "../components/BlogSection";
import Contact from "../components/Contact";
import StickyCTA from "../components/StickyCTA";

import Modal from "../components/ui/Modal";
import ResumeViewer from "../components/ResumeViewer";

export default function Portfolio() {
  const prefersReducedMotion = useReducedMotion();
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="bg-brand-bg text-brand-text overflow-x-hidden">

      {/* NAVBAR */}
      <Navbar
        onResume={() => setResumeOpen(true)}
      />

      {/* MAIN CONTENT */}
      <main className="relative">

        <Hero />

        <Philosophy />

        <FeaturedProjects />

        <ExperienceTimeline />

        <Achievements />

        <Skills prefersReducedMotion={prefersReducedMotion} />

        <BlogSection />

        <Contact />

      </main>

      {/* STICKY CTA */}
      <StickyCTA onResume={() => setResumeOpen(true)} />

      {/* RESUME MODAL */}
      <Modal open={resumeOpen} onClose={() => setResumeOpen(false)}>
        <ResumeViewer />
      </Modal>

    </div>
  );
}
