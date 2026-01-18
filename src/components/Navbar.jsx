import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const sections = [
  "home",
  "about",
  "achievements",
  "projects",
  "skills",
  "contact",
];

export default function Navbar({ onResume }) {
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  const linkRefs = useRef({});
  const underlineRef = useRef(null);
  const lastScroll = useRef(0);

  /* =====================================================
     SCROLL: AUTO-HIDE + PROGRESS (MOBILE SAFE)
     ===================================================== */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      setProgress(Math.min(100, (y / h) * 100));
      setHidden(y > lastScroll.current && y > 120);
      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =====================================================
     ACTIVE SECTION OBSERVER (RESPONSIVE)
     ===================================================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: isMobile
          ? "-30% 0px -60% 0px"
          : "-45% 0px -45% 0px",
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile]);

  /* =====================================================
     UNDERLINE POSITION (DESKTOP ONLY)
     ===================================================== */
  useLayoutEffect(() => {
    if (reduceMotion || isMobile) return;

    const el = linkRefs.current[active];
    const bar = underlineRef.current;
    if (!el || !bar) return;

    const rect = el.getBoundingClientRect();
    const parent = el.offsetParent.getBoundingClientRect();

    bar.style.width = `${rect.width}px`;
    bar.style.transform = `translateX(${rect.left - parent.left}px)`;
  }, [active, reduceMotion, isMobile]);

  /* =====================================================
     NAVIGATION (NO SMOOTH SCROLL ON MOBILE)
     ===================================================== */
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion || isMobile ? "auto" : "smooth",
    });

    window.location.hash = id;
    setOpen(false);
  };

  /* =====================================================
     ESC CLOSE
     ===================================================== */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-brand-primary z-[999]"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <motion.header
        initial={false}
        animate={{ y: hidden && !reduceMotion ? -120 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-x-0 top-4 z-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`relative flex items-center justify-between rounded-2xl
            ${isMobile ? "bg-brand-bg" : "bg-brand-bg/80 backdrop-blur-xl"}
            shadow-lg ring-1 ring-black/5 px-6 py-4`}
          >
            {/* Noise overlay (DESKTOP ONLY) */}
            {!isMobile && (
              <div className="noise-overlay rounded-2xl pointer-events-none" />
            )}

            {/* Logo */}
            <span className="relative z-10 font-black tracking-tight text-lg">
              Tristan Jorge Cuartero
            </span>

            {/* ================= DESKTOP NAV ================= */}
            <nav
              className="relative z-10 hidden md:flex gap-2"
              aria-label="Primary"
            >
              {sections.map((s) => (
                <button
                  key={s}
                  ref={(el) => (linkRefs.current[s] = el)}
                  onClick={() => go(s)}
                  className={`capitalize px-3 py-2 rounded-lg transition ${
                    active === s
                      ? "text-brand-primary"
                      : "hover:text-brand-primary"
                  }`}
                >
                  {s}
                </button>
              ))}

              <button
                onClick={onResume}
                className="ml-2 px-4 py-2 rounded-full bg-brand-primary text-white font-semibold shadow hover:opacity-90 transition"
              >
                Resume
              </button>

              {!reduceMotion && !isMobile && (
                <motion.span
                  ref={underlineRef}
                  className="absolute -bottom-1 h-[3px] bg-brand-primary rounded-full"
                />
              )}
            </nav>

            {/* ================= MOBILE TOGGLE ================= */}
            <button
              className="relative z-10 md:hidden h-10 w-10 grid place-items-center rounded-lg ring-1 ring-black/10"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              ☰
            </button>
          </div>

          {/* ================= MOBILE MENU ================= */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative mt-3 md:hidden rounded-2xl bg-brand-bg shadow-lg ring-1 ring-black/5 p-4 space-y-2"
              >
                {sections.map((s) => (
                  <button
                    key={s}
                    onClick={() => go(s)}
                    className={`block w-full text-left capitalize px-4 py-2 rounded-lg ${
                      active === s
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "hover:bg-black/5"
                    }`}
                  >
                    {s}
                  </button>
                ))}

                <button
                  onClick={() => {
                    onResume();
                    setOpen(false);
                  }}
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow"
                >
                  Resume
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
