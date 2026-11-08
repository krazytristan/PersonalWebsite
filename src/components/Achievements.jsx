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
  ShieldCheck,
  Calendar,
  Building2,
  Copy,
  Check,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import Modal from "./ui/Modal";
import CertificateViewer from "./ui/CertificateViewer";
import { sounds } from "../utils/audio";

const achievements = [
  {
    id: "capstone-architecture-honor",
    year: "2025",
    title: "Full-Stack Systems Architect & Capstone Honor",
    desc: "Architected and delivered the iLab Reservation and Barangay Cloud ERP platforms. Recognized by academic faculty panels for zero-downtime reliability, relational normalization, and high-availability architecture.",
    longDesc: "Conducted end-to-end systems design and production engineering for high-concurrency academic reservation systems and municipal administrative portals. Overcame challenging database transaction locking contention and delivered a fully paperless clearance engine utilizing cryptographically signed QR verification.",
    category: "Architecture",
    badge: "Architecture Distinction",
    organization: "Batangas State University - The National Engineering University",
    credentialId: "BSU-CICS-ARCH-2025-081",
    featured: true,
    icon: Award,
    skills: ["React 18", "Node.js / Express", "MySQL Architecture", "RBAC Security", "SHA-256 Verifiable QR", "High Availability"],
    highlights: [
      "Engineered automated lab conflict resolution algorithm eliminating scheduling overlap across 500+ daily sessions",
      "Normalized relational schema across 14 tables reducing complex query response times by 68%",
      "Awarded highest capstone rating by the academic evaluation panel",
    ],
    certificate: {
      title: "Systems Architecture & Engineering Recognition",
      src: "/certificates/architecture.pdf",
      issuer: "Batangas State University",
      date: "2025",
      credentialId: "BSU-CICS-ARCH-2025-081",
    },
  },
  {
    id: "campus-journalism-research",
    year: "2024",
    title: "Campus Journalism Action Research Lead",
    desc: "Authored and published institutional action research delivering systematic technological rubrics and digital workflow pipelines for regional secondary school journalism coaches.",
    longDesc: "Spearheaded empirical investigation into transitioning traditional campus student newspapers into modern digital publishing platforms. Designed standardized evaluation rubrics for digital publication, reducing layout turnaround time while improving technological literacy across regional school advisers.",
    category: "Research",
    badge: "Published Research",
    organization: "Department of Education / Regional Research Council",
    credentialId: "DEPED-RR-2024-C38",
    featured: false,
    icon: BookOpen,
    skills: ["Action Research", "Quantitative Pedagogy", "Digital Publication", "Workflow Automation", "Educational Technology"],
    highlights: [
      "Published regional research paper endorsed by secondary education supervisors",
      "Trained over 40 faculty advisers across Batangas province in automated layout tools",
      "Standardized rubrics adopted in division-wide press conferences",
    ],
    certificate: {
      title: "Action Research & Publication Certificate",
      src: "/certificates/research.pdf",
      issuer: "Department of Education",
      date: "2024",
      credentialId: "DEPED-RR-2024-C38",
    },
  },
  {
    id: "iot-telemetry-instructor",
    year: "2023 – 2024",
    title: "IoT Telemetry & Web Systems Instructor",
    desc: "Delivered hands-on university coursework integrating ESP32 microcontroller sensor arrays with cloud APIs and real-time interactive telemetry dashboards for graduating computer science seniors.",
    longDesc: "Mentored aspiring engineers in hardware-to-cloud telemetry. Developed comprehensive laboratory modules connecting physical DHT22, ultrasonic, and RFID sensors to Node.js backend services and reactive React web cockpits via MQTT and RESTful protocols.",
    category: "IoT",
    badge: "Instructional Excellence",
    organization: "College of Informatics & Computing Sciences (CICS)",
    credentialId: "CICS-FAC-2023-019",
    featured: false,
    icon: Cpu,
    skills: ["ESP32 Microcontrollers", "MQTT & HTTP REST", "Hardware Circuitry", "Real-Time Telemetry", "Coursework Pedagogy"],
    highlights: [
      "Designed 12 progressive hands-on laboratory modules from breadboard wiring to cloud deployment",
      "Mentored 60+ graduating students on hardware-driven software capstones",
      "Recognized by faculty administration for exemplary student satisfaction and practical rigor",
    ],
    certificate: {
      title: "Faculty Recognition in Embedded Systems & IoT",
      src: "/certificates/architecture.pdf",
      issuer: "College of Informatics & Computing Sciences",
      date: "2024",
      credentialId: "CICS-FAC-2023-019",
    },
  },
  {
    id: "civic-govtech-innovation",
    year: "2025",
    title: "Civic GovTech & Paperless Administration Citation",
    desc: "Recognized for architecting an end-to-end community administrative cloud suite eliminating paper friction, speeding up document issuance from 3 days to under 4 minutes.",
    longDesc: "Collaborated with local barangay councils to replace physical binders and carbon-copy forms with a unified resident registry, automated blotter incident ledger, and instant clearance issuing engine compliant with the Philippine Data Privacy Act of 2012 (RA 10173).",
    category: "Architecture",
    badge: "Civic Innovation",
    organization: "Local Government Unit & Community Innovation Council",
    credentialId: "CIVIC-GOVTECH-2025-092",
    featured: false,
    icon: Layers,
    skills: ["Paperless Government", "Data Privacy RA 10173", "Cryptographic QR", "Audit Trails", "Tailwind CSS"],
    highlights: [
      "Digitized over 3,000+ local community resident records with strict role-based access",
      "Integrated instant tamper-proof QR code clearance validation",
      "Reduced municipal operational processing time by over 90%",
    ],
    certificate: {
      title: "Civic Innovation & Community Impact Citation",
      src: "/certificates/architecture.pdf",
      issuer: "Barangay Civic Innovation Board",
      date: "2025",
      credentialId: "CIVIC-GOVTECH-2025-092",
    },
  },
  {
    id: "advanced-fullstack-certification",
    year: "2024",
    title: "Advanced Full-Stack Engineering & Cloud Credential",
    desc: "Rigorous professional credential validating high-performance client state management, database normalization, concurrency locking, and secure API architecture.",
    longDesc: "Validation of advanced competencies spanning scalable frontend component design with React 18, high-throughput asynchronous services in Node.js, relational constraint modeling in MySQL, and defense-in-depth security invariants.",
    category: "Certifications",
    badge: "Professional Credential",
    organization: "Technical Architecture Standards Council",
    credentialId: "CERT-ADV-FS-2024-511",
    featured: false,
    icon: ShieldCheck,
    skills: ["Defense-in-Depth", "CSRF Protection", "Parameterized SQL", "RESTful Contracts", "Tailwind Design Tokens"],
    highlights: [
      "Mastery in secure session management, token authentication, and query sanitization",
      "Demonstrated architectural proficiency in zero-render-waste state design",
      "Scored top percentile on relational database optimization assessments",
    ],
    certificate: {
      title: "Certified Advanced Full-Stack Systems Engineer",
      src: "/certificates/research.pdf",
      issuer: "Technical Architecture Standards Council",
      date: "2024",
      credentialId: "CERT-ADV-FS-2024-511",
    },
  },
];

