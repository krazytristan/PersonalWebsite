import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen grid place-items-center bg-brand-bg text-brand-text px-6">
      <motion.div
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 40, filter: "blur(8px)" }
        }
        animate={
          reduceMotion
            ? false
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative max-w-lg w-full text-center
          rounded-3xl p-10
          backdrop-blur-xl bg-white/10
          ring-1 ring-white/20
          shadow-2xl
        "
      >
        {/* Glow */}
        {!reduceMotion && (
          <div className="absolute -inset-6 -z-10 rounded-full bg-brand-primary/30 blur-3xl" />
        )}

        <h1 className="text-6xl font-black tracking-tight mb-4">
          404
        </h1>

        <p className="text-lg text-text-muted mb-8">
          The page you’re looking for doesn’t exist — or it
          moved somewhere better.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="
              px-6 py-3 rounded-xl
              bg-brand-primary text-white font-semibold
              shadow-lg
            "
          >
            Back to Home
          </Link>

          <Link
            to="/blog"
            className="
              px-6 py-3 rounded-xl
              bg-white/10 backdrop-blur
              ring-1 ring-white/20
              font-semibold
            "
          >
            Read the Blog
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
