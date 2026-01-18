import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  "home",
  "about",
  "achievements",
  "projects",
  "skills",
  "contact",
];

export default function Navbar({ onResume }) {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  const navRef = useRef(null);
  const linkRefs = useRef({});
  const underlineRef = useRef(null);
  const lastScroll = useRef(0);

  /* =====================================================
     AUTO-HIDE NAVBAR + PROGRESS BAR
     ===================================================== */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;
      setProgress((y / h) * 100);

      setHidden(y > lastScroll.current && y > 120);
      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =====================================================
     INTERSECTION OBSERVER (ACTIVE SECTION)
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
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* =====================================================
     UNDERLINE ANIMATION
     ===================================================== */
  useLayoutEffect(() => {
    const el = linkRefs.current[active];
    const bar = underlineRef.current;
    if (!el || !bar) return;

    const rect = el.getBoundingClientRect();
    const parent = el.offsetParent.getBoundingClientRect();

    bar.style.width = `${rect.width}px`;
    bar.style.transform = `translateX(${rect.left - parent.left}px)`;
  }, [active]);

  /* =====================================================
     NAVIGATION
     ===================================================== */
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
    setOpen(false);
  };

  /* =====================================================
     ESC CLOSE (MOBILE)
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
      />

      <motion.header
        ref={navRef}
        initial={false}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-x-0 top-4 z-50"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex items-center justify-between rounded-2xl bg-brand-bg/80 backdrop-blur-xl shadow-lg ring-1 ring-black/5 px-6 py-4">

            {/* Grain */}
            <div className="noise-overlay rounded-2xl pointer-events-none" />

            {/* Logo */}
            <span className="relative z-10 font-black tracking-tight text-lg">
              Tristan Jorge Cuartero
            </span>

            {/* ================= DESKTOP NAV ================= */}
            <nav className="relative z-10 hidden md:flex gap-2">
              {sections.map((s) => (
                <button
                  key={s}
                  ref={(el) => (linkRefs.current[s] = el)}
                  onClick={() => go(s)}
                  className={`capitalize px-3 py-2 rounded-lg transition focus:outline-none ${
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

              {/* Animated Underline */}
              <motion.span
                ref={underlineRef}
                layout
                className="absolute -bottom-1 h-[3px] bg-brand-primary rounded-full shadow-[0_0_12px_rgba(255,109,31,0.6)]"
              />
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
                transition={{ duration: 0.25 }}
                className="relative mt-3 md:hidden rounded-2xl bg-brand-bg shadow-lg ring-1 ring-black/5 p-4 space-y-2"
              >
                <div className="noise-overlay rounded-2xl pointer-events-none" />

                {sections.map((s) => (
                  <button
                    key={s}
                    onClick={() => go(s)}
                    className={`relative z-10 block w-full text-left capitalize px-4 py-2 rounded-lg transition ${
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
                  className="relative z-10 w-full mt-2 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow"
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
