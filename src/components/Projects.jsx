import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { projects } from "../data/projects";

const INTERVAL = 4200;
const ITEM_HEIGHT = 96;
const SWIPE_THRESHOLD = 60;
const MAX_TILT = 10;

export default function Projects({ onOpen }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const paused = useRef(false);
  const wheelLock = useRef(false);
  const touchStartY = useRef(0);
  const focusRef = useRef(null);
  const total = projects.length;

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const IMAGE_OFFSET_Y =
    typeof window !== "undefined"
      ? Math.min(window.innerHeight * 0.35, 260)
      : 260;

  /* ================= HELPERS ================= */
  const goNext = useCallback(
    () => setActive((i) => (i + 1) % total),
    [total]
  );
  const goPrev = useCallback(
    () => setActive((i) => (i - 1 + total) % total),
    [total]
  );

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (reduceMotion || total <= 1) return;

    const id = setInterval(() => {
      if (!paused.current) goNext();
    }, INTERVAL);

    return () => clearInterval(id);
  }, [reduceMotion, total, goNext]);

  /* ================= AUTO FOCUS ================= */
  useEffect(() => {
    focusRef.current?.focus({ preventScroll: true });
  }, [active]);

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown") goNext();
      if (e.key === "ArrowUp") goPrev();
      if (e.key === "Enter") onOpen?.(projects[active]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goNext, goPrev, onOpen]);

  /* ================= WHEEL ================= */
  useEffect(() => {
    if (isTouch) return;

    const onWheel = (e) => {
      if (paused.current || wheelLock.current) return;
      wheelLock.current = true;

      e.deltaY > 0 ? goNext() : goPrev();
      setTimeout(() => (wheelLock.current = false), 520);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isTouch, goNext, goPrev]);

  /* ================= TOUCH ================= */
  useEffect(() => {
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const delta =
        touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return;
      delta > 0 ? goNext() : goPrev();
    };

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  /* ================= PERFORMANCE WINDOW ================= */
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
    setTilt({
      x: y * MAX_TILT,
      y: -x * MAX_TILT,
    });
  };

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 bg-brand-bg overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      aria-live="polite"
    >
      <h2 className="text-3xl md:text-4xl font-black text-center mb-20">
        Featured Projects
      </h2>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-[1fr_1.3fr] md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* LEFT */}
        <div className="relative">
          <div className="absolute left-[-28px] top-0 bottom-0 w-[2px] bg-black/10">
            <motion.div
              animate={{ height: `${((active + 1) / total) * 100}%` }}
              className="w-full bg-brand-primary"
            />
          </div>

          <motion.div
            animate={{ y: active * ITEM_HEIGHT }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="absolute left-0 top-2"
          >
            <div className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg">
              →
            </div>
          </motion.div>

          <div className="pl-10 md:pl-16 space-y-6">
            {projects.map((p, i) => (
              <button
                key={p.id}
                ref={i === active ? focusRef : null}
                onClick={() => setActive(i)}
                aria-current={i === active}
                className={`block w-full text-left transition-all ${
                  i === active
                    ? "opacity-100 translate-x-1"
                    : "opacity-40 hover:opacity-70"
                }`}
                style={{ height: ITEM_HEIGHT }}
              >
                <h3 className="text-base md:text-xl font-black">
                  {p.title}
                </h3>
                <p className="text-xs md:text-sm text-text-muted line-clamp-2">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative h-[360px] md:h-[480px] lg:sticky lg:top-32 perspective-[1200px]">
          <AnimatePresence initial={false}>
            {visibleProjects.map((p) => {
              const offset = p.offset;
              const isActive = offset === 0;

              return (
                <motion.div
                  key={p.id}
                  layout
                  drag={isActive && !reduceMotion ? "y" : false}
                  dragElastic={0.15}
                  onDragEnd={(_, info) => {
                    if (info.offset.y < -80) goNext();
                    if (info.offset.y > 80) goPrev();
                  }}
                  onPointerMove={isActive ? onPointerMove : undefined}
                  onPointerLeave={() => setTilt({ x: 0, y: 0 })}
                  onClick={() => isActive && onOpen?.(p)}
                  animate={{
                    y: offset * (isTouch ? 160 : IMAGE_OFFSET_Y),
                    x: offset * -36,
                    scale: isActive ? 1 : 0.88,
                    opacity: isActive ? 1 : 0.25,
                    rotateZ: offset * -4,
                    rotateX: isActive ? tilt.x : 0,
                    rotateY: isActive ? tilt.y : 0,
                    zIndex: isActive ? 30 : 10 - Math.abs(offset),
                  }}
                  transition={{ type: "spring", stiffness: 140, damping: 28 }}
                  className="absolute inset-x-0 mx-auto h-[200px] md:h-[260px] rounded-3xl overflow-hidden cursor-pointer bg-white/40 backdrop-blur-2xl ring-1 ring-white/30 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)] will-change-transform"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 text-white"
                    >
                      <h4 className="font-black text-lg">
                        {p.title}
                      </h4>
                      <p className="text-sm opacity-80 line-clamp-2">
                        {p.desc}
                      </p>
                    </motion.div>
                  )}

                  {isActive && (
                    <motion.div
                      animate={{ opacity: [0.2, 0.35, 0.2] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="absolute -inset-2 rounded-3xl bg-brand-primary/25 blur-2xl pointer-events-none"
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
