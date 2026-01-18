import { useState, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
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
    certificate: {
      title: "Systems Architecture Recognition",
      src: "/certificates/architecture.jpg",
      type: "image",
    },
  },
  {
    year: "2024",
    title: "Campus Journalism Research Lead",
    desc: "Led action research for non-trained journalism coaches.",
    badge: { icon: "📘", label: "Research" },
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

export default function Achievements() {
  const reduceMotion = useReducedMotion();
  const [activeCert, setActiveCert] = useState(null);
  const sectionRef = useRef(null);

  /* Scroll-linked spine */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative py-36 min-h-[80vh] bg-brand-bg overflow-hidden"
    >
      {/* NAVBAR ACTIVATION BUFFER */}
      <span aria-hidden className="absolute top-[30vh]" />

      {/* ================= BACKGROUND ATMOSPHERE ================= */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-brand-primary/20 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-24"
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

        {/* ================= TIMELINE ================= */}
        <div className="relative pl-12 space-y-20">
          {/* Spine (static) */}
          <div className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary/25" />

          {/* Spine (animated) */}
          {!reduceMotion && (
            <motion.div
              className="absolute left-[10px] top-0 bottom-0 w-px bg-brand-primary origin-top"
              style={{ scaleY: spineScale }}
            />
          )}

          {achievements.map((a, i) => (
            <motion.article
              key={a.title}
              initial={!reduceMotion ? { opacity: 0, y: 36 } : false}
              whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* ================= NODE ================= */}
              <motion.span
                initial={!reduceMotion ? { scale: 0.8, opacity: 0 } : false}
                whileInView={!reduceMotion ? { scale: 1, opacity: 1 } : false}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="absolute left-[2px] top-5 w-4 h-4 rounded-full bg-brand-primary ring-4 ring-brand-bg shadow-[0_0_18px_rgba(255,109,31,0.75)]"
              />

              {/* ================= CARD ================= */}
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
                  <span className="text-sm font-semibold text-brand-primary">
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
        </div>
      </div>

      {/* ================= CERTIFICATE MODAL ================= */}
      <Modal open={!!activeCert} onClose={() => setActiveCert(null)}>
        {activeCert && <CertificateViewer {...activeCert} />}
      </Modal>
    </section>
  );
}
