import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Award,
  Sparkles,
  FileCheck,
  ExternalLink,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle,
} from "lucide-react";
import Modal from "./ui/Modal";
import CertificateViewer from "./ui/CertificateViewer";

const achievements = [
  {
    year: "2025",
    title: "Full-Stack Systems Architect & Capstone Honor",
    desc: "Architected and delivered the iLab Reservation and Barangay Cloud ERP platforms. Recognized for exemplary system engineering and high-availability architecture.",
    category: "Architecture",
    badge: "Architecture Distinction",
    featured: true,
    icon: Award,
    certificate: {
      title: "Systems Architecture & Engineering Recognition",
      src: "/certificates/architecture.pdf",
    },
  },
  {
    year: "2024",
    title: "Campus Journalism Action Research Lead",
    desc: "Authored and published institutional action research empowering secondary school coaches with structured technological rubrics for digital publication.",
    category: "Research",
    badge: "Published Research",
    featured: false,
    icon: BookOpen,
    certificate: {
      title: "Action Research & Publication Certificate",
      src: "/certificates/research.pdf",
    },
  },
  {
    year: "2023",
    title: "IoT Telemetry & Web Systems Instructor",
    desc: "Delivered hands-on university coursework integrating ESP32 sensor hardware with cloud APIs and real-time monitoring dashboards for graduating seniors.",
    category: "IoT",
    badge: "Instructional Excellence",
    featured: false,
    icon: Cpu,
  },
];

const categories = ["All", "Architecture", "Research", "IoT"];

export default function Achievements() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCert, setActiveCert] = useState(null);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return achievements;
    return achievements.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="achievements"
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
            Verified Milestones
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Recognitions, Research &{" "}
            <span className="gradient-brand">Certifications</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            Key academic and professional recognitions acknowledging technical depth, research contributions, and leadership in higher education.
          </motion.p>

          {/* Filter Pills */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                    : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MILESTONES GRID ================= */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={!reduceMotion ? { opacity: 0, scale: 0.95 } : false}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/40 hover:shadow-xl transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        {item.year}
                      </span>

                      <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {item.badge}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-lg sm:text-xl text-brand-text mb-2.5 group-hover:text-brand-primary transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {item.certificate ? (
                    <button
                      onClick={() => setActiveCert(item.certificate)}
                      className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs font-semibold text-brand-primary hover:text-brand-primaryHover transition group/btn"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4" />
                        View Verified Certificate
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  ) : (
                    <div className="mt-6 pt-4 border-t border-brand-border text-[11px] font-mono text-brand-muted">
                      Official Department Milestone
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* ================= CERTIFICATE MODAL ================= */}
      <Modal open={!!activeCert} onClose={() => setActiveCert(null)}>
        {activeCert && <CertificateViewer {...activeCert} />}
      </Modal>
    </section>
  );
}