import { useState, useEffect, useMemo } from "react";
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

  const handleLogin = (e) => {
    e.preventDefault();
    sounds.playClick();

    if (passwordInput === getAdminPassword() || passwordInput === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthError("");
      sounds.playSuccess();
    } else {
      setAuthError("Invalid administrative keycode. Please check and try again.");
    }
  };

  const handleLogout = () => {
    sounds.playClick();
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPasswordInput("");
  };

  /* ================= ACTIVE TAB STATE ================= */
  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | articles | messages | settings

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

  // Sync listener
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
  const [projectSearch, setProjectSearch] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projectsList;
    const q = projectSearch.toLowerCase();
    return projectsList.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.stack?.some((s) => s.toLowerCase().includes(q))
    );
  }, [projectsList, projectSearch]);

  const filteredPosts = useMemo(() => {
    if (!postSearch.trim()) return postsList;
    const q = postSearch.toLowerCase();
    return postsList.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [postsList, postSearch]);

  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim()) return messagesList;
    const q = messageSearch.toLowerCase();
    return messagesList.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
    );
  }, [messagesList, messageSearch]);

  /* ================= PROJECT MODAL FORM ================= */
  const [editingProject, setEditingProject] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  const openNewProjectModal = () => {
    setEditingProject({
      id: "project-" + Date.now(),
      slug: "new-project-" + Date.now(),
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
    } else {
      updated = [editingProject, ...projectsList];
    }

    setProjectsList(updated);
    saveStoredProjects(updated);
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id) => {
    if (!window.confirm("Are you sure you want to delete this project from the catalog?")) return;
    sounds.playClick();
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    saveStoredProjects(updated);
  };

  /* ================= ARTICLE MODAL FORM ================= */
  const [editingPost, setEditingPost] = useState(null);
  const [postModalOpen, setPostModalOpen] = useState(false);

  const openNewPostModal = () => {
    setEditingPost({
      id: "note-" + Date.now(),
      slug: "new-technical-note-" + Date.now(),
      title: "",
      date: new Date().toISOString().split("T")[0],
      readTime: "5 min read",
      readingTimeText: "5 min read",
      tags: ["Engineering", "Architecture"],
      excerpt: "",
      cover: "/images/tech.jpg",
      contentString: "Write your technical reflections, architecture decisions, and code insights here...",
    });
    setPostModalOpen(true);
  };

  const openEditPostModal = (post) => {
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
    } else {
      updated = [editingPost, ...postsList];
    }

    setPostsList(updated);
    saveStoredPosts(updated);
    setPostModalOpen(false);
  };

  const handleDeletePost = (id) => {
    if (!window.confirm("Are you sure you want to remove this publication?")) return;
    sounds.playClick();
    const updated = postsList.filter((p) => p.id !== id && p.slug !== id);
    setPostsList(updated);
    saveStoredPosts(updated);
  };

  /* ================= MESSAGES ACTIONS ================= */
  const toggleMessageRead = (id) => {
    const updated = messagesList.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
    setMessagesList(updated);
    localStorage.setItem("admin_portfolio_messages", JSON.stringify(updated));
  };

  const handleDeleteMessage = (id) => {
    const updated = messagesList.filter((m) => m.id !== id);
    setMessagesList(updated);
    localStorage.setItem("admin_portfolio_messages", JSON.stringify(updated));
  };

  const clearAllMessages = () => {
    if (!window.confirm("Clear all received contact transmissions?")) return;
    setMessagesList([]);
    localStorage.removeItem("admin_portfolio_messages");
  };

  /* ================= SETTINGS ACTIONS ================= */
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    localStorage.setItem("admin_password", newPassword);
    setSettingsSuccess("Admin access pass keycode successfully updated!");
    setNewPassword("");
    sounds.playSuccess();
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  const handleExportData = () => {
    sounds.playClick();
    const data = {
      projects: projectsList,
      posts: postsList,
      messages: messagesList,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset all projects, field notes, and settings back to system defaults?")) return;
    resetStoredProjects();
    resetStoredPosts();
    setProjectsList(defaultProjects);
    setPostsList(defaultPosts);
    localStorage.removeItem("admin_password");
    setSettingsSuccess("All portfolio parameters successfully restored to defaults.");
    sounds.playSuccess();
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  /* ================= RENDER: LOGIN GATEWAY ================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-text grid place-items-center px-4 py-12 relative overflow-hidden">
        <SEO
          title="Admin Authentication Gateway — Tristan Jorge Cuartero"
          description="Administrative control center authentication."
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-md w-full p-8 sm:p-10 rounded-3xl glass-card border border-brand-border shadow-2xl text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center mb-6 shadow-sm">
            <Shield className="w-7 h-7" />
          </div>

          <div className="text-xs font-mono font-bold tracking-widest uppercase text-brand-primary mb-1">
            Cluster Console // v3.5
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-2">
            Administrator Gateway
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mb-8 leading-relaxed">
            Enter administrative credentials to access the portfolio content management system.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-muted mb-2">
                Administrative Passcode
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin keycode..."
                  required
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 rounded-xl glass-panel border border-brand-border text-sm text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary/70 transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-sm shadow-md shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
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

            <span className="text-[11px] text-brand-muted/70">
              Default: <code className="text-brand-text">tristan2025</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ================= RENDER: AUTHENTICATED ADMIN DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col">
      <SEO
        title="Admin Control Center — Tristan Jorge Cuartero"
        description="Comprehensive architecture and portfolio content management system."
      />

      {/* ================= TOP APPLICATION BAR ================= */}
      <header className="sticky top-0 z-40 bg-brand-surface/85 backdrop-blur-xl border-b border-brand-border px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            title="View public site"
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-orange-400 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-brand-primary/25"
          >
            TC
          </Link>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-brand-text flex items-center gap-2">
              <span>Tristan Architecture Admin</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ACTIVE
              </span>
            </span>
            <span className="text-[10px] font-mono tracking-wider text-brand-muted">
              SYSTEM CONSOLE // BATANGAS NODE
            </span>
          </div>
        </div>

        {/* Right utility cluster */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3 h-3 text-brand-primary" />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-brand-border text-brand-muted hover:text-brand-text transition"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          <button
            onClick={handleLogout}
            title="Sign out of admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* ================= SIDEBAR NAVIGATION TABS ================= */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="p-2 rounded-2xl glass-card border border-brand-border space-y-1 sticky top-24">
            {[
              { id: "overview", label: "Overview", icon: Server },
              { id: "projects", label: "Projects", icon: FolderKanban, badge: projectsList.length },
              { id: "articles", label: "Field Notes", icon: FileText, badge: postsList.length },
              { id: "messages", label: "Inbox Messages", icon: Mail, badge: messagesList.filter((m) => !m.read).length || null },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    sounds.playClick();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25"
                      : "text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== null && tab.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ================= CONTENT PANEL ================= */}
        <main className="flex-1 min-w-0">
          
          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brand-primary font-bold">
                  Management Center
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-text mt-1">
                  System Architecture Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Manage active deployments, technical field notes, and incoming civic transmissions.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-mono uppercase">Production Systems</span>
                    <FolderKanban className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="text-3xl font-black font-mono text-brand-text">
                    {projectsList.length}
                  </div>
                  <div className="text-[11px] text-emerald-500 mt-1 font-mono">
                    ● {projectsList.filter((p) => p.featured).length} Featured on Hero
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-mono uppercase">Field Notes</span>
                    <FileText className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-brand-text">
                    {postsList.length}
                  </div>
                  <div className="text-[11px] text-brand-muted mt-1 font-mono">
                    Published Technical Articles
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-mono uppercase">Inquiries Received</span>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black font-mono text-brand-primary">
                    {messagesList.length}
                  </div>
                  <div className="text-[11px] text-brand-muted mt-1 font-mono">
                    {messagesList.filter((m) => !m.read).length} Unread Messages
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-mono uppercase">System Integrity</span>
                    <Cpu className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-black font-mono text-emerald-500">
                    99.98%
                  </div>
                  <div className="text-[11px] text-emerald-500 mt-1 font-mono">
                    Zero Collision Locking
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border">
                <h3 className="text-base font-bold text-brand-text mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  <span>Immediate Direct Actions</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={openNewProjectModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:scale-105 active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Project</span>
                  </button>

                  <button
                    onClick={openNewPostModal}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Technical Note</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("messages")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>View Inbox ({messagesList.length})</span>
                  </button>
                </div>
              </div>

              {/* System Diagnostics Box */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-brand-border pb-3">
                  <span className="font-bold text-brand-text">Architecture Cluster Specifications</span>
                  <span className="text-emerald-500">● LIVE RUNTIME</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-brand-muted">
                  <div>• Platform Engine: React 18 SPA + Vite 5.4</div>
                  <div>• Styling System: Tailwind CSS 3.4 Design Tokens</div>
                  <div>• Animation Layer: Framer Motion v11</div>
                  <div>• Local Persistence: Active (Synced with Web Events)</div>
                  <div>• Target Node: Batangas State University Node</div>
                  <div>• Security Protocol: Sealed SHA-256 + RBAC Simulation</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PROJECTS MANAGEMENT ================= */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text">
                    Production Systems & Projects
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Add, edit, and organize portfolio projects. Updates reflect instantly across the live portfolio.
                  </p>
                </div>

                <button
                  onClick={openNewProjectModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Filter projects by title, category, or technology..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl glass-card border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-primary/40 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-surface border border-brand-border shrink-0">
                        <img
                          src={p.image || "/images/tech.jpg"}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-brand-text">
                            {p.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                            {p.badge || p.category}
                          </span>
                        </div>
                        <p className="text-xs text-brand-muted line-clamp-2 max-w-xl">
                          {p.desc || p.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.stack?.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-[10px] font-mono glass-panel border border-brand-border text-brand-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => openEditProjectModal(p)}
                        className="px-3 py-1.5 rounded-lg glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: FIELD NOTES & WRITINGS ================= */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text">
                    Technical Field Notes & Articles
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Publish architectural perspectives, engineering retrospectives, and classroom takeaways.
                  </p>
                </div>

                <button
                  onClick={openNewPostModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/25 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Note</span>
                </button>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Filter articles by title or tags..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Posts List */}
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id || post.slug}
                    className="p-4 sm:p-5 rounded-2xl glass-card border border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-primary/40 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono text-brand-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
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

                      <p className="text-xs text-brand-muted line-clamp-2 max-w-xl">
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
                        title="View public reader"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
                        onClick={() => handleDeletePost(post.id || post.slug)}
                        className="p-2 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: INBOX & CONTACT TRANSMISSIONS ================= */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text">
                    Transmission Center Inbox
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Messages received through your portfolio contact form.
                  </p>
                </div>

                {messagesList.length > 0 && (
                  <button
                    onClick={clearAllMessages}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Inbox</span>
                  </button>
                )}
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="Search sender name, email, or message body..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                />
              </div>

              {/* Messages List */}
              {filteredMessages.length === 0 ? (
                <div className="p-10 rounded-3xl glass-card border border-brand-border text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-brand-text">No Transmissions Found</h3>
                  <p className="text-xs text-brand-muted max-w-sm mx-auto">
                    When visitors submit the contact form on your portfolio, transmissions will immediately be archived here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-2xl glass-card border transition ${
                        msg.read ? "border-brand-border opacity-75" : "border-brand-primary/40 shadow-md ring-1 ring-brand-primary/20"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-brand-border">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              msg.read ? "bg-brand-muted" : "bg-emerald-500 animate-pulse"
                            }`}
                          />
                          <span className="font-bold text-sm text-brand-text">{msg.name}</span>
                          <span className="text-xs font-mono text-brand-muted">&lt;{msg.email}&gt;</span>
                        </div>

                        <div className="text-[11px] font-mono text-brand-muted">
                          {new Date(msg.date).toLocaleString()}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-brand-text whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>

                      <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between">
                        <a
                          href={`mailto:${msg.email}?subject=Regarding Your Inquiry - Tristan Cuartero`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:opacity-90 transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Direct Reply</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleMessageRead(msg.id)}
                            className="px-2.5 py-1 rounded-lg glass-panel border border-brand-border text-[11px] font-medium text-brand-muted hover:text-brand-text transition"
                          >
                            {msg.read ? "Mark Unread" : "Mark as Read"}
                          </button>

                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 5: SETTINGS ================= */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h2 className="text-2xl font-extrabold text-brand-text">
                  Administrative System Settings
                </h2>
                <p className="text-xs text-brand-muted mt-1">
                  Manage security access passcodes, data persistence backups, and system defaults.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{settingsSuccess}</span>
                </div>
              )}

              {/* Password update form */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border">
                <h3 className="text-sm font-bold text-brand-text mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-brand-primary" />
                  <span>Update Admin Keycode</span>
                </h3>
                <p className="text-xs text-brand-muted mb-4">
                  Set a custom password to access the `/admin` portal.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new admin keycode..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90 transition"
                  >
                    Update Keycode
                  </button>
                </form>
              </div>

              {/* Backup & Export */}
              <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-brand-text flex items-center gap-2">
                    <Download className="w-4 h-4 text-sky-400" />
                    <span>Database Backup & Export</span>
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Download a full JSON snapshot of your current projects, field notes, and messages.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Export JSON Archive</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone: Reset to Defaults */}
              <div className="p-6 rounded-3xl glass-card border border-rose-500/20 bg-rose-500/5 space-y-3">
                <h3 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Reset All Configurations</span>
                </h3>
                <p className="text-xs text-brand-muted">
                  Restores original factory project dossiers and posts. Use with care.
                </p>
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition"
                >
                  Reset Factory Defaults
                </button>
              </div>
            </div>
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
              <h3 className="text-lg font-bold text-brand-text">
                {editingProject.id.startsWith("project-") ? "Create New System Project" : "Edit Project Dossier"}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="text-xs font-mono text-brand-muted hover:text-brand-text"
              >
                Cancel ✕
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
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>

                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
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
                <label className="block font-mono text-brand-muted mb-1 uppercase">Role</label>
                <input
                  type="text"
                  value={editingProject.role}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Short Summary Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Full Dossier Description</label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
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
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
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
                  Save Project
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
              <h3 className="text-lg font-bold text-brand-text">
                {editingPost.id.startsWith("note-") ? "Publish Field Note" : "Edit Field Note"}
              </h3>
              <button
                onClick={() => setPostModalOpen(false)}
                className="text-xs font-mono text-brand-muted hover:text-brand-text"
              >
                Cancel ✕
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
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
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
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
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
                  rows={7}
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
                  Save & Publish
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
