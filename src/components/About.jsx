import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Database,
  Globe,
  Terminal,
  Code2,
  Users,
  Award,
  BookOpen,
} from "lucide-react";
import Timeline from "./ui/Timeline";
import { sounds } from "../utils/audio";

const principles = [
  {
    icon: Zap,
    title: "Clarity Over Complexity",
    tag: "Design Axiom",
    desc: "A system shouldn't demand cognitive strain. When domain logic is decoupled cleanly, interfaces naturally feel obvious, fast, and frictionless.",
  },
  {
    icon: ShieldCheck,
    title: "Fault-Tolerant by Default",
    tag: "Resilience Axiom",
    desc: "Hardware disconnects, concurrent race conditions, and network packet loss are assumed baseline realities. Systems must self-heal gracefully.",
  },
  {
    icon: GraduationCap,
    title: "Human-First Technology",
    tag: "Purpose Axiom",
    desc: "Engineering exists to elevate human capability — whether replacing tedious paper forms for civic barangay workers or giving students instant lab access.",
  },
];

const pipelineStages = [
  {
    step: "01",
    title: "Edge & Input Layer",
    tech: "ESP32 • Barcode • UI Forms",
    desc: "Capturing real-world sensor streams and citizen requests cleanly at the physical edge.",
    icon: Cpu,
  },
  {
    step: "02",
    title: "API & Business Logic",
    tech: "PHP / Node.js • REST • Middleware",
    desc: "Sanitizing, validating, and applying strict transactional business invariants.",
    icon: Terminal,
  },
  {
    step: "03",
    title: "Data & Storage Core",
    tech: "MySQL • Firebase • ACID Locks",
    desc: "Ensuring persistence, normalized relational integrity, and zero collision records.",
    icon: Database,
  },
  {
    step: "04",
    title: "Reactive Client Layer",
    tech: "React 18 • Tailwind • WebSockets",
    desc: "Delivering real-time feedback, accessibility compliant telemetry, and fluid UX.",
    icon: Globe,
  },
];

const pedagogyStats = [
  { value: "500+", label: "University Students Instructed", icon: Users },
  { value: "10+", label: "Capstone Platforms Mentored", icon: Award },
  { value: "100%", label: "Curriculum Pass Rate", icon: CheckCircle2 },
  { value: "3", label: "Research Publications", icon: BookOpen },
];

