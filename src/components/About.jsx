import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import Highlight from "./ui/Highlight";
import Timeline from "./ui/Timeline";

export default function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  /* Scroll progress (journey spine) */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bgDrift = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-36 min-h-[90vh] bg-brand-bg overflow-hidden"
    >
      {/* NAVBAR ACTIVATION BUFFER */}
      <span aria-hidden className="absolute top-[30vh]" />

      {/* ================= BACKGROUND ATMOSPHERE ================= */}
      <motion.div
        style={!reduceMotion ? { y: bgDrift } : {}}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-32 right-[-180px] w-[560px] h-[560px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-32 left-[-200px] w-[460px] h-[460px] rounded-full bg-brand-secondary/30 blur-3xl" />
      </motion.div>

      {/* ================= SCROLL SPINE ================= */}
      {!reduceMotion && (
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[2px] bg-brand-primary/20 origin-top hidden lg:block"
          style={{ scaleY: spineScale }}
        />
      )}

      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-start">
        {/* ================= LEFT — STORY ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 40 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="inline-block mb-4 text-xs font-bold tracking-widest text-brand-primary">
            ABOUT ME
          </span>

          <h2 className="text-4xl font-black text-brand-dark leading-tight mb-6">
            Systems that feel
            <br className="hidden sm:block" />
            intuitive and human
          </h2>

          <p className="text-lg leading-relaxed text-zinc-700 max-w-xl">
            I work at the intersection of{" "}
            <span className="font-semibold text-brand-dark">education</span>{" "}
            and{" "}
            <span className="font-semibold text-brand-dark">
              software engineering
            </span>
            .
            <br />
            <br />
            My focus is transforming complex requirements into practical,
            human-centered systems — built for clarity, scalability, and
            long-term use.
          </p>

          {/* ================= TIMELINE ================= */}
          <motion.div
            className="mt-16"
            initial={!reduceMotion ? { opacity: 0, y: 20 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Timeline />
          </motion.div>

          {/* ================= STICKY PHILOSOPHY ================= */}
          <motion.div
            initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            whileHover={
              !reduceMotion
                ? {
                    boxShadow:
                      "0 24px 48px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,109,31,0.35)",
                  }
                : {}
            }
            className="relative mt-20 rounded-2xl bg-white/90 backdrop-blur p-7 shadow-lg ring-1 ring-black/5 transition"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-l-2xl" />
            <h3 className="font-black text-lg text-brand-dark mb-2">
              Design Philosophy
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Technology should fade into the background.
              <br />
              When systems feel obvious, they’re doing their job.
            </p>
          </motion.div>
        </motion.div>

        {/* ================= RIGHT — CAPABILITIES ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 40 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          className="grid gap-8"
        >
          {/* Capability Counters */}
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: "5+", label: "Years Teaching" },
              { value: "15+", label: "Systems Built" },
              { value: "100%", label: "User-First" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-brand-dark">
                  {stat.value}
                </div>
                <div className="text-xs text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          {[
            {
              title: "What I Build",
              items: [
                "Academic & attendance systems",
                "Admin dashboards & internal tools",
                "Reservation & tracking platforms",
                "IoT-integrated web applications",
              ],
            },
            {
              title: "How I Work",
              items: [
                "User-first system design",
                "Clean architecture & domain logic",
                "Readable, maintainable code",
                "Iterative, feedback-driven development",
              ],
            },
            {
              title: "What I Value",
              items: [
                "Simplicity over complexity",
                "Longevity over quick wins",
                "Systems that scale with people",
              ],
            },
          ].map((block) => (
            <motion.div
              key={block.title}
              whileHover={!reduceMotion ? { y: -8 } : {}}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
            >
              <Highlight title={block.title} items={block.items} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
