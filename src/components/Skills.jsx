import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Terminal,
  Code2,
  CheckCircle2,
  Wand2,
} from "lucide-react";
import { skills, skillCategories } from "../data/skills";
import { sounds } from "../utils/audio";

const stackPresets = [
  {
    id: "web",
    label: "Cloud Web Application",
    highlightSkills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "MySQL", "REST APIs"],
  },
  {
    id: "iot",
    label: "IoT Sensor Platform",
    highlightSkills: ["ESP32 & Arduino", "Sensors & RFID", "IoT Telemetry", "Firebase", "REST APIs"],
  },
  {
    id: "govtech",
    label: "Civic / Enterprise ERP",
    highlightSkills: ["PHP", "MySQL", "Tailwind CSS", "System Architecture", "Git & GitHub"],
  },
  {
    id: "academic",
    label: "Academic Attendance Platform",
    highlightSkills: ["JavaScript (ES6+)", "PHP", "MySQL", "REST APIs", "Technical Education"],
  },
];

export default function Skills() {
  const reduceMotion = useReducedMotion();
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePreset, setActivePreset] = useState(null);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchCat = selectedCat === "All" || s.category === selectedCat;
      const matchSearch =
        searchQuery === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  const selectPreset = (preset) => {
    sounds.playClick();
    if (activePreset?.id === preset.id) {
      setActivePreset(null);
    } else {
      setActivePreset(preset);
      setSelectedCat("All");
      setSearchQuery("");
      sounds.playSuccess();
    }
  };

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-sky-500/10 blur-[130px] pointer-events-none" />

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
            Engineering Matrix & Stack Matcher
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Technical Stack &{" "}
            <span className="gradient-brand">Domain Proficiencies</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            A battle-tested spectrum of technologies used to construct high-performance web applications, hardware sensor networks, and dependable backends.
          </motion.p>

          {/* ================= INTERACTIVE STACK MATCHER ================= */}
          <div className="mt-8 p-4 rounded-2xl glass-card border border-brand-border inline-block max-w-2xl w-full">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-brand-primary font-bold uppercase mb-2.5">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Interactive Architecture Matcher</span>
            </div>
            <p className="text-xs text-brand-muted mb-3">
              Click what you're planning to build to highlight Tristan's recommended technology stack:
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {stackPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => selectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activePreset?.id === preset.id
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                      : "glass-panel border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= CONTROLS: CATEGORIES & SEARCH ================= */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 w-full sm:w-auto">
              {skillCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCat(cat);
                    sounds.playClick();
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCat === cat
                      ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/25 font-semibold"
                      : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search technologies..."
                className="w-full pl-9 pr-4 py-2 rounded-full glass-card border border-brand-border text-xs sm:text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/60 transition"
              />
            </div>
          </div>
        </div>

        {/* ================= SKILLS BENTO GRID ================= */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredSkills.map((skill) => {
              const isMatchedByPreset =
                activePreset && activePreset.highlightSkills.includes(skill.name);

              return (
                <motion.div
                  layout
                  key={skill.name}
                  initial={!reduceMotion ? { opacity: 0, scale: 0.95 } : false}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    borderColor: isMatchedByPreset ? "#FF6D1F" : undefined,
                  }}
                  exit={!reduceMotion ? { opacity: 0, scale: 0.9 } : false}
                  transition={{ duration: 0.25 }}
                  className={`p-5 rounded-2xl glass-card border transition-all group flex flex-col justify-between ${
                    isMatchedByPreset
                      ? "border-brand-primary bg-brand-primary/10 shadow-lg shadow-brand-primary/15 ring-2 ring-brand-primary/40"
                      : "border-brand-border hover:border-brand-primary/40 hover:shadow-lg"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl glass-panel p-2 flex items-center justify-center border border-brand-border group-hover:scale-105 transition-transform">
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isMatchedByPreset && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-brand-primary text-white animate-pulse">
                            RECOMMENDED
                          </span>
                        )}

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                            skill.level === "Expert"
                              ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                              : skill.level === "Advanced"
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-brand-text group-hover:text-brand-primary transition-colors">
                      {skill.name}
                    </h3>

                    <p className="mt-2 text-xs text-brand-muted leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] font-mono text-brand-muted">
                    <span>{skill.category}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-16 text-brand-muted text-sm">
            No technologies match your filter "{searchQuery}".
          </div>
        )}

        {/* ================= MARQUEE RIBBON ================= */}
        <div className="mt-16 pt-10 border-t border-brand-border overflow-hidden relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-bg to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-bg to-transparent z-10" />

          <motion.div
            className="flex gap-10 w-max"
            animate={!reduceMotion ? { x: ["0%", "-50%"] } : {}}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...skills, ...skills].map((s, idx) => (
              <div
                key={`${s.name}-${idx}`}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl glass-panel border border-brand-border whitespace-nowrap opacity-75 hover:opacity-100 transition"
              >
                <img
                  src={s.icon}
                  alt={s.name}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-xs font-mono font-medium text-brand-text">
                  {s.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