function CheckCircle2(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function About() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("architecture"); // "architecture" | "pedagogy"

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.span
            initial={!reduceMotion ? { opacity: 0, y: 10 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Background & Engineering Philosophy
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Bridging Architectural Rigor with{" "}
            <span className="gradient-brand">Real-World Usability</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            Operating across higher education and production software engineering — turning complex requirements into dependable platforms built for longevity.
          </motion.p>

          {/* Perspective Switcher */}
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => {
                setActiveTab("architecture");
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === "architecture"
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                  : "glass-card text-brand-muted hover:text-brand-text"
              }`}
            >
              Systems Architecture View
            </button>
            <button
              onClick={() => {
                setActiveTab("pedagogy");
                sounds.playClick();
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                activeTab === "pedagogy"
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                  : "glass-card text-brand-muted hover:text-brand-text"
              }`}
            >
              Academic & Teaching Impact
            </button>
          </div>
        </div>

        {/* ================= BENTO GRID ================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Bio & Principles (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {activeTab === "architecture" ? (
              <>
                {/* Story Card */}
                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-brand-text">
                      The Architect’s Mindset
                    </h3>
                    <span className="text-xs font-mono text-brand-primary font-bold">
                      PHILOSOPHY
                    </span>
                  </div>
                  
                  <div className="space-y-4 text-sm sm:text-base text-brand-muted leading-relaxed font-normal">
                    <p>
                      Over five years in computer science education in Batangas, Philippines, I have had the privilege of instructing hundreds of aspiring developers while actively architecting civic and enterprise platforms.
                    </p>
                    <p>
                      As an educator, I constantly distill complex algorithms and patterns into fundamental truths. When building civic platforms like the <span className="text-brand-text font-semibold">Barangay Cloud ERP</span> or high-concurrency systems like the <span className="text-brand-text font-semibold">iLab Reservation Platform</span>, I apply that same philosophy: software should be clear, unpretentious, and bulletproof.
                    </p>
                  </div>

                  {/* Tag Pill Highlights */}
                  <div className="mt-6 pt-6 border-t border-brand-border flex flex-wrap gap-2.5">
                    {[
                      "Civic GovTech Platforms",
                      "Academic Attendance & ERPs",
                      "IoT Telemetry & Embedded",
                      "Relational Database Optimization",
                      "Curriculum Engineering",
                    ].map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-mono font-medium glass-panel border border-brand-border text-brand-text"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Architectural Principles (3 Cards) */}
                <div className="grid sm:grid-cols-3 gap-4">
                  {principles.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={!reduceMotion ? { opacity: 0, y: 15 } : false}
                        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-2xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/30 transition-colors"
                      >
                        <div>
                          <div className="w-9 h-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] font-mono text-brand-muted uppercase">
                            {p.tag}
                          </span>
                          <h4 className="font-bold text-sm text-brand-text mb-2 mt-1">
                            {p.title}
                          </h4>
                          <p className="text-xs text-brand-muted leading-relaxed">
                            {p.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* System Pipeline Dataflow Visual */}
                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-brand-text">
                        End-to-End System Pipeline
                      </h4>
                      <p className="text-xs text-brand-muted">
                        How signals transition from physical edge devices to reactive interfaces
                      </p>
                    </div>
                    <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      STANDARD PIPELINE
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {pipelineStages.map((stage, idx) => {
                      const Icon = stage.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl glass-panel border border-brand-border"
                        >
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="font-mono text-xs font-bold text-brand-primary">
                              {stage.step}
                            </span>
                            <Icon className="w-4 h-4 text-brand-text" />
                            <h5 className="font-bold text-xs text-brand-text">
                              {stage.title}
                            </h5>
                          </div>
                          <div className="text-[11px] font-mono text-brand-primary mb-1">
                            {stage.tech}
                          </div>
                          <p className="text-xs text-brand-muted">
                            {stage.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* Pedagogy Tab */
              <div className="space-y-6">
                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border">
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-text mb-4">
                    Pedagogy: Empowering Future Engineers
                  </h3>

                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-6 font-normal">
                    Teaching computer science at university level requires moving beyond passive coding tutorials. I emphasize system architecture, defensive edge-case handling, and delivering software for real community stakeholders.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {pedagogyStats.map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={i}
                          className="p-4 rounded-2xl glass-panel border border-brand-border text-center"
                        >
                          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-primary mb-1">
                            {stat.value}
                          </div>
                          <div className="text-[11px] font-medium text-brand-muted">
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border">
                  <h4 className="text-base font-bold text-brand-text mb-3">
                    Coursework & Workshops Delivered
                  </h4>
                  <div className="space-y-3">
                    {[
                      { course: "Web Systems & Development", focus: "React, PHP, RESTful APIs, Session Security" },
                      { course: "Database Management & Modeling", focus: "MySQL, Relational Normalization, Index Tuning" },
                      { course: "Embedded Systems & IoT Networks", focus: "ESP32 C++, Ultrasonic Depth, Firebase Telemetry" },
                      { course: "Campus Journalism Research", focus: "Digital Publishing Rubrics & Action Research" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl glass-panel border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                      >
                        <span className="font-bold text-brand-text">{item.course}</span>
                        <span className="font-mono text-brand-muted">{item.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: Experience & Journey (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border sticky top-28">
              <div className="mb-6">
                <span className="text-xs font-mono tracking-widest text-brand-primary uppercase">
                  Career Progression
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-text mt-1">
                  Milestones & Roles
                </h3>
              </div>

              <Timeline />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