const categories = ["All", "Architecture", "Research", "IoT", "Certifications"];

export default function Achievements() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [modalTab, setModalTab] = useState("overview"); // overview | certificate
  const [copiedId, setCopiedId] = useState(false);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return achievements;
    return achievements.filter((a) => a.category === activeCategory);
  }, [activeCategory]);

  const handleOpenMilestone = (item, defaultTab = "overview") => {
    sounds.playPop();
    setModalTab(defaultTab);
    setSelectedMilestone(item);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    sounds.playSuccess();
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

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
            Verified Milestones & Honors
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
            Key academic milestones, peer-reviewed action research, and validated professional credentials acknowledging technical rigor and leadership.
          </motion.p>

          {/* Filter Pills */}
          <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(cat);
                }}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence>
            {filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={!reduceMotion ? { opacity: 0, scale: 0.95 } : false}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  onClick={() => handleOpenMilestone(item, "overview")}
                  className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/50 hover:shadow-xl transition-all group cursor-pointer relative"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                        {item.year}
                      </span>

                      <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        {item.badge}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-11 h-11 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 group-hover:border-brand-primary/40 transition-transform shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-lg sm:text-xl text-brand-text mb-2.5 group-hover:text-brand-primary transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <div className="text-xs font-mono text-brand-muted mb-3 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-muted/70 shrink-0" />
                      <span className="truncate">{item.organization}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {item.skills?.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded text-[10px] font-mono glass-panel border border-brand-border text-brand-muted"
                        >
                          {sk}
                        </span>
                      ))}
                      {item.skills?.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-brand-primary font-bold">
                          +{item.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary group-hover:text-brand-primaryHover transition">
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4" />
                      <span>{item.certificate ? "View Dossier & Certificate" : "View Milestone Dossier"}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* ================= COMPREHENSIVE MILESTONE DOSSIER MODAL ================= */}
      <Modal
        open={!!selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        size="xl"
      >
        {selectedMilestone && (
          <div className="space-y-6">
            
            {/* Modal Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  {selectedMilestone.year}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedMilestone.badge}</span>
                </span>
                <span className="text-xs font-mono text-brand-muted ml-auto">
                  Category: <strong className="text-brand-text">{selectedMilestone.category}</strong>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
                {selectedMilestone.title}
              </h2>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-mono text-brand-muted">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{selectedMilestone.organization}</span>
                </span>
                <span>•</span>
                <button
                  onClick={() => handleCopyId(selectedMilestone.credentialId)}
                  className="inline-flex items-center gap-1 text-brand-muted hover:text-brand-text transition"
                  title="Copy Credential Verification ID"
                >
                  <span>ID: <strong className="text-brand-text">{selectedMilestone.credentialId}</strong></span>
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab switch between Dossier & Certificate (if cert exists) */}
            {selectedMilestone.certificate && (
              <div className="flex items-center gap-2 p-1 rounded-2xl glass-panel border border-brand-border w-fit">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setModalTab("overview");
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                    modalTab === "overview"
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  Milestone Dossier
                </button>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setModalTab("certificate");
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    modalTab === "certificate"
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Official Certificate PDF</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: OVERVIEW DOSSIER */}
            {modalTab === "overview" ? (
              <div className="space-y-6 text-sm">
                
                {/* Description */}
                <div className="p-5 rounded-2xl glass-card border border-brand-border space-y-2">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Scope & Architectural Significance
                  </div>
                  <p className="text-brand-text leading-relaxed sm:text-base">
                    {selectedMilestone.longDesc || selectedMilestone.desc}
                  </p>
                </div>

                {/* Highlights */}
                {selectedMilestone.highlights && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-brand-text flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                      <span>Key Verified Deliverables & Honors</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedMilestone.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl glass-panel border border-brand-border flex items-start gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validated Skills */}
                <div className="space-y-2.5">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-muted">
                    Competencies Validated
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone.skills?.map((sk) => (
                      <span
                        key={sk}
                        className="px-3 py-1 rounded-xl text-xs font-mono font-medium glass-panel border border-brand-border text-brand-text"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Quick Preview Banner */}
                {selectedMilestone.certificate && (
                  <div className="p-4 rounded-2xl glass-card border border-brand-primary/30 bg-brand-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-brand-text">
                          Official Certificate Document Available
                        </div>
                        <div className="text-[11px] font-mono text-brand-muted">
                          Cryptographically logged • High-resolution PDF
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          setModalTab("certificate");
                        }}
                        className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow hover:opacity-95 transition"
                      >
                        View Certificate
                      </button>
                      <a
                        href={selectedMilestone.certificate.src}
                        download
                        className="p-2 rounded-xl glass-panel border border-brand-border text-brand-text hover:border-brand-primary transition"
                        title="Download Certificate PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* TAB CONTENT: CERTIFICATE PDF VIEWER */
              <div>
                {selectedMilestone.certificate && (
                  <CertificateViewer {...selectedMilestone.certificate} />
                )}
              </div>
            )}

            {/* Modal Bottom Close Toolbar */}
            <div className="pt-4 border-t border-brand-border/70 flex items-center justify-between text-xs">
              <span className="font-mono text-brand-muted">
                Official Credential Verification Record
              </span>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="px-5 py-2 rounded-xl glass-card border border-brand-border text-brand-text font-semibold hover:border-brand-primary transition"
              >
                Close Milestone
              </button>
            </div>

          </div>
        )}
      </Modal>
    </section>
  );
}
