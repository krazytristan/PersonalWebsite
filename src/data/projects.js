export const projects = [
  {
    id: "ilab-system",
    slug: "ilab-reservation-system",

    /* ================= CORE ================= */
    title: "iLab Reservation System",
    shortTitle: "iLab System",
    badge: "Capstone Project",

    desc: "PC reservation, maintenance tracking, and admin dashboard system for computer laboratories.",
    description:
      "A full-featured laboratory management platform with real-time PC availability, maintenance tracking, and role-based admin dashboards.",

    /* ================= VISUALS ================= */
    image: "/images/projects/ilab.jpg",
    heroImage: "/images/projects/ilab.jpg",
    fallbackImage: "/images/projects/fallback.jpg",
    imageAlt: "iLab Reservation System dashboard",

    gallery: [
      "/images/projects/ilab.jpg",
      "/images/projects/ilab-2.jpg",
      "/images/projects/ilab-3.jpg",
    ],

    video: null,

    /* ================= META ================= */
    year: 2025,
    duration: "2024 – 2025",
    role: "Lead Developer",

    type: "project",
    featured: true,
    order: 1,

    /* ================= DESIGN ================= */
    accent: "from-indigo-500 via-purple-500 to-cyan-400",

    motion: {
      direction: "diagonal-up",
      intensity: "high",
    },

    ui: {
      theme: "glass",
    },

    /* ================= CONTENT ================= */
    tags: ["Reservation", "Admin", "UX"],
    stack: ["PHP", "MySQL", "AJAX", "Tailwind"],

    highlights: [
      "Real-time PC availability tracking",
      "Conflict-safe reservation logic",
      "Admin notifications & maintenance logs",
    ],

    timeline: [
      { title: "Planning", note: "Requirements analysis & system design" },
      { title: "Development", note: "Backend, dashboard, and reservation logic" },
      { title: "Testing", note: "User testing & edge-case handling" },
      { title: "Deployment", note: "Production setup and final defense" },
    ],

    outcomes: [
      "Improved lab utilization efficiency",
      "Reduced manual reservation conflicts",
    ],

    metrics: {
      users: "300+ students",
      uptime: "99.9%",
    },

    cta: {
      demo: null,
      repo: null,
      caseStudy: null,
    },
  },

  {
    id: "barangay-system",
    slug: "barangay-information-system",
    title: "Barangay Information Management System",
    shortTitle: "Barangay System",
    badge: "GovTech System",

    desc: "Cloud-based system for certificates, announcements, residents, and automated email delivery.",
    description:
      "A government-ready information system that automates certificate generation, announcements, resident records, and email delivery.",

    image: "/images/projects/barangay.jpg",
    heroImage: "/images/projects/barangay.jpg",
    fallbackImage: "/images/projects/fallback.jpg",
    imageAlt: "Barangay Information Management System",

    gallery: [
      "/images/projects/barangay.jpg",
      "/images/projects/barangay-2.jpg",
    ],

    video: null,

    year: 2025,
    duration: "2025",
    role: "Full-Stack Developer",

    type: "project",
    featured: true,
    order: 2,

    accent: "from-emerald-500 via-teal-400 to-cyan-400",

    motion: {
      direction: "diagonal-down",
      intensity: "medium",
    },

    ui: {
      theme: "glass",
    },

    tags: ["Cloud", "GovTech", "Automation"],
    stack: ["PHP", "MySQL", "Tailwind", "PHPMailer"],

    highlights: [
      "Automated certificate generation (PDF)",
      "Email notifications with attachments",
      "Resident & request management dashboard",
    ],

    timeline: [
      { title: "Design", note: "Workflow and document templates" },
      { title: "Implementation", note: "Core modules & admin dashboard" },
      { title: "Automation", note: "Email + PDF delivery integration" },
    ],

    outcomes: [
      "Faster certificate processing",
      "Reduced manual paperwork",
    ],

    metrics: {
      certificates: "1,000+ generated",
      response: "Instant delivery",
    },

    cta: {
      demo: null,
      repo: null,
      caseStudy: null,
    },
  },

  {
    id: "librarysys",
    slug: "librarysys-management",
    title: "LibrarySys",
    shortTitle: "LibrarySys",
    badge: "Academic System",

    desc: "Library management system with barcode-based attendance, analytics, and admin controls.",
    description:
      "A complete library platform featuring barcode attendance, inventory management, and usage analytics.",

    image: "/images/projects/librarysys.jpg",
    heroImage: "/images/projects/librarysys.jpg",
    fallbackImage: "/images/projects/fallback.jpg",
    imageAlt: "LibrarySys management dashboard",

    gallery: [
      "/images/projects/librarysys.jpg",
      "/images/projects/librarysys-2.jpg",
    ],

    video: null,

    year: 2024,
    duration: "2024",
    role: "Full-Stack Developer",

    type: "project",
    featured: true,
    order: 3,

    accent: "from-rose-500 via-pink-500 to-fuchsia-400",

    motion: {
      direction: "diagonal-up",
      intensity: "medium",
    },

    ui: {
      theme: "glass",
    },

    tags: ["PHP", "MySQL", "Barcode", "UX"],
    stack: ["PHP", "MySQL", "JavaScript", "Tailwind"],

    highlights: [
      "Barcode-based student attendance",
      "Book inventory & borrowing system",
      "Admin analytics dashboard",
    ],

    timeline: [
      { title: "System Design", note: "Database & access planning" },
      { title: "Development", note: "Attendance & inventory modules" },
      { title: "Optimization", note: "Analytics and admin reports" },
    ],

    metrics: {
      scans: "5,000+",
      accuracy: "High reliability",
    },

    cta: {
      demo: null,
      repo: null,
      caseStudy: null,
    },
  },

  {
    id: "amatrack",
    slug: "amatrack-attendance",
    title: "AMATrack",
    shortTitle: "AMATrack",
    badge: "Professional Experience",

    desc: "Attendance and scheduling platform with real-time dashboards for academic institutions.",
    description:
      "An academic attendance and scheduling system with real-time dashboards and role-based access.",

    image: "/images/projects/amatrack.jpg",
    heroImage: "/images/projects/amatrack.jpg",
    fallbackImage: "/images/projects/fallback.jpg",
    imageAlt: "AMATrack academic dashboard",

    gallery: ["/images/projects/amatrack.jpg"],

    video: null,

    year: 2023,
    duration: "2023",
    role: "System Designer & Developer",

    type: "experience",
    featured: true,
    order: 4,

    accent: "from-amber-500 via-orange-400 to-rose-400",

    motion: {
      direction: "diagonal-down",
      intensity: "low",
    },

    ui: {
      theme: "glass",
    },

    tags: ["JavaScript", "Dashboard", "Admin"],
    stack: ["JavaScript", "PHP", "MySQL"],

    highlights: [
      "Real-time attendance monitoring",
      "Schedule conflict detection",
      "Role-based access control",
    ],

    timeline: [
      { title: "Requirement Analysis", note: "Academic scheduling needs" },
      { title: "Dashboard Build", note: "Live data visualization" },
      { title: "Deployment", note: "Institution rollout" },
    ],

    metrics: {
      classes: "50+",
      instructors: "30+",
    },

    cta: {
      demo: null,
      repo: null,
      caseStudy: null,
    },
  },

  {
    id: "wificonnect",
    slug: "wifi-connect-iot",
    title: "WiFi Connect",
    shortTitle: "WiFi Connect",
    badge: "IoT Research Project",

    desc: "IoT-based smart waste and connectivity system with cloud monitoring.",
    description:
      "An IoT system using ESP32 devices with cloud dashboards and REST API integration.",

    image: "/images/projects/wificonnect.jpg",
    heroImage: "/images/projects/wificonnect.jpg",
    fallbackImage: "/images/projects/fallback.jpg",
    imageAlt: "WiFi Connect IoT dashboard",

    gallery: ["/images/projects/wificonnect.jpg"],

    video: null,

    year: 2022,
    duration: "2022",
    role: "IoT & Backend Developer",

    type: "experience",
    featured: false,
    order: 5,

    accent: "from-sky-500 via-cyan-400 to-teal-400",

    motion: {
      direction: "diagonal-up",
      intensity: "low",
    },

    ui: {
      theme: "glass",
    },

    tags: ["IoT", "Cloud", "APIs"],
    stack: ["ESP32", "Firebase", "REST API"],

    highlights: [
      "ESP32 sensor integration",
      "Cloud-based monitoring dashboard",
      "REST API data synchronization",
    ],

    timeline: [
      { title: "Research", note: "IoT architecture & feasibility" },
      { title: "Prototyping", note: "ESP32 integration & testing" },
      { title: "Deployment", note: "Cloud monitoring setup" },
    ],

    metrics: {
      devices: "Multiple nodes",
      latency: "Near real-time",
    },

    cta: {
      demo: null,
      repo: null,
      caseStudy: null,
    },
  },
];
