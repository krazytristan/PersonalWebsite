import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("trstnjorge@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <section
      id="contact"
      className="relative py-36 text-center bg-brand-bg overflow-hidden"
    >
      {/* ================= AMBIENT GLOW ================= */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute bottom-[-220px] left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-brand-primary/15 blur-3xl" />
      </div>

      {/* ================= HEADER ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0, y: 40 } : false}
        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-16"
      >
        <span className="inline-block mb-4 text-xs font-bold tracking-widest text-brand-primary">
          CONTACT
        </span>

        <h2 className="text-4xl xl:text-5xl font-black text-brand-dark mb-6">
          Let’s Build Something Meaningful
        </h2>

        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          Interested in collaboration, consulting, or building systems that
          actually get used? I’m always open to thoughtful conversations.
        </p>
      </motion.div>

      {/* ================= CONTACT CARDS ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0, y: 30 } : false}
        whileInView={!reduceMotion ? { opacity: 1, y: 0 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-8"
      >
        {/* ================= EMAIL ================= */}
        <motion.button
          onClick={copyEmail}
          whileHover={!reduceMotion ? { y: -6, scale: 1.03 } : {}}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="group w-72 p-7 rounded-3xl bg-white
            shadow-xl ring-1 ring-black/5
            hover:shadow-2xl focus:outline-none"
        >
          <div className="text-3xl mb-4">📧</div>
          <div className="font-semibold text-brand-dark">Email</div>
          <div className="text-sm text-zinc-600 mt-1">
            trstnjorge@gmail.com
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary transition">
            {copied ? "Copied ✓" : "Click to copy →"}
          </div>
        </motion.button>

        {/* ================= GITHUB ================= */}
        <motion.a
          href="https://github.com/krazytristan"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={!reduceMotion ? { y: -6, scale: 1.03 } : {}}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="group w-72 p-7 rounded-3xl bg-white
            shadow-xl ring-1 ring-black/5
            hover:shadow-2xl"
        >
          <div className="text-3xl mb-4">🐙</div>
          <div className="font-semibold text-brand-dark">GitHub</div>
          <div className="text-sm text-zinc-600 mt-1">
            github.com/krazytristan
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition">
            View repositories →
          </div>
        </motion.a>

        {/* ================= LINKEDIN ================= */}
        <motion.a
          href="https://linkedin.com/in/tristan-jorge-cuartero"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={!reduceMotion ? { y: -6, scale: 1.03 } : {}}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="group w-72 p-7 rounded-3xl bg-white
            shadow-xl ring-1 ring-black/5
            hover:shadow-2xl"
        >
          <div className="text-3xl mb-4">🔗</div>
          <div className="font-semibold text-brand-dark">LinkedIn</div>
          <div className="text-sm text-zinc-600 mt-1">
            tristan-jorge-cuartero
          </div>

          <div className="mt-4 text-xs font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition">
            Connect professionally →
          </div>
        </motion.a>
      </motion.div>

      {/* ================= DIVIDER ================= */}
      <div className="mt-24 mx-auto h-px w-24 bg-brand-primary/40" />

      {/* ================= FOOTER ================= */}
      <motion.div
        initial={!reduceMotion ? { opacity: 0 } : false}
        whileInView={!reduceMotion ? { opacity: 1 } : false}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-sm text-zinc-500"
      >
        © {new Date().getFullYear()} Tristan Jorge Cuartero
        <span className="block mt-1">
          Built with React, Tailwind, and thoughtful design
        </span>
      </motion.div>
    </section>
  );
}
