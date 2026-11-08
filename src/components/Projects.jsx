import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
  Layers,
  Server,
  Database,
  Shield,
  ArrowUpRight,
  Sparkles,
  Cpu,
  CheckCircle2,
  Calendar,
  BarChart3,
  Clock,
  Code,
} from "lucide-react";
import { projects } from "../data/projects";

const categories = [
  "All Systems",
  "GovTech & Civic",
  "Academic Platforms",
  "IoT & Hardware",
];

export default function Projects({ onOpen }) {
  const reduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All Systems");
  const [hoveredId, setHoveredId] = useState(null);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Systems") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <section
      id="projects"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden bg-grid-pattern"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full bg-brand-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-sky-500/8 blur-[130px] pointer-events-none" />

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
            Selected Systems
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Architecting Digital Systems That{" "}
            <span className="gradient-brand">Deliver Real Impact</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            A curated portfolio of production software platforms, civic government portals, and IoT hardware integrations engineered for high availability and intuitive human usability.
          </motion.p>

          {/* ================= CATEGORY FILTER TABS ================= */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25 scale-[1.02]"
                    : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ================= PROJECTS GRID ================= */}
        <motion.div
          layout
          className="grid md:grid-cols-2 gap-8 lg:gap-10"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.article
                  layout
                  key={project.id}
                  initial={!reduceMotion ? { opacity: 0, y: 25 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={!reduceMotion ? { opacity: 0, scale: 0.95 } : false}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative rounded-3xl glass-card border border-brand-border overflow-hidden flex flex-col justify-between hover:border-brand-primary/40 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Card Visual Preview */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-surface border-b border-brand-border">
                    <img
                      src={project.image}
                      alt={project.imageAlt}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Rim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Badges Floating on Top of Image */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900/80 backdrop-blur-md text-white border border-white/10 shadow">
                        {project.badge}
                      </span>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-brand-primary/90 text-white shadow">
                        {project.year}
                      </span>
                    </div>

                    {/* Primary Metric Badge Bottom of Image */}
                    {project.metrics && (
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/15 text-white flex items-center gap-2">
                          <BarChart3 className="w-3.5 h-3.5 text-brand-primary" />
                          <span className="text-xs font-mono font-bold">
                            {Object.values(project.metrics)[0]}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-slate-300 drop-shadow">
                          {project.role}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-brand-text group-hover:text-brand-primary transition-colors">
                        {project.title}
                      </h3>

                      <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-3">
                        {project.desc}
                      </p>

                      {/* Tech Stack Pills */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium glass-panel border border-brand-border text-brand-text"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 pt-5 border-t border-brand-border flex items-center justify-between">
                      <button
                        onClick={() => onOpen?.(project)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primaryHover group/btn transition"
                      >
                        <span>View Architecture Specs</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>

                      <span className="text-xs font-mono text-brand-muted">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
