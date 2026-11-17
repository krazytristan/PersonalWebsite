/* ============================================================================
   TRISTAN ARCHITECTURE & SYSTEMS ENGINEERING — COMPANY ERP DATA LAYER
   Provides persistent localStorage state + reactive event syncing for:
   1. Quotations & Proposals Engine
   2. Active Project Management & Progress Tracker
   3. Corporate Finance, Invoicing & Expense Ledger
   4. Client CRM & Retainer Directory
   ============================================================================ */

export const DEFAULT_QUOTATIONS = [
  {
    id: "qt-101",
    quoteNumber: "QT-2026-001",
    clientName: "LGU Barangay San Isidro Council",
    clientEmail: "council.sanisidro@batangas.gov.ph",
    projectTitle: "Paperless Barangay Cloud ERP & QR Document Verification Suite",
    date: "2026-10-15",
    validUntil: "2026-11-30",
    status: "Approved", // Draft | Sent | Approved | Invoiced | Declined
    items: [
      { desc: "System Architecture & Normalized MySQL Database Schema", qty: 1, price: 35000 },
      { desc: "Resident Registry & Blotter Case Management Module", qty: 1, price: 45000 },
      { desc: "Cryptographic SHA-256 QR Clearance Generator & Scanner", qty: 1, price: 30000 },
      { desc: "On-Site Staff Training, Cloud Deployment & 1-Year SLA", qty: 1, price: 25000 },
    ],
    discount: 5000,
    notes: "Includes RA 10173 Data Privacy compliance audit and automated daily encrypted backups.",
  },
  {
    id: "qt-102",
    quoteNumber: "QT-2026-002",
    clientName: "Batangas Academic Innovation Center",
    clientEmail: "it.director@batangas-edu.org",
    projectTitle: "High-Concurrency Laboratory Reservation & RFID Attendance Engine",
    date: "2026-10-28",
    validUntil: "2026-12-15",
    status: "Sent",
    items: [
      { desc: "Real-Time Conflict-Free Scheduling & Seat Map UI (React 18)", qty: 1, price: 40000 },
      { desc: "ESP32 RFID Terminal Firmware & WebSocket Telemetry API", qty: 3, price: 15000 },
      { desc: "Role-Based Faculty & Dean Analytics Cockpit", qty: 1, price: 30000 },
    ],
    discount: 0,
    notes: "Hardware terminals include custom 3D-printed enclosures and PoE power adapters.",
  },
  {
    id: "qt-103",
    quoteNumber: "QT-2026-003",
    clientName: "Southern Luzon Cold-Chain Logistics Inc.",
    clientEmail: "ops@sllogistics.com.ph",
    projectTitle: "Industrial IoT Warehouse Temperature & Humidity Alert Platform",
    date: "2026-11-05",
    validUntil: "2026-12-05",
    status: "Draft",
    items: [
      { desc: "ESP32 Industrial Sensor Nodes (DHT22 + LoRa Mesh)", qty: 6, price: 8500 },
      { desc: "Cloud Telemetry Ingestion Server & SMS/Email Alert Engine", qty: 1, price: 48000 },
      { desc: "Live Warehouse Floorplan Heatmap Dashboard", qty: 1, price: 32000 },
    ],
    discount: 6000,
    notes: "50% mobilization downpayment upon contract signing; 50% upon UAT sign-off.",
  },
];

export const DEFAULT_ACTIVE_PROJECTS = [
  {
    id: "ap-201",
    projectCode: "PRJ-2026-01",
    name: "Barangay Cloud ERP & QR Verification Rollout",
    client: "LGU Barangay San Isidro Council",
    phase: "QA & Security Audit", // Discovery & Design | Frontend Architecture | Backend & Database | QA & Security Audit | Completed / Live
    priority: "Critical", // Critical | High | Standard
    progress: 85,
    budget: 130000,
    startDate: "2026-09-10",
    deadline: "2026-11-25",
    repoUrl: "https://github.com/krazytristan",
    tasks: [
      { id: "t-1", title: "Relational MySQL Schema & Indexing", done: true },
      { id: "t-2", title: "RBAC Authentication & Session Hardening", done: true },
      { id: "t-3", title: "SHA-256 QR Certificate Print Engine", done: true },
      { id: "t-4", title: "Final On-Site LGU Staff UAT & Handover", done: false },
    ],
  },
  {
    id: "ap-202",
    projectCode: "PRJ-2026-02",
    name: "iLab v2.5 Multi-Campus Reservation Cluster",
    client: "Batangas Academic Innovation Center",
    phase: "Backend & Database",
    priority: "High",
    progress: 60,
    budget: 115000,
    startDate: "2026-10-01",
    deadline: "2026-12-10",
    repoUrl: "https://github.com/krazytristan",
    tasks: [
      { id: "t-5", title: "Zero-Collision Slot Locking Algorithm", done: true },
      { id: "t-6", title: "Interactive Lab Floorplan Seat Selector", done: true },
      { id: "t-7", title: "ESP32 RFID Door Lock Relay Integration", done: false },
      { id: "t-8", title: "Automated CSV/PDF Semester Utilization Reports", done: false },
    ],
  },
  {
    id: "ap-203",
    projectCode: "PRJ-2026-03",
    name: "AMATrack Campus Event QR Attendance Suite",
    client: "Student Affairs & Academic Council",
    phase: "Completed / Live",
    priority: "Standard",
    progress: 100,
    budget: 75000,
    startDate: "2026-07-15",
    deadline: "2026-09-30",
    repoUrl: "https://github.com/krazytristan",
    tasks: [
      { id: "t-9", title: "High-Speed Camera QR Scanner PWA", done: true },
      { id: "t-10", title: "Offline-First IndexedDB Sync Queue", done: true },
      { id: "t-11", title: "Real-Time Department Attendance Leaderboard", done: true },
    ],
  },
];

