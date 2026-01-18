import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const email = "trstnjorge@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // iOS fallback
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 text-center bg-brand-bg overflow-hidden"
    >
      {/* ================= AMBIENT GLOW ================= */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute bottom-[-240px] left-1/2 -translate-x-1/2 w-[520px] h-[520px] sm:w-[760px] sm:h-[760px] rounded-full bg-brand-primary/15 blur-3xl" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14 px-4"
      >
        <span className="inline-block mb-3 text-xs font-bold tracking-widest text-brand-primary">
          CONTACT
        </span>

        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-black mb-5">
          Let’s Build Something Meaningful
        </h2>

        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
          Interested in collaboration, consulting, or building systems that
          actually get used? I’m always open to thoughtful conversations.
        </p>
      </motion.div>

      {/* ================= CONTACT CARDS ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0, y: 24 } : false}
        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"
      >
        {/* ================= EMAIL ================= */}
        <button
          onClick={copyEmail}
          className="rounded-3xl bg-white p-7 text-left shadow-xl ring-1 ring-black/5 focus:outline-none active:scale-[0.98] transition"
        >
          <div className="text-3xl mb-3">📧</div>
          <div className="font-semibold">Email</div>
          <div className="text-sm text-zinc-600 mt-1 break-all">
            {email}
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary">
            {copied ? "Copied ✓" : "Tap to copy"}
          </div>
        </button>

        {/* ================= GITHUB ================= */}
        <a
          href="https://github.com/krazytristan"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl bg-white p-7 text-left shadow-xl ring-1 ring-black/5 active:scale-[0.98] transition"
        >
          <div className="text-3xl mb-3">🐙</div>
          <div className="font-semibold">GitHub</div>
          <div className="text-sm text-zinc-600 mt-1">
            github.com/krazytristan
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary">
            View repositories →
          </div>
        </a>

        {/* ================= LINKEDIN ================= */}
        <a
          href="https://linkedin.com/in/tristan-jorge-cuartero"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl bg-white p-7 text-left shadow-xl ring-1 ring-black/5 active:scale-[0.98] transition"
        >
          <div className="text-3xl mb-3">🔗</div>
          <div className="font-semibold">LinkedIn</div>
          <div className="text-sm text-zinc-600 mt-1">
            tristan-jorge-cuartero
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary">
            Connect professionally →
          </div>
        </a>
      </motion.div>

      {/* ================= DIVIDER ================= */}
      <div className="mt-20 mx-auto h-px w-20 bg-brand-primary/40" />

      {/* ================= FOOTER ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0 } : false}
        whileInView={!reduceMotion ? { opacity: 1 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 text-sm text-zinc-500 px-4"
      >
        © {new Date().getFullYear()} Tristan Jorge Cuartero
        <span className="block mt-1">
          Built with React, Tailwind, and thoughtful design
        </span>
      </motion.div>
    </section>
  );
}
