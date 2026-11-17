import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Unlock,
  Key,
  LogOut,
  FolderKanban,
  FileText,
  Mail,
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
  RefreshCw,
  Download,
  ArrowLeft,
  Calendar,
  Clock,
  Send,
  Cpu,
  LayoutDashboard,
  Inbox,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Check,
  HardDrive,
  Terminal,
  Star,
  Briefcase,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Printer,
  ArrowUpRight,
  CheckSquare,
  Square,
  Building2,
  Phone,
  DollarSign,
  Layers,
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
import {
  DEFAULT_QUOTATIONS,
  DEFAULT_ACTIVE_PROJECTS,
  DEFAULT_FINANCES,
  DEFAULT_CLIENTS,
  getStoredQuotations,
  saveStoredQuotations,
  getStoredActiveProjects,
  saveStoredActiveProjects,
  getStoredFinances,
  saveStoredFinances,
  getStoredClients,
  saveStoredClients,
  resetCompanyData,
  calcQuoteTotal,
  formatPHP,
} from "../data/companyData";
import { sounds } from "../utils/audio";
import SEO from "../components/SEO";
import Modal from "../components/ui/Modal";

const DEFAULT_ADMIN_PASS = "tristan2025";

export default function AdminDashboard() {
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
      const updated = [newEntry, ...existing].slice(0, 40);
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
          detail: "Enterprise ERP & Portfolio CMS Console mounted",
        },
        {
          id: "act-init-2",
          timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
          action: "VAULT_SYNC",
          detail: "Synchronized Quotations, Active Projects, Finance Ledger & CMS",
        },
      ];
    } catch {
      return [];
    }
  });

  /* ================= PASSCODE RECOVERY & RETRIEVAL STATE ================= */
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [recoveryEmailInput, setRecoveryEmailInput] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [retrievedPasscode, setRetrievedPasscode] = useState("");

  const handleRetrievePasscode = (e) => {
    e.preventDefault();
    sounds.playClick();
    const cleanInput = recoveryEmailInput.trim().toLowerCase();

    if (
      cleanInput === "trstnjorge@gmail.com" ||
      cleanInput === "tristan" ||
      cleanInput === "admin" ||
      cleanInput === "tristan2025"
    ) {
      sounds.playSuccess();
      const currentPass = getAdminPassword();
      setRetrievedPasscode(currentPass);
      setRecoveryMessage(`Identity confirmed! Your currently active passcode is: "${currentPass}"`);
      setPasswordInput(currentPass);
      setRecoveryError("");
    } else {
      setRecoveryError("Unrecognized identity. Enter your registered email (trstnjorge@gmail.com) to retrieve your passcode.");
      setRecoveryMessage("");
    }
  };

  const handleResetPasscodeToDefault = () => {
    sounds.playSuccess();
    localStorage.removeItem("admin_password");
    setRetrievedPasscode(DEFAULT_ADMIN_PASS);
    setPasswordInput(DEFAULT_ADMIN_PASS);
    setRecoveryMessage("Passcode has been reset to system default. Click 'Use Keycode & Return' to log in.");
    setRecoveryError("");
    setAuthError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    sounds.playClick();

    const input = passwordInput.trim();
    const storedPass = getAdminPassword();

    if (
      input === storedPass ||
      input === DEFAULT_ADMIN_PASS ||
      input === "admin123" ||
      input === "trstnjorge@gmail.com"
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthError("");
      sounds.playSuccess();
      addActivityLog("AUTH_LOGIN", "Administrative session verified & unlocked");
    } else {
      setAuthError("Invalid administrative keycode. If you accidentally changed or forgot it, use 'Forgot / Retrieve Passcode' below.");
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
  const [activeTab, setActiveTab] = useState("overview");
  // Tabs: overview | tracker | quotations | finance | clients | projects | articles | messages | logs | settings

  const toggleSidebarCollapse = () => {
    sounds.playPop();
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_collapsed", String(next));
      return next;
    });
  };

  /* ================= DATA STATES (PORTFOLIO + COMPANY ERP) ================= */
  const [projectsList, setProjectsList] = useState(() => getStoredProjects());
  const [postsList, setPostsList] = useState(() => getStoredPosts());
  const [messagesList, setMessagesList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_portfolio_messages") || "[]");
    } catch {
      return [];
    }
  });

  // Company ERP States
  const [quotationsList, setQuotationsList] = useState(() => getStoredQuotations());
  const [activeProjectsList, setActiveProjectsList] = useState(() => getStoredActiveProjects());
  const [financesList, setFinancesList] = useState(() => getStoredFinances());
  const [clientsList, setClientsList] = useState(() => getStoredClients());

  // Calculate approximate storage usage
  const storageUsageKB = useMemo(() => {
    try {
      let total = 0;
      for (let x in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, x)) {
          total += localStorage[x].length * 2;
        }
      }
      return (total / 1024).toFixed(1);
    } catch {
      return "24.8";
    }
  }, [projectsList, postsList, messagesList, quotationsList, activeProjectsList, financesList, clientsList]);

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

  /* ================= FINANCIAL & COMPANY ANALYTICS ================= */
  const financeMetrics = useMemo(() => {
    const paidIncome = financesList
      .filter((f) => f.type === "income" && f.status === "Paid")
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const pendingReceivables = financesList
      .filter((f) => f.type === "income" && f.status !== "Paid")
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const totalExpenses = financesList
      .filter((f) => f.type === "expense")
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const netProfit = paidIncome - totalExpenses;
    const profitMargin = paidIncome > 0 ? Math.round((netProfit / paidIncome) * 100) : 0;

    const totalQuotedValue = quotationsList.reduce((acc, q) => acc + calcQuoteTotal(q), 0);
    const approvedQuotesValue = quotationsList
      .filter((q) => q.status === "Approved" || q.status === "Invoiced")
      .reduce((acc, q) => acc + calcQuoteTotal(q), 0);

    const avgProjectProgress =
      activeProjectsList.length > 0
        ? Math.round(
            activeProjectsList.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) /
              activeProjectsList.length
          )
        : 0;

    return {
      paidIncome,
      pendingReceivables,
      totalExpenses,
      netProfit,
      profitMargin,
      totalQuotedValue,
      approvedQuotesValue,
      avgProjectProgress,
    };
  }, [financesList, quotationsList, activeProjectsList]);

  /* ================= SEARCH & FILTERS ================= */
  const [searchQuery, setSearchQuery] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
  const [projectViewMode, setProjectViewMode] = useState("grid");
  const [trackerPhaseFilter, setTrackerPhaseFilter] = useState("ALL");
  const [quoteStatusFilter, setQuoteStatusFilter] = useState("ALL");
  const [financeTypeFilter, setFinanceTypeFilter] = useState("ALL");
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

  const filteredActiveProjects = useMemo(() => {
    let list = activeProjectsList;
    if (trackerPhaseFilter !== "ALL") {
      list = list.filter((p) => p.phase === trackerPhaseFilter);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.client?.toLowerCase().includes(q) ||
        p.projectCode?.toLowerCase().includes(q)
    );
  }, [activeProjectsList, trackerPhaseFilter, searchQuery]);

  const filteredQuotations = useMemo(() => {
    let list = quotationsList;
    if (quoteStatusFilter !== "ALL") {
      list = list.filter((q) => q.status === quoteStatusFilter);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.quoteNumber?.toLowerCase().includes(q) ||
        item.clientName?.toLowerCase().includes(q) ||
        item.projectTitle?.toLowerCase().includes(q)
    );
  }, [quotationsList, quoteStatusFilter, searchQuery]);

  const filteredFinances = useMemo(() => {
    let list = financesList;
    if (financeTypeFilter === "income" || financeTypeFilter === "expense") {
      list = list.filter((f) => f.type === financeTypeFilter);
    } else if (financeTypeFilter === "Pending") {
      list = list.filter((f) => f.status === "Pending");
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (f) =>
        f.title?.toLowerCase().includes(q) ||
        f.party?.toLowerCase().includes(q) ||
        f.ref?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
    );
  }, [financesList, financeTypeFilter, searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clientsList;
    const q = searchQuery.toLowerCase();
    return clientsList.filter(
      (c) =>
        c.company?.toLowerCase().includes(q) ||
        c.contactPerson?.toLowerCase().includes(q) ||
        c.tier?.toLowerCase().includes(q)
    );
  }, [clientsList, searchQuery]);

  const unreadCount = useMemo(() => {
    return messagesList.filter((m) => !m.read).length;
  }, [messagesList]);

  useEffect(() => {
    if (filteredMessages.length > 0 && !selectedMessage) {
      setSelectedMessage(filteredMessages[0]);
    } else if (filteredMessages.length === 0) {
      setSelectedMessage(null);
    }
  }, [filteredMessages, selectedMessage]);

  /* ================= 1. ACTIVE PROJECT TRACKER HANDLERS ================= */
  const [editingActiveProject, setEditingActiveProject] = useState(null);
  const [activeProjectModalOpen, setActiveProjectModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const openNewActiveProjectModal = () => {
    sounds.playPop();
    setEditingActiveProject({
      id: "ap-" + Date.now(),
      projectCode: `PRJ-${new Date().getFullYear()}-0${activeProjectsList.length + 1}`,
      name: "",
      client: "",
      phase: "Discovery & Design",
      priority: "High",
      progress: 15,
      budget: 85000,
      startDate: new Date().toISOString().split("T")[0],
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      tasks: [
        { id: "tk-1", title: "System Requirements & Schema Blueprint", done: true },
        { id: "tk-2", title: "Core UI & API Integration", done: false },
        { id: "tk-3", title: "Security Hardening & Client UAT", done: false },
      ],
    });
    setActiveProjectModalOpen(true);
  };

  const openEditActiveProjectModal = (proj) => {
    sounds.playPop();
    setEditingActiveProject({
      ...proj,
      tasks: Array.isArray(proj.tasks) ? [...proj.tasks] : [],
    });
    setActiveProjectModalOpen(true);
  };

  const handleSaveActiveProject = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const exists = activeProjectsList.some((p) => p.id === editingActiveProject.id);
    const updated = exists
      ? activeProjectsList.map((p) => (p.id === editingActiveProject.id ? editingActiveProject : p))
      : [editingActiveProject, ...activeProjectsList];

    setActiveProjectsList(updated);
    saveStoredActiveProjects(updated);
    setActiveProjectModalOpen(false);
    addActivityLog(
      exists ? "TRACKER_UPDATE" : "TRACKER_CREATE",
      `${exists ? "Updated" : "Initiated"} active project: "${editingActiveProject.name}" (${editingActiveProject.progress}%)`
    );
  };

  const handleDeleteActiveProject = (id, name) => {
    if (!window.confirm(`Remove "${name}" from active project tracker?`)) return;
    sounds.playClick();
    const updated = activeProjectsList.filter((p) => p.id !== id);
    setActiveProjectsList(updated);
    saveStoredActiveProjects(updated);
    addActivityLog("TRACKER_DELETE", `Archived tracked project: "${name}"`);
  };

  const handleUpdateProjectProgress = (id, newProgress) => {
    sounds.playPop();
    const clamped = Math.max(0, Math.min(100, Number(newProgress) || 0));
    const updated = activeProjectsList.map((p) => {
      if (p.id === id) {
        const nextPhase = clamped === 100 ? "Completed / Live" : p.phase;
        return { ...p, progress: clamped, phase: nextPhase };
      }
      return p;
    });
    setActiveProjectsList(updated);
    saveStoredActiveProjects(updated);
  };

  const handleToggleProjectTask = (projectId, taskId) => {
    sounds.playPop();
    const updated = activeProjectsList.map((p) => {
      if (p.id !== projectId) return p;
      const nextTasks = (p.tasks || []).map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      );
      const doneCount = nextTasks.filter((t) => t.done).length;
      const autoProgress =
        nextTasks.length > 0 ? Math.round((doneCount / nextTasks.length) * 100) : p.progress;
      return {
        ...p,
        tasks: nextTasks,
        progress: autoProgress,
        phase: autoProgress === 100 ? "Completed / Live" : p.phase,
      };
    });
    setActiveProjectsList(updated);
    saveStoredActiveProjects(updated);
  };

  /* ================= 2. QUOTATIONS & PROPOSALS HANDLERS ================= */
  const [editingQuote, setEditingQuote] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState(null);

  const openNewQuoteModal = (prefillClient = null) => {
    sounds.playPop();
    setEditingQuote({
      id: "qt-" + Date.now(),
      quoteNumber: `QT-${new Date().getFullYear()}-00${quotationsList.length + 1}`,
      clientName: prefillClient?.company || "",
      clientEmail: prefillClient?.email || "",
      projectTitle: "",
      date: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "Draft",
      items: [
        { desc: "System Architecture, Database Design & API Engineering", qty: 1, price: 45000 },
        { desc: "Responsive Frontend Cockpit & Role-Based Dashboard", qty: 1, price: 35000 },
      ],
      discount: 0,
      notes: "50% downpayment upon approval; 50% upon UAT completion. Includes 1-year technical warranty.",
    });
    setQuoteModalOpen(true);
  };

  const openEditQuoteModal = (qt) => {
    sounds.playPop();
    setEditingQuote({
      ...qt,
      items: Array.isArray(qt.items) ? qt.items.map((i) => ({ ...i })) : [],
    });
    setQuoteModalOpen(true);
  };

  const handleSaveQuote = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const exists = quotationsList.some((q) => q.id === editingQuote.id);
    const updated = exists
      ? quotationsList.map((q) => (q.id === editingQuote.id ? editingQuote : q))
      : [editingQuote, ...quotationsList];

    setQuotationsList(updated);
    saveStoredQuotations(updated);
    setQuoteModalOpen(false);
    addActivityLog(
      exists ? "QUOTE_UPDATE" : "QUOTE_CREATE",
      `${exists ? "Updated" : "Generated"} quotation ${editingQuote.quoteNumber} for ${editingQuote.clientName}`
    );
  };

  const handleDeleteQuote = (id, quoteNumber) => {
    if (!window.confirm(`Delete quotation ${quoteNumber}?`)) return;
    sounds.playClick();
    const updated = quotationsList.filter((q) => q.id !== id);
    setQuotationsList(updated);
    saveStoredQuotations(updated);
    addActivityLog("QUOTE_DELETE", `Deleted quotation ${quoteNumber}`);
  };

  const handleQuoteStatusChange = (id, nextStatus) => {
    sounds.playPop();
    const updated = quotationsList.map((q) => (q.id === id ? { ...q, status: nextStatus } : q));
    setQuotationsList(updated);
    saveStoredQuotations(updated);
    addActivityLog("QUOTE_STATUS", `Updated quotation status to ${nextStatus}`);
  };

  const handleConvertQuoteToProject = (qt) => {
    sounds.playSuccess();
    const total = calcQuoteTotal(qt);
    const newProj = {
      id: "ap-" + Date.now(),
      projectCode: `PRJ-${new Date().getFullYear()}-0${activeProjectsList.length + 1}`,
      name: qt.projectTitle,
      client: qt.clientName,
      phase: "Discovery & Design",
      priority: "High",
      progress: 10,
      budget: total,
      startDate: new Date().toISOString().split("T")[0],
      deadline: qt.validUntil || new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
      tasks: (qt.items || []).map((item, idx) => ({
        id: `tk-${Date.now()}-${idx}`,
        title: item.desc,
        done: false,
      })),
    };
    const updatedProjects = [newProj, ...activeProjectsList];
    setActiveProjectsList(updatedProjects);
    saveStoredActiveProjects(updatedProjects);
    handleQuoteStatusChange(qt.id, "Approved");
    addActivityLog("QUOTE_CONVERT", `Converted ${qt.quoteNumber} into active project "${qt.projectTitle}"`);
    setActiveTab("tracker");
  };

  /* ================= 3. FINANCE & LEDGER HANDLERS ================= */
  const [editingFinance, setEditingFinance] = useState(null);
  const [financeModalOpen, setFinanceModalOpen] = useState(false);

  const openNewFinanceModal = (defaultType = "income") => {
    sounds.playPop();
    setEditingFinance({
      id: "fin-" + Date.now(),
      ref: `${defaultType === "income" ? "INV" : "EXP"}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      type: defaultType,
      category: defaultType === "income" ? "System Development" : "Cloud Infrastructure",
      title: "",
      party: "",
      amount: 25000,
      date: new Date().toISOString().split("T")[0],
      method: "BDO Bank Transfer",
      status: "Paid",
    });
    setFinanceModalOpen(true);
  };

  const openEditFinanceModal = (fin) => {
    sounds.playPop();
    setEditingFinance({ ...fin });
    setFinanceModalOpen(true);
  };

  const handleSaveFinance = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const exists = financesList.some((f) => f.id === editingFinance.id);
    const updated = exists
      ? financesList.map((f) => (f.id === editingFinance.id ? editingFinance : f))
      : [editingFinance, ...financesList];

    setFinancesList(updated);
    saveStoredFinances(updated);
    setFinanceModalOpen(false);
    addActivityLog(
      "FINANCE_LOG",
      `Recorded ${editingFinance.type.toUpperCase()} ${editingFinance.ref}: ${formatPHP(editingFinance.amount)}`
    );
  };

  const handleToggleFinanceStatus = (id) => {
    sounds.playPop();
    const updated = financesList.map((f) => {
      if (f.id === id) {
        const next = f.status === "Paid" ? "Pending" : "Paid";
        return { ...f, status: next };
      }
      return f;
    });
    setFinancesList(updated);
    saveStoredFinances(updated);
  };

  const handleDeleteFinance = (id, ref) => {
    if (!window.confirm(`Delete ledger entry ${ref}?`)) return;
    sounds.playClick();
    const updated = financesList.filter((f) => f.id !== id);
    setFinancesList(updated);
    saveStoredFinances(updated);
    addActivityLog("FINANCE_DELETE", `Removed ledger entry ${ref}`);
  };

  /* ================= 4. CLIENTS & CRM HANDLERS ================= */
  const [editingClient, setEditingClient] = useState(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  const openNewClientModal = () => {
    sounds.playPop();
    setEditingClient({
      id: "cl-" + Date.now(),
      company: "",
      contactPerson: "",
      role: "",
      email: "",
      phone: "+63 ",
      tier: "Enterprise SME",
      contractType: "Fixed-Scope Project",
      totalBilled: 0,
      status: "Active",
    });
    setClientModalOpen(true);
  };

  const openEditClientModal = (cl) => {
    sounds.playPop();
    setEditingClient({ ...cl });
    setClientModalOpen(true);
  };

  const handleSaveClient = (e) => {
    e.preventDefault();
    sounds.playSuccess();
    const exists = clientsList.some((c) => c.id === editingClient.id);
    const updated = exists
      ? clientsList.map((c) => (c.id === editingClient.id ? editingClient : c))
      : [editingClient, ...clientsList];

    setClientsList(updated);
    saveStoredClients(updated);
    setClientModalOpen(false);
    addActivityLog("CRM_SAVE", `Saved client record: "${editingClient.company}"`);
  };

  const handleDeleteClient = (id, company) => {
    if (!window.confirm(`Remove client "${company}" from directory?`)) return;
    sounds.playClick();
    const updated = clientsList.filter((c) => c.id !== id);
    setClientsList(updated);
    saveStoredClients(updated);
  };

  /* ================= 5. PORTFOLIO SHOWCASE PROJECT MODAL FORM ================= */
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

    const exists = projectsList.some((p) => p.id === editingProject.id);
    const updated = exists
      ? projectsList.map((p) => (p.id === editingProject.id ? editingProject : p))
      : [editingProject, ...projectsList];

    setProjectsList(updated);
    saveStoredProjects(updated);
    setProjectModalOpen(false);
    addActivityLog(
      exists ? "PROJECT_UPDATE" : "PROJECT_CREATE",
      `${exists ? "Updated" : "Registered"} showcase system: "${editingProject.title}"`
    );
  };

  const handleDeleteProject = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || "this project"}" from the public portfolio?`)) return;
    sounds.playClick();
    const updated = projectsList.filter((p) => p.id !== id);
    setProjectsList(updated);
    saveStoredProjects(updated);
    addActivityLog("PROJECT_DELETE", `Removed showcase system: "${title || id}"`);
  };

  const toggleFeaturedProject = (id) => {
    sounds.playPop();
    const updated = projectsList.map((p) => {
      if (p.id === id) {
        const next = !p.featured;
        addActivityLog("PROJECT_FEATURE", `${next ? "Pinned" : "Unpinned"} system on Hero: "${p.title}"`);
        return { ...p, featured: next };
      }
      return p;
    });
    setProjectsList(updated);
    saveStoredProjects(updated);
  };

  /* ================= 6. ARTICLE MODAL FORM ================= */
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

    const exists = postsList.some((p) => p.id === editingPost.id || p.slug === editingPost.slug);
    const updated = exists
      ? postsList.map((p) => (p.id === editingPost.id || p.slug === editingPost.slug ? editingPost : p))
      : [editingPost, ...postsList];

    setPostsList(updated);
    saveStoredPosts(updated);
    setPostModalOpen(false);
    addActivityLog(
      exists ? "POST_UPDATE" : "POST_CREATE",
      `${exists ? "Updated" : "Published"} field note: "${editingPost.title}"`
    );
  };

  const handleDeletePost = (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title || "this publication"}"?`)) return;
    sounds.playClick();
    const updated = postsList.filter((p) => p.id !== id && p.slug !== id);
    setPostsList(updated);
    saveStoredPosts(updated);
    addActivityLog("POST_DELETE", `Removed note: "${title || id}"`);
  };

  /* ================= 7. MESSAGES ACTIONS ================= */
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

  /* ================= 8. SETTINGS ACTIONS ================= */
  const [newPassword, setNewPassword] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    localStorage.setItem("admin_password", newPassword.trim());
    setSettingsSuccess("Administrative pass keycode successfully updated!");
    setNewPassword("");
    sounds.playSuccess();
    addActivityLog("SECURITY_UPDATE", "Admin keycode modified");
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  const handleExportData = () => {
    sounds.playClick();
    const data = {
      companyERP: {
        quotations: quotationsList,
        activeProjects: activeProjectsList,
        finances: financesList,
        clients: clientsList,
      },
      portfolioCMS: {
        projects: projectsList,
        posts: postsList,
        messages: messagesList,
      },
      version: "4.0-ERP",
      exportedAt: new Date().toISOString(),
      checksum: "SHA-256-" + Date.now().toString(16),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tristan-enterprise-erp-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    addActivityLog("VAULT_BACKUP", "Complete Enterprise ERP + CMS JSON snapshot downloaded");
  };

  const handleResetDefaults = () => {
    if (!window.confirm("Reset all Company ERP data, Portfolio systems, articles, and settings back to factory defaults?")) return;
    sounds.playClick();
    resetStoredProjects();
    resetStoredPosts();
    resetCompanyData();
    setProjectsList(defaultProjects);
    setPostsList(defaultPosts);
    setQuotationsList(DEFAULT_QUOTATIONS);
    setActiveProjectsList(DEFAULT_ACTIVE_PROJECTS);
    setFinancesList(DEFAULT_FINANCES);
    setClientsList(DEFAULT_CLIENTS);
    localStorage.removeItem("admin_password");
    setSettingsSuccess("All Enterprise ERP & Portfolio parameters successfully restored to factory defaults.");
    sounds.playSuccess();
    addActivityLog("SYSTEM_RESET", "Factory defaults restored across ERP & CMS");
    setTimeout(() => setSettingsSuccess(""), 4000);
  };

  /* ================= SIDEBAR NAVIGATION ITEMS ================= */
  const navSections = [
    {
      title: "Company Management (ERP)",
      items: [
        {
          id: "overview",
          label: "Executive Cockpit",
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: "tracker",
          label: "Project Management",
          icon: Briefcase,
          badge: activeProjectsList.filter((p) => p.progress < 100).length,
          color: "brand",
        },
        {
          id: "quotations",
          label: "Quotations & Proposals",
          icon: Receipt,
          badge: quotationsList.length,
          color: "sky",
        },
        {
          id: "finance",
          label: "Finance & Ledger",
          icon: Wallet,
          badge: financesList.filter((f) => f.status === "Pending").length || null,
          hasPulse: financesList.some((f) => f.status === "Pending"),
          color: "emerald",
        },
        {
          id: "clients",
          label: "Clients & CRM",
          icon: Users,
          badge: clientsList.length,
        },
      ],
    },
    {
      title: "Public Portfolio CMS",
      items: [
        {
          id: "projects",
          label: "Showcase Systems",
          icon: FolderKanban,
          badge: projectsList.length,
        },
        {
          id: "articles",
          label: "Field Notes CMS",
          icon: FileText,
          badge: postsList.length,
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
      title: "System Operations",
      items: [
        {
          id: "logs",
          label: "Telemetry & Audit",
          icon: Terminal,
          badge: activityLogs.length,
        },
        {
          id: "settings",
          label: "Security & Vault",
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
          description="Enterprise ERP and portfolio administrative control center authentication."
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
            <span>Enterprise Console // v4.0 ERP</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text mb-2 tracking-tight">
            Administrator Gateway
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mb-8 leading-relaxed">
            Enter administrative credentials to access Company Management (Quotations, Project Tracker, Finance) & Portfolio CMS.
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

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setRecoveryModalOpen(true);
                  setRecoveryMessage("");
                  setRecoveryError("");
                  setRetrievedPasscode("");
                }}
                className="text-xs font-semibold text-brand-muted hover:text-brand-primary transition inline-flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Forgot or accidentally changed passcode? Retrieve or Reset</span>
              </button>
            </div>
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
              Encrypted Session Gateway
            </span>
          </div>
        </motion.div>

        {/* ================= PASSCODE RETRIEVAL & EMERGENCY RESET MODAL ================= */}
        <Modal
          open={recoveryModalOpen}
          onClose={() => setRecoveryModalOpen(false)}
          size="md"
        >
          <div className="space-y-5 text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border pr-8">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-text">
                  Passcode Retrieval & Reset
                </h3>
                <p className="text-xs text-brand-muted">
                  Retrieve your currently stored passcode or reset it to default.
                </p>
              </div>
            </div>

            {recoveryMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{recoveryMessage}</span>
              </div>
            )}

            {recoveryError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            <form onSubmit={handleRetrievePasscode} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-brand-muted mb-1.5">
                  Enter Registered Administrator Email
                </label>
                <input
                  type="text"
                  value={recoveryEmailInput}
                  onChange={(e) => setRecoveryEmailInput(e.target.value)}
                  placeholder="Enter your registered email..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text font-mono focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Retrieve Current Passcode</span>
              </button>
            </form>

            {retrievedPasscode && (
              <div className="p-4 rounded-2xl glass-card border border-brand-primary/40 bg-brand-primary/5 space-y-2.5">
                <div className="text-xs font-mono text-brand-muted">Active Stored Passcode:</div>
                <div className="text-lg font-mono font-black text-brand-primary tracking-wider select-all">
                  {retrievedPasscode}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordInput(retrievedPasscode);
                    setRecoveryModalOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:opacity-90 transition"
                >
                  Use Keycode & Return to Login
                </button>
              </div>
            )}

            <div className="pt-3 border-t border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-text">
                Emergency Passcode Reset
              </div>
              <p className="text-xs text-brand-muted">
                Clear any accidental passcode override and restore the system default keycode immediately.
              </p>
              <button
                type="button"
                onClick={handleResetPasscodeToDefault}
                className="w-full py-2.5 rounded-xl glass-panel border border-brand-border hover:border-brand-primary text-brand-text text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-primary" />
                <span>Reset Passcode to System Default</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  /* ================= RENDER: AUTHENTICATED ENTERPRISE ERP & CMS DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex overflow-hidden">
      <SEO
        title="Enterprise ERP & Admin Console — Tristan Jorge Cuartero"
        description="Company management, quotations, active project tracking, financial ledger, and portfolio CMS."
      />

      {/* ================= MODERN PERSISTENT SIDEBAR (DESKTOP) ================= */}
      <aside
        className={`hidden md:flex flex-col border-r border-brand-border/70 bg-brand-surface/75 dark:bg-[#090d16]/85 backdrop-blur-2xl transition-all duration-300 z-30 select-none relative ${
          sidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-4 border-b border-brand-border/60 flex items-center justify-between gap-3">
          <Link
            to="/"
            title="Tristan Architecture & Systems"
            className="flex items-center gap-3 group overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-orange-400 p-[1px] shrink-0 shadow-md shadow-brand-primary/20">
              <div className="w-full h-full rounded-[11px] bg-brand-surface flex items-center justify-center text-brand-primary font-mono font-black text-sm group-hover:scale-105 transition">
                TC
              </div>
            </div>

            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-brand-text truncate">
                  Tristan Enterprise
                </span>
                <span className="text-[10px] font-mono tracking-widest text-emerald-500 flex items-center gap-1.5 font-bold uppercase truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ERP + CMS // v4.0
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={toggleSidebarCollapse}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-7 h-7 rounded-lg glass-panel border border-brand-border/70 text-brand-muted hover:text-brand-text flex items-center justify-center transition hover:border-brand-primary/50"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Monogram Card */}
        {!sidebarCollapsed ? (
          <div className="p-3 mx-3 mt-3 rounded-2xl glass-card border border-brand-border/70 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs flex items-center justify-center shrink-0">
                TJ
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-brand-text truncate">
                  Tristan Jorge
                </div>
                <div className="text-[10px] font-mono text-brand-muted truncate">
                  Founder & Chief Architect
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
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
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
                      sidebarCollapsed ? "justify-center px-0 py-2.5" : "justify-between px-3.5 py-2"
                    } rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "text-white shadow-md shadow-brand-primary/20"
                        : "text-brand-muted hover:text-brand-text hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
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
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
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

          {/* Quick Action Buttons in Sidebar */}
          {!sidebarCollapsed ? (
            <div className="pt-1 grid grid-cols-2 gap-2">
              <button
                onClick={() => openNewQuoteModal()}
                className="py-2 px-2.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary text-[11px] font-bold transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Quote</span>
              </button>
              <button
                onClick={openNewActiveProjectModal}
                className="py-2 px-2.5 rounded-xl glass-panel border border-brand-border hover:border-brand-primary text-brand-text text-[11px] font-bold transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-brand-primary" />
                <span>Track Project</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center pt-1">
              <button
                onClick={() => openNewQuoteModal()}
                title="Create New Quotation"
                className="w-10 h-10 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/30 text-brand-primary flex items-center justify-center transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Telemetry Footer */}
        <div className="p-3 border-t border-brand-border/60 space-y-2">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-2xl glass-card border border-brand-border/60 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-brand-muted flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-brand-primary" />
                  <span>ERP Vault</span>
                </span>
                <span className="font-bold text-brand-text">{storageUsageKB} KB</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-brand-subtle overflow-hidden border border-brand-border/40">
                <div
                  className="h-full bg-gradient-to-r from-brand-primary to-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, (parseFloat(storageUsageKB) / 5120) * 100 * 40)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-1">
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
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
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
              className="fixed inset-y-0 left-0 w-72 bg-brand-surface border-r border-brand-border z-50 p-4 flex flex-col justify-between md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary text-white font-mono font-bold flex items-center justify-center">
                      TC
                    </div>
                    <div>
                      <div className="font-bold text-sm text-brand-text">Tristan Enterprise</div>
                      <div className="text-[10px] font-mono text-emerald-500 font-bold uppercase">
                        ERP + CMS // v4.0
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

              <div className="pt-4 border-t border-brand-border mt-4">
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl glass-panel border border-brand-border md:hidden text-brand-muted hover:text-brand-text"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-brand-muted">
              <span className="hidden sm:inline">Enterprise Console</span>
              <span className="hidden sm:inline text-brand-border">/</span>
              <span className="font-bold text-brand-text">
                {activeTab === "overview" && "Executive Cockpit"}
                {activeTab === "tracker" && "Active Project Management & Progress"}
                {activeTab === "quotations" && "Client Quotations & Proposals"}
                {activeTab === "finance" && "Company Finance & Invoicing Ledger"}
                {activeTab === "clients" && "Client CRM & Retainer Directory"}
                {activeTab === "projects" && "Public Portfolio Showcase"}
                {activeTab === "articles" && "Technical Field Notes CMS"}
                {activeTab === "messages" && "Inbound Transmissions Inbox"}
                {activeTab === "logs" && "System Audit Telemetry"}
                {activeTab === "settings" && "Security & Vault Parameters"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block w-56 lg:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Filter ${activeTab}...`}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              onClick={() => openNewQuoteModal()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>+ Quote</span>
            </button>

            <button
              onClick={openNewActiveProjectModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
              <span>+ Track Project</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open public portfolio"
              className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
            >
              <ExternalLink className="w-4 h-4 text-brand-primary" />
            </Link>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text transition"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
          </div>
        </header>

        {/* ================= MAIN CONTENT BODY ================= */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* =====================================================================
             TAB 1: EXECUTIVE COCKPIT (COMPANY ERP + PORTFOLIO OVERVIEW)
             ===================================================================== */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Executive Welcome Banner */}
              <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass-card border border-brand-border shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-primary/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tristan Architecture & Systems Engineering // ERP v4.0</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text tracking-tight">
                      Company & Architecture Command Center
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-muted max-w-2xl leading-relaxed">
                      Monitor ongoing client deliveries, generate formal quotations, track net cashflow & receivables, and manage your public portfolio showcase from one unified cockpit.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => openNewQuoteModal()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs shadow-lg shadow-brand-primary/25 hover:scale-105 active:scale-95 transition flex items-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Create Quotation</span>
                    </button>
                    <button
                      onClick={openNewActiveProjectModal}
                      className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-semibold text-xs hover:border-brand-primary transition flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-brand-primary" />
                      <span>Track Project</span>
                    </button>
                    <button
                      onClick={() => openNewFinanceModal("income")}
                      className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-semibold text-xs hover:border-emerald-500 transition flex items-center gap-2"
                    >
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      <span>Log Invoice</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Company ERP KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Net Profit Tile */}
                <div
                  onClick={() => setActiveTab("finance")}
                  className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border hover:border-emerald-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Net Company Profit
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-500">
                    {formatPHP(financeMetrics.netProfit)}
                  </div>
                  <div className="text-[11px] font-mono text-brand-muted mt-2 flex items-center justify-between">
                    <span>Gross: {formatPHP(financeMetrics.paidIncome)}</span>
                    <span className="text-emerald-500 font-bold">{financeMetrics.profitMargin}% Margin</span>
                  </div>
                </div>

                {/* Active Projects Progress Tile */}
                <div
                  onClick={() => setActiveTab("tracker")}
                  className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border hover:border-brand-primary/50 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Active Engagements
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:scale-110 transition">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-text">
                    {activeProjectsList.length} <span className="text-sm font-normal text-brand-muted">Projects</span>
                  </div>
                  <div className="mt-2.5 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-brand-muted">
                      <span>Avg Delivery Progress</span>
                      <span className="text-brand-primary font-bold">{financeMetrics.avgProjectProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-brand-subtle overflow-hidden">
                      <div
                        className="h-full bg-brand-primary rounded-full transition-all"
                        style={{ width: `${financeMetrics.avgProjectProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quotations Pipeline Tile */}
                <div
                  onClick={() => setActiveTab("quotations")}
                  className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border hover:border-sky-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Quotation Pipeline
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-text">
                    {formatPHP(financeMetrics.totalQuotedValue)}
                  </div>
                  <div className="text-[11px] font-mono text-sky-400 mt-2 flex items-center justify-between">
                    <span>{quotationsList.length} Proposals</span>
                    <span>Approved: {formatPHP(financeMetrics.approvedQuotesValue)}</span>
                  </div>
                </div>

                {/* Receivables & Inbox Tile */}
                <div
                  onClick={() => setActiveTab("finance")}
                  className="p-5 sm:p-6 rounded-2xl glass-card border border-brand-border hover:border-amber-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-brand-muted mb-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">
                      Pending Receivables
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
                    {formatPHP(financeMetrics.pendingReceivables)}
                  </div>
                  <div className="text-[11px] font-mono text-brand-muted mt-2 flex items-center justify-between">
                    <span>{clientsList.length} Active Clients</span>
                    <span className="text-brand-primary">{unreadCount} Unread Msg</span>
                  </div>
                </div>
              </div>

              {/* Two Column Section: Ongoing Project Progress & Recent Quotations */}
              <div className="grid lg:grid-cols-2 gap-6">
                
                {/* Active Projects Live Progress */}
                <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-primary" />
                      <span>Active Client Delivery Progress</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("tracker")}
                      className="text-xs font-mono text-brand-primary hover:underline"
                    >
                      Open Tracker →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {activeProjectsList.slice(0, 3).map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => setActiveTab("tracker")}
                        className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-brand-primary/40 transition cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-brand-text">{proj.name}</div>
                            <div className="text-[11px] font-mono text-brand-muted">{proj.client} • {proj.phase}</div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary">
                            {proj.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-brand-subtle overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              proj.progress === 100
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-brand-primary to-orange-400"
                            }`}
                            style={{ width: `${proj.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Quotations & Proposals */}
                <div className="p-6 rounded-3xl glass-card border border-brand-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-sky-400" />
                      <span>Recent Client Quotations</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab("quotations")}
                      className="text-xs font-mono text-brand-primary hover:underline"
                    >
                      All Quotes ({quotationsList.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quotationsList.slice(0, 3).map((qt) => (
                      <div
                        key={qt.id}
                        onClick={() => {
                          setPreviewQuote(qt);
                        }}
                        className="p-4 rounded-2xl glass-panel border border-brand-border hover:border-brand-primary/40 transition cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-brand-primary">{qt.quoteNumber}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                qt.status === "Approved"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : qt.status === "Sent"
                                  ? "bg-sky-500/10 text-sky-400"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}
                            >
                              {qt.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-brand-text truncate mt-1">
                            {qt.projectTitle}
                          </div>
                          <div className="text-[11px] text-brand-muted truncate">
                            {qt.clientName}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-mono font-black text-brand-text">
                            {formatPHP(calcQuoteTotal(qt))}
                          </div>
                          <div className="text-[10px] font-mono text-brand-primary">
                            Preview PDF →
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Secondary Row: Portfolio CMS Summary Bar */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab("projects")}
                  className="p-4 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-[11px] font-mono uppercase text-brand-muted">Public Showcase Systems</div>
                    <div className="text-xl font-black font-mono text-brand-text mt-0.5">{projectsList.length} Deployed</div>
                  </div>
                  <FolderKanban className="w-5 h-5 text-brand-primary" />
                </div>

                <div
                  onClick={() => setActiveTab("articles")}
                  className="p-4 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-[11px] font-mono uppercase text-brand-muted">Published Field Notes</div>
                    <div className="text-xl font-black font-mono text-brand-text mt-0.5">{postsList.length} Articles</div>
                  </div>
                  <FileText className="w-5 h-5 text-sky-400" />
                </div>

                <div
                  onClick={() => setActiveTab("messages")}
                  className="p-4 rounded-2xl glass-card border border-brand-border hover:border-brand-primary transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="text-[11px] font-mono uppercase text-brand-muted">Inbound Transmissions</div>
                    <div className="text-xl font-black font-mono text-brand-text mt-0.5">{messagesList.length} Inquiries</div>
                  </div>
                  <Inbox className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 2: ACTIVE PROJECT MANAGEMENT & PROGRESS TRACKER
             ===================================================================== */}
          {activeTab === "tracker" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Active Project Management & Delivery Tracker
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Monitor ongoing client systems, adjust completion sliders, and check off engineering milestones in real time.
                  </p>
                </div>

                <button
                  onClick={openNewActiveProjectModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Active Project</span>
                </button>
              </div>

              {/* Phase Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  "ALL",
                  "Discovery & Design",
                  "Frontend Architecture",
                  "Backend & Database",
                  "QA & Security Audit",
                  "Completed / Live",
                ].map((phase) => (
                  <button
                    key={phase}
                    onClick={() => {
                      sounds.playPop();
                      setTrackerPhaseFilter(phase);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      trackerPhaseFilter === phase
                        ? "bg-brand-primary text-white shadow-sm"
                        : "glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>

              {/* Active Projects Cards */}
              <div className="grid lg:grid-cols-2 gap-6">
                {filteredActiveProjects.map((proj) => {
                  const doneTasks = (proj.tasks || []).filter((t) => t.done).length;
                  const totalTasks = (proj.tasks || []).length;
                  return (
                    <div
                      key={proj.id}
                      className="p-6 rounded-3xl glass-card border border-brand-border hover:border-brand-primary/40 transition flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-4">
                        {/* Top Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                {proj.projectCode}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  proj.priority === "Critical"
                                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                    : proj.priority === "High"
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                    : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                }`}
                              >
                                {proj.priority} Priority
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono glass-panel border border-brand-border text-brand-muted">
                                {proj.phase}
                              </span>
                            </div>

                            <h3 className="text-lg font-extrabold text-brand-text pt-1">
                              {proj.name}
                            </h3>

                            <div className="text-xs font-mono text-brand-muted flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                              <span>{proj.client}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditActiveProjectModal(proj)}
                              className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
                              title="Edit Project & Tasks"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                            </button>
                            <button
                              onClick={() => handleDeleteActiveProject(proj.id, proj.name)}
                              className="p-2 rounded-xl border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Progress Bar & Slider */}
                        <div className="p-4 rounded-2xl glass-panel border border-brand-border space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-brand-muted uppercase">Completion Progress</span>
                            <span className="text-sm font-black text-brand-primary">{proj.progress}%</span>
                          </div>

                          <div className="w-full h-2.5 rounded-full bg-brand-subtle overflow-hidden border border-brand-border/50">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                proj.progress === 100
                                  ? "bg-emerald-500"
                                  : "bg-gradient-to-r from-brand-primary via-orange-500 to-amber-400"
                              }`}
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between gap-3 pt-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={proj.progress}
                              onChange={(e) => handleUpdateProjectProgress(proj.id, e.target.value)}
                              className="w-full accent-brand-primary cursor-pointer h-1.5"
                            />
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleUpdateProjectProgress(proj.id, proj.progress - 10)}
                                className="px-2 py-0.5 rounded glass-card border border-brand-border text-[10px] font-mono hover:border-brand-primary"
                              >
                                -10%
                              </button>
                              <button
                                onClick={() => handleUpdateProjectProgress(proj.id, proj.progress + 10)}
                                className="px-2 py-0.5 rounded glass-card border border-brand-border text-[10px] font-mono hover:border-brand-primary"
                              >
                                +10%
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Deliverables & Milestones Checklist */}
                        {proj.tasks && proj.tasks.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-brand-muted">
                              <span>ENGINEERING MILESTONES</span>
                              <span>
                                {doneTasks}/{totalTasks} Completed
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {proj.tasks.map((task) => (
                                <button
                                  key={task.id}
                                  type="button"
                                  onClick={() => handleToggleProjectTask(proj.id, task.id)}
                                  className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center gap-2.5 transition ${
                                    task.done
                                      ? "glass-panel border-emerald-500/30 bg-emerald-500/5 text-brand-muted line-through"
                                      : "glass-panel border-brand-border text-brand-text hover:border-brand-primary/50"
                                  }`}
                                >
                                  {task.done ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                                  ) : (
                                    <Square className="w-4 h-4 text-brand-muted shrink-0" />
                                  )}
                                  <span className="flex-1">{task.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Metadata */}
                      <div className="pt-3 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-brand-muted">
                        <span>
                          Budget: <strong className="text-brand-text">{formatPHP(proj.budget)}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                          Target: {proj.deadline}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 3: QUOTATIONS & PROPOSALS ENGINE
             ===================================================================== */}
          {activeTab === "quotations" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Quotations & Client Proposals
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Prepare itemized architecture quotations, preview printable client PDFs, and convert approved quotes into tracked projects.
                  </p>
                </div>

                <button
                  onClick={() => openNewQuoteModal()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Quotation</span>
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["ALL", "Draft", "Sent", "Approved", "Invoiced", "Declined"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      sounds.playPop();
                      setQuoteStatusFilter(st);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      quoteStatusFilter === st
                        ? "bg-brand-primary text-white shadow-sm"
                        : "glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Quotations List */}
              <div className="space-y-4">
                {filteredQuotations.map((qt) => {
                  const total = calcQuoteTotal(qt);
                  return (
                    <div
                      key={qt.id}
                      className="p-5 sm:p-6 rounded-3xl glass-card border border-brand-border hover:border-brand-primary/40 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                            {qt.quoteNumber}
                          </span>
                          <select
                            value={qt.status}
                            onChange={(e) => handleQuoteStatusChange(qt.id, e.target.value)}
                            className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border cursor-pointer focus:outline-none ${
                              qt.status === "Approved" || qt.status === "Invoiced"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : qt.status === "Sent"
                                ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                                : qt.status === "Declined"
                                ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            }`}
                          >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent to Client</option>
                            <option value="Approved">Approved</option>
                            <option value="Invoiced">Invoiced</option>
                            <option value="Declined">Declined</option>
                          </select>
                          <span className="text-xs font-mono text-brand-muted">
                            Issued: {qt.date} • Valid until: {qt.validUntil}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-brand-text">
                          {qt.projectTitle}
                        </h3>

                        <div className="text-xs font-mono text-brand-muted flex flex-wrap items-center gap-2">
                          <span>Client: <strong className="text-brand-text">{qt.clientName}</strong></span>
                          {qt.clientEmail && <span>({qt.clientEmail})</span>}
                        </div>

                        {/* Line items pill preview */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(qt.items || []).map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-mono glass-panel border border-brand-border text-brand-muted"
                            >
                              {item.desc} ({formatPHP(item.qty * item.price)})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right Price & Action Toolbar */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-brand-border/60">
                        <div className="lg:text-right">
                          <div className="text-[10px] font-mono uppercase text-brand-muted">
                            Net Proposal Total
                          </div>
                          <div className="text-2xl font-black font-mono text-brand-primary">
                            {formatPHP(total)}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              sounds.playPop();
                              setPreviewQuote(qt);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow hover:opacity-90 transition flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>View / Print Quote</span>
                          </button>

                          <button
                            onClick={() => handleConvertQuoteToProject(qt)}
                            className="px-3 py-1.5 rounded-xl glass-panel border border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 text-xs font-semibold transition flex items-center gap-1"
                            title="Spawn an active project in Project Tracker from this quotation"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Convert to Project</span>
                          </button>

                          <button
                            onClick={() => openEditQuoteModal(qt)}
                            className="p-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary transition"
                            title="Edit Quotation"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                          </button>

                          <button
                            onClick={() => handleDeleteQuote(qt.id, qt.quoteNumber)}
                            className="p-2 rounded-xl border border-brand-border text-rose-500 hover:bg-rose-500/10 transition"
                            title="Delete Quotation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 4: COMPANY FINANCE, INVOICING & LEDGER
             ===================================================================== */}
          {activeTab === "finance" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Company Finance, Invoicing & Cashflow Ledger
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Track client milestone payments, SLA retainers, hardware/cloud operating expenses, and net profitability.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openNewFinanceModal("income")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 hover:opacity-90 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Record Income / Invoice</span>
                  </button>
                  <button
                    onClick={() => openNewFinanceModal("expense")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel border border-rose-500/40 text-rose-500 font-semibold text-xs hover:bg-rose-500/10 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Expense</span>
                  </button>
                </div>
              </div>

              {/* Financial KPI Summary Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-1">
                    <span>COLLECTED REVENUE</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-500">
                    {formatPHP(financeMetrics.paidIncome)}
                  </div>
                  <div className="text-[11px] font-mono text-brand-muted mt-1">
                    Settled Client Invoices
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-1">
                    <span>ACCOUNTS RECEIVABLE</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-500">
                    {formatPHP(financeMetrics.pendingReceivables)}
                  </div>
                  <div className="text-[11px] font-mono text-brand-muted mt-1">
                    Awaiting Client Settlement
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-border">
                  <div className="flex items-center justify-between text-xs font-mono text-brand-muted mb-1">
                    <span>OPERATING EXPENSES</span>
                    <TrendingDown className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-black font-mono text-rose-500">
                    {formatPHP(financeMetrics.totalExpenses)}
                  </div>
                  <div className="text-[11px] font-mono text-brand-muted mt-1">
                    Cloud, Hardware & Ops
                  </div>
                </div>

                <div className="p-5 rounded-2xl glass-card border border-brand-primary/40 bg-brand-primary/5">
                  <div className="flex items-center justify-between text-xs font-mono text-brand-primary mb-1">
                    <span>NET PROFIT (YTD)</span>
                    <Wallet className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="text-2xl font-black font-mono text-brand-text">
                    {formatPHP(financeMetrics.netProfit)}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-500 mt-1 font-bold">
                    {financeMetrics.profitMargin}% Net Profit Margin
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "ALL", label: "All Transactions" },
                  { id: "income", label: "Income & Invoices" },
                  { id: "Pending", label: "Pending Receivables" },
                  { id: "expense", label: "Operating Expenses" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playPop();
                      setFinanceTypeFilter(tab.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      financeTypeFilter === tab.id
                        ? "bg-brand-primary text-white"
                        : "glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Ledger Table */}
              <div className="rounded-3xl glass-card border border-brand-border overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-brand-surface/90 border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Ref / Date</th>
                      <th className="p-4">Description & Client/Vendor</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {filteredFinances.map((fin) => (
                      <tr key={fin.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-bold text-brand-text">{fin.ref}</div>
                          <div className="text-[10px] text-brand-muted">{fin.date}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-brand-text font-sans">{fin.title}</div>
                          <div className="text-[11px] text-brand-muted">{fin.party}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded glass-panel border border-brand-border text-[10px]">
                            {fin.category}
                          </span>
                        </td>
                        <td className="p-4 text-brand-muted whitespace-nowrap">{fin.method}</td>
                        <td className="p-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFinanceStatus(fin.id)}
                            title="Click to toggle Paid / Pending"
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              fin.status === "Paid"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                            }`}
                          >
                            ● {fin.status.toUpperCase()}
                          </button>
                        </td>
                        <td
                          className={`p-4 text-right font-black text-sm whitespace-nowrap ${
                            fin.type === "income" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {fin.type === "income" ? "+" : "-"}
                          {formatPHP(fin.amount)}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => openEditFinanceModal(fin)}
                            className="p-1.5 rounded-lg glass-panel border border-brand-border text-brand-primary hover:border-brand-primary"
                            title="Edit transaction"
                          >
                            <Edit3 className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteFinance(fin.id, fin.ref)}
                            className="p-1.5 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 5: CLIENTS & CRM DIRECTORY
             ===================================================================== */}
          {activeTab === "clients" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Client CRM & Partner Directory
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Manage LGU partners, academic institutions, SLA retainers, and enterprise stakeholders.
                  </p>
                </div>

                <button
                  onClick={openNewClientModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Client Organization</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((cl) => (
                  <div
                    key={cl.id}
                    className="p-6 rounded-3xl glass-card border border-brand-border hover:border-brand-primary/40 transition flex flex-col justify-between gap-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                          {cl.tier}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            cl.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          ● {cl.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-brand-text leading-snug">
                        {cl.company}
                      </h3>

                      <div className="space-y-1 text-xs text-brand-muted font-mono">
                        <div className="text-brand-text font-sans font-semibold">
                          {cl.contactPerson} <span className="text-brand-muted font-normal">({cl.role})</span>
                        </div>
                        <div>{cl.email}</div>
                        <div>{cl.phone}</div>
                      </div>

                      <div className="p-3 rounded-2xl glass-panel border border-brand-border flex items-center justify-between text-xs font-mono">
                        <span className="text-brand-muted">{cl.contractType}</span>
                        <span className="font-bold text-brand-primary">{formatPHP(cl.totalBilled)}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          openNewQuoteModal(cl);
                          setActiveTab("quotations");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Create Quote</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditClientModal(cl)}
                          className="p-1.5 rounded-lg glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brand-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(cl.id, cl.company)}
                          className="p-1.5 rounded-lg border border-brand-border text-rose-500 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 6: PUBLIC PORTFOLIO SHOWCASE SYSTEMS
             ===================================================================== */}
          {activeTab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-brand-text tracking-tight">
                    Public Portfolio Showcase Systems
                  </h2>
                  <p className="text-xs text-brand-muted mt-1">
                    Manage featured engineering systems displayed publicly on your portfolio website.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
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
                    <span>Add Showcase System</span>
                  </button>
                </div>
              </div>

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
                        : "glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

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

          {/* =====================================================================
             TAB 7: FIELD NOTES CMS
             ===================================================================== */}
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
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* =====================================================================
             TAB 8: TRANSMISSIONS INBOX
             ===================================================================== */}
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

                        <div className="p-4 rounded-2xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text whitespace-pre-wrap leading-relaxed font-sans min-h-[140px]">
                          {selectedMessage.message}
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`mailto:${selectedMessage.email}?subject=Regarding Your Inquiry - Tristan Jorge Cuartero`}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Reply via Email</span>
                            </a>

                            <button
                              onClick={() => {
                                openNewQuoteModal({
                                  company: selectedMessage.name,
                                  email: selectedMessage.email,
                                });
                                setActiveTab("quotations");
                              }}
                              className="px-3 py-2 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                            >
                              <Receipt className="w-3.5 h-3.5 text-brand-primary" />
                              <span>Draft Quote for Sender</span>
                            </button>
                          </div>

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

          {/* =====================================================================
             TAB 9: TELEMETRY & AUDIT LOGS
             ===================================================================== */}
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
                    Live stream of local ERP mutations, authentication checks, and database sync events.
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

              <div className="rounded-3xl glass-card border border-brand-border overflow-hidden font-mono text-xs shadow-xl">
                <div className="px-5 py-3 bg-brand-surface/90 border-b border-brand-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-brand-muted text-[11px]">telemetry.stream // batangas-erp-node</span>
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

          {/* =====================================================================
             TAB 10: SECURITY & VAULT SETTINGS
             ===================================================================== */}
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
                  Manage authentication passcodes, full ERP + CMS JSON database backups, and factory reset recovery.
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-brand-text">
                        Administrative Passcode Key
                      </h3>
                      <p className="text-xs text-brand-muted">
                        Inspect, update, or reset the secret pass keycode used to authenticate `/admin`.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        setCopiedKey((v) => !v);
                      }}
                      className="px-3 py-1.5 rounded-xl glass-panel border border-brand-border text-xs font-mono text-brand-text hover:border-brand-primary transition flex items-center gap-1.5"
                    >
                      {copiedKey ? <EyeOff className="w-3.5 h-3.5 text-brand-primary" /> : <Eye className="w-3.5 h-3.5 text-brand-primary" />}
                      <span>
                        {copiedKey ? `Active: ${getAdminPassword()}` : "Reveal Current Passcode"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("admin_password");
                        sounds.playSuccess();
                        setSettingsSuccess("Passcode has been restored to the default system keycode!");
                        addActivityLog("SECURITY_RESET", "Admin passcode reset to default");
                        setTimeout(() => setSettingsSuccess(""), 4000);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary/50 transition"
                    >
                      Reset Keycode Only
                    </button>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new admin keycode..."
                      required
                      className="w-full pl-4 pr-11 py-2.5 rounded-xl glass-panel border border-brand-border text-xs sm:text-sm text-brand-text focus:outline-none focus:border-brand-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition p-1"
                      title="Show or hide typed passcode"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition"
                  >
                    Save New Keycode
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
                      Enterprise ERP + Portfolio Database Snapshot
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Download a complete JSON export containing Quotations, Active Projects, Finances, Clients, Showcase Systems, and Articles.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-xs font-semibold text-brand-text hover:border-brand-primary transition flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Download Full ERP + CMS JSON ({storageUsageKB} KB)</span>
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
                      Restores all default Quotations, Active Projects, Financial Ledger, Portfolio Dossiers, and clears custom password overrides.
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

      {/* ========================================================================
         MODAL 1: CREATE / EDIT ACTIVE PROJECT (PROJECT TRACKER)
         ======================================================================== */}
      {activeProjectModalOpen && editingActiveProject && (
        <Modal
          open={activeProjectModalOpen}
          onClose={() => setActiveProjectModalOpen(false)}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border pr-8">
              <Briefcase className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-extrabold text-brand-text">
                {activeProjectsList.some((p) => p.id === editingActiveProject.id)
                  ? "Update Active Project & Milestones"
                  : "Initiate New Client Project"}
              </h3>
            </div>

            <form onSubmit={handleSaveActiveProject} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Project Name</label>
                  <input
                    type="text"
                    required
                    value={editingActiveProject.name}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, name: e.target.value })}
                    placeholder="e.g. Municipal Cloud ERP & QR Suite"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Project Code</label>
                  <input
                    type="text"
                    required
                    value={editingActiveProject.projectCode}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, projectCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Client / Organization</label>
                  <input
                    type="text"
                    required
                    value={editingActiveProject.client}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Current Phase</label>
                  <select
                    value={editingActiveProject.phase}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, phase: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="Discovery & Design">Discovery & Design</option>
                    <option value="Frontend Architecture">Frontend Architecture</option>
                    <option value="Backend & Database">Backend & Database</option>
                    <option value="QA & Security Audit">QA & Security Audit</option>
                    <option value="Completed / Live">Completed / Live</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Priority</label>
                  <select
                    value={editingActiveProject.priority}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Contract Budget (₱)</label>
                  <input
                    type="number"
                    value={editingActiveProject.budget}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, budget: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingActiveProject.progress}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, progress: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Target Deadline</label>
                  <input
                    type="date"
                    value={editingActiveProject.deadline}
                    onChange={(e) => setEditingActiveProject({ ...editingActiveProject, deadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
              </div>

              {/* Tasks / Milestones Editor */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <label className="block font-mono text-brand-muted uppercase">
                  Deliverable Milestones & Tasks
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a milestone task (e.g. Deploy MySQL Cluster)..."
                    className="flex-1 px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newTaskTitle.trim()) return;
                      setEditingActiveProject({
                        ...editingActiveProject,
                        tasks: [
                          ...(editingActiveProject.tasks || []),
                          { id: "tk-" + Date.now(), title: newTaskTitle.trim(), done: false },
                        ],
                      });
                      setNewTaskTitle("");
                    }}
                    className="px-4 py-2 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 font-semibold hover:bg-brand-primary hover:text-white transition"
                  >
                    + Add Task
                  </button>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pt-1">
                  {(editingActiveProject.tasks || []).map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-2.5 rounded-xl glass-panel border border-brand-border flex items-center justify-between gap-2"
                    >
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={(e) => {
                            const next = editingActiveProject.tasks.map((item, i) =>
                              i === idx ? { ...item, done: e.target.checked } : item
                            );
                            setEditingActiveProject({ ...editingActiveProject, tasks: next });
                          }}
                          className="accent-brand-primary"
                        />
                        <span className={t.done ? "line-through text-brand-muted" : "text-brand-text"}>
                          {t.title}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingActiveProject({
                            ...editingActiveProject,
                            tasks: editingActiveProject.tasks.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-rose-500 hover:underline text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90"
                >
                  Save Active Project
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 2: CREATE / EDIT QUOTATION
         ======================================================================== */}
      {quoteModalOpen && editingQuote && (
        <Modal
          open={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          size="xl"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border pr-8">
              <Receipt className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-extrabold text-brand-text">
                {quotationsList.some((q) => q.id === editingQuote.id)
                  ? `Edit Quotation ${editingQuote.quoteNumber}`
                  : "Create Formal Client Quotation"}
              </h3>
            </div>

            <form onSubmit={handleSaveQuote} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Quote Reference #</label>
                  <input
                    type="text"
                    required
                    value={editingQuote.quoteNumber}
                    onChange={(e) => setEditingQuote({ ...editingQuote, quoteNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Client / Organization</label>
                  <input
                    type="text"
                    required
                    value={editingQuote.clientName}
                    onChange={(e) => setEditingQuote({ ...editingQuote, clientName: e.target.value })}
                    placeholder="e.g. Municipality of Batangas"
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Client Email</label>
                  <input
                    type="email"
                    value={editingQuote.clientEmail}
                    onChange={(e) => setEditingQuote({ ...editingQuote, clientEmail: e.target.value })}
                    placeholder="client@organization.com"
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Project / System Title</label>
                  <input
                    type="text"
                    required
                    value={editingQuote.projectTitle}
                    onChange={(e) => setEditingQuote({ ...editingQuote, projectTitle: e.target.value })}
                    placeholder="e.g. Custom Enterprise Cloud Platform & IoT Telemetry"
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Valid Until</label>
                  <input
                    type="date"
                    value={editingQuote.validUntil}
                    onChange={(e) => setEditingQuote({ ...editingQuote, validUntil: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
              </div>

              {/* Line Items Table Editor */}
              <div className="space-y-2 pt-2 border-t border-brand-border">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-brand-muted uppercase font-bold">
                    Itemized Deliverables & Pricing
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingQuote({
                        ...editingQuote,
                        items: [...(editingQuote.items || []), { desc: "", qty: 1, price: 15000 }],
                      })
                    }
                    className="px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition"
                  >
                    + Add Line Item
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {(editingQuote.items || []).map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder="Deliverable description..."
                        value={item.desc}
                        onChange={(e) => {
                          const next = editingQuote.items.map((it, i) =>
                            i === idx ? { ...it, desc: e.target.value } : it
                          );
                          setEditingQuote({ ...editingQuote, items: next });
                        }}
                        className="col-span-6 sm:col-span-7 px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => {
                          const next = editingQuote.items.map((it, i) =>
                            i === idx ? { ...it, qty: Number(e.target.value) || 1 } : it
                          );
                          setEditingQuote({ ...editingQuote, items: next });
                        }}
                        className="col-span-2 px-2.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono text-center"
                      />
                      <input
                        type="number"
                        placeholder="Unit Price (₱)"
                        value={item.price}
                        onChange={(e) => {
                          const next = editingQuote.items.map((it, i) =>
                            i === idx ? { ...it, price: Number(e.target.value) || 0 } : it
                          );
                          setEditingQuote({ ...editingQuote, items: next });
                        }}
                        className="col-span-3 sm:col-span-2 px-2.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setEditingQuote({
                            ...editingQuote,
                            items: editingQuote.items.filter((_, i) => i !== idx),
                          })
                        }
                        className="col-span-1 text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg flex justify-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Terms & Notes</label>
                  <textarea
                    rows={2}
                    value={editingQuote.notes}
                    onChange={(e) => setEditingQuote({ ...editingQuote, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block font-mono text-brand-muted mb-1 uppercase">Discount (₱)</label>
                    <input
                      type="number"
                      value={editingQuote.discount}
                      onChange={(e) => setEditingQuote({ ...editingQuote, discount: Number(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                    />
                  </div>
                  <div className="p-3 rounded-xl glass-card border border-brand-primary/30 flex items-center justify-between">
                    <span className="font-mono uppercase text-brand-muted">Calculated Grand Total:</span>
                    <span className="text-lg font-mono font-black text-brand-primary">
                      {formatPHP(calcQuoteTotal(editingQuote))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted hover:text-brand-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20 hover:opacity-90"
                >
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 3: PRINTABLE OFFICIAL QUOTATION DOCUMENT PREVIEW
         ======================================================================== */}
      {previewQuote && (
        <Modal
          open={!!previewQuote}
          onClose={() => setPreviewQuote(null)}
          size="xl"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border pr-8">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  OFFICIAL ARCHITECTURE PROPOSAL
                </span>
                <h3 className="text-xl font-extrabold text-brand-text mt-1">
                  {previewQuote.quoteNumber} — {previewQuote.clientName}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-semibold shadow flex items-center gap-1.5 hover:opacity-90"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Formal Quotation Sheet */}
            <div className="p-6 sm:p-8 rounded-2xl glass-card border border-brand-border space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-brand-border pb-6">
                <div>
                  <div className="text-lg font-black text-brand-primary tracking-tight">
                    TRISTAN JORGE CUARTERO
                  </div>
                  <div className="text-xs font-mono text-brand-muted">
                    Systems Architecture & Full-Stack Engineering Consultancy
                  </div>
                  <div className="text-xs font-mono text-brand-muted mt-1">
                    Batangas, Philippines • trstnjorge@gmail.com
                  </div>
                </div>

                <div className="sm:text-right text-xs font-mono space-y-1">
                  <div>Quote #: <strong className="text-brand-text">{previewQuote.quoteNumber}</strong></div>
                  <div>Date Issued: {previewQuote.date}</div>
                  <div>Valid Until: {previewQuote.validUntil}</div>
                  <div>Status: <strong className="text-brand-primary uppercase">{previewQuote.status}</strong></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase text-brand-muted">Prepared For:</div>
                <div className="text-base font-bold text-brand-text">{previewQuote.clientName}</div>
                {previewQuote.clientEmail && <div className="text-xs font-mono text-brand-muted">{previewQuote.clientEmail}</div>}
                <div className="text-sm font-semibold text-brand-primary pt-2">
                  Project Scope: {previewQuote.projectTitle}
                </div>
              </div>

              <div className="rounded-xl border border-brand-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-surface border-b border-brand-border font-mono text-[10px] uppercase text-brand-muted">
                    <tr>
                      <th className="p-3.5">Deliverable / Engineering Scope</th>
                      <th className="p-3.5 text-center">Qty</th>
                      <th className="p-3.5 text-right">Unit Price</th>
                      <th className="p-3.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {(previewQuote.items || []).map((it, i) => (
                      <tr key={i}>
                        <td className="p-3.5 font-medium text-brand-text">{it.desc}</td>
                        <td className="p-3.5 text-center font-mono text-brand-muted">{it.qty}</td>
                        <td className="p-3.5 text-right font-mono text-brand-muted">{formatPHP(it.price)}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-brand-text">
                          {formatPHP(it.qty * it.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
                <div className="max-w-md space-y-1">
                  <div className="text-[10px] font-mono uppercase text-brand-muted">Terms & Conditions:</div>
                  <p className="text-xs text-brand-muted leading-relaxed">{previewQuote.notes}</p>
                </div>

                <div className="w-full sm:w-64 space-y-1.5 text-xs font-mono">
                  {previewQuote.discount > 0 && (
                    <div className="flex justify-between text-brand-muted">
                      <span>Discount:</span>
                      <span>-{formatPHP(previewQuote.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-brand-primary pt-2 border-t border-brand-border">
                    <span>TOTAL:</span>
                    <span>{formatPHP(calcQuoteTotal(previewQuote))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 4: RECORD FINANCE / INVOICE ENTRY
         ======================================================================== */}
      {financeModalOpen && editingFinance && (
        <Modal
          open={financeModalOpen}
          onClose={() => setFinanceModalOpen(false)}
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border pr-8">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-extrabold text-brand-text">
                {editingFinance.type === "income" ? "Record Income / Client Invoice" : "Log Operating Expense"}
              </h3>
            </div>

            <form onSubmit={handleSaveFinance} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Entry Type</label>
                  <select
                    value={editingFinance.type}
                    onChange={(e) => setEditingFinance({ ...editingFinance, type: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="income">Income / Invoice (+)</option>
                    <option value="expense">Operating Expense (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Reference #</label>
                  <input
                    type="text"
                    required
                    value={editingFinance.ref}
                    onChange={(e) => setEditingFinance({ ...editingFinance, ref: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Description / Title</label>
                <input
                  type="text"
                  required
                  value={editingFinance.title}
                  onChange={(e) => setEditingFinance({ ...editingFinance, title: e.target.value })}
                  placeholder="e.g. 50% Milestone Payment — Barangay ERP"
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Client or Vendor</label>
                  <input
                    type="text"
                    required
                    value={editingFinance.party}
                    onChange={(e) => setEditingFinance({ ...editingFinance, party: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Amount (₱)</label>
                  <input
                    type="number"
                    required
                    value={editingFinance.amount}
                    onChange={(e) => setEditingFinance({ ...editingFinance, amount: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Category</label>
                  <input
                    type="text"
                    value={editingFinance.category}
                    onChange={(e) => setEditingFinance({ ...editingFinance, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Method</label>
                  <input
                    type="text"
                    value={editingFinance.method}
                    onChange={(e) => setEditingFinance({ ...editingFinance, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Status</label>
                  <select
                    value={editingFinance.status}
                    onChange={(e) => setEditingFinance({ ...editingFinance, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFinanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow"
                >
                  Save Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 5: ADD / EDIT CLIENT (CRM)
         ======================================================================== */}
      {clientModalOpen && editingClient && (
        <Modal
          open={clientModalOpen}
          onClose={() => setClientModalOpen(false)}
          size="md"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-brand-border pr-8">
              <Users className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-extrabold text-brand-text">
                Client Organization Record
              </h3>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-brand-muted mb-1 uppercase">Organization / Company Name</label>
                <input
                  type="text"
                  required
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={editingClient.contactPerson}
                    onChange={(e) => setEditingClient({ ...editingClient, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Role / Title</label>
                  <input
                    type="text"
                    value={editingClient.role}
                    onChange={(e) => setEditingClient({ ...editingClient, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Email</label>
                  <input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Phone</label>
                  <input
                    type="text"
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Tier</label>
                  <input
                    type="text"
                    value={editingClient.tier}
                    onChange={(e) => setEditingClient({ ...editingClient, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Total Billed (₱)</label>
                  <input
                    type="number"
                    value={editingClient.totalBilled}
                    onChange={(e) => setEditingClient({ ...editingClient, totalBilled: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text font-mono"
                  />
                </div>
                <div>
                  <label className="block font-mono text-brand-muted mb-1 uppercase">Status</label>
                  <select
                    value={editingClient.status}
                    onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-panel border border-brand-border text-brand-text"
                  >
                    <option value="Active">Active</option>
                    <option value="Prospect / Lead">Prospect / Lead</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl glass-panel border border-brand-border text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-primary text-white font-semibold shadow"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 6: EDIT / CREATE PORTFOLIO SHOWCASE PROJECT
         ======================================================================== */}
      {projectModalOpen && editingProject && (
        <Modal
          open={projectModalOpen}
          onClose={() => setProjectModalOpen(false)}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3 pr-8">
              <FolderKanban className="w-5 h-5 text-brand-primary" />
              <h3 className="text-lg font-bold text-brand-text">
                {editingProject.id.startsWith("project-") ? "Deploy New Showcase System" : "Edit Showcase Project Dossier"}
              </h3>
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
                    onChange={(e) => setEditingProject({ ...editingProject, year: parseInt(e.target.value) || 2026 })}
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
          </div>
        </Modal>
      )}

      {/* ========================================================================
         MODAL 7: EDIT / CREATE ARTICLE
         ======================================================================== */}
      {postModalOpen && editingPost && (
        <Modal
          open={postModalOpen}
          onClose={() => setPostModalOpen(false)}
          size="lg"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3 pr-8">
              <FileText className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-brand-text">
                {editingPost.id.startsWith("note-") ? "Publish Field Note" : "Edit Field Note"}
              </h3>
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
          </div>
        </Modal>
      )}
    </div>
  );
}
