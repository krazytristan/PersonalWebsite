import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Command,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  FileText,
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Award,
  BookOpen,
  Terminal,
  Shield,
} from "lucide-react";
import { projects } from "../data/projects";
import { sounds } from "../utils/audio";

export default function CommandPalette({
  open,
  onClose,
  onResume,
  onOpenProject,
  onReplayIntro,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [open]);

  // Command items
  const items = useMemo(() => {
    const navigateTo = (id) => {
      onClose();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.location.hash = id;
      } else {
        window.location.href = `/#${id}`;
      }
    };

    const list = [
      // Navigation
      {
        id: "nav-home",
        title: "Go to Home",
        category: "Navigation",
        icon: Terminal,
        action: () => navigateTo("home"),
      },
      {
        id: "nav-about",
        title: "Go to About & Philosophy",
        category: "Navigation",
        icon: Layers,
        action: () => navigateTo("about"),
      },
      {
        id: "nav-simulator",
        title: "Go to System Architecture Simulator",
        category: "Navigation",
        icon: Cpu,
        action: () => navigateTo("simulator"),
      },
      {
        id: "nav-projects",
        title: "Go to Selected Projects",
        category: "Navigation",
        icon: Sparkles,
        action: () => navigateTo("projects"),
      },
      {
        id: "nav-skills",
        title: "Go to Engineering Matrix",
        category: "Navigation",
        icon: Layers,
        action: () => navigateTo("skills"),
      },
      {
        id: "nav-achievements",
        title: "Go to Milestones & Credentials",
        category: "Navigation",
        icon: Award,
        action: () => navigateTo("achievements"),
      },
      {
        id: "nav-blog",
        title: "Go to Field Notes & Writings",
        category: "Navigation",
        icon: BookOpen,
        action: () => navigateTo("blog"),
      },
      {
        id: "nav-contact",
        title: "Go to Transmission Center",
        category: "Navigation",
        icon: Mail,
        action: () => navigateTo("contact"),
      },

      // Actions
      {
        id: "action-theme",
        title: "Toggle Dark / Light Theme",
        category: "Actions",
        icon: Sun,
        action: () => {
          window.__theme?.toggle();
          sounds.playPop();
          onClose();
        },
      },
      {
        id: "action-resume",
        title: "View / Download Official Resume",
        category: "Actions",
        icon: FileText,
        action: () => {
          onResume();
          onClose();
        },
      },
      {
        id: "action-copy-email",
        title: "Copy Email: trstnjorge@gmail.com",
        category: "Actions",
        icon: Mail,
        action: () => {
          navigator.clipboard.writeText("trstnjorge@gmail.com");
          sounds.playSuccess();
          onClose();
        },
      },
      {
        id: "action-replay-intro",
        title: "Replay Welcome Intro Animation",
        category: "Actions",
        icon: Sparkles,
        action: () => {
          onReplayIntro?.();
          onClose();
        },
      },

      // Projects
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        title: `Project: ${p.title}`,
        category: "Projects",
        icon: Sparkles,
        action: () => {
          onOpenProject(p);
          onClose();
        },
      })),
    ];

    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [query, onClose, onResume, onOpenProject, onReplayIntro]);

  // Keyboard navigation inside palette
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
        sounds.playClick();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
        sounds.playClick();
      } else if (e.key === "Enter" && items[selectedIndex]) {
        e.preventDefault();
        items[selectedIndex].action();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, items, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl glass-panel border border-brand-border shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-brand-border gap-3">
              <Search className="w-5 h-5 text-brand-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command, project, or destination..."
                className="w-full bg-transparent text-sm sm:text-base text-brand-text placeholder-brand-muted focus:outline-none"
              />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-surface border border-brand-border text-brand-muted">
                ESC
              </span>
            </div>

            {/* Command Results List */}
            <div className="overflow-y-auto p-2 space-y-1">
              {items.length === 0 ? (
                <div className="py-12 text-center text-sm text-brand-muted">
                  No matching commands found for "{query}".
                </div>
              ) : (
                items.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-brand-primary/15 text-brand-text border border-brand-primary/30"
                          : "text-brand-muted hover:text-brand-text border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-brand-primary text-white"
                              : "glass-card text-brand-muted"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              isSelected ? "text-brand-text" : "text-brand-text/90"
                            }`}
                          >
                            {item.title}
                          </div>
                          <div className="text-[10px] font-mono text-brand-muted uppercase">
                            {item.category}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-brand-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2.5 border-t border-brand-border/60 bg-brand-surface/40 flex items-center justify-between text-[11px] font-mono text-brand-muted">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <span className="text-brand-primary font-medium">Tristan OS v2.5</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
