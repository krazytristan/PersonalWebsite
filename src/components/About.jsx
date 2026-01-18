import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  useInView,
} from "framer-motion";
import { useRef } from "react";
import Highlight from "./ui/Highlight";
import Timeline from "./ui/Timeline";

export default function About() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  /* ================= VISIBILITY ================= */
  const isInView = useInView(sectionRef, {
    margin: "-25% 0px -25% 0px",
  });

  /* ================= SCROLL ================= */
  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scrollVelocity = useVelocity(scrollY);

  /* ================= BACKGROUND ================= */
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const bgDrift = useTransform(scrollYProgress, [0, 1], [0, -160]);

  /* ================= CAMERA PARALLAX ================= */
  const cameraY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -24]),
    { stiffness: 40, damping: 22 }
  );

  /* ================= LANYARD PHYSICS ================= */
  const laceLength = useTransform(scrollYProgress, [0, 1], [130, 190]);

  const laceRotateRaw = useTransform(
    scrollVelocity,
    [-1200, 0, 1200],
    [10, 0, -10]
  );
  const laceRotate = useSpring(laceRotateRaw, {
    stiffness: 50,
    damping: 26,
  });

  const holderSwingRaw = useTransform(
    scrollVelocity,
    [-1200, 0, 1200],
    [14, 0, -14]
  );
  const holderSwing = useSpring(holderSwingRaw, {
    stiffness: 40,
    damping: 28,
  });

  /* ================= MAGNETIC CURSOR ================= */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const magneticX = useSpring(mx, { stiffness: 90, damping: 26 });
  const magneticY = useSpring(my, { stiffness: 90, damping: 26 });

  const rotateX = useSpring(useTransform(my, [-60, 60], [8, -8]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-60, 60], [-8, 8]), {
    stiffness: 120,
    damping: 20,
  });

  /* ================= GLARE & CHROMA ================= */
  const glareX = useSpring(
    useTransform(mx, [-60, 60], ["35%", "65%"]),
    { stiffness: 60, damping: 30 }
  );
  const glareY = useSpring(
    useTransform(my, [-60, 60], ["35%", "65%"]),
    { stiffness: 60, damping: 30 }
  );

  const chroma = useTransform(mx, [-60, 60], [-1, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-36 min-h-[90vh] bg-brand-bg overflow-hidden"
    >
      {/* =====================================================
          FLOATING ID HOLDER (DESKTOP ONLY)
      ===================================================== */}
      {!reduceMotion && (
        <motion.div
          className="fixed right-10 top-0 h-screen z-50 hidden lg:flex justify-center pointer-events-none"
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ y: cameraY }}
        >
          <div className="relative mt-24 pointer-events-auto">
            {/* LANYARD */}
            <motion.div
              className="absolute left-1/2 top-0 w-[4px] rounded-full
                bg-gradient-to-b from-brand-primary to-transparent"
              style={{
                height: laceLength,
                rotate: laceRotate,
                transformOrigin: "top",
              }}
            />

            {/* METAL CLIP */}
            <motion.div
              className="absolute left-1/2 top-[130px] -translate-x-1/2
                w-8 h-3 rounded-sm
                bg-gradient-to-r from-zinc-300 via-white to-zinc-400
                shadow-sm"
              style={{ rotate: laceRotate }}
            />

            {/* ID HOLDER */}
            <motion.div
              className="relative mt-[150px] w-[220px] h-[280px]
                rounded-3xl bg-white/85 backdrop-blur-xl
                ring-1 ring-black/10
                shadow-[0_28px_60px_rgba(0,0,0,0.18)]
                overflow-hidden"
              style={{
                rotateZ: holderSwing,
                rotateX,
                rotateY,
                x: magneticX,
                y: magneticY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const dx = e.clientX - r.left - r.width / 2;
                const dy = e.clientY - r.top - r.height / 2;

                // Dead-zone to avoid jitter
                mx.set(Math.abs(dx) < 8 ? 0 : dx);
                my.set(Math.abs(dy) < 8 ? 0 : dy);
              }}
              onMouseLeave={() => {
                mx.set(0);
                my.set(0);
              }}
            >
              {/* PHOTO */}
              <img
                src="/images/bro.jpg"
                alt="Tristan"
                className="w-full h-full object-cover"
              />

              {/* CHROMATIC EDGE */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: `
                    inset ${chroma}px 0 0 rgba(255,0,0,0.18),
                    inset ${-chroma}px 0 0 rgba(0,140,255,0.18)
                  `,
                }}
              />

              {/* EMBOSSED BORDER */}
              <div className="absolute inset-0 rounded-3xl ring-2 ring-white/30 pointer-events-none" />

              {/* GAZE LIGHT */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(
                    220px at ${glareX} ${glareY},
                    rgba(255,255,255,0.28),
                    transparent 65%
                  )`,
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ================= BACKGROUND ================= */}
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
          className="absolute left-1/2 top-0 h-full w-[2px]
            bg-brand-primary/20 origin-top hidden lg:block"
          style={{ scaleY: spineScale }}
        />
      )}

      {/* ================= CONTENT ================= */}
      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-start">
        {/* LEFT */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 40 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.9 }}
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

          <motion.div className="mt-16">
            <Timeline />
          </motion.div>

          <motion.div className="relative mt-20 rounded-2xl bg-white/90 backdrop-blur p-7 shadow-lg ring-1 ring-black/5">
            <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary rounded-l-2xl" />
            <h3 className="font-black text-lg text-brand-dark mb-2">
              Design Philosophy
            </h3>
            <p className="text-sm text-zinc-600">
              Technology should fade into the background.
              <br />
              When systems feel obvious, they’re doing their job.
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={!reduceMotion ? { opacity: 0, y: 40 } : false}
          whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          className="grid gap-10"
        >
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
                "Iterative development",
              ],
            },
            {
              title: "What I Value",
              items: [
                "Simplicity over complexity",
                "Longevity over shortcuts",
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
