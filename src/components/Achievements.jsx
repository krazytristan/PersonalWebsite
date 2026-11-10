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
      className="relative py-16 sm:py-24 lg:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.span
            initial={!reduceMotion ? { opacity: 0, y: 10 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-3 sm:mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Verified Milestones & Honors
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-text leading-tight px-1"
          >
            Recognitions, Research &{" "}
            <span className="gradient-brand">Certifications</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 sm:mt-5 text-sm sm:text-base lg:text-lg text-brand-muted leading-relaxed px-2"
          >
            Key academic milestones, peer-reviewed action research, and validated professional credentials acknowledging technical rigor and leadership.
          </motion.p>

          {/* Filter Pills */}
          <div className="mt-6 sm:mt-8 flex justify-center gap-1.5 sm:gap-2 flex-wrap px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(cat);
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
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

        {/* ================= MILESTONES GRID (RESPONSIVE: 1 col on mobile, 2 on tablet, 3 on desktop) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl glass-card border border-brand-border flex flex-col justify-between hover:border-brand-primary/50 hover:shadow-xl transition-all group cursor-pointer relative"
                >
                  <div>
                    {/* Top Meta Bar */}
                    <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4 flex-wrap">
                      <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shrink-0">
                        {item.year}
                      </span>

                      <span className="text-[11px] sm:text-xs font-mono text-brand-muted flex items-center gap-1 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item.badge}</span>
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary mb-3 sm:mb-4 group-hover:scale-110 group-hover:border-brand-primary/40 transition-transform shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-bold text-base sm:text-lg lg:text-xl text-brand-text mb-2 group-hover:text-brand-primary transition-colors leading-snug break-words">
                      {item.title}
                    </h3>

                    <div className="text-xs font-mono text-brand-muted mb-2.5 sm:mb-3 flex items-start sm:items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-brand-muted/70 shrink-0 mt-0.5 sm:mt-0" />
                      <span className="break-words line-clamp-1 sm:line-clamp-none">{item.organization}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-3 sm:pt-4">
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
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-primary group-hover:text-brand-primaryHover transition gap-2">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileCheck className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.certificate ? "View Dossier & Certificate" : "View Milestone Dossier"}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* ================= FULLY RESPONSIVE MILESTONE DOSSIER MODAL ================= */}
      <Modal
        open={!!selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        size="xl"
      >
        {selectedMilestone && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* Modal Header (with pr-8 sm:pr-12 to prevent overlapping with close button) */}
            <div className="space-y-2.5 pr-8 sm:pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shrink-0">
                  {selectedMilestone.year}
                </span>
                <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1.5 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedMilestone.badge}</span>
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-brand-muted sm:ml-auto">
                  Category: <strong className="text-brand-text">{selectedMilestone.category}</strong>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-text tracking-tight leading-snug break-words">
                {selectedMilestone.title}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs font-mono text-brand-muted">
                <span className="flex items-center gap-1.5 break-words">
                  <Building2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                  <span>{selectedMilestone.organization}</span>
                </span>
                <span className="hidden sm:inline">•</span>
                <button
                  onClick={() => handleCopyId(selectedMilestone.credentialId)}
                  className="inline-flex items-center gap-1 text-brand-muted hover:text-brand-text transition w-fit py-0.5"
                  title="Copy Credential Verification ID"
                >
                  <span>ID: <strong className="text-brand-text break-all">{selectedMilestone.credentialId}</strong></span>
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab switch between Dossier & Certificate (Responsive: 2-col grid on mobile, inline flex on tablet/desktop) */}
            {selectedMilestone.certificate && (
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 p-1 rounded-2xl glass-panel border border-brand-border w-full sm:w-fit">
                <button
                  onClick={() => {
                    sounds.playPop();
                    setModalTab("overview");
                  }}
                  className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition text-center justify-center ${
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
                  className={`px-3 sm:px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 text-center ${
                    modalTab === "certificate"
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-muted hover:text-brand-text"
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Official Certificate PDF</span>
                </button>
              </div>
            )}

            {/* TAB CONTENT: OVERVIEW DOSSIER */}
            {modalTab === "overview" ? (
              <div className="space-y-5 sm:space-y-6 text-sm">
                
                {/* Description */}
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl glass-card border border-brand-border space-y-2">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-brand-primary">
                    Scope & Architectural Significance
                  </div>
                  <p className="text-brand-text leading-relaxed text-xs sm:text-sm lg:text-base">
                    {selectedMilestone.longDesc || selectedMilestone.desc}
                  </p>
                </div>

                {/* Highlights */}
                {selectedMilestone.highlights && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-brand-text flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
                      <span>Key Verified Deliverables & Honors</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedMilestone.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="p-3 sm:p-3.5 rounded-xl glass-panel border border-brand-border flex items-start gap-3"
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
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedMilestone.skills?.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-mono font-medium glass-panel border border-brand-border text-brand-text"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Quick Preview Banner */}
                {selectedMilestone.certificate && (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl glass-card border border-brand-primary/30 bg-brand-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-brand-text truncate">
                          Official Certificate Document Available
                        </div>
                        <div className="text-[11px] font-mono text-brand-muted truncate">
                          Cryptographically logged • High-resolution PDF
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          sounds.playPop();
                          setModalTab("certificate");
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow hover:opacity-95 transition text-center"
                      >
                        View Certificate
                      </button>
                      <a
                        href={selectedMilestone.certificate.src}
                        download
                        className="w-full sm:w-auto p-2 rounded-xl glass-panel border border-brand-border text-brand-text hover:border-brand-primary transition flex items-center justify-center gap-1 text-xs font-semibold"
                        title="Download Certificate PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span className="sm:hidden">Download</span>
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

            {/* Modal Bottom Close Toolbar (stacks cleanly on mobile) */}
            <div className="pt-4 border-t border-brand-border/70 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-mono text-brand-muted text-center sm:text-left text-[11px] sm:text-xs">
                Official Credential Verification Record
              </span>

              <button
                onClick={() => setSelectedMilestone(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl glass-card border border-brand-border text-brand-text font-semibold hover:border-brand-primary transition text-center"
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
