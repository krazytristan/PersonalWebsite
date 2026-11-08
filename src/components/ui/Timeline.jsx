import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Code2, Cpu, Award } from "lucide-react";

const milestones = [
  {
    year: "2018 – Present",
    role: "Computer Science & IT Educator",
    institution: "Higher Education / Batangas",
    desc: "Lecturing on algorithms, full-stack web engineering, and system analysis. Mentored hundreds of students through real-world capstone platforms.",
    icon: GraduationCap,
    tag: "Education",
  },
  {
    year: "2021 – 2023",
    role: "Full-Stack Software Engineer",
    institution: "Academic & Enterprise Solutions",
    desc: "Architected custom academic attendance engines, schedule conflict matrices, and relational database systems for university operations.",
    icon: Code2,
    tag: "Engineering",
  },
  {
    year: "2023 – 2024",
    role: "IoT & Hardware Integration Lead",
    institution: "Applied Research Lab",
    desc: "Spearheaded research connecting ESP32 microcontroller sensor nodes with real-time cloud data pipelines and environmental monitoring dashboards.",
    icon: Cpu,
    tag: "IoT & Embedded",
  },
  {
    year: "2024 – Present",
    role: "Lead Systems Architect",
    institution: "Civic & Enterprise Platforms",
    desc: "Designing end-to-end cloud platforms including the Barangay Cloud ERP system and high-concurrency laboratory reservation platforms.",
    icon: Award,
    tag: "Architecture",
  },
];

export default function Timeline() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative pl-6 sm:pl-8 border-l border-brand-border space-y-8">
      {milestones.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.year + m.role}
            initial={!reduceMotion ? { opacity: 0, x: -20 } : false}
            whileInView={!reduceMotion ? { opacity: 1, x: 0 } : false}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative group"
          >
            {/* Timeline Node Point */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-brand-surface border-2 border-brand-primary flex items-center justify-center text-brand-primary shadow-md group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-brand-primary" />
            </div>

            <div className="p-4 sm:p-5 rounded-2xl glass-card border border-brand-border group-hover:border-brand-primary/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  {m.year}
                </span>
                <span className="text-xs font-mono text-brand-muted">
                  {m.tag}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-brand-text">
                {m.role}
              </h4>
              <p className="text-xs font-medium text-brand-primary mt-0.5">
                {m.institution}
              </p>

              <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                {m.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
