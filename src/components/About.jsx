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

  /* ================= SCROLL EFFECTS ================= */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgDrift = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 sm:py-36 bg-brand-bg overflow-hidden"
    >
      {/* ================= BACKGROUND ================= */}
      <motion.div
        style={!reduceMotion ? { y: bgDrift } : {}}
        className="absolute inset-0 -z-10 pointer-events-none"
      >
        <div className="absolute top-24 right-[-200px] w-[520px] h-[520px] rounded-full bg-brand-primary/15 blur-3xl" />
        <div className="absolute bottom-32 left-[-200px] w-[420px] h-[420px] rounded-full bg-brand-secondary/20 blur-3xl" />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="relative max-w-6xl mx-auto px-4 grid gap-20 lg:grid-cols-2 lg:gap-24">
        {/* ================= LEFT ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 32 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col"
        >
          <span className="inline-block mb-4 text-xs font-bold tracking-widest text-brand-primary">
            ABOUT ME
          </span>

          <h2 className="text-4xl sm:text-5xl font-black text-brand-dark leading-tight mb-6">
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

          {/* TIMELINE */}
          <div className="mt-20">
            <Timeline />
          </div>

          {/* PHILOSOPHY */}
          <div className="relative mt-20 max-w-xl rounded-2xl bg-white/90 backdrop-blur p-8 shadow-lg ring-1 ring-black/5">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-l-2xl" />
            <h3 className="font-black text-lg text-brand-dark mb-3">
              Design Philosophy
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Technology should fade into the background.
              <br />
              When systems feel obvious, they’re doing their job.
            </p>
          </div>
        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 32 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
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
