import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* -------------------- TYPEWRITER -------------------- */
function Typewriter({ text }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(text);
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, 70);

    return () => clearInterval(id);
  }, [text, reduceMotion]);

  return <>{display}</>;
}

/* -------------------- COUNT UP -------------------- */
function useCountUp(target, duration = 1200) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.6 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, reduceMotion]);

  return [value, ref];
}

/* -------------------- HERO -------------------- */
export default function Hero() {
  const reduceMotion = useReducedMotion();

  /* Scroll effects */
  const { scrollY } = useScroll();
  const fadeOut = useTransform(scrollY, [0, 420], [1, 0.85]);

  /* Cursor spotlight */
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  /* Tilt */
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rotateX = useSpring(useTransform(ty, [-40, 40], [10, -10]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(tx, [-40, 40], [-10, 10]), {
    stiffness: 120,
    damping: 18,
  });

  /* Roles */
  const roles = ["Educator", "Developer", "Architect"];
  const [role, setRole] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setRole((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  /* Stats */
  const [years, yearsRef] = useCountUp(5);
  const [systems, systemsRef] = useCountUp(15);

  return (
    <section
      id="home"
      className="relative min-h-[95vh] flex items-center overflow-hidden bg-brand-bg text-brand-text"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      {/* Ambient spotlight */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useTransform(
              [mx, my],
              ([x, y]) =>
                `radial-gradient(600px at ${x}% ${y}%, rgba(255,109,31,0.15), transparent 60%)`
            ),
          }}
        />
      )}

      {/* Background video */}
      {!reduceMotion && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-[0.05]"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      <div className="noise-overlay absolute inset-0 pointer-events-none" />

      <motion.div
        style={{ opacity: fadeOut }}
        className="relative z-10 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-14 items-center"
      >
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="inline-flex px-4 py-1.5 rounded-full text-sm bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/30">
            🚀 Building real-world systems
          </span>

          <h1 className="mt-6 text-5xl xl:text-6xl font-black leading-tight">
            Hi, I’m{" "}
            <span className="text-brand-primary">
              <Typewriter text="Tristan" />
            </span>
          </h1>

          <div className="relative mt-2 h-[28px] text-lg font-semibold text-brand-primary overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute"
              >
                {roles[role]}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-4 text-lg text-text-muted max-w-xl">
            I design and build scalable platforms, dashboards, and systems with
            strong UX and clean architecture.
          </p>

          <div className="mt-8 flex gap-4">
            <motion.a
              href="#projects"
              whileHover={!reduceMotion ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-xl bg-brand-primary text-white font-semibold shadow-lg"
            >
              View Projects
            </motion.a>

            <a
              href="#contact"
              className="px-7 py-3 rounded-xl bg-brand-surface ring-1 ring-black/10 hover:bg-black/5 transition"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <div ref={yearsRef}>
              <Stat value={`${years}+`} label="Years Teaching" />
            </div>
            <div ref={systemsRef}>
              <Stat value={`${systems}+`} label="Systems Built" />
            </div>
            <Stat value="UX & Logic" label="Focus" />
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="relative hidden md:block perspective-[1200px]"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            tx.set(e.clientX - r.left - r.width / 2);
            ty.set(e.clientY - r.top - r.height / 2);
          }}
          onMouseLeave={() => {
            tx.set(0);
            ty.set(0);
          }}
        >
          {!reduceMotion && (
            <motion.div
              className="absolute -inset-8 rounded-[2.5rem]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, #FF6D1F, transparent)",
                filter: "blur(26px)",
                opacity: 0.6,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
          )}

          <motion.div
            style={!reduceMotion ? { rotateX, rotateY } : {}}
            whileHover={!reduceMotion ? { scale: 1.05 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="/images/BSU_6102.jpg"
              alt="Tristan portrait"
              className="rounded-3xl"
              loading="eager"
            />
            <div className="noise-overlay absolute inset-0" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- STAT ---------------- */
function Stat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
