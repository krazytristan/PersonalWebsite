import { useState, useRef, useMemo } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Modal from "./ui/Modal";
import Badge from "./ui/Badge";
import CertificateViewer from "./ui/CertificateViewer";

const achievements = [
  {
    year: "2025",
    title: "Full-Stack Systems Architect",
    desc: "Designed and deployed academic, reservation, and admin platforms.",
    badge: { icon: "🏆", label: "Architecture" },
    category: "Architecture",
    certificate: {
      title: "Systems Architecture Recognition",
      src: "/certificates/architecture.pdf",
      type: "pdf",
    },
  },
  {
    year: "2024",
    title: "Campus Journalism Research Lead",
    desc: "Led action research for non-trained journalism coaches.",
    badge: { icon: "📘", label: "Research" },
    category: "Research",
    certificate: {
      title: "Action Research Certificate",
      src: "/certificates/research.pdf",
      type: "pdf",
    },
  },
  {
    year: "2023",
    title: "IoT & Web Systems Instructor",
    desc: "Delivered real-world IoT + dashboard projects.",
    badge: { icon: "🔌", label: "IoT" },
    category: "IoT",
  },
];

const filters = ["All", "Architecture", "Research", "IoT"];

export default function Achievements() {
  const reduceMotion = useReducedMotion();
  const [activeCert, setActiveCert] = useState(null);
  const [filter, setFilter] = useState("All");
  const sectionRef = useRef(null);

  /* Scroll-linked spine */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bgDrift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  /* Filtered data */
  const filtered = useMemo(() => {
    if (filter === "All") return achievements;
    return achievements.filter((a) => a.category === filter);
  }, [filter]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative py-36 min-h-[80vh] bg-brand-bg overflow-hidden"
    >
      {/* NAVBAR BUFFER */}
      <span aria-hidden className="absolute top-[30vh]" />

      {/* ================= BRAND BACKGROUND ================= */}
      <motion.div
        style={!reduceMotion ? { y: bgDrift } : {}}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[720px] h-[720px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-24 right-[-200px] w-[520px] h-[520px] rounded-full bg-brand-secondary/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-bg/70 to-brand-bg" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
            MILESTONES
          </span>

          <h2 className="text-4xl font-black mb-4">
            Achievements & Recognition
          </h2>

          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Key milestones, recognitions, and professional highlights across
            education, research, and systems development.
          </p>
        </motion.div>

        {/* ================= FILTER ================= */}
        <div className="flex justify-center gap-3 mb-20 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ring-1
                ${
                  filter === f
                    ? "bg-brand-primary text-white ring-brand-primary"
                    : "bg-white/70 hover:bg-white ring-black/10"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="relative pl-12 space-y-20">
          {/* Spine */}
          <div className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary/25" />
          {!reduceMotion && (
            <motion.div
              className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary origin-top"
              style={{ scaleY: spineScale }}
            />
          )}

          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative"
              >
                {/* NODE */}
                <span className="absolute left-[2px] top-5 w-4 h-4 rounded-full bg-brand-primary ring-4 ring-brand-bg shadow-[0_0_18px_rgba(255,109,31,0.75)]" />

                {/* CARD */}
                <motion.div
                  whileHover={
                    a.certificate && !reduceMotion
                      ? {
                          y: -6,
                          boxShadow:
                            "0 20px 40px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,109,31,0.35)",
                        }
                      : {}
                  }
                  transition={{ type: "spring", stiffness: 160, damping: 16 }}
                  onClick={() =>
                    a.certificate && setActiveCert(a.certificate)
                  }
                  className={`rounded-2xl p-7 bg-white/90 backdrop-blur shadow-lg ring-1 ring-black/5 transition ${
                    a.certificate
                      ? "cursor-pointer hover:shadow-xl"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                      {a.year}
                    </span>
                    <Badge {...a.badge} />
                  </div>

                  <h3 className="mt-4 text-xl font-black text-brand-dark">
                    {a.title}
                  </h3>

                  <p className="mt-2 text-text-muted leading-relaxed">
                    {a.desc}
                  </p>

                  {a.certificate && (
                    <p className="mt-4 text-sm font-semibold text-brand-primary">
                      View certificate →
                    </p>
                  )}
                </motion.div>
              </motion.article>
            ))}
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
