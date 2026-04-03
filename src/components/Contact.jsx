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
      <span className="block bg-gradient-to-r from-brand-primary to-orange-400 bg-clip-text text-transparent">
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

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
    "peer w-full rounded-xl bg-transparent px-4 pt-5 pb-2 text-sm text-text-primary " +
    "ring-1 ring-brand-text/10 focus:outline-none focus:ring-2 focus:ring-brand-primary transition";

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-brand-bg overflow-hidden"
    >
      {/* ================= TOAST ================= */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3
            rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur
            ${toast.type === "success"
              ? "bg-emerald-500/90 text-white"
              : "bg-red-500/90 text-white"
            }`}
        >
          {toast.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />}
          {toast.message}
        </motion.div>
      )}

      {/* ================= GLOW ================= */}
      {!reduceMotion && (
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute bottom-[-240px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-primary/20 blur-3xl" />
        </div>
      )}

      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 px-4 text-center max-w-3xl mx-auto"
      >
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
          {HEADER.label}
        </span>

        <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight">
          {HEADER.title}
        </h2>

        <p className="mt-6 text-sm sm:text-base text-text-muted">
          {HEADER.desc}
        </p>
      </motion.div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14">
        
        {/* ================= FORM ================= */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/5 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/10"
        >
          <div className="space-y-6">

            {/* NAME */}
            <div className="relative">
              <input
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className={fieldClass}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-text-muted transition-all
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                peer-focus:top-2 peer-focus:text-xs">
                Name
              </label>
            </div>

            {/* EMAIL */}
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                className={fieldClass}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-text-muted transition-all
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                peer-focus:top-2 peer-focus:text-xs">
                Email
              </label>
            </div>

            {/* MESSAGE */}
            <div className="relative">
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={onChange}
                className={fieldClass}
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-text-muted transition-all
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                peer-focus:top-2 peer-focus:text-xs">
                Message
              </label>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-xl py-3 font-semibold text-white
                bg-gradient-to-r from-brand-primary to-orange-400
                shadow-lg hover:shadow-xl transition disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </motion.button>
          </div>
        </motion.form>

        {/* ================= SOCIAL ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-black">Connect with me</h3>

          <p className="text-sm text-text-muted max-w-md">
            You can also reach out or follow my work through these platforms.
          </p>

          <div className="flex gap-4">
            {[
              { icon: <FaGithub />, link: "https://github.com/krazytristan" },
              { icon: <FaLinkedinIn />, link: "https://linkedin.com/in/tristan-jorge-cuartero" },
              { icon: <FaEnvelope />, link: `mailto:${email}` },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                target="_blank"
                whileHover={{ y: -6, scale: 1.1 }}
                className="w-12 h-12 flex items-center justify-center rounded-xl
                  bg-white/5 backdrop-blur ring-1 ring-white/10
                  hover:bg-brand-primary hover:text-white transition shadow-lg"
              >
                {item.icon}
              </motion.a>
            ))}
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