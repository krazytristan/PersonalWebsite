import { useEffect, useMemo, useState } from "react";

export default function Portfolio() {
  // Theme toggle
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // smooth scroll
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // back-to-top visibility
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quickFacts = useMemo(() => ([
    { emoji: "👨‍💻", title: "5+ Years Coding", sub: "Full Stack, AI/ML, Web Apps" },
    { emoji: "🎓",  title: "Educator",        sub: "Teaching IT & CS since 2018" },
    { emoji: "🚩",  title: "Batangas, PH",    sub: "Based in Lipa City" },
  ]), []);

  return (
    <div className="min-h-screen bg-light text-dark dark:bg-dark dark:text-light relative">
      {/* simple decorative background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-secondary/15 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-[float_6s_ease-in-out_infinite] [animation-delay:.6s]" />
      </div>

      {/* navbar */}
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mt-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10">
            <div className="px-5 py-4 flex items-center justify-between">
              <a href="#" className="group inline-flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
                  TJ
                </span>
                <span className="text-lg font-extrabold tracking-wide">
                  <span className="text-indigo-700 dark:text-indigo-300">Tristan Jorge</span>{" "}
                  <span className="text-gray-700 dark:text-gray-200">Cuartero</span>
                </span>
              </a>

              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
                {["home","about","projects","skills","contact"].map((id) => (
                  <button key={id} onClick={() => go(id)} className="hover:text-indigo-600">
                    {id[0].toUpperCase()+id.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition"
                  title="Toggle theme"
                >
                  {theme === "dark" ? "🌙" : "🌞"}
                </button>
              </nav>

              {/* mobile theme btn */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/5 dark:ring-white/10"
                title="Toggle theme"
              >
                {theme === "dark" ? "🌙" : "🌞"}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-28" />

      {/* hero */}
      <section id="home" className="relative min-h-[80vh] flex items-center">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
            <p className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-gray-600 dark:text-gray-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Educator • Full Stack Developer • Innovator
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
              Hi, I’m Tristan.
            </h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              I build modern, accessible web apps and teach people how to do the same.
              I love clean UX, solid architecture, and shipping fast.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => go("projects")} className="btn-pop inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                🚀 View Projects
              </button>
              <button onClick={() => go("contact")} className="btn-pop inline-flex items-center justify-center px-6 py-3 rounded-full ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10">
                📡 Contact
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/images/IMG_20250523_130120~2.jpg"
              alt="Tristan portrait"
              className="rounded-3xl shadow-2xl object-cover h-[420px] w-full ring-4 ring-white/60 dark:ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* about */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">About</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-zinc-900">
              <h3 className="text-xl font-semibold mb-3">Who I am</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tech-savvy educator and full-stack developer focused on building useful, beautiful tools.
                Into React, Node, Tailwind, and making complex flows feel simple.
              </p>
            </div>
            <div className="rounded-2xl p-6 ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-zinc-900">
              <h3 className="text-xl font-semibold mb-3">Quick facts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickFacts.map((c) => (
                  <div key={c.title} className="rounded-xl p-4 bg-gray-50 dark:bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10 text-center">
                    <div className="text-2xl">{c.emoji}</div>
                    <div className="mt-1 font-semibold text-primary">{c.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a href="/resume.pdf" className="inline-flex items-center px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90">📄 Download Resume</a>
          </div>
        </div>
      </section>

      {/* projects */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-zinc-900/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "LibrarySys", desc: "Library management with barcode & attendance tracking.", link: "#" },
              { title: "WiFi Connect", desc: "IoT-powered smart waste management for cities.", link: "#" },
              { title: "AMATrack", desc: "Attendance & scheduler for schools.", link: "#" },
            ].map((p) => (
              <article key={p.title} className="group rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-zinc-900 hover:-translate-y-1 hover:shadow-xl transition">
                <div className="h-40 bg-gradient-to-br from-indigo-500/20 to-purple-600/20" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{p.desc}</p>
                  <a href={p.link} className="inline-block mt-3 text-indigo-600 dark:text-indigo-400 font-medium">View →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section id="skills" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-10 text-center">Skills</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center items-center">
            {skills.map((s) => (
              <div key={s.name} className="flex flex-col items-center">
                <img src={s.icon} alt={s.name} className="w-10 h-10 mb-2" />
                <span className="text-xs text-gray-600 dark:text-gray-300">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* contact */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-zinc-900/40">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Contact</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Let’s connect! Reach out via email or socials below.
          </p>
          <div className="space-y-3 max-w-fit mx-auto text-left text-gray-700 dark:text-gray-300">
            <p>📧 Email: <a className="text-indigo-600 dark:text-indigo-400 underline" href="mailto:trstnjorge@gmail.com">trstnjorge@gmail.com</a></p>
            <p>🐙 GitHub: <a className="text-indigo-600 dark:text-indigo-400 underline" href="https://github.com/krazytristan" target="_blank">github.com/krazytristan</a></p>
            <p>🔗 LinkedIn: <a className="text-indigo-600 dark:text-indigo-400 underline" href="https://linkedin.com/in/tristan-jorge-cuartero" target="_blank">linkedin.com/in/tristan-jorge-cuartero</a></p>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="text-center py-10">
        <p className="text-sm opacity-80">&copy; {new Date().getFullYear()} Tristan Jorge Cuartero. All rights reserved.</p>
      </footer>

      {/* back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 h-11 w-11 rounded-full bg-secondary text-white shadow-lg hover:bg-primary"
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}

const skills = [
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "PHP",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "MySQL",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Firebase",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Tailwind",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "HTML5",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "AI/ML",      icon: "https://img.icons8.com/color/48/000000/artificial-intelligence.png" },
  { name: "Cloud",      icon: "https://img.icons8.com/color/48/000000/cloud.png" },
];
