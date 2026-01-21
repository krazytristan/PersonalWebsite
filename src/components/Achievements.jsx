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
  },
];

const filters = ["All", "Architecture", "Research", "IoT"];

export default function Achievements() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  /* ---------------- MOBILE DETECTION ---------------- */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setIsMobile(mq.matches);
    const h = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const [filter, setFilter] = useState("All");
  const [activeCert, setActiveCert] = useState(null);
  const [index, setIndex] = useState(0);

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    if (filter === "All") return achievements;
    return achievements.filter((a) => a.category === filter);
  }, [filter]);

  const featured =
    filtered.find((a) => a.featured) || filtered[0];

  /* ---------------- SCROLL SPINE ---------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ---------------- SWIPE HANDLERS (MOBILE) ---------------- */
  const swipeHandlers = isMobile
    ? {
        onDragEnd: (_, info) => {
          if (info.offset.x < -80 && index < filtered.length - 1) {
            setIndex((i) => i + 1);
          }
          if (info.offset.x > 80 && index > 0) {
            setIndex((i) => i - 1);
          }
        },
      }
    : {};

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative py-28 bg-brand-bg overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <div className="max-w-6xl mx-auto px-4 text-center mb-16">
        <span className="block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          MILESTONES
        </span>
        <h2 className="text-4xl font-black mb-4">
          Achievements & Recognition
        </h2>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Key milestones across education, research, and systems development.
        </p>
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex justify-center gap-3 mb-20 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setIndex(0);
            }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ring-1
              ${
                filter === f
                  ? "bg-brand-primary text-white ring-brand-primary"
                  : "bg-white/80 hover:bg-white ring-black/10"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ================= FEATURED SPOTLIGHT ================= */}
      {featured && (
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 30 } : false}
          animate={!reduceMotion ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-24 px-4"
        >
          <div
            className="relative rounded-3xl p-10 bg-white/90 backdrop-blur
              ring-1 ring-black/5 shadow-2xl"
          >
            <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold bg-brand-primary text-white">
              FEATURED
            </span>

            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                {featured.year}
              </span>
              <Badge {...featured.badge} />
            </div>

            <h3 className="text-2xl font-black mb-3">
              {featured.title}
            </h3>

            <p className="text-text-muted">
              {featured.desc}
            </p>

            {featured.certificate && (
              <button
                onClick={() => setActiveCert(featured.certificate)}
                className="mt-6 inline-flex font-semibold text-brand-primary hover:underline"
              >
                View certificate →
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* ================= TIMELINE ================= */}
      <div className="relative max-w-6xl mx-auto px-4 pl-10 space-y-16">
        <div className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary/25" />

        {!reduceMotion && !isMobile && (
          <motion.div
            className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary origin-top"
            style={{ scaleY: spineScale }}
          />
        )}

        <AnimatePresence>
          {filtered.map((a, i) => (
            <motion.article
              key={a.title}
              drag={isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              {...swipeHandlers}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <span className="absolute left-[2px] top-5 w-4 h-4 rounded-full bg-brand-primary ring-4 ring-brand-bg" />

              <div
                onClick={() => a.certificate && setActiveCert(a.certificate)}
                className={`rounded-2xl p-7 bg-white shadow-lg ring-1 ring-black/5 ${
                  a.certificate ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                    {a.year}
                  </span>
                  <Badge {...a.badge} />
                </div>

                <h3 className="mt-4 text-xl font-black">
                  {a.title}
                </h3>

                <p className="mt-2 text-text-muted">
                  {a.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* ================= CERTIFICATE MODAL ================= */}
      <Modal open={!!activeCert} onClose={() => setActiveCert(null)}>
        {activeCert && <CertificateViewer {...activeCert} />}
      </Modal>
    </section>
  );
}
