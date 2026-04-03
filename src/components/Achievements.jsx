import { useState, useRef, useMemo, useEffect } from "react";
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

/* ================= HEADER PRESETS ================= */
const HEADER_PRESETS = {
  default: {
    label: "Milestones",
    title: (
      <>
        Achievements &
        <span className="block text-brand-primary">
          Professional Recognition
        </span>
      </>
    ),
    desc:
      "Key milestones across education, research, and system development that reflect growth, leadership, and technical depth.",
  },
};

/* ================= DATA ================= */
const achievements = [
  {
    year: "2025",
    title: "Full-Stack Systems Architect",
    desc: "Designed and deployed academic, reservation, and admin platforms.",
    badge: { icon: "🏆", label: "Architecture" },
    category: "Architecture",
    featured: true,
    certificate: {
      title: "Systems Architecture Recognition",
      src: "/certificates/architecture.pdf",
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

export default function Achievements({ headerVariant = "default" }) {
  const reduceMotion = useReducedMotion();
  const header = HEADER_PRESETS[headerVariant];
  const sectionRef = useRef(null);

  /* ================= MOBILE DETECTION ================= */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [filter, setFilter] = useState("All");
  const [activeCert, setActiveCert] = useState(null);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    if (filter === "All") return achievements;
    return achievements.filter((a) => a.category === filter);
  }, [filter]);

  const featured =
    filtered.find((a) => a.featured) || filtered[0];

  /* ================= SCROLL ================= */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative py-24 bg-brand-bg overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto px-4 text-center mb-16"
      >
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold tracking-wide">
          {header.label}
        </span>

        <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-text-primary leading-tight">
          {header.title}
        </h2>

        <p className="mt-6 text-sm sm:text-base text-text-muted leading-relaxed">
          {header.desc}
        </p>
      </motion.div>

      {/* ================= FILTER ================= */}
      <div className="flex justify-center gap-3 mb-16 flex-wrap px-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ring-1
              ${
                filter === f
                  ? "bg-brand-primary text-white ring-brand-primary shadow-lg"
                  : "bg-brand-surface hover:bg-white ring-brand-text/10"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ================= FEATURED ================= */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-20 px-4"
        >
          <div className="relative rounded-2xl p-6 sm:p-8 bg-brand-surface ring-1 ring-brand-text/10 shadow-xl">
            <span className="absolute -top-3 left-5 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary text-white">
              Featured
            </span>

            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                {featured.year}
              </span>
              <Badge {...featured.badge} />
            </div>

            <h3 className="text-xl font-black text-text-primary mb-2">
              {featured.title}
            </h3>

            <p className="text-sm text-text-muted">
              {featured.desc}
            </p>

            {featured.certificate && (
              <button
                onClick={() => setActiveCert(featured.certificate)}
                className="mt-4 text-sm font-semibold text-brand-primary hover:underline"
              >
                View certificate →
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ================= TIMELINE (2 COLUMN) ================= */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Spine */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-brand-primary/20 hidden md:block" />

        {!reduceMotion && !isMobile && (
          <motion.div
            className="absolute left-4 top-0 bottom-0 w-px bg-brand-primary origin-top hidden md:block"
            style={{ scaleY: spineScale }}
          />
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  onClick={() =>
                    a.certificate && setActiveCert(a.certificate)
                  }
                  className={`rounded-xl p-5 bg-brand-surface ring-1 ring-brand-text/10 shadow-md transition
                  ${
                    a.certificate
                      ? "cursor-pointer hover:shadow-lg hover:-translate-y-1"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                      {a.year}
                    </span>
                    <Badge {...a.badge} />
                  </div>

                  <h3 className="mt-3 text-lg font-black text-text-primary">
                    {a.title}
                  </h3>

                  <p className="mt-1 text-sm text-text-muted">
                    {a.desc}
                  </p>

                  {a.certificate && (
                    <p className="mt-3 text-xs font-semibold text-brand-primary">
                      View certificate →
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <Modal open={!!activeCert} onClose={() => setActiveCert(null)}>
        {activeCert && <CertificateViewer {...activeCert} />}
      </Modal>
    </section>
  );
}