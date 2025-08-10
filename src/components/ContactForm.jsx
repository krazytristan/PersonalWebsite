import { useState } from "react";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm() {
  const [state, setState] = useState({ name: "", email: "", message: "", bot: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);

  const onChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // Honeypot
    if (state.bot) return;

    // Basic validation
    if (!state.name || !state.email || !state.message) {
      setErr("Please fill in all fields.");
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY";
    if (!accessKey || accessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setErr("Missing Web3Forms access key. Add VITE_WEB3FORMS_KEY to your .env and restart.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: "New message from tristan-portfolio",
          from_name: state.name,
          from_email: state.email,
          reply_to: state.email,
          message: state.message,
          // extra metadata (shows up in the email)
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

  if (sent) {
    return (
      <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/30">
        <p className="text-emerald-700 dark:text-emerald-300 font-medium">
          Thanks! Your message has been sent.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-3 px-4 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={state.name}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={state.email}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="bot">Do not fill</label>
        <input id="bot" name="bot" value={state.bot} onChange={onChange} tabIndex={-1} />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={state.message}
          onChange={onChange}
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="How can I help?"
          required
        />
      </div>

      {err && <p className="text-sm text-rose-600">{err}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={sending}
          className="px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Send Message"}
        </button>
        <a
          href={`mailto:trstnjorge@gmail.com?subject=${encodeURIComponent("Hello from your portfolio")}`}
          className="px-5 py-3 rounded-xl font-semibold ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Email Instead
        </a>
      </div>
    </form>
  );
}
