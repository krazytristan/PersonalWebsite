import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import {
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

/* ================= EMAILJS CONFIG ================= */
const EMAILJS_SERVICE_ID = "service_u6uxs3o";
const EMAILJS_TEMPLATE_ID = "template_3pvxbd6";
const EMAILJS_PUBLIC_KEY = "QqMzu1L0vi8mE7GeF";

/* ================= HEADER ================= */
const HEADER = {
  label: "Contact",
  title: (
    <>
      Let’s Build Something
      <span className="block text-brand-primary">
        Meaningful Together
      </span>
    </>
  ),
  desc:
    "Interested in collaboration, consulting, or building systems that actually get used? Send a message or connect through my platforms below.",
};

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const email = "trstnjorge@gmail.com";

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending
  const [toast, setToast] = useState(null); // { type, message }

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= AUTO-HIDE TOAST ================= */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

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

      setToast({
        type: "success",
        message: "Message sent successfully!",
      });

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setStatus("idle");
    }
  };

  const fieldClass =
    "w-full rounded-xl bg-brand-surface px-4 py-3 text-sm text-text-primary " +
    "ring-1 ring-brand-text/10 focus:outline-none focus:ring-2 focus:ring-brand-primary";

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-brand-bg overflow-hidden"
    >
      {/* ================= TOAST ================= */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`
            fixed top-6 right-6 z-50 flex items-center gap-3
            rounded-xl px-5 py-3 text-sm font-semibold shadow-xl
            ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }
          `}
        >
          {toast.type === "success" ? (
            <FaCheckCircle />
          ) : (
            <FaTimesCircle />
          )}
          {toast.message}
        </motion.div>
      )}

      {/* ================= AMBIENT GLOW ================= */}
      {!reduceMotion && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div
            className="absolute bottom-[-240px] left-1/2 -translate-x-1/2
            w-[520px] h-[520px] sm:w-[760px] sm:h-[760px]
            rounded-full bg-brand-primary/15 blur-3xl"
          />
        </div>
      )}

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 px-4 text-center max-w-3xl mx-auto"
      >
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full
          bg-brand-primary/10 text-brand-primary
          text-xs font-semibold tracking-wide"
        >
          {HEADER.label}
        </span>

        <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-text-primary leading-tight">
          {HEADER.title}
        </h2>

        <p className="mt-6 text-sm sm:text-base text-text-muted leading-relaxed">
          {HEADER.desc}
        </p>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ================= FORM ================= */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-brand-surface p-8 shadow-xl ring-1 ring-brand-text/10"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Name
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className={fieldClass}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                className={fieldClass}
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                className={fieldClass}
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="
                inline-flex items-center justify-center
                rounded-xl bg-brand-primary px-6 py-3
                text-sm font-semibold text-white
                hover:opacity-90 active:scale-95 transition
                disabled:opacity-60
              "
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </motion.form>

        {/* ================= SOCIALS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-black text-text-primary">
            Connect with me
          </h3>

          <p className="text-sm text-text-muted max-w-md">
            You can also reach out or follow my work through these platforms.
          </p>

          <div className="flex gap-4">
            <a
              href="https://github.com/krazytristan"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                grid place-items-center w-12 h-12 rounded-xl
                bg-brand-surface ring-1 ring-brand-text/10
                hover:bg-[#24292e] hover:text-white transition
              "
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/tristan-jorge-cuartero"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="
                grid place-items-center w-12 h-12 rounded-xl
                bg-brand-surface ring-1 ring-brand-text/10
                hover:bg-[#0a66c2] hover:text-white transition
              "
            >
              <FaLinkedinIn />
            </a>

            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="
                grid place-items-center w-12 h-12 rounded-xl
                bg-brand-surface ring-1 ring-brand-text/10
                hover:bg-brand-primary hover:text-white transition
              "
            >
              <FaEnvelope />
            </a>
          </div>
        </motion.div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-20 text-sm text-text-muted text-center px-4">
        © {new Date().getFullYear()} Tristan Jorge Cuartero
        <span className="block mt-1">
          Built with React, Tailwind, and thoughtful design
        </span>
      </div>
    </section>
  );
}
