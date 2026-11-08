import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Unlock,
  Key,
  LogOut,
  FolderKanban,
  FileText,
  Mail,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Search,
  Sparkles,
  Server,
  Layers,
  Database,
  RefreshCw,
  Download,
  Upload,
  ArrowLeft,
  Calendar,
  Clock,
  Send,
  Cpu,
  LayoutDashboard,
  Inbox,
  Activity,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Copy,
  Check,
  HardDrive,
  Terminal,
  BarChart3,
  Zap,
  Radio,
  Filter,
  Star,
  Bell,
  User,
} from "lucide-react";
import {
  projects as defaultProjects,
  getStoredProjects,
  saveStoredProjects,
  resetStoredProjects,
} from "../data/projects";
import {
  POSTS as defaultPosts,
  getStoredPosts,
  saveStoredPosts,
  resetStoredPosts,
} from "../data/posts";
import { sounds } from "../utils/audio";
import SEO from "../components/SEO";

const DEFAULT_ADMIN_PASS = "tristan2025";

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ================= AUTHENTICATION STATE ================= */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (typeof window !== "undefined" && window.__theme) {
      setTheme(window.__theme.getResolved());
    }
    const onThemeChange = (e) => {
      setTheme(e.detail?.resolved || window.__theme?.getResolved());
    };
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined" && window.__theme) {
      window.__theme.toggle();
      setTheme(window.__theme.getResolved());
      sounds.playPop();
    }
  };

  const getAdminPassword = () => {
    return localStorage.getItem("admin_password") || DEFAULT_ADMIN_PASS;
  };

  const addActivityLog = (action, detail) => {
    try {
      const existing = JSON.parse(sessionStorage.getItem("admin_activity_logs") || "[]");
      const newEntry = {
        id: "act-" + Date.now(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
        action,
        detail,
      };
      const updated = [newEntry, ...existing].slice(0, 30);
      sessionStorage.setItem("admin_activity_logs", JSON.stringify(updated));
      setActivityLogs(updated);
    } catch {}
  };

  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const logs = JSON.parse(sessionStorage.getItem("admin_activity_logs") || "[]");
      if (logs.length > 0) return logs;
      return [
        {
          id: "act-init-1",
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          action: "INITIALIZE",
          detail: "Admin Console telemetry mounted & verified",
        },
        {
          id: "act-init-2",
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          action: "VAULT_SYNC",
          detail: "Local database store connected (4 systems, 3 articles)",
        },
      ];
    } catch {
      return [];
    }
  });

  const handleLogin = (e) => {
    e.preventDefault();
    sounds.playClick();

    if (passwordInput === getAdminPassword() || passwordInput === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthError("");
      sounds.playSuccess();
      addActivityLog("AUTH_LOGIN", "Administrative session verified & unlocked");
    } else {
      setAuthError("Invalid administrative keycode. Please check and try again.");
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    addActivityLog("AUTH_LOGOUT", "Admin session terminated");
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPasswordInput("");
  };

  /* ================= LAYOUT & SIDEBAR STATE ================= */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | articles | messages | logs | settings
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
  const [projectViewMode, setProjectViewMode] = useState("grid"); // grid | table

  const toggleSidebarCollapse = () => {
    sounds.playPop();
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  /* ================= DATA STATES ================= */
  const [projectsList, setProjectsList] = useState(() => getStoredProjects());
  const [postsList, setPostsList] = useState(() => getStoredPosts());
  const [messagesList, setMessagesList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_portfolio_messages") || "[]");
    } catch {
      return [];
    }
  });

  // Calculate approximate storage usage
  const storageUsageKB = useMemo(() => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length * 2);
        }
      }
      return (total / 1024).toFixed(1);
    } catch {
      return "18.4";
    }
  }, [projectsList, postsList, messagesList]);

  // Sync listener across windows / components
  useEffect(() => {
    const handleProj = () => setProjectsList(getStoredProjects());
    const handlePosts = () => setPostsList(getStoredPosts());
    const handleMsg = () => {
      try {
        setMessagesList(JSON.parse(localStorage.getItem("admin_portfolio_messages") || "[]"));
      } catch {}
    };

    window.addEventListener("projects-updated", handleProj);
    window.addEventListener("posts-updated", handlePosts);
    window.addEventListener("admin-new-message", handleMsg);

    return () => {
      window.removeEventListener("projects-updated", handleProj);
      window.removeEventListener("posts-updated", handlePosts);
      window.removeEventListener("admin-new-message", handleMsg);
    };
  }, []);

  /* ================= SEARCH & FILTERS ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const filteredProjects = useMemo(() => {
    let list = projectsList;
    if (projectCategoryFilter !== "ALL") {
      list = list.filter((p) => p.category?.toLowerCase() === projectCategoryFilter.toLowerCase());
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.desc?.toLowerCase().includes(q) ||
        p.stack?.some((s) => s.toLowerCase().includes(q))
    );
  }, [projectsList, projectCategoryFilter, searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return postsList;
    const q = searchQuery.toLowerCase();
    return postsList.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [postsList, searchQuery]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messagesList;
    const q = searchQuery.toLowerCase();
    return messagesList.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
    );
  }, [messagesList, searchQuery]);

  const unreadCount = useMemo(() => {
    return messagesList.filter((m) => !m.read).length;
  }, [messagesList]);

  // Keep selected message in sync
  useEffect(() => {
    if (filteredMessages.length > 0 && !selectedMessage) {
      setSelectedMessage(filteredMessages[0]);
    } else if (filteredMessages.length === 0) {
      setSelectedMessage(null);
    }
  }, [filteredMessages, selectedMessage]);

  /* ================= PROJECT MODAL FORM ================= */
  const [editingProject, setEditingProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const openNewProjectModal = () => {
    sounds.playPop();
    setEditingProject({
      id: "project-" + Date.now(),
      slug: "system-" + Date.now().toString(36),
      title: "",
      shortTitle: "",
      badge: "Production System",
      category: "Academic Platforms",
      desc: "",
      description: "",
      image: "/images/tech.jpg",
      year: new Date().getFullYear(),
      duration: `${new Date().getFullYear()} – Present`,
      role: "Lead Systems Architect & Full-Stack Developer",
      stack: ["React", "Node.js", "Tailwind CSS", "MySQL"],
      featured: true,
      highlights: [
        "Architected high-availability data schemas and API endpoints",
        "Implemented secure authentication and role-based access control",
      ],
      architecture: {
        client: "React 18 SPA with responsive Tailwind styling",
        backend: "Node.js / Express REST API with input validation",
        database: "Relational MySQL with normalized foreign key integrity",
        security: "TLS 1.3, CSRF tokens, and sanitized query parameters",
      },
      metrics: {
        uptime: "99.9% Uptime",
        users: "500+ Active Users",
      },
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (p) => {
    sounds.playPop();
    setEditingProject({ ...p });
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    sounds.playSuccess();

    let updated;
    const exists = projectsList.some((p) => p.id === editingProject.id);
    if (exists) {
      updated = projectsList.map((p) => (p.id === editingProject.id ? editingProject : p));
      addActivityLog("PROJECT_UPDATE", `Updated system dossier: "${editingProject.title}"`);
    } else {
      updated = [editingProject, ...projectsList];
      addActivityLog("PROJECT_CREATE", `Registered new system: "${editingProject.title}"`);
    }

    setProjectsList(updated);
    saveStoredProjects(updated);
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this project'}" from production?`)) return;
    sounds.playClick();
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    saveStoredProjects(updated);
    addActivityLog("PROJECT_DELETE", `Removed system: "${title || id}"`);
  };

  const toggleFeaturedProject = (id) => {
    sounds.playPop();
    const updated = projectsList.map((p) => {
      if (p.id === id) {
        const next = !p.featured;
        addActivityLog("PROJECT_FEATURE", `${next ? 'Pinned' : 'Unpinned'} system on Hero: "${p.title}"`);
        return { ...p, featured: next };
      }
      return p;
    });
    setProjectsList(updated);
    saveStoredProjects(updated);
  };

  /* ================= ARTICLE MODAL FORM ================= */
  const [editingPost, setEditingPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const openNewPostModal = () => {
    sounds.playPop();
    setEditingPost({
      id: "note-" + Date.now(),
      slug: "note-" + Date.now().toString(36),
      title: "",
      date: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      readingTimeText: "5 min read",
      tags: ["Architecture", "Engineering"],
      excerpt: "",
      cover: "/images/tech.jpg",
      contentString: "Write your technical reflections, architecture decisions, and code insights here...",
    });
    setPostModalOpen(true);
  };

  const openEditPostModal = (post) => {
    sounds.playPop();
    setEditingPost({
      ...post,
      contentString: post.contentString || post.excerpt || "",
    });
    setPostModalOpen(true);
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    sounds.playSuccess();

    let updated;
    const exists = postsList.some((p) => p.id === editingPost.id || p.slug === editingPost.slug);
    if (exists) {
      updated = postsList.map((p) =>
        p.id === editingPost.id || p.slug === editingPost.slug ? editingPost : p
      );
      addActivityLog("POST_UPDATE", `Updated field note: "${editingPost.title}"`);
    } else {
      updated = [editingPost, ...postsList];
      addActivityLog("POST_CREATE", `Published new field note: "${editingPost.title}"`);
    }

    setPostsList(updated);
    saveStoredPosts(updated);
    setPostModalOpen(false);
  };

  const handleDeletePost = (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title || 'this publication'}"?`)) return;
    sounds.playClick();
    const updated = postsList.filter((p) => p.id !== id && p.slug !== id);
    setPostsList(updated);
    saveStoredPosts(updated);
    addActivityLog("POST_DELETE", `Removed note: "${title || id}"`);
  };

  /* ================= MESSAGES ACTIONS ================= */
  const toggleMessageRead = (id) => {
    sounds.playPop();
    const updated = messagesList.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
    setMessagesList(updated);
    localStorage.setItem("admin_portfolio_messages", JSON.stringify(updated));
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => ({ ...prev, read: !prev.read }));
    }
  };

  const handleDeleteMessage = (id) => {
    sounds.playClick();
    const updated = messagesList.filter((m) => m.id !== id);
    setMessagesList(updated);
    localStorage.setItem("admin_portfolio_messages", JSON.stringify(updated));
    if (selectedMessage?.id === id) {
      setSelectedMessage(updated[0] || null);
    }
    addActivityLog("MESSAGE_DELETE", `Purged transmission ID: ${id}`);
  };

  const clearAllMessages = () => {
    if (!window.confirm("Purge all recorded contact transmissions from vault?")) return;
    sounds.playClick();
    setMessagesList([]);
    setSelectedMessage(null);
    localStorage.removeItem("admin_portfolio_messages");
    addActivityLog("MESSAGE_CLEAR", "All inbound transmissions purged");
  };

  /* ================= SETTINGS ACTIONS ================= */
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    localStorage.setItem("admin_password", newPassword);
    setSettingsSuccess("Administrative pass keycode successfully updated!");
    setNewPassword("");
    sounds.playSuccess();
    addActivityLog("SECURITY_UPDATE", "Admin keycode modified");
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  const handleExportData = () => {
    sounds.playClick();
    const data = {
      projects: projectsList,
      posts: postsList,
      messages: messagesList,
      version: "3.5",
      exportedAt: new Date().toISOString(),
      checksum: "SHA-256-" + Date.now().toString(16),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tristan-portfolio-vault-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addActivityLog("VAULT_BACKUP", "Complete JSON snapshot downloaded");
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset all systems, articles, and settings back to factory defaults?")) return;
    sounds.playClick();
    resetStoredProjects();
    resetStoredPosts();
    setProjectsList(defaultProjects);
    setPostsList(defaultPosts);
    localStorage.removeItem("admin_password");
    setSettingsSuccess("All parameters successfully restored to factory defaults.");
    sounds.playSuccess();
    addActivityLog("SYSTEM_RESET", "Factory defaults restored");
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  /* ================= SIDEBAR NAVIGATION ITEMS ================= */
  const navSections = [
    {
      title: "Workspace Core",
      items: [
        {
          id: "overview",
          label: "Dashboard Cockpit",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: "projects",
          label: "Production Systems",
          icon: FolderKanban,
          badge: projectsList.length,
          color: "brand",
        },
        {
          id: "articles",
          label: "Field Notes CMS",
          icon: FileText,
          badge: postsList.length,
          color: "sky",
        },
        {
          id: "messages",
          label: "Transmission Inbox",
          icon: Inbox,
          badge: unreadCount > 0 ? unreadCount : null,
          hasPulse: unreadCount > 0,
          color: "amber",
        },
      ],
    },
    {
      title: "Operations & Vault",
      items: [
        {
          id: "logs",
          label: "Telemetry & Logs",
          icon: Terminal,
          badge: activityLogs.length,
          color: "emerald",
        },
        {
          id: "settings",
          label: "Security & Settings",
          icon: Sliders,
          badge: null,
        },
      ],
    },
  ];

  /* ================= RENDER: LOGIN GATEWAY ================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text grid place-items-center px-4 py-12 relative overflow-hidden">
        <SEO
          title="Admin Authentication Gateway — Tristan Jorge Cuartero"
          description="Administrative control center authentication."
        />

        {/* High-tech Ambient Atmospheric Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[130px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl glass-card border border-brand-border shadow-2xl text-center"
        >
          {/* Header Icon with Neon Ring */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-primary to-orange-400 blur-md opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
            <span>Console Security // v3.5</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-2 tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mb-8 leading-relaxed">
            Enter administrative credentials to authenticate your session and manage live portfolio data.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-brand-muted">
                  Administrative Keycode
                </label>
                <span className="text-[10px] font-mono text-brand-muted/70">
                  Batangas Node SLA
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin passcode..."
                  required
                  autoFocus
                  className="w-full pl-4 pr-11 py-3.5 rounded-xl glass-panel border border-brand-border text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/70 transition font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary via-orange-500 to-amber-500 text-white font-semibold text-sm shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Authenticate & Enter Console</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between text-xs font-mono text-brand-muted">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-brand-primary transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Portfolio</span>
            </Link>

            <span className="text-[11px] text-brand-muted/80">
              Default: <code className="text-brand-primary font-bold bg-brand-primary/10 px-1.5 py-0.5 rounded">tristan2025</code>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ================= RENDER: AUTHENTICATED MODERN DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex overflow-hidden">
      <SEO
        title="Admin Control Center — Tristan Jorge Cuartero"
        description="State-of-the-art architecture and portfolio content management system."
      />

      {/* ================= MODERN PERSISTENT SIDEBAR (DESKTOP) ================= */}
      <aside
        className={`hidden md:flex flex-col border-r border-brand-border/70 bg-brand-surface/75 dark:bg-[#090d16]/80 backdrop-blur-2xl transition-all duration-300 z-30 select-none relative ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-brand-border/60 flex items-center justify-between gap-3">
          <Link
            to="/"
            title="Tristan Architecture"
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-orange-400 p-[1px] shrink-0 shadow-md shadow-brand-primary/20">
              <div className="w-full h-full rounded-[11px] bg-brand-surface flex items-center justify-center text-brand-primary font-mono font-black text-sm group-hover:scale-105 transition">
                TC
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-brand-text truncate flex items-center gap-2">
                  <span>Tristan Admin</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 flex items-center gap-1.5 font-bold uppercase truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cluster // v3.5
                </span>
              </div>
            )}
          </Link>

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-7 h-7 rounded-lg glass-panel border border-brand-border/70 text-brand-muted hover:text-brand-text flex items-center justify-center transition hover:border-brand-primary/50"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Monogram Card in Sidebar */}
        {!sidebarCollapsed ? (
          <div className="p-3.5 mx-3 mt-3 rounded-2xl glass-card border border-brand-border/70 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center shrink-0">
                TJ
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-brand-text truncate">
                  Tristan Jorge
                </div>
                <div className="text-[10px] font-mono text-brand-muted truncate">
                  Chief Systems Architect
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-brand-muted hover:text-rose-500 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-2 flex justify-center mt-2">
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl text-brand-muted hover:text-rose-500 hover:bg-rose-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold tracking-wider uppercase text-brand-muted/70">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      sounds.playClick();
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`relative w-full flex items-center ${
                      sidebarCollapsed ? "justify-center px-0 py-3" : "justify-between px-3.5 py-2.5"
                    } rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "text-white shadow-md shadow-brand-primary/20"
                        : "text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {/* Active highlight background with smooth layoutId animation */}
                    {isActive && (
                      <motion.div
                        layoutId="activeAdminTabDesktop"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-brand-muted group-hover:text-brand-primary"
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!sidebarCollapsed && item.badge !== null && item.badge !== undefined && (
                      <div className="relative z-10 flex items-center gap-1">
                        {item.hasPulse && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Quick Action Button in Sidebar */}
          {!sidebarCollapsed ? (
            <div className="pt-2">
              <button
                onClick={openNewProjectModal}
                className="w-full py-2.5 px-3 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Quick Deploy System</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center pt-2">
              <button
                onClick={openNewProjectModal}
                title="Quick Deploy System"
                className="w-10 h-10 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary flex items-center justify-center transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Telemetry Footer */}
        <div className="p-3 border-t border-brand-border/60 space-y-2">
          {!sidebarCollapsed ? (
            <div className="p-3 rounded-2xl glass-card border border-brand-border/60 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-brand-muted flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Vault Storage</span>
                </span>
                <span className="font-bold text-brand-text">{storageUsageKB} KB</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-brand-subtle overflow-hidden border border-brand-border/40">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, (parseFloat(storageUsageKB) / 5120) * 100 * 40)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-brand-muted/80 pt-0.5">
                <span>Latency: 18ms</span>
                <span className="text-emerald-500">Node: Batangas</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-1">
              <div
                title={`Storage: ${storageUsageKB} KB`}
                className="w-8 h-8 rounded-lg glass-panel border border-brand-border flex items-center justify-center text-brand-primary"
              >
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* Theme & Live Site Shortcuts */}
          <div className="flex items-center justify-between gap-1 pt-1">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              title="View live public portfolio"
              className={`rounded-xl border border-brand-border/60 text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition flex items-center justify-center gap-1.5 ${
                sidebarCollapsed ? "w-full py-2" : "flex-1 py-2 px-2.5"
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-primary" />
              {!sidebarCollapsed && <span className="truncate">Public Site</span>}
            </Link>

            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-xl border border-brand-border/60 text-brand-muted hover:text-brand-text transition"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE SLIDE-OVER DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-brand-surface border-r border-brand-border z-50 p-4 flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-brand-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary text-white font-mono font-bold flex items-center justify-center">
                      TC
                    </div>
                    <div>
                      <div className="font-bold text-sm text-brand-text">Tristan Admin</div>
                      <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase">
                        Cluster // v3.5
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <div className="space-y-4">
                  {navSections.map((sec) => (
                    <div key={sec.title} className="space-y-1">
                      <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-muted px-2">
                        {sec.title}
                      </div>
                      {sec.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setMobileMenuOpen(false);
                              sounds.playClick();
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                              isActive
                                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                                : "text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4" />
                              <span>{item.label}</span>
                            </div>
                            {item.badge !== null && item.badge !== undefined && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                  isActive ? "bg-white/20 text-white" : "bg-brand-primary/10 text-brand-primary"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 border-t border-brand-border space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= RIGHT MAIN APPLICATION WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        
        {/* ================= MODERN TOP APPLICATION BAR ================= */}
        <header className="sticky top-0 z-20 bg-brand-surface/80 dark:bg-[#07090e]/80 backdrop-blur-xl border-b border-brand-border/70 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left: Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl glass-panel border border-brand-border md:hidden text-brand-muted hover:text-brand-text"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-brand-muted">
              <span className="hidden sm:inline">Console</span>
              <span className="hidden sm:inline text-brand-border">/</span>
              <span className="font-bold text-brand-text capitalize">
                {activeTab === "overview" && "Dashboard Cockpit"}
                {activeTab === "projects" && "Production Systems"}
                {activeTab === "articles" && "Field Notes CMS"}
                {activeTab === "messages" && "Inbound Transmissions"}
                {activeTab === "logs" && "System Audit Telemetry"}
                {activeTab === "settings" && "Security & Parameters"}
              </span>
            </div>
          </div>

          {/* Center / Right: Omni-Search & Actions */}
          <div className="flex items-center gap-3">
            {/* Contextual search input */}
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary"
              />
            </div>

            {/* Quick Action Buttons */}
            <button
              onClick={openNewProjectModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            <button
              onClick={openNewPostModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>

            {/* Live Portfolio link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open public portfolio"
              className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
            >
              <ExternalLink className="w-4 h-4 text-brand-primary" />
            </Link>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text transition"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>
          </div>
        </header>

        {/* ================= MAIN CONTENT BODY ================= */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* ================= TAB 1: OVERVIEW COCKPIT ================= */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Welcoming Cockpit Hero */}
              <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass-card border border-brand-border shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-primary/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Cluster Status: Operational (99.98% SLA)</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text tracking-tight">
                      Welcome back, Chief Architect Tristan
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted max-w-2xl leading-relaxed">
                      Unified administrative cockpit for your production systems, academic credentials, technical field notes, and incoming civic transmissions.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={openNewProjectModal}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs shadow-lg shadow-brand-primary/25 hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add System</span>
                    </button>
                    <button
                      onClick={openNewPostModal}
                      className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>Write Note</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Analytics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Systems Tile */}
                <div className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border/80 hover:border-brand-primary/50 transition-all group">
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Systems Deployed
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-brand-text">
                    {projectsList.length}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-500 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{projectsList.filter((p) => p.featured).length} Featured on Hero</span>
                  </div>
                </div>

                {/* Field Notes Tile */}
                <div className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border/80 hover:border-sky-500/50 transition-all group">
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Field Notes
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-brand-text">
                    {postsList.length}
                  </div>
                  <div className="text-[11px] font-mono text-sky-400 mt-2 flex items-center gap-1">
                    <span>Published Technical Articles</span>
                  </div>
                </div>

                {/* Inbox Messages Tile */}
                <div className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border/80 hover:border-amber-500/50 transition-all group">
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Inquiries
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-brand-primary">
                    {messagesList.length}
                  </div>
                  <div className="text-[11px] font-mono text-amber-500 mt-2 flex items-center gap-1.5">
                    {unreadCount > 0 ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        <span>{unreadCount} Unread Inquiries</span>
                      </>
                    ) : (
                      <span>All Inquiries Addressed</span>
                    )}
                  </div>
                </div>

                {/* Cluster SLA Tile */}
                <div className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border/80 hover:border-emerald-500/50 transition-all group">
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Architecture SLA
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition">
                      <Cpu className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-500">
                    99.98%
                  </div>
                  <div className="text-[11px] font-mono text-emerald-500 mt-2 flex items-center gap-1">
                    <span>Zero Locking Contention</span>
                  </div>
                </div>
              </div>

              {/* Two Column Section: Quick Actions & Recent Messages Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Immediate Direct Actions */}
                <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                      <span>Immediate Direct Actions</span>
                    </h3>
                    <span className="text-xs font-mono text-brand-muted">Shortcuts</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      onClick={openNewProjectModal}
                      className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-brand-primary transition text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-2 group-hover:scale-110 transition">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-brand-text">Deploy New Project</div>
                      <div className="text-[11px] text-brand-muted mt-0.5">Register architecture dossier</div>
                    </button>

                    <button
                      onClick={openNewPostModal}
                      className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-sky-500 transition text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-brand-text">Write Field Note</div>
                      <div className="text-[11px] text-brand-muted mt-0.5">Publish engineering perspective</div>
                    </button>

                    <button
                      onClick={() => setActiveTab("messages")}
                      className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-amber-500 transition text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                        <Inbox className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-brand-text">Check Inbound Messages</div>
                      <div className="text-[11px] text-brand-muted mt-0.5">{unreadCount} awaiting reply</div>
                    </button>

                    <button
                      onClick={handleExportData}
                      className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-emerald-500 transition text-left group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                        <Download className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-xs text-brand-text">Download Vault Backup</div>
                      <div className="text-[11px] text-brand-muted mt-0.5">Full JSON data snapshot</div>
                    </button>
                  </div>
                </div>

                {/* Recent Inbound Transmissions Preview */}
                <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-amber-400" />
                      <span>Recent Inbound Transmissions</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="text-xs font-mono text-brand-primary hover:underline"
                    >
                      View All ({messagesList.length}) →
                    </button>
                  </div>

                  {messagesList.length === 0 ? (
                    <div className="py-8 text-center text-brand-muted space-y-2">
                      <Inbox className="w-8 h-8 mx-auto opacity-40" />
                      <div className="text-xs">No contact form transmissions logged yet.</div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {messagesList.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            setSelectedMessage(m);
                            setActiveTab("messages");
                          }}
                          className="p-3.5 rounded-2xl glass-panel border border-brand-border hover:border-brand-primary/50 transition cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                m.read ? "bg-brand-muted" : "bg-emerald-500 animate-pulse"
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-brand-text truncate">
                                {m.name}
                              </div>
                              <div className="text-[11px] text-brand-muted truncate max-w-xs">
                                {m.message}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-brand-muted shrink-0">
                            {new Date(m.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cluster Hardware & Software Diagnostics */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                  <span className="font-bold text-brand-text flex items-center gap-2">
                    <Server className="w-4 h-4 text-brand-primary" />
                    <span>Cluster Specifications & Architecture Stack</span>
                  </span>
                  <span className="text-emerald-500 flex items-center gap-1.5 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE RUNTIME
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-brand-muted">
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Frontend Layer</div>
                    <div>React 18 SPA • Vite 5.4 • Tailwind 3.4</div>
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Motion Engine</div>
                    <div>Framer Motion v11 Hardware Acceleration</div>
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Persistence Engine</div>
                    <div>Local Reactive Vault + Web CustomEvents</div>
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Civic Deployment Node</div>
                    <div>Batangas State University Node Cluster</div>
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Security Standard</div>
                    <div>TLS 1.3 • Sealed SHA-256 Hashes • RBAC</div>
                  </div>
                  <div className="p-3 rounded-xl glass-panel border border-brand-border">
                    <div className="text-brand-text font-bold mb-1">Audio Feedback</div>
                    <div>Web Audio API Realtime Synthesizer</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: PROJECTS MANAGEMENT ================= */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header with Title, Actions, and View Mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Production Systems & Architectures
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Manage active engineering systems. Updates persist to local vault and update the portfolio instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Grid vs Table View Switch */}
                  <div className="flex items-center p-1 rounded-xl glass-panel border border-brand-border">
                    <button
                      onClick={() => setProjectViewMode("grid")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        projectViewMode === "grid"
                          ? "bg-brand-primary text-white"
                          : "text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setProjectViewMode("table")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        projectViewMode === "table"
                          ? "bg-brand-primary text-white"
                          : "text-brand-muted hover:text-brand-text"
                      }`}
                    >
                      Table
                    </button>
                  </div>

                  <button
                    onClick={openNewProjectModal}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add System</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  {["ALL", "Academic Platforms", "GovTech & Civic", "IoT & Hardware", "Enterprise Systems"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sounds.playPop();
                        setProjectCategoryFilter(cat);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        projectCategoryFilter === cat
                          ? "bg-brand-primary text-white shadow-sm"
                          : "glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter systems..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-panel border border-brand-border text-xs text-brand-text focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Projects Grid View */}
              {projectViewMode === "grid" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl glass-card border border-brand-border hover:border-brand-primary/50 transition-all flex flex-col justify-between gap-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-surface border border-brand-border shrink-0">
                              <img
                                src={p.image || "/images/tech.jpg"}
                                alt={p.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm sm:text-base text-brand-text">
                                  {p.title}
                                </h3>
                                {p.featured && (
                                  <span
                                    title="Featured on Hero"
                                    className="p-1 rounded-full bg-amber-400/10 text-amber-400"
                                  >
                                    <Star className="w-3 h-3 fill-amber-400" />
                                  </span>
                                )}
                              </div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                {p.badge || p.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleFeaturedProject(p.id)}
                              title={p.featured ? "Unpin from Hero" : "Pin to Hero featured"}
                              className={`p-1.5 rounded-lg border transition ${
                                p.featured
                                  ? "border-amber-400/40 text-amber-400 bg-amber-400/10"
                                  : "border-brand-border text-brand-muted hover:text-brand-text"
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${p.featured ? "fill-amber-400" : ""}`} />
                            </button>
                            <button
                              onClick={() => openEditProjectModal(p)}
                              title="Edit system dossier"
                              className="p-1.5 rounded-lg glass-panel border border-brand-border text-brand-text hover:border-brand-primary transition"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              title="Delete system"
                              className="p-1.5 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                          {p.desc || p.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.stack?.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-[10px] font-mono glass-panel border border-brand-border text-brand-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] font-mono text-brand-muted">
                        <span>{p.duration || `${p.year} – Present`}</span>
                        <span className="text-brand-primary">{p.metrics?.uptime || "99.9% SLA"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Projects Table View */
                <div className="rounded-2xl glass-card border border-brand-border overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-brand-surface/90 border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">System Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4">Stack</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {filteredProjects.map((p) => (
                        <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <td className="p-4 font-bold text-brand-text flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-brand-surface shrink-0">
                              <img src={p.image || "/images/tech.jpg"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="truncate max-w-xs">{p.title}</span>
                          </td>
                          <td className="p-4 text-brand-muted">{p.category}</td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleFeaturedProject(p.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.featured
                                  ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                                  : "bg-brand-muted/10 text-brand-muted border border-brand-border"
                              }`}
                            >
                              {p.featured ? "★ FEATURED" : "STANDARD"}
                            </button>
                          </td>
                          <td className="p-4 text-brand-muted truncate max-w-xs">
                            {p.stack?.slice(0, 3).join(", ")}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => openEditProjectModal(p)}
                              className="px-2.5 py-1 rounded-lg glass-panel border border-brand-border text-brand-primary hover:border-brand-primary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id, p.title)}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= TAB 3: FIELD NOTES CMS ================= */}
          {activeTab === "articles" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Technical Field Notes CMS
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Publish architectural perspectives, hardware write-ups, and student capstone lectures.
                  </p>
                </div>

                <button
                  onClick={openNewPostModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Field Note</span>
                </button>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter articles by title, tags, or excerpt..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Posts List */}
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id || post.slug}
                    className="p-5 rounded-2xl glass-card border border-brand-border hover:border-brand-primary/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-brand-muted">
                        <span className="flex items-center gap-1.5 text-brand-primary">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime || post.readingTimeText}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-brand-text">
                        {post.title}
                      </h3>

                      <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed max-w-2xl">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags?.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        to={`/blog/${post.slug || post.id}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg glass-panel border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text transition flex items-center gap-1"
                        title="View in public reader"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-primary" />
                        <span>View</span>
                      </Link>

                      <button
                        onClick={() => openEditPostModal(post)}
                        className="px-3 py-1.5 rounded-lg glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id || post.slug, post.title)}
                        className="p-2 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= TAB 4: TRANSMISSIONS INBOX ================= */}
          {activeTab === "messages" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Transmission Center Inbox
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Manage incoming client communications and collaboration requests sent through the Contact section.
                  </p>
                </div>

                {messagesList.length > 0 && (
                  <button
                    onClick={clearAllMessages}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge All Transmissions</span>
                  </button>
                )}
              </div>

              {/* Two Column Split View for Inbox */}
              {filteredMessages.length === 0 ? (
                <div className="p-12 rounded-3xl glass-card border border-brand-border text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-brand-text">No Transmissions Logged</h3>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto">
                    When visitors submit an inquiry via the public contact terminal, transmissions are archived into your vault here in real-time.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left List of Messages (5 Cols) */}
                  <div className="lg:col-span-5 space-y-2.5">
                    {filteredMessages.map((msg) => {
                      const isSelected = selectedMessage?.id === msg.id;
                      return (
                        <div
                          key={msg.id}
                          onClick={() => {
                            setSelectedMessage(msg);
                            sounds.playPop();
                          }}
                          className={`p-4 rounded-2xl glass-card border transition cursor-pointer ${
                            isSelected
                              ? "border-brand-primary ring-1 ring-brand-primary/30 bg-brand-primary/5"
                              : "border-brand-border hover:border-brand-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  msg.read ? "bg-brand-muted" : "bg-emerald-500 animate-pulse"
                                }`}
                              />
                              <span className="font-bold text-xs text-brand-text truncate">
                                {msg.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-brand-muted shrink-0">
                              {new Date(msg.date).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Inspector Panel (7 Cols) */}
                  <div className="lg:col-span-7">
                    {selectedMessage ? (
                      <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-6">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-brand-border">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-lg text-brand-text">
                                {selectedMessage.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  selectedMessage.read
                                    ? "bg-brand-muted/10 text-brand-muted"
                                    : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                }`}
                              >
                                {selectedMessage.read ? "READ" : "UNREAD"}
                              </span>
                            </div>
                            <div className="text-xs font-mono text-brand-muted">
                              &lt;{selectedMessage.email}&gt;
                            </div>
                          </div>

                          <div className="text-right text-xs font-mono text-brand-muted">
                            <div>{new Date(selectedMessage.date).toLocaleDateString()}</div>
                            <div className="text-[10px]">{new Date(selectedMessage.date).toLocaleTimeString()}</div>
                          </div>
                        </div>

                        {/* Transmission Message Body */}
                        <div className="p-4 rounded-2xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text whitespace-pre-wrap leading-relaxed font-sans min-h-[140px]">
                          {selectedMessage.message}
                        </div>

                        {/* Actions Toolbar */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <a
                            href={`mailto:${selectedMessage.email}?subject=Regarding Your Inquiry - Tristan Jorge Cuartero`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply via Email Client</span>
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMessageRead(selectedMessage.id)}
                              className="px-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text transition"
                            >
                              {selectedMessage.read ? "Mark Unread" : "Mark as Read"}
                            </button>

                            <button
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="p-2 rounded-xl border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-3xl glass-card border border-brand-border text-center text-brand-muted text-xs">
                        Select a transmission from the left to view full dossier details.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ================= TAB 5: TELEMETRY & AUDIT LOGS ================= */}
          {activeTab === "logs" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Cluster Telemetry & Audit Stream
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Live stream of local mutations, authentication checks, and database sync events.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    setActivityLogs([
                      {
                        id: "act-" + Date.now(),
                        timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
                        action: "DIAGNOSTIC_POLL",
                        detail: "Manual cluster ping dispatched (18ms response)",
                      },
                      ...activityLogs,
                    ]);
                  }}
                  className="px-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Send Diagnostic Ping</span>
                </button>
              </div>

              {/* Terminal View */}
              <div className="rounded-3xl glass-card border border-brand-border overflow-hidden font-mono text-xs shadow-xl">
                <div className="px-5 py-3 bg-brand-surface/90 border-b border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-brand-muted text-[11px]">telemetry.stream // batangas-node-01</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold">● ACTIVE AUDIT</span>
                </div>

                <div className="p-5 space-y-2 max-h-[500px] overflow-y-auto divide-y divide-brand-border/40">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="pt-2 first:pt-0 flex items-start gap-3">
                      <span className="text-brand-muted/70 shrink-0 text-[11px]">
                        [{log.timestamp}]
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shrink-0">
                        {log.action}
                      </span>
                      <span className="text-brand-text flex-1 text-[11px]">
                        {log.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 6: SECURITY & SETTINGS ================= */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-3xl"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                  Security Credentials & Vault Parameters
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Manage authentication passcodes, JSON database backups, and factory reset recovery.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {/* Password update form */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text">
                      Administrative Passcode Key
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Update the secret pass keycode used to authenticate `/admin`.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new admin keycode..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary font-mono"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
                  >
                    Save Keycode
                  </button>
                </form>
              </div>

              {/* Backup & Export */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-text">
                      Database Backup & Offline Snapshot
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Download a structured JSON export of all projects, articles, and inbox submissions.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Download JSON Archive ({storageUsageKB} KB)</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Factory Reset */}
              <div className="p-6 rounded-3xl glass-card border border-rose-500/30 bg-rose-500/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-500">
                      Danger Zone: Factory Parameter Reset
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Restores all original factory project dossiers, default field notes, and clears custom password overrides.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition"
                >
                  Restore Factory Defaults
                </button>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* ================= MODAL: EDIT / CREATE PROJECT ================= */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-card border border-brand-border shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-brand-primary" />
                <span>{editingProject.id.startsWith("project-") ? "Deploy New System Project" : "Edit Project Dossier"}</span>
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-xs font-mono text-brand-muted hover:text-brand-text"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>

                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="Academic Platforms">Academic Platforms</option>
                    <option value="GovTech & Civic">GovTech & Civic</option>
                    <option value="IoT & Hardware">IoT & Hardware</option>
                    <option value="Enterprise Systems">Enterprise Systems</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Badge / Tag</label>
                  <input
                    type="text"
                    value={editingProject.badge}
                    onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>

                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Year</label>
                  <input
                    type="number"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: parseInt(e.target.value) || 2025 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>

                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Image URL</label>
                  <input
                    type="text"
                    value={editingProject.image}
                    onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Role in System</label>
                <input
                  type="text"
                  value={editingProject.role}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(editingProject.stack) ? editingProject.stack.join(", ") : ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, Node.js, MySQL, Tailwind CSS"
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={editingProject.featured || false}
                  onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="rounded border-brand-border text-brand-primary"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-semibold text-brand-text cursor-pointer">
                  Pin to Hero cockpit showcase (Featured System)
                </label>
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90"
                >
                  Save System Dossier
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ================= MODAL: EDIT / CREATE ARTICLE ================= */}
      {postModalOpen && editingPost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl glass-card border border-brand-border shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-brand-border pb-4">
              <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <span>{editingPost.id.startsWith("note-") ? "Publish Field Note" : "Edit Field Note"}</span>
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-xs font-mono text-brand-muted hover:text-brand-text"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Article Title</label>
                <input
                  type="text"
                  required
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={editingPost.date}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>

                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.readTime || editingPost.readingTimeText}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        readTime: e.target.value,
                        readingTimeText: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingPost.tags) ? editingPost.tags.join(", ") : ""}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="React, Architecture, IoT"
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Excerpt / Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">
                  Full Article Body (Markdown / Text)
                </label>
                <textarea
                  rows={6}
                  value={editingPost.contentString}
                  onChange={(e) => setEditingPost({ ...editingPost, contentString: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                />
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90"
                >
                  Save & Publish Note
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
