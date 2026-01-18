export const projects = [
  {
    id: "ilab-system",
    title: "iLab Reservation System",
    desc: "PC reservation, maintenance tracking, and admin dashboard system for computer laboratories.",
    description:
      "PC reservation, maintenance tracking, and admin dashboard system for computer laboratories.",
    image: "/images/projects/ilab.jpg",
    video: null, // optional hover preview
    year: "2025",
    role: "Lead Developer",
    type: "project",
    order: 1,

    featured: true,

    tags: ["Reservation", "Admin", "UX"],
    stack: ["PHP", "MySQL", "AJAX", "Tailwind"],

    highlights: [
      "Real-time PC availability tracking",
      "Conflict-safe reservation logic",
      "Admin notifications & maintenance logs",
    ],

    metrics: {
      users: "300+ students",
      uptime: "99.9%",
    },

    demo: null, // live demo URL
    repo: null, // GitHub URL
    link: null,
  },

  {
    id: "barangay-system",
    title: "Barangay Information Management System",
    desc: "Cloud-based system for certificates, announcements, residents, and automated email delivery.",
    description:
      "Cloud-based system for certificates, announcements, residents, and automated email delivery.",
    image: "/images/projects/barangay.jpg",
    video: null,
    year: "2025",
    role: "Full-Stack Developer",
    type: "project",
    order: 2,

    featured: true,

    tags: ["Cloud", "GovTech", "Automation"],
    stack: ["PHP", "MySQL", "Tailwind", "PHPMailer"],

    highlights: [
      "Automated certificate generation (PDF)",
      "Email notifications with attachments",
      "Resident & request management dashboard",
    ],

    metrics: {
      certificates: "1,000+ generated",
      response: "Instant delivery",
    },

    demo: null,
    repo: null,
    link: null,
  },

  {
    id: "librarysys",
    title: "LibrarySys",
    desc: "A complete library management system with barcode-based attendance, analytics, and admin controls.",
    description:
      "A complete library management system with barcode-based attendance, analytics, and admin controls.",
    image: "/images/projects/librarysys.jpg",
    video: null,
    year: "2024",
    role: "Full-Stack Developer",
    type: "project",
    order: 3,

    featured: true,

    tags: ["PHP", "MySQL", "Barcode", "UX"],
    stack: ["PHP", "MySQL", "JavaScript", "Tailwind"],

    highlights: [
      "Barcode-based student attendance",
      "Book inventory & borrowing system",
      "Admin analytics dashboard",
    ],

    metrics: {
      scans: "5,000+",
      accuracy: "High reliability",
    },

    demo: null,
    repo: null,
    link: null,
  },

  {
    id: "amatrack",
    title: "AMATrack",
    desc: "Attendance and scheduling platform designed for academic institutions with real-time dashboards.",
    description:
      "Attendance and scheduling platform designed for academic institutions with real-time dashboards.",
    image: "/images/projects/amatrack.jpg",
    video: null,
    year: "2023",
    role: "System Designer & Developer",
    type: "experience",
    order: 4,

    featured: true,

    tags: ["JavaScript", "Dashboard", "Admin"],
    stack: ["JavaScript", "PHP", "MySQL"],

    highlights: [
      "Real-time attendance monitoring",
      "Schedule conflict detection",
      "Role-based access control",
    ],

    metrics: {
      classes: "50+",
      instructors: "30+",
    },

    demo: null,
    repo: null,
    link: null,
  },

  {
    id: "wificonnect",
    title: "WiFi Connect",
    desc: "IoT-based smart waste and connectivity system with cloud monitoring and API integrations.",
    description:
      "IoT-based smart waste and connectivity system with cloud monitoring and API integrations.",
    image: "/images/projects/wificonnect.jpg",
    video: null,
    year: "2022",
    role: "IoT & Backend Developer",
    type: "experience",
    order: 5,

    featured: false,

    tags: ["IoT", "Cloud", "APIs"],
    stack: ["ESP32", "Firebase", "REST API"],

    highlights: [
      "ESP32 sensor integration",
      "Cloud-based monitoring dashboard",
      "REST API data synchronization",
    ],

    metrics: {
      devices: "Multiple nodes",
      latency: "Near real-time",
    },

    demo: null,
    repo: null,
    link: null,
  },
];
