import { useEffect, useRef, useState } from "react";

export default function ResumeViewer() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const download = () => {
    const a = document.createElement("a");
    a.href = "/resume.pdf";     // put your resume in public/resume.pdf
    a.download = "Tristan-Jorge-Cuartero-Resume.pdf";
    a.click();
  };

  const printPdf = () => {
    // Use a new window to print the embedded PDF
    const w = window.open("/resume.pdf", "_blank", "noopener,noreferrer");
    if (!w) return;
    // give the PDF a moment to load then call print (best-effort)
    setTimeout(() => { try { w.focus(); w.print(); } catch {} }, 700);
  };

  return (
    <div className="text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => setOpen(true)}
                className="inline-flex items-center px-5 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700">
          👀 Preview Resume
        </button>
        <a href="/resume.pdf" download
           className="inline-flex items-center px-5 py-3 rounded-xl font-semibold ring-1 ring-black/10 dark:ring-white/20 hover:bg-black/5 dark:hover:bg-white/10">
          ⬇️ Download PDF
        </a>
      </div>

      {open && (
        <div ref={overlayRef}
             onClick={(e) => e.target === overlayRef.current && setOpen(false)}
             className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="mx-auto max-w-5xl w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
              <h3 className="font-semibold">Resume</h3>
              <div className="flex items-center gap-2">
                <button onClick={printPdf}
                        className="rounded-lg px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10">
                  🖨️ Print
                </button>
                <button onClick={download}
                        className="rounded-lg px-3 py-2 ring-1 ring-black/10 dark:ring-white/10 hover:bg-black/5 dark:hover:bg-white/10">
                  ⬇️ Download
                </button>
                <button onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 bg-black/80 text-white hover:bg-black">
                  ✕
                </button>
              </div>
            </div>
            {/* Embedded PDF */}
            <div className="aspect-[3/4] md:aspect-[16/10] bg-zinc-100 dark:bg-zinc-800">
              <iframe
                title="Resume PDF"
                src="/resume.pdf#view=FitH"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
