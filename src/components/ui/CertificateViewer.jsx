import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  FileCheck,
  Download,
  ExternalLink,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { sounds } from "../../utils/audio";

export default function CertificateViewer({
  title,
  src,
  issuer = "Batangas State University",
  date = "2025",
  credentialId = "BSU-CICS-ARCH-2025-081",
}) {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    sounds.playPop();
    setZoomLevel((prev) => Math.min(prev + 20, 160));
  };

  const handleZoomOut = () => {
    sounds.playPop();
    setZoomLevel((prev) => Math.max(prev - 20, 80));
  };

  const handleZoomReset = () => {
    sounds.playPop();
    setZoomLevel(100);
  };

  return (
    <motion.div
      initial={!reduceMotion ? { opacity: 0, y: 12 } : false}
      animate={!reduceMotion ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full flex flex-col space-y-4"
    >
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>AUTHENTICATED CREDENTIAL // VERIFIED</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-brand-text">
            {title}
          </h3>

          <div className="text-xs font-mono text-brand-muted flex flex-wrap items-center gap-2">
            <span>Issuer: <strong className="text-brand-text">{issuer}</strong></span>
            <span>•</span>
            <span>Year: {date}</span>
            <span>•</span>
            <span className="text-brand-primary">ID: {credentialId}</span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center glass-panel border border-brand-border rounded-xl p-1 gap-1">
            <button
              onClick={handleZoomOut}
              title="Zoom out"
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-brand-muted px-1">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom in"
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 100 && (
              <button
                onClick={handleZoomReset}
                title="Reset zoom"
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Download PDF button */}
          <a
            href={src}
            download
            onClick={() => sounds.playClick()}
            className="px-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
            title="Download original certificate document"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Open In New Tab */}
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.playClick()}
            className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90 transition flex items-center gap-1.5"
            title="Open in fullscreen new tab"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen</span>
          </a>
        </div>
      </div>

      {/* ================= PDF / DOCUMENT VIEWER CONTAINER ================= */}
      <div
        className="
          relative w-full
          min-h-[55vh]
          sm:min-h-[65vh]
          lg:min-h-[70vh]
          rounded-2xl
          overflow-hidden
          border border-brand-border
          bg-brand-surface
          shadow-inner
        "
      >
        {/* Loading Spinner */}
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-brand-surface/90 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
              <div className="text-xs font-mono text-brand-muted tracking-wider uppercase">
                Rendering High-Resolution Certificate...
              </div>
            </div>
          </div>
        )}

        {/* Embedded Document Frame */}
        <iframe
          src={`${src}#view=FitH&toolbar=0&navpanes=0`}
          title={title}
          className="absolute inset-0 w-full h-full border-0 transition-transform origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Fallback Notice for Mobile & Browsers that block iframes */}
      <div className="p-3.5 rounded-2xl glass-card border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-brand-muted">
          <Sparkles className="w-4 h-4 text-brand-primary shrink-0" />
          <span>If your device restricts in-browser PDF rendering, you can open or download the high-resolution file directly.</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl border border-brand-border text-brand-text font-semibold hover:border-brand-primary transition flex items-center gap-1"
          >
            <span>Open Tab</span>
            <ExternalLink className="w-3 h-3 text-brand-primary" />
          </a>
          <a
            href={src}
            download
            className="px-3.5 py-1.5 rounded-xl bg-brand-primary text-white font-semibold shadow hover:opacity-95 transition flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>Save PDF</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
