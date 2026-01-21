import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import Highlight from "./ui/Highlight";
import Timeline from "./ui/Timeline";

/* ================= HEADER COPY ================= */
const HEADER = {
  label: "About Me",
  title: (
    <>
      Designing Systems
      <span className="block text-brand-primary">
        That Feel Intuitive & Human
      </span>
    </>
  ),
  desc:
    "I focus on building software systems that balance technical structure with real-world usability — transforming complex requirements into clear, scalable solutions.",
};

export default function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  /* ================= SCROLL EFFECTS ================= */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgDrift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 sm:py-36 bg-brand-bg overflow-hidden"
    >
      {/* ================= AMBIENT BACKGROUND ================= */}
      {!reduceMotion && (
        <motion.div
          style={{ y: bgDrift }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <div
            className="absolute top-24 right-[-200px]
            w-[520px] h-[520px]
            rounded-full bg-brand-primary/15 blur-3xl"
          />
          <div
            className="absolute bottom-32 left-[-200px]
            w-[420px] h-[420px]
            rounded-full bg-brand-primary/10 blur-3xl"
          />
        </motion.div>
      )}

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
        className="mb-24 px-4 text-center max-w-3xl mx-auto"
      >
        <span
          className="inline-block mb-4 px-4 py-1.5 rounded-full
          bg-brand-primary/10 text-brand-primary
          text-xs font-semibold tracking-wide"
        >
          {HEADER.label}
        </span>

        <h2
          className="text-4xl sm:text-5xl xl:text-6xl
          font-black text-text-primary leading-tight"
        >
          {HEADER.title}
        </h2>

        <p className="mt-6 text-sm sm:text-base text-text-muted leading-relaxed">
          {HEADER.desc}
        </p>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="relative max-w-6xl mx-auto px-4 grid gap-20 lg:grid-cols-2 lg:gap-24">
        {/* ================= LEFT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col"
        >
          <p className="text-base sm:text-lg leading-relaxed text-text-muted max-w-xl">
            I work at the intersection of{" "}
            <span className="font-semibold text-text-primary">
              education
            </span>{" "}
            and{" "}
            <span className="font-semibold text-text-primary">
              software engineering
            </span>
            .
            <br />
            <br />
            My approach centers on turning complex workflows into systems that
            feel clear, efficient, and intuitive — built for long-term use and
            real people.
          </p>

          {/* TIMELINE */}
          <div className="mt-20">
            <Timeline />
          </div>

          {/* PHILOSOPHY */}
          <div
            className="relative mt-20 max-w-xl
            rounded-2xl bg-brand-surface
            backdrop-blur p-8 shadow-xl
            ring-1 ring-brand-text/10"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-l-2xl" />
            <h3 className="font-black text-lg text-text-primary mb-3">
              Design Philosophy
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              Technology should fade into the background.
              <br />
              When systems feel obvious, they’re doing their job.
            </p>
          </div>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-10 lg:pt-10"
        >
          <Highlight
            title="What I Build"
            items={[
              "Academic & attendance systems",
              "Admin dashboards & internal tools",
              "Reservation & tracking platforms",
              "IoT-integrated web applications",
            ]}
          />

          <Highlight
            title="How I Work"
            items={[
              "User-first system design",
              "Clean architecture & domain logic",
              "Readable, maintainable code",
              "Iterative development",
            ]}
          />

          <Highlight
            title="What I Value"
            items={[
              "Simplicity over complexity",
              "Longevity over shortcuts",
              "Systems that scale with people",
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}
