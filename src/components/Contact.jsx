import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Calendar,
  HelpCircle,
  Shield,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { sounds } from "../utils/audio";

/* ================= EMAILJS CONFIG ================= */
const EMAILJS_SERVICE_ID = "service_u6uxs3o";
const EMAILJS_TEMPLATE_ID = "template_3pvxbd6";
const EMAILJS_PUBLIC_KEY = "QqMzu1L0vi8mE7GeF";

const faqs = [
  {
    q: "What is your primary architectural specialty and tech stack?",
    a: "I architect scalable cloud backends, relational databases, and reactive interfaces. My production stack centers on React, Node.js/Express, PHP (MVC/Laravel), MySQL, Tailwind CSS, and ESP32 embedded hardware systems.",
  },
  {
    q: "Are you available for consulting on civic GovTech or academic platforms?",
    a: "Yes. I actively collaborate with local government units (LGUs), barangays, universities, and private enterprises to design paperless administrative platforms, attendance engines, and high-concurrency reservation systems.",
  },
  {
    q: "How do you ensure security and Data Privacy compliance?",
    a: "Every architecture implements defense-in-depth: parameterized database queries, strict role-based access control (RBAC), CSRF protection, cryptographic document hashing (SHA-256 with verifiable QR), and compliance with the Philippine Data Privacy Act of 2012 (RA 10173).",
  },
  {
    q: "Do you deliver university guest lectures or technical workshops?",
    a: "Yes. As a computer science and IT educator, I frequently deliver hands-on workshops on full-stack development, IoT sensor networks, and software capstone design across universities and student chapters.",
  },
];

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const emailAddress = "trstnjorge@gmail.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    sounds.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    sounds.playClick();

    // Always persist to local Admin Inbox
    try {
      const existing = JSON.parse(localStorage.getItem("admin_portfolio_messages") || "[]");
      const record = {
        id: "msg_" + Date.now(),
        name: form.name,
        email: form.email,
        message: form.message,
        date: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem("admin_portfolio_messages", JSON.stringify([record, ...existing]));
      window.dispatchEvent(new CustomEvent("admin-new-message"));
    } catch (e) {}

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      sounds.playSuccess();
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={!reduceMotion ? { opacity: 0, y: 10 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Transmission Center
          </motion.span>

          <motion.h2
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight"
          >
            Let’s Architect Something{" "}
            <span className="gradient-brand">Exceptional Together</span>
          </motion.h2>

          <motion.p
            initial={!reduceMotion ? { opacity: 0, y: 14 } : false}
            whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed"
          >
            Whether discussing scalable systems architecture, civic software initiatives, university workshops, or full-stack engineering — reach out directly.
          </motion.p>
        </div>

        {/* ================= MAIN DUAL LAYOUT ================= */}
        <div className="grid lg:grid-cols-12 gap-10 items-start max-w-6xl mx-auto mb-16">
          
          {/* LEFT: Direct Details & Quick Copy (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Email Card */}
            <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-border">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-muted">
                Direct Dispatch
              </span>
              
              <div className="mt-3 flex items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-brand-border">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-medium text-brand-text truncate">
                    {emailAddress}
                  </span>
                </div>

                <button
                  onClick={copyEmail}
                  className="px-3 py-1.5 rounded-xl bg-brand-surface border border-brand-border text-xs font-semibold text-brand-primary hover:border-brand-primary flex items-center gap-1.5 transition shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Telemetry info */}
              <div className="mt-6 pt-5 border-t border-brand-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    Base Region
                  </span>
                  <span className="font-medium text-brand-text">
                    Batangas, Philippines
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    Local Time (GMT+8)
                  </span>
                  <span className="font-mono font-medium text-brand-text">
                    {localTime || "08:00 PM"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-muted flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Typical Response
                  </span>
                  <span className="font-medium text-emerald-500">
                    Within 24 Hours
                  </span>
                </div>
              </div>
            </div>

            {/* Social Matrix */}
            <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-border">
              <h3 className="text-sm font-mono uppercase tracking-wider text-brand-muted mb-4">
                Professional Channels
              </h3>

              <div className="grid grid-cols-5 gap-3">
                {[
                  { icon: <FaGithub />, link: "https://github.com/krazytristan", label: "GitHub" },
                  { icon: <FaLinkedinIn />, link: "https://www.linkedin.com/in/tristan-jorge-cuartero/", label: "LinkedIn" },
                  { icon: <FaFacebookF />, link: "https://www.facebook.com/profile.php?id=61580976757488", label: "Facebook" },
                  { icon: <FaInstagram />, link: "https://www.instagram.com/_trstnjrgcrtr_officialoppa/", label: "Instagram" },
                  { icon: <FaTiktok />, link: "https://www.tiktok.com/@_trstnjrgcrtr", label: "TikTok" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    onClick={() => sounds.playClick()}
                    className="h-11 rounded-xl glass-panel border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-primary hover:border-brand-primary hover:scale-105 transition shadow-sm"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Direct Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-brand-border">
              <h3 className="text-xl font-bold text-brand-text mb-2">
                Send a Direct Transmission
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted mb-6">
                Fill out the form below to initiate direct communication with Tristan.
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted mb-1.5">
                    Your Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. Alex Mercer"
                    className="w-full px-4 py-3 rounded-xl glass-panel border border-brand-border text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/70 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    placeholder="e.g. alex@organization.com"
                    className="w-full px-4 py-3 rounded-xl glass-panel border border-brand-border text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/70 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted mb-1.5">
                    Project Scope / Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={onChange}
                    placeholder="Outline your system requirements, inquiry, or collaboration idea..."
                    className="w-full px-4 py-3 rounded-xl glass-panel border border-brand-border text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/70 transition resize-none"
                  />
                </div>

                {status === "success" && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Transmission dispatched successfully! I will reply shortly.
                  </div>
                )}

                {status === "error" && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Transmission failed. Please reach me directly at trstnjorge@gmail.com.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-sm shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {status === "sending" ? (
                    <span>Dispatching Transmission...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* ================= ARCHITECTURAL FAQ ACCORDION ================= */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-brand-border">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-primary font-bold">
              Frequently Asked Questions
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-brand-text mt-1">
              Architecture & Collaboration Inquiries
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-card border border-brand-border overflow-hidden transition-all"
                >
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setOpenFaq(isOpen ? null : index);
                    }}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-brand-text hover:text-brand-primary transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-brand-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-brand-muted leading-relaxed border-t border-brand-border/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-20 pt-8 border-t border-brand-border text-center text-xs text-brand-muted font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} Tristan Jorge Cuartero. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Built with React 18 • Tailwind CSS • Framer Motion</span>
            <span className="text-brand-border">•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-brand-muted hover:text-brand-primary transition-colors opacity-70 hover:opacity-100"
              title="Open Administrative Console"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}