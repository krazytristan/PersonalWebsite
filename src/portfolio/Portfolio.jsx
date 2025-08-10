import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import ContactForm from "../components/ContactForm.jsx";
import ResumeViewer from "../components/ResumeViewer.jsx";
import BlogSection from "../components/BlogSection.jsx";

export default function Portfolio() {
  /* -------------------- THEME -------------------- */
  const getResolved = () => {
    try {
      if (typeof window !== "undefined" && window.__getResolvedTheme) return window.__getResolvedTheme();
      return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
    } catch {
      return "light";
    }
  };
  const [theme, setTheme] = useState(getResolved);

  // keep icon in sync with <html> class (works across tabs)
  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => setTheme(html.classList.contains("dark") ? "dark" : "light"));
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  /* -------------------- REDUCED MOTION -------------------- */
  const prefersReducedMotion = useReducedMotion();

  /* -------------------- NAV ACTIVE + REVEAL -------------------- */
  const sections = ["home", "about", "projects", "skills", "resume", "blog", "contact"];
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries, io) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(e.target.id);
          e.target.classList.add("in");
          io.unobserve(e.target); // reveal once
        }
      },
      { rootMargin: "-50% 0px -40% 0px", threshold: 0.01 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (![...el.classList].some((c) => c.startsWith("reveal"))) el.classList.add("reveal");
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* -------------------- NAV UNDERLINE (animated) -------------------- */
  const linkRefs = useRef({});
  const underlineRef = useRef(null);
  const placeUnderline = () => {
    const el = linkRefs.current[active];
    const bar = underlineRef.current;
    if (!el || !bar) return;
    const { left, width } = el.getBoundingClientRect();
    const nav = el.offsetParent?.getBoundingClientRect();
    const x = nav ? left - nav.left : left;
    bar.style.transform = `translateX(${Math.round(x)}px)`;
    bar.style.width = `${Math.round(width)}px`;
  };
  useLayoutEffect(() => {
    let raf = requestAnimationFrame(placeUnderline);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(placeUnderline);
    };
    const onScroll = onResize;
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("orientationchange", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [active]);

  /* -------------------- back-to-top -------------------- */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* -------------------- HERO PARALLAX -------------------- */
  const [parallax, setParallax] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setParallax(Math.max(-16, Math.min(16, (window.scrollY || 0) / 30)));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefersReducedMotion]);

  /* -------------------- HERO MOUSE-FOLLOW (tilt + glow) -------------------- */
  const heroRef = useRef(null);
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0 });
  useEffect(() => {
    const el = heroRef.current;
    if (!el || prefersReducedMotion) return;
    let raf = 0;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setHeroTilt({
          rx: Math.max(-10, Math.min(10, py * -10)),
          ry: Math.max(-12, Math.min(12, px * 12)),
        });
      });
    };
    const handleLeave = () => {
      cancelAnimationFrame(raf);
      setHeroTilt({ rx: 0, ry: 0 });
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  /* -------------------- PROJECT MODAL -------------------- */
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const lastFocusRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* -------------------- Scroll progress bar -------------------- */
  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 80 : 120,
    damping: prefersReducedMotion ? 30 : 20,
    mass: 0.2,
  });

  const facts = useMemo(
    () => [
      { emoji: "👨‍💻", title: "5+ Years Coding", sub: "Full Stack • AI/ML • Web Apps" },
      { emoji: "🎓", title: "Educator", sub: "Teaching IT & CS since 2018" },
      { emoji: "🚩", title: "Batangas, PH", sub: "Based in Lipa City" },
    ],
    []
  );

  /* -------------------- Variants -------------------- */
  const fadeUp = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    whileInView: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.6 } },
  };
  const fade = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1, transition: { duration: prefersReducedMotion ? 0 : 0.6 } },
  };

  return (
    <div className="min-h-screen bg-[#fffffe] text-[#16161a] dark:bg-[#050508] dark:text-white relative transition-colors">
      {/* Scoped styles + universe layers */}
      <StyleTokens />

      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[70] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 origin-left"
        style={{ scaleX: progressWidth }}
        aria-hidden
      />

      {/* UNIVERSE layers (behind everything) */}
      <div className="universe" aria-hidden="true">
        <div className="planet planet-1" />
        <div className="planet planet-2" />
      </div>

      {/* Aurora glow */}
      <div className="aurora" aria-hidden="true" />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="mt-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10"
          >
            <div className="px-5 py-4 flex items-center justify-between">
              <a href="#" className="group inline-flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
                  TJ
                </span>
                <span className="text-lg font-extrabold tracking-wide">
                  <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                    Tristan Jorge Cuartero
                  </span>
                </span>
              </a>

              {/* Desktop nav */}
              <div className="hidden md:block relative">
                <nav className="flex items-center gap-1 text-sm font-semibold">
                  {sections.map((id) => (
                    <button
                      key={id}
                      ref={(el) => (linkRefs.current[id] = el)}
                      onClick={(e) => {
                        lastFocusRef.current = e.currentTarget;
                        go(id);
                        setTimeout(placeUnderline, 50);
                      }}
                      aria-current={active === id ? "page" : undefined}
                      className={`px-3 py-2 rounded-lg transition hover:text-indigo-600 dark:hover:text-indigo-400 ${active === id ? "text-indigo-600 dark:text-indigo-400" : ""}`}
                    >
                      {id[0].toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => (window.__toggleTheme ? window.__toggleTheme() : setTheme(theme === "dark" ? "light" : "dark"))}
                    className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition"
                    title="Toggle theme"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? "🌙" : "🌞"}
                  </button>
                </nav>
                <span
                  ref={underlineRef}
                  className="pointer-events-none absolute -bottom-1 h-[3px] rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 transition-transform duration-300 ease-out"
                  style={{ width: 0, transform: "translateX(0px)" }}
                  aria-hidden="true"
                />
              </div>

              {/* mobile theme button */}
              <button
                onClick={() => (window.__toggleTheme ? window.__toggleTheme() : setTheme(theme === "dark" ? "light" : "dark"))}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10"
                title="Toggle theme"
                aria-label="Toggle theme (mobile)"
              >
                {theme === "dark" ? "🌙" : "🌞"}
              </button>
            </div>
          </motion.div>
        </div>
      </header>
      <div className="h-28" />

      {/* HERO */}
      <section id="home" ref={heroRef} className="relative min-h-[84vh] flex items-center">
        <div className="cursor-spotlight" aria-hidden="true" />
        {/* Orbiting astronaut */}
        <Astronaut prefersReducedMotion={prefersReducedMotion} />

        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center" style={{ perspective: "1200px" }}>
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-10% 0% -10% 0%" }}
            className="card p-8 transition-transform duration-150 will-change-transform"
            style={{ transform: `translateY(${parallax * -0.5}px) rotateX(${heroTilt.rx * -0.4}deg) rotateY(${heroTilt.ry * -0.4}deg)` }}
          >
            <span className="badge text-indigo-700 dark:text-indigo-300 bg-white/60 dark:bg-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Educator • Full Stack Dev • Innovator
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              Hi, I’m <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">Tristan</span>.
            </h1>
            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              I build modern, accessible web apps and teach people how to do the same. I love clean UX, solid architecture, and shipping fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={(e) => { lastFocusRef.current = e.currentTarget; go("projects"); }}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                🚀 View Projects
              </button>
              <button
                onClick={(e) => { lastFocusRef.current = e.currentTarget; go("contact"); }}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              >
                📡 Contact
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={fade}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="hidden md:block will-change-transform transition-transform duration-150"
            style={{ transform: `translateY(${parallax}px) rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`, transformStyle: "preserve-3d" }}
          >
            <img
              src="/images/BSU_6102.jpg"
              alt="Portrait of Tristan Jorge Cuartero"
              className="rounded-3xl shadow-2xl object-cover h-[420px] w-full ring-4 ring-white/60 dark:ring-white/10"
              loading="lazy"
              style={{ transform: "translateZ(30px)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <motion.section id="about" className="py-20" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            About <span className="text-indigo-600 dark:text-indigo-400">Me</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Who I am</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Tech-savvy educator and full-stack developer focused on building useful, beautiful tools. Into React, Node, Tailwind — making complex flows feel simple and fast.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Quick Facts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {facts.map((f) => (
                  <motion.div key={f.title} className="rounded-xl p-4 bg-white/70 dark:bg-zinc-800/60 ring-1 ring-black/5 dark:ring-white/10 text-center" whileHover={{ y: -2 }}>
                    <div className="text-2xl">{f.emoji}</div>
                    <div className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400">{f.title}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{f.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PROJECTS */}
      <motion.section id="projects" className="py-20 bg-zinc-50 dark:bg-zinc-900/40" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Featured <span className="text-indigo-600 dark:text-indigo-400">Projects</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((p) => (
              <motion.article
                key={p.title}
                className="card overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer"
                onClick={(e) => { lastFocusRef.current = e.currentTarget; setCurrent(p); setOpen(true); }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" ? (setCurrent(p), setOpen(true)) : null)}
                aria-label={`Open ${p.title} details`}
                whileHover={{ scale: 1.01 }}
              >
                <div className="h-36 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{p.desc}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="badge bg-white/70 dark:bg-white/10 text-zinc-700 dark:text-zinc-300">{t}</span>
                    ))}
                  </div>
                  <div className="mt-4"><span className="text-indigo-600 dark:text-indigo-400 font-medium">View →</span></div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SKILLS */}
      <motion.section id="skills" className="py-20" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Tech <span className="text-indigo-600 dark:text-indigo-400">Stack</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center items-center">
            {skills.map((s) => (
              <motion.div key={s.name} className="flex flex-col items-center" whileHover={{ y: -3 }}>
                <img src={s.icon} alt={s.name} className="w-10 h-10 mb-2" loading="lazy" />
                <span className="text-xs text-zinc-600 dark:text-zinc-300">{s.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* RESUME */}
      <motion.section id="resume" className="py-20 bg-zinc-50 dark:bg-zinc-900/40" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Resume <span className="text-indigo-600 dark:text-indigo-400">Viewer</span>
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">Preview, download, or print my latest resume.</p>
          <div className="rounded-2xl p-6 bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/5 dark:ring-white/10 shadow-xl backdrop-blur">
            <ResumeViewer />
          </div>
        </div>
      </motion.section>

      {/* BLOG */}
      <motion.section id="blog" className="py-20" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Notes <span className="text-indigo-600 dark:text-indigo-400">& Writings</span>
          </h2>
          <BlogSection />
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section id="contact" className="py-20 bg-zinc-50 dark:bg-zinc-900/40" variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Let’s <span className="text-indigo-600 dark:text-indigo-400">Connect</span>
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">Ping me anytime—use the form or email/socials below.</p>
          <div className="card p-6 text-left">
            <ContactForm />
            <div className="mt-6 space-y-3 text-zinc-700 dark:text-zinc-300">
              <p>📧 Email: <a className="text-indigo-600 dark:text-indigo-400 underline" href="mailto:trstnjorge@gmail.com">trstnjorge@gmail.com</a></p>
              <p>🐙 GitHub: <a className="text-indigo-600 dark:text-indigo-400 underline" target="_blank" rel="noreferrer noopener" href="https://github.com/krazytristan">github.com/krazytristan</a></p>
              <p>🔗 LinkedIn: <a className="text-indigo-600 dark:text-indigo-400 underline" target="_blank" rel="noreferrer noopener" href="https://linkedin.com/in/tristan-jorge-cuartero">linkedin.com/in/tristan-jorge-cuartero</a></p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="text-center py-10">
        <p className="text-sm opacity-80">&copy; {new Date().getFullYear()} Tristan Jorge Cuartero. All rights reserved.</p>
      </footer>

      {/* back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 h-11 w-11 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
          title="Back to top"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {open && (
          <ProjectModal
            key="project-modal"
            open={open}
            onClose={() => {
              setOpen(false);
              setTimeout(() => lastFocusRef.current?.focus?.(), 0);
            }}
            project={current}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Astronaut (orbiting) ---------- */
function Astronaut({ prefersReducedMotion }) {
  return (
    <motion.div
      className="astro-orbit"
      aria-hidden="true"
      animate={prefersReducedMotion ? {} : { rotate: 360 }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
    >
      <div className="astro-ring" />
      <motion.div
        className="astronaut"
        animate={prefersReducedMotion ? {} : { y: [0, -6, 0, 4, 0], rotate: [8, 10, 8, 6, 8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Floating astronaut">
          <defs>
            <linearGradient id="suit" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#e5e7eb" />
            </linearGradient>
            <linearGradient id="accent" x1="0" x2="1">
              <stop offset="0" stopColor="#6366f1" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <rect x="16" y="28" width="32" height="22" rx="8" fill="url(#accent)" opacity="0.35" />
          <rect x="20" y="26" width="24" height="24" rx="8" fill="url(#suit)" stroke="#cbd5e1" strokeWidth="1.5" />
          <rect x="10" y="30" width="12" height="8" rx="4" fill="url(#suit)" stroke="#cbd5e1" strokeWidth="1.2" />
          <rect x="42" y="30" width="12" height="8" rx="4" fill="url(#suit)" stroke="#cbd5e1" strokeWidth="1.2" />
          <rect x="22" y="48" width="8" height="11" rx="3.5" fill="url(#suit)" stroke="#cbd5e1" strokeWidth="1.2" />
          <rect x="34" y="48" width="8" height="11" rx="3.5" fill="url(#suit)" stroke="#cbd5e1" strokeWidth="1.2" />
          <circle cx="32" cy="18" r="12" fill="#0b1020" stroke="#ffffff" strokeWidth="3" />
          <circle cx="27" cy="15" r="2.2" fill="#93c5fd" opacity="0.9" />
          <circle cx="35" cy="21" r="1.4" fill="#60a5fa" opacity="0.8" />
          <rect x="26" y="34" width="12" height="8" rx="2" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="29" cy="38" r="1.2" fill="#22c55e" />
          <circle cx="33" cy="38" r="1.2" fill="#f59e0b" />
          <circle cx="37" cy="38" r="1.2" fill="#ef4444" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Modal ---------- */
function ProjectModal({ open, onClose, project, prefersReducedMotion }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const trapFocus = (e) => {
    const c = containerRef.current;
    if (!c) return;
    const focusables = c.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    if (!open) return;
    containerRef.current?.querySelector("button")?.focus?.();
  }, [open]);

  if (!open || !project) return null;
  const titleId = "project-modal-title";
  const descId = "project-modal-desc";

  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
        className="mx-auto max-w-2xl mt-24 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
      >
        <div className="relative">
          <img
            src={project.image || "/images/IMG_20250523_130120~2.jpg"}
            alt={project.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/70"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <h3 id={titleId} className="text-xl font-semibold">{project.title}</h3>
          <p id={descId} className="text-zinc-700 dark:text-zinc-300 mt-2">{project.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags?.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-black/10 dark:ring-white/20 bg-white/70 dark:bg-white/10 text-zinc-700 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Open Project
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------- DATA -------------------- */
const projects = [
  { title: "LibrarySys", desc: "Library management with barcode & attendance tracking.", link: "#", tags: ["React", "Node", "MySQL"], image: "/images/librarysys.jpg" },
  { title: "WiFi Connect", desc: "IoT-powered smart waste management for cities.", link: "#", tags: ["IoT", "APIs", "Dashboards"], image: "/images/wifi-connect.jpg" },
  { title: "AMATrack", desc: "Attendance & scheduler for schools.", link: "#", tags: ["React", "Tailwind", "Auth"], image: "/images/amatrack.jpeg" },
];

const skills = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "AI/ML", icon: "https://img.icons8.com/color/48/000000/artificial-intelligence.png" },
  { name: "Cloud", icon: "https://img.icons8.com/color/48/000000/cloud.png" },
];

/* -------------------- Style Tokens (scoped) -------------------- */
function StyleTokens() {
  return (
    <style>{`
      html { color-scheme: light dark; }

      /* --- Auto-hide scrollbars globally (still scrolls) --- */
      *::-webkit-scrollbar{ width:0; height:0; }
      *::-webkit-scrollbar-thumb{ background:transparent; }
      html, body, .hide-scroll{ scrollbar-width: none; }
      .hide-scroll::-webkit-scrollbar{ display:none; }

      /* Aurora background */
      .aurora{position:fixed;inset:-20vh 0 0 0;z-index:-2;pointer-events:none;filter:blur(45px)}
      .aurora::before,.aurora::after{content:"";position:absolute;inset:-20rem;
        background:
          radial-gradient(40rem 30rem at 20% 10%, rgba(124,58,237,.14), transparent 40%),
          radial-gradient(50rem 40rem at 80% 20%, rgba(34,197,94,.14), transparent 45%),
          radial-gradient(60rem 40rem at 50% 70%, rgba(236,72,153,.12), transparent 40%);
        animation:drift 18s linear infinite}
      .aurora::after{animation-duration:26s;animation-direction:reverse;opacity:.8}
      @keyframes drift{0%{transform:translateX(0)}50%{transform:translateX(8%)}100%{transform:translateX(0)}}

      /* Universe: soft planets that drift slowly */
      .universe{ position:fixed; inset:0; z-index:-3; pointer-events:none; overflow:hidden; }
      .planet{ position:absolute; border-radius:9999px; filter: blur(40px); opacity:.18; }
      .planet-1{
        width:40vmin; height:40vmin; top:8%; left:-6%;
        background: radial-gradient(circle at 30% 30%, rgba(99,102,241,.55), rgba(99,102,241,0) 60%),
                    radial-gradient(circle at 70% 60%, rgba(236,72,153,.45), rgba(236,72,153,0) 58%);
        animation: floatA 40s ease-in-out infinite;
      }
      .planet-2{
        width:55vmin; height:55vmin; bottom:-10%; right:-8%;
        background: radial-gradient(circle at 35% 40%, rgba(34,197,94,.55), rgba(34,197,94,0) 60%),
                    radial-gradient(circle at 70% 70%, rgba(99,102,241,.45), rgba(99,102,241,0) 60%);
        animation: floatB 55s ease-in-out infinite;
      }
      @keyframes floatA{ 0%{ transform:translateY(0) translateX(0);} 50%{ transform:translateY(-20px) translateX(10px);} 100%{ transform:translateY(0) translateX(0);} }
      @keyframes floatB{ 0%{ transform:translateY(0) translateX(0);} 50%{ transform:translateY(25px) translateX(-12px);} 100%{ transform:translateY(0) translateX(0);} }

      /* spotlight that follows cursor (uses --mx/--my) */
      .cursor-spotlight{position:absolute;inset:0;background:radial-gradient(240px 240px at var(--mx, -100px) var(--my, -100px), rgba(99,102,241,.15), transparent 60%);mix-blend-mode:soft-light}
      .dark .cursor-spotlight{background:radial-gradient(260px 260px at var(--mx, -100px) var(--my, -100px), rgba(99,102,241,.14), transparent 65%)}

      /* cards & badges */
      .card{background:rgba(255,255,255,.82);border-radius:1.25rem;box-shadow:0 10px 25px rgba(0,0,0,.06);backdrop-filter:blur(6px);border:1px solid rgba(0,0,0,.06)}
      .dark .card{background:rgba(24,24,27,.7);border-color:rgba(255,255,255,.08);box-shadow:0 10px 30px rgba(0,0,0,.5)}
      .badge{display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .6rem;border-radius:999px;font-size:.75rem;font-weight:600}

      /* reveal */
      .reveal{opacity:0;transform:translateY(16px);transition:opacity .5s ease, transform .5s ease}
      .in{opacity:1;transform:none}

      /* Astronaut orbit */
      .astro-orbit{
        position:absolute; width:56vmin; height:56vmin; top:46%; left:58%;
        transform:translate(-50%,-50%); pointer-events:none; z-index:1;
      }
      @media (max-width: 900px){ .astro-orbit{ display:none; } }
      .astronaut{ position:absolute; top:0; left:50%; transform:translate(-50%,-50%);
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.35)); }
      .astro-ring{ position:absolute; inset:0; border-radius:50%;
        background: conic-gradient(from 0deg, rgba(99,102,241,.15), rgba(236,72,153,.12), rgba(34,197,94,.15), rgba(99,102,241,.15));
        filter: blur(12px); opacity:.45; }
      @media (prefers-reduced-motion: reduce){
        .astro-ring{ display:none; }
      }
    `}</style>
  );
}
