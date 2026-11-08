import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sun,
  Moon,
  FileText,
  Menu,
  X,
  Command,
  Volume2,
  VolumeX,
} from "lucide-react";
import { sounds } from "../utils/audio";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "simulator", label: "Lab Sandbox" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Milestones" },
  { id: "blog", label: "Insights" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ onResume, onOpenPalette }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [soundEnabled, setSoundEnabled] = useState(false);

  const linkRefs = useRef({});
  const underlineRef = useRef(null);
  const lastScroll = useRef(0);

  /* ================= THEME STATE ================= */
  useEffect(() => {
    if (typeof window !== "undefined" && window.__theme) {
      setTheme(window.__theme.getResolved());
    }

    const onThemeChange = (e) => {
      setTheme(e.detail?.resolved || window.__theme?.getResolved());
    };

    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined" && window.__theme) {
      window.__theme.toggle();
      setTheme(window.__theme.getResolved());
      sounds.playPop();
    }
  };

  const toggleSound = () => {
    const isNowOn = sounds.toggle();
    setSoundEnabled(isNowOn);
  };

  /* ================= SCROLL: AUTO-HIDE + PROGRESS ================= */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );

      setProgress(Math.min(100, (y / h) * 100));
      setHidden(y > lastScroll.current && y > 150);
      lastScroll.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= ACTIVE SECTION OBSERVER ================= */
  useEffect(() => {
    if (location.pathname.startsWith("/blog")) {
      setActive("blog");
      return;
    }

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
          : "-40% 0px -50% 0px",
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile, location.pathname]);

  /* ================= UNDERLINE POSITION (DESKTOP) ================= */
  useLayoutEffect(() => {
    if (reduceMotion || isMobile) return;

    const el = linkRefs.current[active];
    const bar = underlineRef.current;
    if (!el || !bar) return;

    const rect = el.getBoundingClientRect();
    const parent = el.offsetParent.getBoundingClientRect();

    bar.style.width = `${rect.width}px`;
    bar.style.transform = `translateX(${rect.left - parent.left}px)`;
    bar.style.opacity = "1";
  }, [active, reduceMotion, isMobile]);

  /* ================= NAVIGATION ================= */
  const go = (id) => {
    sounds.playClick();
    setOpen(false);

    if (location.pathname !== "/") {
      if (id === "home") {
        navigate("/");
      } else {
        navigate(`/#${id}`);
      }
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reduceMotion || isMobile ? "auto" : "smooth",
      });
      window.location.hash = id;
    } else {
      navigate(`/#${id}`);
    }
  };

  const handleResume = () => {
    sounds.playClick();
    if (onResume) {
      onResume();
    } else {
      window.open("/resume.pdf", "_blank");
    }
  };

  const handleOpenPalette = () => {
    sounds.playPop();
    if (onOpenPalette) {
      onOpenPalette();
    } else {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  /* ================= KEYBOARD PALETTE SHORTCUT ================= */
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleOpenPalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenPalette]);

  return (
    <>
      {/* Top Scroll Progress Line */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-brand-primary via-orange-400 to-amber-300 z-[999]"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      <motion.header
        initial={false}
        animate={{ y: hidden && !reduceMotion ? -110 : 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed inset-x-0 top-3 sm:top-5 z-50 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="relative flex items-center justify-between rounded-full glass-panel px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg"
          >
            {/* Monogram Brand */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                go("home");
              }}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-orange-400 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-brand-primary/20 group-hover:scale-105 transition">
                TC
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-sm text-brand-text group-hover:text-brand-primary transition">
                  Tristan Cuartero
                </span>
                <span className="text-[10px] font-mono tracking-widest text-brand-muted hidden sm:block">
                  SYSTEMS ARCHITECT
                </span>
              </div>
            </a>

            {/* ================= DESKTOP NAV ================= */}
            <nav
              className="relative hidden xl:flex items-center gap-1 text-sm font-medium"
              aria-label="Primary"
            >
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  ref={(el) => (linkRefs.current[id] = el)}
                  onClick={() => go(id)}
                  className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs sm:text-sm ${
                    active === id
                      ? "text-brand-primary font-semibold"
                      : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}

              {/* Floating Underline Pill */}
              {!reduceMotion && !isMobile && (
                <motion.span
                  ref={underlineRef}
                  className="absolute bottom-0 h-[2px] bg-brand-primary rounded-full transition-all duration-300 pointer-events-none opacity-0"
                />
              )}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <button
                onClick={handleOpenPalette}
                title="Search commands (Ctrl+K)"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/40 text-xs font-mono transition"
              >
                <Command className="w-3.5 h-3.5 text-brand-primary" />
                <span>Search</span>
                <span className="text-[10px] text-brand-muted border border-brand-border px-1 rounded">⌘K</span>
              </button>

              {/* Audio Sound FX Toggle */}
              <button
                onClick={toggleSound}
                aria-label="Toggle subtle interface sounds"
                title={soundEnabled ? "Mute interface sounds" : "Enable interface sounds"}
                className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                  soundEnabled
                    ? "border-brand-primary text-brand-primary bg-brand-primary/10"
                    : "border-brand-border text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="w-9 h-9 rounded-full flex items-center justify-center text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5 border border-brand-border transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              {/* Resume Trigger */}
              <button
                onClick={handleResume}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Resume
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="xl:hidden w-9 h-9 flex items-center justify-center rounded-full border border-brand-border text-brand-text hover:bg-black/5 dark:hover:bg-white/5 transition"
                onClick={() => {
                  sounds.playClick();
                  setOpen((v) => !v);
                }}
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ================= MOBILE MENU DRAWER ================= */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="mt-2 xl:hidden rounded-2xl glass-panel shadow-2xl p-4 space-y-1.5 border border-brand-border"
              >
                {sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      active === id
                        ? "bg-brand-primary/15 text-brand-primary"
                        : "text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}

                <div className="pt-2 border-t border-brand-border space-y-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5 border border-brand-border transition"
                  >
                    <span className="flex items-center gap-2">
                      {theme === "dark" ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                      <span>{theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                    </span>
                    <span className="text-[10px] font-mono text-brand-primary uppercase font-bold">
                      {theme}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleResume();
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md"
                    >
                      <FileText className="w-4 h-4" />
                      Resume
                    </button>

                    <button
                      onClick={() => {
                        setOpen(false);
                        handleOpenPalette();
                      }}
                      className="px-3 py-2 rounded-xl border border-brand-border text-xs font-mono text-brand-text flex items-center gap-1"
                    >
                      <Command className="w-3.5 h-3.5" />
                      Search
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
