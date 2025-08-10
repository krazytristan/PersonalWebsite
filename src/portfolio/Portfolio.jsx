import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ContactForm from "../components/ContactForm.jsx";

export default function Portfolio() {
  /* THEME */
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* NAV ACTIVE + REVEAL */
  const sections = ["home", "about", "projects", "skills", "contact"];
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { rootMargin: "-50% 0px -40% 0px", threshold: 0.01 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("reveal");
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, []);

  /* NAV UNDERLINE (animated bar under active button) */
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
    placeUnderline();
    const onResize = () => placeUnderline();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active]);

  /* back-to-top */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  /* HERO PARALLAX */
  const [parallax, setParallax] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;
    const onScroll = () => {
      const y = window.scrollY || 0;
      setParallax(Math.max(-16, Math.min(16, y / 30))); // clamp
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* PROJECT MODAL */
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const facts = useMemo(
    () => [
      { emoji: "👨‍💻", title: "5+ Years Coding", sub: "Full Stack • AI/ML • Web Apps" },
      { emoji: "🎓", title: "Educator", sub: "Teaching IT & CS since 2018" },
      { emoji: "🚩", title: "Batangas, PH", sub: "Based in Lipa City" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#fffffe] text-[#16161a] dark:bg-[#0b0b0d] dark:text-white relative">
      {/* AURORA */}
      <div className="aurora" aria-hidden="true" />

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10">
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

              {/* Desktop nav with underline rail */}
              <div className="hidden md:block relative">
                <nav className="flex items-center gap-1 text-sm font-semibold">
                  {sections.map((id) => (
                    <button
                      key={id}
                      ref={(el) => (linkRefs.current[id] = el)}
                      onClick={() => {
                        go(id);
                        setTimeout(placeUnderline, 50);
                      }}
                      className={`px-3 py-2 rounded-lg transition hover:text-indigo-600 ${
                        active === id ? "text-indigo-600" : ""
                      }`}
                    >
                      {id[0].toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition"
                    title="Toggle theme"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? "🌙" : "🌞"}
                  </button>
                </nav>
                {/* underline bar */}
                <span
                  ref={underlineRef}
                  className="pointer-events-none absolute -bottom-1 h-[3px] rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 transition-transform duration-300 ease-out"
                  style={{ width: 0, transform: "translateX(0px)" }}
                  aria-hidden="true"
                />
              </div>

              {/* mobile theme button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10"
                title="Toggle theme"
                aria-label="Toggle theme (mobile)"
              >
                {theme === "dark" ? "🌙" : "🌞"}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-28" />

      {/* HERO */}
      <section id="home" className="relative min-h-[84vh] flex items-center">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div
            className="card p-8"
            style={{ transform: `translateY(${parallax * -0.5}px)` }}
          >
            <span className="badge text-indigo-700 dark:text-indigo-300 bg-white/60 dark:bg-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Educator • Full Stack Dev • Innovator
            </span>

            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              Hi, I’m{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500 bg-clip-text text-transparent">
                Tristan
              </span>
              .
            </h1>

            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              I build modern, accessible web apps and teach people how to do the same. I love clean UX, solid architecture, and shipping fast.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => go("projects")}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
              >
                🚀 View Projects
              </button>
              <button
                onClick={() => go("contact")}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              >
                📡 Contact
              </button>
            </div>
          </div>

          <div
            className="hidden md:block will-change-transform"
            style={{ transform: `translateY(${parallax}px)` }}
          >
            <img
              src="/images/BSU_6102.jpg"
              alt="Tristan portrait"
              className="rounded-3xl shadow-2xl object-cover h-[420px] w-full ring-4 ring-white/60 dark:ring-white/10"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            About <span className="text-indigo-600">Me</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Who I am</h3>
              <p className="text-zinc-700 dark:text-zinc-300">
                Tech-savvy educator and full-stack developer focused on building useful, beautiful tools.
                Into React, Node, Tailwind — making complex flows feel simple and fast.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-3">Quick Facts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {facts.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl p-4 bg-white/70 dark:bg-zinc-800/60 ring-1 ring-black/5 dark:ring-white/10 text-center"
                  >
                    <div className="text-2xl">{f.emoji}</div>
                    <div className="mt-1 font-semibold text-indigo-600 dark:text-indigo-400">
                      {f.title}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{f.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/resume.pdf"
              className="inline-flex items-center px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
            >
              📄 Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-20 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Featured <span className="text-indigo-600">Projects</span>
          </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <article
              key={p.title}
              className="card overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer"
              onClick={() => {
                setCurrent(p);
                setOpen(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" ? (setCurrent(p), setOpen(true)) : null)}
              aria-label={`Open ${p.title} details`}
            >
              <div className="h-36 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="badge bg-white/70 dark:bg-white/10 text-zinc-700 dark:text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    View →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">
            Tech <span className="text-indigo-600">Stack</span>
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center items-center">
            {skills.map((s) => (
              <div key={s.name} className="flex flex-col items-center">
                <img src={s.icon} alt={s.name} className="w-10 h-10 mb-2" loading="lazy" />
                <span className="text-xs text-zinc-600 dark:text-zinc-300">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT (Formspree) */}
      <section id="contact" className="py-20 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
            Let’s <span className="text-indigo-600">Connect</span>
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">
            Ping me anytime—use the form or email/socials below.
          </p>
          <div className="card p-6 text-left">
            <ContactForm />
            <div className="mt-6 space-y-3 text-zinc-700 dark:text-zinc-300">
              <p>
                📧 Email:{" "}
                <a
                  className="text-indigo-600 dark:text-indigo-400 underline"
                  href="mailto:trstnjorge@gmail.com"
                >
                  trstnjorge@gmail.com
                </a>
              </p>
              <p>
                🐙 GitHub:{" "}
                <a
                  className="text-indigo-600 dark:text-indigo-400 underline"
                  target="_blank"
                  href="https://github.com/krazytristan"
                >
                  github.com/krazytristan
                </a>
              </p>
              <p>
                🔗 LinkedIn:{" "}
                <a
                  className="text-indigo-600 dark:text-indigo-400 underline"
                  target="_blank"
                  href="https://linkedin.com/in/tristan-jorge-cuartero"
                >
                  linkedin.com/in/tristan-jorge-cuartero
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10">
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} Tristan Jorge Cuartero. All rights reserved.
        </p>
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
      <ProjectModal open={open} onClose={() => setOpen(false)} project={current} />
    </div>
  );
}

/* ---------- Modal Component (no extra libs) ---------- */
function ProjectModal({ open, onClose, project }) {
  const overlayRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !project) return null;
  return (
    <div
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto max-w-2xl mt-24 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">
        <div className="relative">
          <img
            src={project.image || "/images/IMG_20250523_130120~2.jpg"}
            alt={`${project.title} preview`}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/70"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <p className="text-zinc-700 dark:text-zinc-300 mt-2">{project.desc}</p>
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
              className="inline-block mt-5 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Open Project
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- DATA ---------- */
const projects = [
  {
    title: "LibrarySys",
    desc: "Library management with barcode & attendance tracking.",
    link: "#",
    tags: ["React", "Node", "MySQL"],
    image: "/images/librarysys.jpg", // optional; falls back to your portrait if missing
  },
  {
    title: "WiFi Connect",
    desc: "IoT-powered smart waste management for cities.",
    link: "#",
    tags: ["IoT", "APIs", "Dashboards"],
    image: "/images/wifi-connect.jpg",
  },
  {
    title: "AMATrack",
    desc: "Attendance & scheduler for schools.",
    link: "#",
    tags: ["React", "Tailwind", "Auth"],
    image: "/images/amatrack.jpeg",
  },
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
