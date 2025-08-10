import { useState } from "react";

export default function ContactForm() {
  // TODO: swap with your real Formspree endpoint:
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/your_endpoint_id";

  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState("");

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setOk(null); setErr("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      setOk(true);
      setData({ name: "", email: "", message: "" });
    } catch (e) {
      setOk(false); setErr(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Your Name</label>
        <input name="name" value={data.name} onChange={onChange} required
          className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
      </div>
      <div>
        <label className="block text-sm mb-1">Email Address</label>
        <input type="email" name="email" value={data.email} onChange={onChange} required
          className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
      </div>
      <div>
        <label className="block text-sm mb-1">Message</label>
        <textarea rows="4" name="message" value={data.message} onChange={onChange} required
          className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-black/10 dark:ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600" />
      </div>
      <button disabled={busy}
        className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
        {busy ? "Sending..." : "Send Message"}
      </button>
      {ok === true && <p className="text-emerald-600 text-sm">Message sent! I’ll get back to you soon.</p>}
      {ok === false && <p className="text-red-600 text-sm">Error: {err}</p>}
    </form>
  );
}
