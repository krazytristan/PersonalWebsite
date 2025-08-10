import { useEffect, useMemo, useState, useRef } from "react";

export default function ResumeViewer({
  src = "/resume.pdf",                             // put your PDF in /public
  filename = "Tristan-Cuartero-Resume.pdf",
  thumbnail = "/images/resume-thumb.jpg",          // optional image fallback
  height = "72vh",
  forceFallback = false,                           // set true to always disable inline preview
}) {
  const [exists, setExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [inlineAllowed, setInlineAllowed] = useState(true);
  const [viewer, setViewer] = useState("object");  // "object" | "iframe" | "fallback"
  const styleInjected = useRef(false);

  // UA buckets that commonly block/break inline PDF
  const problematicUA = useMemo(() => {
    const ua = navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const android = /Android/.test(ua) && /Mobile/.test(ua);
    const firefoxAndroid = android && /Firefox/.test(ua);
    return iOS || firefoxAndroid;
  }, []);

  // HEAD check so a bad path doesn’t render a huge empty box
  useEffect(() => {
    let abort = new AbortController();
    setLoading(true);
    fetch(src, { method: "HEAD", signal: abort.signal })
      .then((r) => {
        setExists(r.ok);
        setLoading(false);
      })
      .catch(() => {
        setExists(false);
        setLoading(false);
      });
    return () => abort.abort();
  }, [src]);

  // Decide if inline is allowed & choose default viewer
  useEffect(() => {
    if (forceFallback || problematicUA) {
      setInlineAllowed(false);
      setViewer("fallback");
      return;
    }
    // Chrome exposes this; others might not. False => hard block.
    const hint = (navigator && navigator.pdfViewerEnabled);
    if (hint === false) {
      setInlineAllowed(false);
      setViewer("fallback");
    } else {
      setInlineAllowed(true);
      setViewer("object");
    }
  }, [forceFallback, problematicUA]);

  const openNewTab = () => window.open(src, "_blank", "noopener,noreferrer");

  const download = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement("a");
      a.href = src;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const printPdf = () => {
    const w = window.open(src, "_blank", "noopener,noreferrer");
    if (!w) return;
    setTimeout(() => {
      try { w.focus(); w.print(); } catch {}
    }, 800);
  };

  // Inject once: hide scrollbars for object/iframe (Chrome/Safari/Opera)
  useEffect(() => {
    if (styleInjected.current) return;
    const css = `
      object::-webkit-scrollbar,
      iframe::-webkit-scrollbar {
        display: none;
      }
    `;
    const tag = document.createElement("style");
    tag.setAttribute("data-resumeviewer-scrollbar", "true");
    tag.textContent = css;
    document.head.appendChild(tag);
    styleInjected.current = true;
    // no cleanup needed; keep it for the session
  }, []);

  const Toolbar = () => (
    <div className="flex items-center justify-between">
      <div className="text-left">
        <h3 className="font-semibold">My Resume</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{filename}</p>
      </div>

      <div className="flex items-center gap-2">
        {inlineAllowed && (
          <div
            className="hidden sm:flex items-center rounded-lg ring-1 ring-black/10 dark:ring-white/10 overflow-hidden"
            role="tablist"
            aria-label="PDF viewer mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewer === "object"}
              onClick={() => setViewer("object")}
              className={`px-3 py-2 text-sm ${
                viewer === "object" ? "bg-black/5 dark:bg-white/10" : ""
              }`}
              title="Use <object> viewer"
            >
              Object
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewer === "iframe"}
              onClick={() => setViewer("iframe")}
              className={`px-3 py-2 text-sm ${
                viewer === "iframe" ? "bg-black/5 dark:bg-white/10" : ""
              }`}
              title="Use <iframe> viewer"
            >
              iFrame
            </button>
          </div>
        )}

        <button
          onClick={openNewTab}
          className="px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Open in new tab
        </button>
        <button
          onClick={download}
          className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Download
        </button>
        <button
          onClick={printPdf}
          className="px-3 py-2 rounded-lg ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10"
        >
          Print
        </button>
      </div>
    </div>
  );

  const FallbackPanel = ({ reason }) => (
    <div className="grid gap-3">
      {thumbnail ? (
        <a href={src} target="_blank" rel="noreferrer" className="block">
          <img
            src={thumbnail}
            alt="Resume preview"
            className="w-full rounded-xl ring-1 ring-black/10 dark:ring-white/10 object-cover"
            loading="lazy"
          />
        </a>
      ) : (
        <div className="p-6 rounded-xl ring-1 ring-black/10 dark:ring-white/10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {reason || "Preview not supported here."} Use the buttons above to open or download the PDF.
        </div>
      )}
    </div>
  );

  // If the file is missing
  if (!loading && !exists) {
    return (
      <div className="flex flex-col gap-3">
        <Toolbar />
        <div className="p-6 rounded-xl ring-1 ring-black/10 dark:ring-white/10 text-center text-sm text-red-600 dark:text-red-400">
          Couldn’t find the file at <code className="font-mono">{src}</code>. Place your PDF in
          <code className="font-mono"> /public{src}</code> (then restart the dev server).
        </div>
      </div>
    );
  }

  // Shared style for hiding scrollbars + no overflow chrome
  const noScrollStyle = {
    height,
    border: 0,
    overflow: "hidden",
    scrollbarWidth: "none",  // Firefox
    msOverflowStyle: "none", // old Edge/IE
  };

  return (
    <div className="flex flex-col gap-3">
      <Toolbar />

      {/* Loading */}
      {loading && (
        <div
          className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-zinc-900/70 grid place-items-center"
          style={{ height }}
          aria-busy="true"
        >
          <div className="text-sm opacity-70">Loading preview…</div>
        </div>
      )}

      {/* Viewer */}
      {!loading && exists && (
        inlineAllowed ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950">
            {viewer === "object" && (
              <object
                data={`${src}#view=FitH`}
                type="application/pdf"
                className="w-full"
                style={noScrollStyle}
              >
                {/* If <object> fails, try iframe automatically */}
                <iframe
                  src={src}
                  title="Resume PDF"
                  className="w-full"
                  style={noScrollStyle}
                />
                <FallbackPanel reason="Inline PDF preview isn’t available in this browser." />
              </object>
            )}

            {viewer === "iframe" && (
              <iframe
                src={src}
                title="Resume PDF"
                className="w-full"
                style={noScrollStyle}
              />
            )}
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-zinc-950"
            style={{ minHeight: height }}
          >
            <FallbackPanel reason="This browser blocks inline PDF viewers." />
          </div>
        )
      )}

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center">
        Tip: If the preview doesn’t load, click “Open in new tab”—some mobile browsers block inline PDFs.
      </p>
    </div>
  );
}
