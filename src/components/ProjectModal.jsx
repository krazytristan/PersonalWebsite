import { motion } from "framer-motion";
import {
  Server,
  Database,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Activity,
  Code2,
  Cpu,
  ArrowUpRight,
} from "lucide-react";

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="flex flex-col max-h-[85vh] overflow-y-auto pr-1">
      {/* Visual Header Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/8] bg-brand-surface border border-brand-border mb-6">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary text-white shadow">
              {project.badge}
            </span>
            <div className="text-xs font-mono text-slate-300 mt-1.5 flex items-center gap-2">
              <span>{project.duration || project.year}</span>
              <span>•</span>
              <span>{project.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title & Category */}
      <div className="mb-6">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-primary mb-1">
          {project.category}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text">
          {project.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-brand-muted leading-relaxed font-normal">
          {project.description || project.desc}
        </p>
      </div>

      {/* Metrics Row */}
      {project.metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Object.entries(project.metrics).map(([key, val]) => (
            <div
              key={key}
              className="p-3.5 rounded-xl glass-panel border border-brand-border text-center"
            >
              <div className="text-base sm:text-lg font-bold font-mono text-brand-primary">
                {val}
              </div>
              <div className="text-[11px] font-mono uppercase text-brand-muted mt-0.5">
                {key}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Architectural Specifications */}
      {project.architecture && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-brand-text mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-primary" />
            System Architecture Specifications
          </h3>

          <div className="grid sm:grid-cols-2 gap-3.5">
            {Object.entries(project.architecture).map(([layer, spec]) => (
              <div
                key={layer}
                className="p-4 rounded-xl glass-panel border border-brand-border"
              >
                <div className="text-xs font-mono uppercase font-bold text-brand-primary mb-1">
                  {layer} Layer
                </div>
                <div className="text-xs sm:text-sm text-brand-text leading-relaxed">
                  {spec}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Highlights */}
      {project.highlights && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-brand-text mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Key Engineering Features & Solved Challenges
          </h3>

          <div className="space-y-2">
            {project.highlights.map((h, i) => (
              <div
                key={i}
                className="p-3 rounded-xl glass-panel border border-brand-border flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <span className="text-xs sm:text-sm text-brand-muted">
                  {h}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {project.stack && (
        <div className="mb-6 pt-4 border-t border-brand-border">
          <div className="text-xs font-mono uppercase tracking-wider text-brand-muted mb-2.5">
            Technology Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-mono font-medium glass-panel border border-brand-border text-brand-text"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Close Action */}
      <div className="pt-4 border-t border-brand-border flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl glass-card text-brand-text font-semibold text-xs hover:border-brand-primary transition"
        >
          Close Dossier
        </button>
      </div>
    </div>
  );
}
