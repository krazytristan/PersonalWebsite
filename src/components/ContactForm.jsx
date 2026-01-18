import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm() {
  const [state, setState] = useState({ name: "", email: "", message: "", bot: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  const onChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (state.bot) return;

    if (!state.name || !state.email || !state.message) {
      setErr("Please fill in all fields.");
      return;
    }

    const accessKey =
      import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";

    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setErr(
        "Missing Web3Forms access key. Add VITE_WEB3FORMS_KEY to your .env and restart."
      );
      return;
    }

    setSending(true);
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "New message from tristan-portfolio",
          from_name: state.name,
          from_email: state.email,
          reply_to: state.email,
          message: state.message,
          site: window.location.origin,
          user_agent: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        setState({ name: "", email: "", message: "", bot: "" });
      } else {
        setErr(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setErr("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl ring-1 ring-black/10 dark:ring-white/10 shadow-xl p-8"
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 grid place-items-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-xl">
                ✓
              </span>
            </div>
            <h3 className="text-lg font-bold">Message sent!</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Thanks for reaching out. I’ll get back to you shortly.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 px-5 py-2.5 rounded-xl font-medium ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            className="grid gap-6"
            noValidate
          >
            {/* Name + Email */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="Name"
                id="name"
                name="name"
                value={state.name}
                onChange={onChange}
                placeholder="Your name"
                autoComplete="name"
              />
              <Field
                label="Email"
                id="email"
                name="email"
                type="email"
                value={state.email}
                onChange={onChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="bot">Do not fill</label>
              <input
                id="bot"
                name="bot"
                value={state.bot}
                onChange={onChange}
                tabIndex={-1}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className="block text-sm mb-1 font-medium"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={state.message}
                onChange={onChange}
                placeholder="How can I help?"
                className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {err && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-rose-600"
                >
                  {err}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={sending}
                className="relative px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Sending…
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              <a
                href={`mailto:trstnjorge@gmail.com?subject=${encodeURIComponent(
                  "Hello from your portfolio"
                )}`}
                className="px-6 py-3 rounded-xl font-semibold ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
              >
                Email Instead
              </a>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------- FIELD -------------------- */
function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm mb-1 font-medium" htmlFor={props.id}>
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  );
}

/* -------------------- SPINNER -------------------- */
function Spinner() {
  return (
    <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
  );
}
