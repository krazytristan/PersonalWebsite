import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  ArrowRight,
  Terminal,
  Server,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  Command,
  Activity,
  Database,
  Shield,
  Radio,
  Wifi,
  CornerDownLeft,
  RefreshCw,
  Zap,
  Globe,
  Clock,
  Code2,
  Check,
  Send,
  Play,
  BarChart2,
  ShieldCheck,
  Lock,
  HardDrive,
  Award,
} from "lucide-react";
import { sounds } from "../utils/audio";

/* -------------------- DYNAMIC TYPEWRITER ROLE CYCLER -------------------- */
function RoleCycler({ roles, activeIndex }) {
  return (
    <span className="inline-block relative align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={activeIndex}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block gradient-brand font-black pb-1"
        >
          {roles[activeIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* -------------------- ANIMATED STAT COUNTER -------------------- */
function useCountUp(target, duration = 1600) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration, reduceMotion]);

  return [value, ref];
}

/* -------------------- MAIN HERO COMPONENT -------------------- */
export default function Hero({ onOpenPalette }) {
  const reduceMotion = useReducedMotion();

  const isDesktop = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 1024px)").matches;
  }, []);

  const enableFX = !reduceMotion && isDesktop;

  const { scrollY } = useScroll();
  const fadeOut = enableFX ? useTransform(scrollY, [0, 650], [1, 0.9]) : 1;

  // 3D Parallax Tilt Calculation
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);

  const rotateX = useSpring(useTransform(ty, [-120, 120], [7, -7]), {
    stiffness: 140,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(tx, [-120, 120], [-7, 7]), {
    stiffness: 140,
    damping: 24,
  });

  const roles = [
    "High-Availability.",
    "Fault-Tolerant.",
    "Zero-Collision.",
    "Scalable & Resilient.",
  ];
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [roles.length]);

  const [years, yearsRef] = useCountUp(5);
  const [systems, systemsRef] = useCountUp(15);
  const [users, usersRef] = useCountUp(1000);

  // Live Philippine Standard Time clock in header
  const [phtTime, setPhtTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setPhtTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // HUD active view: "terminal" | "topology" | "telemetry" | "benchmarks"
  const [hudView, setHudView] = useState("terminal");

  // Terminal interactive state
  const [inputVal, setInputVal] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    {
      type: "system",
      text: "╔════════════════════════════════════════════════════════════════╗\n║  TRISTAN JORGE CUARTERO // SYSTEMS ARCHITECT CLI [v3.4.2]       ║\n║  HOST: bat-cluster-01 • REGION: Batangas, PH (GMT+8)           ║\n╚════════════════════════════════════════════════════════════════╝",
    },
    {
      type: "system",
      text: "Cluster status: 15/15 nodes healthy (21ms latency) • Type 'help' or click presets.",
    },
    {
      type: "cmd",
      cmd: "status",
      output:
        "STATUS [200 OK]: All 15 production platforms active.\n• iLab Concurrency Allocator: LOCKED (0 collisions)\n• Barangay Cloud ERP: VERIFIED (SHA-256 seal)\n• WiFi Connect IoT Mesh: SYNCED (ESP32 Gateway)",
    },
  ]);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    sounds.playClick();

    if (cmd === "clear") {
      setTerminalHistory([]);
      setInputVal("");
      return;
    }

    let output = "";
    if (cmd === "help") {
      output =
        "Available commands:\n• 'status'        - Cluster diagnostic health & active services\n• 'stack'         - Production full-stack & embedded technologies\n• 'architecture'  - Core architectural paradigms & invariants\n• 'benchmarks'    - Concurrency & latency stress metrics\n• 'projects'      - Deep-dive into signature platforms\n• 'education'     - Academic pedagogy & university mentorship\n• 'contact'       - Direct secure communication channels\n• 'clear'         - Flush the terminal buffer";
    } else if (cmd === "status") {
      output =
        "STATUS [200 OK]: All 15 production platforms active.\n• iLab Concurrency Allocator: LOCKED (0 collisions)\n• Barangay Cloud ERP: VERIFIED (SHA-256 seal)\n• WiFi Connect IoT Mesh: SYNCED (ESP32 Gateway)";
    } else if (cmd === "stack") {
      output =
        "PRODUCTION ARSENAL:\n• Frontend: React 18, TypeScript, Tailwind CSS, WebSockets\n• Backend: Node.js, Express, PHP (MVC / Clean Architecture), REST APIs\n• Data Core: MySQL 8.0 (InnoDB ACID Locks), Firebase RTDB, Redis\n• Hardware/IoT: ESP32 C++, Ultrasonic Depth Sensors, RFID MFRC522";
    } else if (cmd === "architecture") {
      output =
        "ARCHITECTURAL INVARIANTS:\n1. Zero-Collision Concurrency: Row-level atomic isolation (REPEATABLE READ)\n2. Cryptographic Integrity: SHA-256 QR tokens for tamper-proof civic validation\n3. Defensive Edge IoT: Exponential backoff retry buffers for flaky Wi-Fi grids";
    } else if (cmd === "benchmarks") {
      output =
        "BENCHMARK TELEMETRY:\n• Concurrency Test: 500 virtual booking requests -> 0 collisions (100% success)\n• P95 Latency: 18.4ms (Batangas Node)\n• Uptime: 99.98% across 12 calendar months";
    } else if (cmd === "projects") {
      output =
        "SIGNATURE DEPLOYMENTS:\n1. iLab Reservation Platform - University terminal allocator\n2. Barangay Cloud ERP - Civic administrative records & clearances\n3. WiFi Connect IoT Grid - Real-time environmental monitoring\n4. AMATrack Portal - High-concurrency academic progression engine";
    } else if (cmd === "education") {
      output =
        "ACADEMIC FACULTY PROFILE:\n• Institution: Higher Education / Batangas State University Faculty\n• Mentorship: 500+ Computer Science & IT students trained\n• Capstone Mentorship: 10+ student software platforms launched to production";
    } else if (cmd === "contact") {
      output =
        "DIRECT COMMUNICATION:\n• Email: trstnjorge@gmail.com\n• Timezone: Asia/Manila (GMT+8)\n• Location: Batangas, Philippines\n• Availability: Systems Architecture Consulting & Engineering Leadership";
    } else if (cmd === "whoami") {
      output =
        "Tristan Jorge Cuartero — Systems Architect, Full-Stack Engineer, and Higher-Education Instructor.";
    } else {
      output = `Command not recognized: '${cmd}'. Type 'help' for the full diagnostic suite.`;
    }

    setTerminalHistory((prev) => [
      ...prev,
      { type: "cmd", cmd: rawCmd, output },
    ]);
    setInputVal("");
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  // Selected topology node for inspection
  const [selectedNode, setSelectedNode] = useState("gateway");

  const topologyNodes = {
    edge: {
      name: "01. Physical Edge & Clients",
      tech: "React 18 SPA • ESP32 Sensor Nodes • Mobile Web Clients",
      metric: "Latency: <15ms",
      desc: "Captures sensor telemetry and citizen form inputs at the physical edge with optimistic UI updates.",
      protocol: "HTTPS / WSS / MQTT",
    },
    gateway: {
      name: "02. API Ingress & Security Gateway",
      tech: "Node.js / Express Router • PHP Middleware • JWT / RBAC",
      metric: "Throughput: 1,450 req/s",
      desc: "Sanitizes incoming payloads, enforces token bucket rate-limiting, and mints cryptographically signed session tokens.",
      protocol: "TLS 1.3 / OAuth2 / SHA-256",
    },
    services: {
      name: "03. Domain Transaction Engines",
      tech: "iLab Atomic Row Allocator • GovTech Clearance Engine • IoT Ingestion",
      metric: "Concurrency: 100% Conflict-Free",
      desc: "Applies strict atomic domain logic, serializes high-frequency seat bookings, and prevents race conditions.",
      protocol: "ACID Isolation: REPEATABLE READ",
    },
    data: {
      name: "04. Distributed Persistence Core",
      tech: "MySQL 8.0 (InnoDB) • Firebase RTDB • Secure Audit Trails",
      metric: "Durability: 99.999% Reliability",
      desc: "Guarantees zero duplicate booking states, normalized relational schemas, and tamper-proof archival logs.",
      protocol: "TCP 3306 / Automated Daily Snapshots",
    },
  };

  // Live Concurrency Benchmark Simulation State
  const [benchRunning, setBenchRunning] = useState(false);
  const [benchProgress, setBenchProgress] = useState(0);
  const [benchResult, setBenchResult] = useState(null);

  const runBenchmark = () => {
    if (benchRunning) return;
    setBenchRunning(true);
    setBenchResult(null);
    setBenchProgress(0);
    sounds.playClick();

    let p = 0;
    const interval = setInterval(() => {
      p += 12;
      if (p >= 100) {
        clearInterval(interval);
        setBenchProgress(100);
        setBenchRunning(false);
        setBenchResult({
          requests: 500,
          collisions: 0,
          avgLatency: "18.2ms",
          status: "PASSED (100% RELIABLE)",
        });
        sounds.playSuccess();
      } else {
        setBenchProgress(p);
      }
    }, 120);
  };

  const [copiedEmail, setCopiedEmail] = useState(false);
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("trstnjorge@gmail.com");
    sounds.playSuccess();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex items-center pt-28 pb-16 overflow-hidden bg-brand-bg text-brand-text bg-grid-pattern"
    >
      {/* Dynamic Ambient Radiant Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-brand-primary/12 blur-[150px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute -bottom-32 left-1/3 w-[520px] h-[520px] rounded-full bg-amber-500/8 blur-[140px]" />
      </div>

      <div className="noise-overlay" />

      <motion.div
        style={{ opacity: fadeOut }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: HERO NARRATIVE & IDENTITY ================= */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Top Executive Status Pill with Live Clock */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-card border border-brand-border">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-brand-text uppercase tracking-wider">
                  Systems Architect & Faculty
                </span>
                <span className="text-brand-border">•</span>
                <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                  <Clock className="w-3 h-3 text-brand-primary" />
                  <span>{phtTime || "Batangas, PH"}</span>
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenPalette?.();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-brand-border text-[11px] font-mono text-brand-muted hover:text-brand-text hover:border-brand-primary/40 transition group"
              >
                <Command className="w-3 h-3 text-brand-primary group-hover:rotate-12 transition-transform" />
                <span>Command Palette</span>
                <kbd className="text-[10px] ml-1">⌘K</kbd>
              </button>
            </div>

            {/* Authoritative Name & Headline */}
            <div className="space-y-1.5 mb-3">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-brand-primary">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tristan Jorge Cuartero</span>
              </div>

              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.12] text-brand-text">
                Engineering systems that are{" "}
                <span className="inline-block">
                  <RoleCycler roles={roles} activeIndex={roleIndex} />
                </span>
              </h1>
            </div>

            {/* Executive Bio Narrative */}
            <p className="mt-4 text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl font-normal">
              Systems architect and university educator bridging distributed MySQL concurrency locking invariants, defensive ESP32 IoT telemetry, and reactive interfaces. Designed and deployed 15+ production platforms serving thousands of citizens and students across Batangas, Philippines.
            </p>

            {/* Categorized Tech Stack Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {[
                { name: "React 18", cmd: "stack" },
                { name: "Node.js", cmd: "stack" },
                { name: "PHP MVC", cmd: "stack" },
                { name: "MySQL ACID", cmd: "architecture" },
                { name: "ESP32 C++", cmd: "stack" },
                { name: "Tailwind CSS", cmd: "stack" },
                { name: "REST APIs", cmd: "stack" },
              ].map((tech) => (
                <span
                  key={tech.name}
                  onClick={() => {
                    executeCommand(tech.cmd);
                    setHudView("terminal");
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/40 cursor-pointer transition select-none active:scale-95"
                  title={`Run '${tech.cmd}' in terminal for ${tech.name}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>

            {/* High-Impact CTA Suite */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <a
                href="#projects"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-sm shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition group"
              >
                <span>Explore Selected Systems</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#simulator"
                onClick={() => sounds.playClick()}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl glass-card text-brand-text font-semibold text-sm hover:border-brand-primary/40 hover:bg-white/10 dark:hover:bg-white/5 transition"
              >
                <Cpu className="w-4 h-4 text-brand-primary" />
                <span>Test Interactive Lab</span>
              </a>

              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl glass-panel border border-brand-border text-xs font-mono text-brand-muted hover:text-brand-text hover:border-brand-primary/40 transition"
                title="Copy Tristan's direct email"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Copy Direct Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Channel Dock */}
            <div className="mt-8 flex items-center gap-2.5">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-muted mr-1.5 hidden sm:inline">
                Channels:
              </span>
              {[
                { icon: <FaGithub />, href: "https://github.com/krazytristan", label: "GitHub" },
                { icon: <FaLinkedinIn />, href: "https://www.linkedin.com/in/tristan-jorge-cuartero/", label: "LinkedIn" },
                { icon: <FaFacebookF />, href: "https://www.facebook.com/profile.php?id=61580976757488", label: "Facebook" },
                { icon: <FaInstagram />, href: "https://www.instagram.com/_trstnjrgcrtr_officialoppa/", label: "Instagram" },
                { icon: <FaTiktok />, href: "https://www.tiktok.com/@_trstnjrgcrtr", label: "TikTok" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  onClick={() => sounds.playClick()}
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-brand-muted hover:text-brand-primary hover:border-brand-primary/40 hover:scale-110 transition shadow-sm"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            {/* Verified Architectural Telemetry KPIs */}
            <div className="mt-10 pt-7 border-t border-brand-border grid grid-cols-3 gap-6 max-w-xl">
              <div ref={yearsRef}>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-text">
                  {years}+
                </div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">
                  Years Tech Education
                </div>
              </div>

              <div ref={systemsRef}>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-primary">
                  {systems}+
                </div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">
                  Production Platforms
                </div>
              </div>

              <div ref={usersRef}>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-text">
                  {users}+
                </div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">
                  Citizens & Students
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT COLUMN: INTERACTIVE ARCHITECTURAL CONTROL CENTER ================= */}
          <div className="lg:col-span-5 relative perspective-[1200px]">
            <motion.div
              style={enableFX ? { rotateX, rotateY } : {}}
              onMouseMove={(e) => {
                if (!enableFX) return;
                const rect = e.currentTarget.getBoundingClientRect();
                tx.set(e.clientX - rect.left - rect.width / 2);
                ty.set(e.clientY - rect.top - rect.height / 2);
              }}
              onMouseLeave={() => {
                tx.set(0);
                ty.set(0);
              }}
              className="relative mx-auto max-w-[440px] sm:max-w-[490px]"
            >
              {/* Radiant Cyber Aura Background Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-primary/25 via-sky-500/20 to-amber-400/20 blur-2xl opacity-75 animate-pulse-glow" />

              {/* Main Interactive Glass HUD Window */}
              <div className="relative rounded-3xl overflow-hidden glass-card border border-brand-border shadow-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[520px]">
                
                {/* HUD Header Toolbar & View Switcher */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
                    <span className="text-[11px] font-mono text-brand-muted ml-1.5 hidden sm:inline">
                      tristan-cluster // v3.4
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[
                      { id: "terminal", label: "CLI", icon: Terminal },
                      { id: "topology", label: "Graph", icon: Layers },
                      { id: "telemetry", label: "Stats", icon: Activity },
                      { id: "benchmarks", label: "Stress", icon: BarChart2 },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setHudView(tab.id);
                            sounds.playClick();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition flex items-center gap-1.5 ${
                            hudView === tab.id
                              ? "bg-brand-primary text-white shadow-sm"
                              : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ================= VIEW 1: INTERACTIVE SHELL CLI ================= */}
                {hudView === "terminal" && (
                  <div className="flex-1 flex flex-col justify-between font-mono text-xs">
                    {/* Live Cluster Banner */}
                    <div className="p-2.5 rounded-xl glass-panel border border-brand-border text-brand-text space-y-1 mb-2.5">
                      <div className="flex items-center justify-between text-[10px] text-brand-muted uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 font-semibold">
                          <Activity className="w-3 h-3 animate-pulse" />
                          Daemon Active
                        </span>
                        <span>Load: 12.4% • Latency: 21ms</span>
                      </div>
                    </div>

                    {/* Scrollable Output Stream */}
                    <div className="flex-1 max-h-[225px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                      {terminalHistory.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          {item.type === "system" && (
                            <pre className="text-[10px] text-brand-muted whitespace-pre-wrap font-mono leading-relaxed">
                              {item.text}
                            </pre>
                          )}
                          {item.type === "cmd" && (
                            <div>
                              <div className="text-brand-muted text-xs">
                                <span className="text-brand-primary font-bold">tristan@arch:~$</span>{" "}
                                <span className="text-brand-text font-semibold">{item.cmd}</span>
                              </div>
                              <pre className="mt-1 p-2 rounded-lg glass-panel text-emerald-600 dark:text-emerald-400 border border-brand-border text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
                                {item.output}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={terminalEndRef} />
                    </div>

                    {/* Interactive Shell Input Form */}
                    <form
                      onSubmit={handleInputSubmit}
                      className="mt-2.5 pt-2.5 border-t border-brand-border/70 flex items-center gap-2"
                    >
                      <span className="text-brand-primary font-bold text-xs">➜</span>
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Type a command (status, stack, benchmarks)..."
                        className="flex-1 bg-transparent border-0 text-xs font-mono text-brand-text placeholder-brand-muted/70 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg glass-panel text-brand-primary hover:text-white hover:bg-brand-primary transition"
                        title="Execute command"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Quick Command Action Pills */}
                    <div className="mt-2.5 pt-2 border-t border-brand-border/60">
                      <div className="text-[10px] font-mono text-brand-muted uppercase mb-1">
                        Quick Diagnostics:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {["status", "stack", "architecture", "benchmarks", "projects", "education", "clear"].map((cmd) => (
                          <button
                            key={cmd}
                            onClick={() => executeCommand(cmd)}
                            className="px-2 py-0.5 rounded-md glass-panel border border-brand-border text-[11px] font-mono text-brand-text hover:border-brand-primary hover:text-brand-primary transition"
                          >
                            {cmd}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= VIEW 2: ARCHITECTURAL TOPOLOGY GRAPH ================= */}
                {hudView === "topology" && (
                  <div className="flex-1 flex flex-col justify-between font-mono text-xs space-y-3">
                    <div className="text-[10px] text-brand-muted uppercase tracking-wider">
                      Interactive Multi-Tier Graph — Click a tier to inspect:
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { id: "edge", label: "01. Edge & IoT Clients", icon: Cpu },
                        { id: "gateway", label: "02. API Ingress & Security", icon: Shield },
                        { id: "services", label: "03. Domain Transaction Engine", icon: Server },
                        { id: "data", label: "04. ACID Persistence Core", icon: Database },
                      ].map((node) => {
                        const Icon = node.icon;
                        const isSelected = selectedNode === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => {
                              setSelectedNode(node.id);
                              sounds.playClick();
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                              isSelected
                                ? "bg-brand-primary/10 border-brand-primary text-brand-text"
                                : "glass-panel border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/40"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-brand-primary" : ""}`} />
                              <span className="font-semibold text-xs">{node.label}</span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Inspected Node Dossier Card */}
                    <div className="p-3.5 rounded-xl glass-panel border border-brand-border text-brand-text space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-primary font-sans">
                          {topologyNodes[selectedNode].name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {topologyNodes[selectedNode].metric}
                        </span>
                      </div>
                      <div className="text-[11px] text-brand-muted font-mono">
                        Tech: {topologyNodes[selectedNode].tech}
                      </div>
                      <div className="text-[10px] text-emerald-500 dark:text-emerald-400 font-mono">
                        Protocol: {topologyNodes[selectedNode].protocol}
                      </div>
                      <div className="text-xs text-brand-muted leading-relaxed font-sans pt-1">
                        {topologyNodes[selectedNode].desc}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================= VIEW 3: LIVE TELEMETRY DASHBOARD ================= */}
                {hudView === "telemetry" && (
                  <div className="flex-1 flex flex-col justify-between font-mono text-xs space-y-3.5">
                    <div className="text-[10px] text-brand-muted uppercase tracking-wider">
                      Live Telemetry Stream • Cluster Health Monitor
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl glass-panel border border-brand-border text-center">
                        <div className="text-[10px] uppercase text-brand-muted">CPU Load</div>
                        <div className="text-2xl font-black text-brand-primary font-mono mt-1">12.4%</div>
                        <div className="text-[9px] text-emerald-400 mt-0.5">● Sub-Optimal Heat</div>
                      </div>

                      <div className="p-3 rounded-xl glass-panel border border-brand-border text-center">
                        <div className="text-[10px] uppercase text-brand-muted">Memory Pool</div>
                        <div className="text-2xl font-black text-brand-text font-mono mt-1">1.82 <span className="text-xs font-normal">GB</span></div>
                        <div className="text-[9px] text-brand-muted mt-0.5">16 GB Total Allocation</div>
                      </div>

                      <div className="p-3 rounded-xl glass-panel border border-brand-border text-center">
                        <div className="text-[10px] uppercase text-brand-muted">Uptime Metric</div>
                        <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono mt-1">99.98%</div>
                        <div className="text-[9px] text-brand-muted mt-0.5">Zero Downtime Record</div>
                      </div>

                      <div className="p-3 rounded-xl glass-panel border border-brand-border text-center">
                        <div className="text-[10px] uppercase text-brand-muted">Active Nodes</div>
                        <div className="text-2xl font-black text-sky-500 dark:text-sky-400 font-mono mt-1">14</div>
                        <div className="text-[9px] text-brand-muted mt-0.5">Synced via ESP32 Grid</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl glass-panel text-brand-text border border-brand-border text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        TLS 1.3 / AES-256 Encrypted
                      </span>
                      <span className="text-brand-muted font-mono">P95: 18.4ms</span>
                    </div>
                  </div>
                )}

                {/* ================= VIEW 4: CONCURRENCY STRESS-TEST BENCHMARK ================= */}
                {hudView === "benchmarks" && (
                  <div className="flex-1 flex flex-col justify-between font-mono text-xs space-y-3">
                    <div>
                      <div className="text-[10px] text-brand-muted uppercase tracking-wider mb-1">
                        High-Concurrency Isolation Benchmark
                      </div>
                      <p className="text-xs text-brand-muted font-sans">
                        Simulate 500 concurrent booking transactions executing against the atomic row-level reservation lock.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl glass-panel border border-brand-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-text">Simulated Stress Target:</span>
                        <span className="text-xs font-mono text-brand-primary font-bold">500 Concurrency Threads</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-brand-surface rounded-full h-2.5 overflow-hidden border border-brand-border">
                        <motion.div
                          className="h-full bg-gradient-to-r from-brand-primary to-emerald-400 rounded-full"
                          style={{ width: `${benchProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-brand-muted font-mono">
                        <span>{benchRunning ? "Processing Transactions..." : "Engine Idle"}</span>
                        <span>{benchProgress}%</span>
                      </div>

                      {benchResult && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs space-y-1">
                          <div className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {benchResult.status}
                          </div>
                          <div className="text-[11px] text-brand-muted">
                            • 500 requests resolved • 0 race conditions • Latency: {benchResult.avgLatency}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={runBenchmark}
                      disabled={benchRunning}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{benchRunning ? "Running 500-Thread Load Test..." : "Execute Concurrency Stress Test"}</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Surrounding Floating Holographic Badges */}
              <motion.div
                animate={enableFX ? { y: [0, -8, 0] } : {}}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-panel shadow-xl border border-brand-border"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-primary/15 text-brand-primary flex items-center justify-center">
                  <Server className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-brand-muted uppercase">Reliability</div>
                  <div className="text-xs font-bold text-brand-text">99.98% Uptime</div>
                </div>
              </motion.div>

              <motion.div
                animate={enableFX ? { y: [0, 8, 0] } : {}}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-panel shadow-xl border border-brand-border"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[9px] font-mono text-brand-muted uppercase">Base Region</div>
                  <div className="text-xs font-bold text-brand-text">Batangas, PH 🇵🇭</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}