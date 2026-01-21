import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  memo,
} from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { projects } from "../data/projects";

/* ================= CONFIG ================= */
const INTERVAL = 4200;
const ITEM_HEIGHT = 96;
const SWIPE_THRESHOLD = 60;
const MAX_TILT = 10;
const IDLE_RESUME = 5000;

/* ================= CARD ================= */
const ProjectCard = memo(function ProjectCard({
  project,
  offset,
  isActive,
  tilt,
  reduceMotion,
  isTouch,
  imageOffsetY,
  onOpen,
  goNext,
  goPrev,
  onPointerMove,
  markUserActive,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <motion.div
      layout
      drag={isActive && !reduceMotion ? "y" : false}
      dragElastic={0.15}
      onDragEnd={(_, info) => {
        markUserActive();
        if (info.offset.y < -80) goNext();
        if (info.offset.y > 80) goPrev();
      }}
      onPointerMove={isActive ? onPointerMove : undefined}
      onClick={() => isActive && onOpen?.(project)}
      animate={{
        y: offset * (isTouch ? 160 : imageOffsetY),
        x: offset * -36,
        scale: isActive ? 1.03 : 0.88,
        opacity: isActive ? 1 : 0.25,
        rotateZ: offset * -4,
        rotateX: isActive ? tilt.x : 0,
        rotateY: isActive ? tilt.y : 0,
        zIndex: isActive ? 30 : 10 - Math.abs(offset),
      }}
      transition={{ type: "spring", stiffness: 140, damping: 28 }}
      className="absolute inset-x-0 mx-auto h-[200px] md:h-[260px]
        rounded-3xl overflow-hidden cursor-pointer
        bg-brand-surface/70 backdrop-blur-2xl
        ring-1 ring-brand-text/10
        shadow-[0_40px_120px_-30px_rgba(0,0,0,0.45)]"
    >
      {!loaded && !error && (
        <div className="absolute inset-0 bg-brand-text/10 animate-pulse" />
      )}

      {!error ? (
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition
            ${loaded ? "opacity-100 scale-105" : "opacity-0"}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm">
          Image unavailable
        </div>
      )}
    </motion.div>
  );
});

/* ================= MAIN ================= */
export default function Projects({ onOpen }) {
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);

  const paused = useRef(false);
  const idleTimer = useRef(null);
  const wheelLock = useRef(false);
  const touchStartY = useRef(0);
  const focusRef = useRef(null);
  const intervalRef = useRef(null);
  const sectionRef = useRef(null);

  const total = projects.length;

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const IMAGE_OFFSET_Y =
    typeof window !== "undefined"
      ? Math.min(window.innerHeight * 0.35, 260)
      : 260;

  /* ================= VISIBILITY PAUSE ================= */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        paused.current = !entry.isIntersecting;
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ================= HELPERS ================= */
  const markUserActive = () => {
    paused.current = true;
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(
      () => (paused.current = false),
      IDLE_RESUME
    );
  };

  const setActiveSafe = useCallback(
    (index) => {
      const next = (index + total) % total;
      setActive(next);
      setProgress(0);
      history.replaceState(null, "", `#${projects[next].id}`);
      markUserActive();
    },
    [total]
  );

  const goNext = useCallback(
    () => setActiveSafe(active + 1),
    [active, setActiveSafe]
  );

  const goPrev = useCallback(
    () => setActiveSafe(active - 1),
    [active, setActiveSafe]
  );

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (reduceMotion || total <= 1) return;

    intervalRef.current = setInterval(() => {
      if (!paused.current) {
        setProgress((p) => {
          if (p >= 100) {
            goNext();
            return 0;
          }
          return p + 100 / (INTERVAL / 100);
        });
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [reduceMotion, total, goNext]);

  /* ================= INPUT ================= */
  useEffect(() => {
    const onKey = (e) => {
      markUserActive();
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
      if (e.key === "Enter") onOpen?.(projects[active]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goNext, goPrev, onOpen]);

  useEffect(() => {
    if (isTouch) return;

    const onWheel = (e) => {
      markUserActive();
      if (wheelLock.current) return;
      wheelLock.current = true;
      e.deltaY > 0 ? goNext() : goPrev();
      setTimeout(() => (wheelLock.current = false), 520);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isTouch, goNext, goPrev]);

  /* ================= WINDOWING ================= */
  const visibleProjects = useMemo(() => {
    return projects
      .map((p, i) => ({ ...p, offset: i - active }))
      .filter((p) => Math.abs(p.offset) <= 2);
  }, [active]);

  /* ================= TILT ================= */
  const onPointerMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * MAX_TILT, y: -x * MAX_TILT });
  };

  /* ================= RENDER ================= */
  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-24 md:py-32 bg-brand-bg overflow-hidden"
    >
      {/* ================= MODERN IT HEADER ================= */}
      <div className="text-center mb-16 max-w-3xl mx-auto px-4">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4 px-4 py-1.5 rounded-full
            bg-brand-primary/10 text-brand-primary
            text-xs md:text-sm font-semibold tracking-wide"
        >
          Selected Projects
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black
            text-text-primary leading-tight"
        >
          Building Digital Systems
          <span className="block text-brand-primary">
            That Solve Real Problems
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-sm md:text-base text-text-muted leading-relaxed"
        >
          A curated selection of web applications and system solutions I’ve
          designed and developed. Each project emphasizes clean architecture,
          performance, usability, and real-world functionality.
        </motion.p>
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="max-w-xs mx-auto mb-8 h-1 bg-brand-text/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-primary"
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-[1fr_1.3fr] md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* LEFT LIST */}
        <div className="pl-10 md:pl-16 space-y-6">
          {projects.map((p, i) => (
            <button
              key={p.id}
              ref={i === active ? focusRef : null}
              onClick={() => setActiveSafe(i)}
              className={`block w-full text-left transition-all ${
                i === active
                  ? "opacity-100 translate-x-1"
                  : "opacity-40 hover:opacity-70"
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              <h3 className="text-base md:text-xl font-black text-text-primary">
                {p.title}
              </h3>
              <p className="text-xs md:text-sm text-text-muted line-clamp-2">
                {p.desc}
              </p>
            </button>
          ))}
        </div>

        {/* RIGHT STACK */}
        <div className="relative h-[360px] md:h-[480px] lg:sticky lg:top-32 perspective-[1200px]">
          <AnimatePresence initial={false}>
            {visibleProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                offset={p.offset}
                isActive={p.offset === 0}
                tilt={tilt}
                reduceMotion={reduceMotion}
                isTouch={isTouch}
                imageOffsetY={IMAGE_OFFSET_Y}
                onOpen={onOpen}
                goNext={goNext}
                goPrev={goPrev}
                onPointerMove={onPointerMove}
                markUserActive={markUserActive}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