export const DEFAULT_FINANCES = [
  {
    id: "fin-301",
    ref: "INV-2026-088",
    type: "income", // income | expense
    category: "GovTech Contract",
    title: "50% Mobilization Downpayment — Barangay Cloud ERP",
    party: "LGU Barangay San Isidro Council",
    amount: 65000,
    date: "2026-09-15",
    method: "LandBank / Check",
    status: "Paid", // Paid | Pending | Overdue
  },
  {
    id: "fin-302",
    ref: "INV-2026-094",
    type: "income",
    category: "System Development",
    title: "Full Settlement — AMATrack QR Attendance Suite",
    party: "Student Affairs & Academic Council",
    amount: 75000,
    date: "2026-10-02",
    method: "BDO Bank Transfer",
    status: "Paid",
  },
  {
    id: "fin-303",
    ref: "INV-2026-102",
    type: "income",
    category: "GovTech Contract",
    title: "Final 50% Milestone Billing — Barangay Cloud ERP",
    party: "LGU Barangay San Isidro Council",
    amount: 65000,
    date: "2026-11-20",
    method: "LandBank / Check",
    status: "Pending",
  },
  {
    id: "fin-304",
    ref: "INV-2026-105",
    type: "income",
    category: "SLA Retainer",
    title: "Q4 Cloud Hosting & Database Maintenance Retainer",
    party: "Batangas Academic Innovation Center",
    amount: 24000,
    date: "2026-11-01",
    method: "GCash Business",
    status: "Paid",
  },
  {
    id: "fin-305",
    ref: "EXP-2026-031",
    type: "expense",
    category: "Cloud Infrastructure",
    title: "Production VPS Cluster, Managed MySQL & Domain Renewals",
    party: "DigitalOcean / Cloudflare",
    amount: 14500,
    date: "2026-10-10",
    method: "Corporate Visa",
    status: "Paid",
  },
  {
    id: "fin-306",
    ref: "EXP-2026-039",
    type: "expense",
    category: "IoT Hardware",
    title: "ESP32 Boards, RFID Readers, Relays & Enclosures Batch",
    party: "CircuitRocks Philippines",
    amount: 18200,
    date: "2026-10-25",
    method: "GCash Business",
    status: "Paid",
  },
];

export const DEFAULT_CLIENTS = [
  {
    id: "cl-401",
    company: "LGU Barangay San Isidro Council",
    contactPerson: "Hon. Roberto Mendoza",
    role: "Barangay Chairman / Administrator",
    email: "council.sanisidro@batangas.gov.ph",
    phone: "+63 917 552 8810",
    tier: "GovTech / LGU",
    contractType: "Project + 1-Yr SLA",
    totalBilled: 130000,
    status: "Active",
  },
  {
    id: "cl-402",
    company: "Batangas Academic Innovation Center",
    contactPerson: "Dr. Elena Villanueva",
    role: "Director of Computing Laboratories",
    email: "it.director@batangas-edu.org",
    phone: "+63 918 334 9021",
    tier: "Academic Partner",
    contractType: "Annual SLA Retainer",
    totalBilled: 139000,
    status: "Active",
  },
  {
    id: "cl-403",
    company: "Southern Luzon Cold-Chain Logistics Inc.",
    contactPerson: "Engr. Marco Reyes",
    role: "VP of Warehouse Operations",
    email: "ops@sllogistics.com.ph",
    phone: "+63 920 881 4419",
    tier: "Enterprise SME",
    contractType: "Proposal Stage",
    totalBilled: 0,
    status: "Prospect / Lead",
  },
];

/* ================= STORAGE HELPERS ================= */
function loadKey(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
  }
  return fallback;
}

function saveKey(key, eventName, list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(eventName, { detail: list }));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
}

export const getStoredQuotations = () => loadKey("admin_company_quotations", DEFAULT_QUOTATIONS);
export const saveStoredQuotations = (list) => saveKey("admin_company_quotations", "quotations-updated", list);

export const getStoredActiveProjects = () => loadKey("admin_company_active_projects", DEFAULT_ACTIVE_PROJECTS);
export const saveStoredActiveProjects = (list) => saveKey("admin_company_active_projects", "active-projects-updated", list);

export const getStoredFinances = () => loadKey("admin_company_finances", DEFAULT_FINANCES);
export const saveStoredFinances = (list) => saveKey("admin_company_finances", "finances-updated", list);

export const getStoredClients = () => loadKey("admin_company_clients", DEFAULT_CLIENTS);
export const saveStoredClients = (list) => saveKey("admin_company_clients", "clients-updated", list);

export function resetCompanyData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin_company_quotations");
  localStorage.removeItem("admin_company_active_projects");
  localStorage.removeItem("admin_company_finances");
  localStorage.removeItem("admin_company_clients");
}

export function calcQuoteTotal(q) {
  if (!q || !Array.isArray(q.items)) return 0;
  const sub = q.items.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  return Math.max(0, sub - (Number(q.discount) || 0));
}

export function formatPHP(amount) {
  const num = Number(amount) || 0;
  return "₱" + num.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
