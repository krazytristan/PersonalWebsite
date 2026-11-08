export const projects = [
  {
    id: "ilab-system",
    slug: "ilab-reservation-system",
    title: "iLab Workstation & Reservation Platform",
    shortTitle: "iLab System",
    badge: "Capstone Project",
    category: "Academic Platforms",

    desc: "Real-time PC terminal reservation, hardware health telemetry, and collision-free scheduling for computer engineering laboratories.",
    description:
      "A high-availability laboratory management platform built to orchestrate 48+ workstation terminals. Features instant conflict-safe time slot reservations, real-time peripheral maintenance telemetry, and tiered role-based admin controls for university faculty and students.",

    image: "/images/projects/ilab.svg",
    heroImage: "/images/projects/ilab.svg",
    fallbackImage: "/images/tech.jpg",
    imageAlt: "iLab Reservation System dashboard",

    gallery: [
      "/images/projects/ilab.svg",
      "/images/tech.jpg",
    ],

    year: 2025,
    duration: "2024 – 2025",
    role: "Lead Systems Architect & Full-Stack Developer",

    type: "project",
    featured: true,
    order: 1,

    accent: "from-orange-500 via-amber-500 to-yellow-400",
    glowColor: "rgba(255, 109, 31, 0.4)",

    tags: ["Real-Time", "Reservation Engine", "Admin Telemetry", "Concurrency"],
    stack: ["PHP", "MySQL", "JavaScript", "AJAX", "Tailwind CSS"],

    highlights: [
      "Zero-collision booking engine with transactional database locking",
      "Dynamic workstation grid showing live availability & hardware status",
      "Automated maintenance ticket generation & audit trail logs",
      "Role-based privilege hierarchy (Students, Instructors, Lab Admins)",
    ],

    architecture: {
      client: "Responsive Tailwind UI + Asynchronous Polling with zero page reload",
      backend: "Modular PHP MVC architecture with sanitized query layers",
      database: "Relational MySQL with strict foreign keys & indexed session slots",
      security: "Session encryption, CSRF tokens & role-gated API endpoints",
    },

    timeline: [
      { title: "Requirements & Discovery", note: "Studied laboratory contention patterns across 300+ students." },
      { title: "Data Architecture", note: "Engineered collision-safe slot allocation schema." },
      { title: "UI/UX & Telemetry", note: "Designed visual terminal grid with instant status feedback." },
      { title: "Production Defense", note: "Successfully deployed and defended with top capstone honors." },
    ],

    outcomes: [
      "Eliminated double-booking errors completely across peak lab hours",
      "Cut workstation issue reporting time by 75% through integrated tickets",
      "Handled 300+ concurrent student bookings with sub-100ms latency",
    ],

    metrics: {
      users: "300+ Students",
      terminals: "48 Workstations",
      uptime: "99.9% Uptime",
      speed: "<85ms Response",
    },
  },

  {
    id: "barangay-system",
    slug: "barangay-information-system",
    title: "Barangay Cloud ERP & E-Certificates",
    shortTitle: "Barangay System",
    badge: "GovTech Civic System",
    category: "GovTech & Civic",

    desc: "Cloud-based local government system automating official citizen clearances, resident census registries, and automated PDF delivery.",
    description:
      "A comprehensive civic platform revolutionizing local barangay governance. Replaces paper records with a centralized citizen census, digital QR-authenticated document generator, and automated email dispatcher with tamper-proof clearance PDFs.",

    image: "/images/projects/barangay.svg",
    heroImage: "/images/projects/barangay.svg",
    fallbackImage: "/images/tech.jpg",
    imageAlt: "Barangay Information Management System",

    gallery: [
      "/images/projects/barangay.svg",
      "/images/tech.jpg",
    ],

    year: 2025,
    duration: "2024 – 2025",
    role: "Full-Stack Engineer & Database Designer",

    type: "project",
    featured: true,
    order: 2,

    accent: "from-emerald-500 via-teal-400 to-cyan-400",
    glowColor: "rgba(16, 185, 129, 0.4)",

    tags: ["GovTech", "PDF Generation", "Email Automation", "Citizen Registry"],
    stack: ["PHP", "MySQL", "Tailwind CSS", "PHPMailer", "FPDF"],

    highlights: [
      "Automated digital certificate generation with cryptographic verification QR",
      "Transactional SMTP email delivery pipeline for immediate clearance dispatch",
      "Comprehensive resident demographic analytics & indigency assessment",
      "Encrypted audit log to comply with Philippine Data Privacy Act standards",
    ],

    architecture: {
      client: "Modern Tailwind admin portal with instant search & pagination",
      backend: "RESTful PHP pipeline with automated queue processing",
      database: "Normalized MySQL database with citizen relationship mapping",
      delivery: "Automated PHPMailer engine with dynamic PDF attachment stream",
    },

    timeline: [
      { title: "Civic Workflow Analysis", note: "Mapped physical clearance issuance bottlenecks." },
      { title: "Engine Build", note: "Constructed dynamic PDF renderer with anti-fraud QR." },
      { title: "Automated Mailer", note: "Integrated SMTP server queue for reliable inbox delivery." },
      { title: "Barangay Rollout", note: "Trained local council staff on paperless operations." },
    ],

    outcomes: [
      "Reduced certificate issuance time from 45 minutes to under 60 seconds",
      "Successfully processed and generated over 1,000+ official clearances",
      "Saved hours of manual paperwork weekly for barangay officials",
    ],

    metrics: {
      certificates: "1,000+ Generated",
      residents: "4,200+ Registered",
      turnaround: "<1 Min Issuance",
      reduction: "85% Paperwork Cut",
    },
  },

  {
    id: "librarysys",
    slug: "librarysys-management",
    title: "LibrarySys Optical Attendance & Inventory",
    shortTitle: "LibrarySys",
    badge: "Academic System",
    category: "Academic Platforms",

    desc: "High-speed optical barcode circulation platform, student library attendance tracker, and real-time inventory management.",
    description:
      "An automated campus library system utilizing optical barcode laser scanning for instant student attendance logging and seamless circulation of thousands of cataloged volumes. Built with live usage analytics to assist campus administrators in resource planning.",

    image: "/images/projects/librarysys.svg",
    heroImage: "/images/projects/librarysys.svg",
    fallbackImage: "/images/React-app.jpg",
    imageAlt: "LibrarySys management dashboard",

    gallery: [
      "/images/projects/librarysys.svg",
      "/images/React-app.jpg",
    ],

    year: 2024,
    duration: "2024",
    role: "Full-Stack Architect",

    type: "project",
    featured: true,
    order: 3,

    accent: "from-rose-500 via-pink-500 to-fuchsia-400",
    glowColor: "rgba(244, 63, 94, 0.4)",

    tags: ["Barcode Scanner", "Inventory Analytics", "Rapid Ingestion", "UX"],
    stack: ["JavaScript", "PHP", "MySQL", "Tailwind CSS"],

    highlights: [
      "Sub-second optical barcode ingestion for hands-free student check-ins",
      "Catalog circulation engine with automated overdue penalty calculation",
      "Interactive data visualizations tracking peak library visitor hours",
      "Instant student eligibility verification against active university records",
    ],

    architecture: {
      client: "Event-driven JavaScript client capturing HID scanner keystroke buffers",
      backend: "Optimized PHP API validating student IDs against enrollment databases",
      database: "Indexed MySQL catalog supporting full-text book search",
      reporting: "Real-time attendance graphs and monthly circulation digests",
    },

    timeline: [
      { title: "Hardware Integration", note: "Engineered fast barcode stream parser." },
      { title: "Circulation Rules", note: "Implemented lending limits, renewals & penalties." },
      { title: "Analytics Engine", note: "Constructed hourly traffic visualizer." },
    ],

    outcomes: [
      "Processed over 5,000+ attendance scans without a single record loss",
      "Reduced long queue times at the library entrance during morning rush",
      "Provided actionable traffic reports to optimize library staffing hours",
    ],

    metrics: {
      scans: "5,000+ Scans",
      catalog: "12,000+ Books",
      latency: "<50ms Ingestion",
      accuracy: "99.99% Reliability",
    },
  },

  {
    id: "amatrack",
    slug: "amatrack-attendance",
    title: "AMATrack Academic Telemetry & Scheduling",
    shortTitle: "AMATrack",
    badge: "Enterprise Platform",
    category: "Academic Platforms",

    desc: "Institutional attendance and lecture hall conflict detection platform orchestrating instructor rosters and real-time room occupancy.",
    description:
      "A mission-critical scheduling engine that resolves classroom conflicts across 50+ simultaneous course sections and dozens of faculty members. Includes automated punch clock telemetry, grace period algorithms, and live institutional dashboards.",

    image: "/images/projects/amatrack.svg",
    heroImage: "/images/projects/amatrack.svg",
    fallbackImage: "/images/tech.jpg",
    imageAlt: "AMATrack academic dashboard",

    gallery: [
      "/images/projects/amatrack.svg",
      "/images/tech.jpg",
    ],

    year: 2023,
    duration: "2023",
    role: "System Designer & Lead Developer",

    type: "experience",
    featured: true,
    order: 4,

    accent: "from-amber-500 via-orange-400 to-rose-400",
    glowColor: "rgba(245, 158, 11, 0.4)",

    tags: ["Scheduling Engine", "Conflict Matrix", "Telemetry", "Academic"],
    stack: ["JavaScript", "PHP", "MySQL", "CSS3"],

    highlights: [
      "Automated lecture timetable conflict solver eliminating overlapping bookings",
      "Live faculty time-in/time-out stream with custom grace-period policies",
      "Room occupancy visualizer displaying vacant laboratories in real time",
      "Executive reporting with exportable attendance metrics for payroll audit",
    ],

    architecture: {
      client: "Modular dashboard interface with live countdown timers and status alerts",
      backend: "Time-matrix conflict detection algorithm in PHP",
      database: "Relational schema modeling rooms, courses, instructors, and semesters",
      reporting: "Exportable CSV & printable payroll compliance logs",
    },

    timeline: [
      { title: "Faculty Survey", note: "Identified pain points in timetable overlap." },
      { title: "Algorithm Design", note: "Built interval-tree conflict detection." },
      { title: "Institution Rollout", note: "Adopted across academic departments." },
    ],

    outcomes: [
      "Zero room schedule collisions achieved across an entire academic year",
      "Streamlined instructor attendance monitoring for 30+ faculty members",
      "Eliminated manual attendance sheet computation errors",
    ],

    metrics: {
      classes: "50+ Courses",
      faculty: "30+ Instructors",
      conflicts: "0 Collisions",
      satisfaction: "98% Positive",
    },
  },

  {
    id: "wificonnect",
    slug: "wifi-connect-iot",
    title: "WiFi Connect IoT Telemetry Platform",
    shortTitle: "WiFi Connect",
    badge: "IoT Research",
    category: "IoT & Hardware",

    desc: "Cloud-connected smart waste and environmental sensor node platform powered by ESP32 microcontrollers and real-time REST synchronization.",
    description:
      "A forward-looking IoT research deployment marrying embedded microcontrollers with cloud dashboards. Monitors ultrasonic container capacity and environmental sensors across campus nodes, dispatching real-time alerts when threshold levels are breached.",

    image: "/images/projects/wificonnect.jpg",
    heroImage: "/images/projects/wificonnect.jpg",
    fallbackImage: "/images/IoT.webp",
    imageAlt: "WiFi Connect IoT dashboard",

    gallery: [
      "/images/projects/wificonnect.jpg",
      "/images/IoT.webp",
    ],

    year: 2022,
    duration: "2022",
    role: "IoT Embedded & Backend Architect",

    type: "experience",
    featured: false,
    order: 5,

    accent: "from-sky-500 via-cyan-400 to-teal-400",
    glowColor: "rgba(56, 189, 248, 0.4)",

    tags: ["ESP32", "IoT Telemetry", "Firebase Cloud", "Hardware Sensors"],
    stack: ["ESP32", "C++", "Firebase", "REST API", "JavaScript"],

    highlights: [
      "Low-power ESP32 firmware with sleep cycles and Wi-Fi reconnect retry loops",
      "Ultrasonic depth measurement calibrated for container volume telemetry",
      "Cloud telemetry pipeline with instantaneous state synchronization",
      "Visual operator dashboard with threshold warning indicators",
    ],

    architecture: {
      hardware: "ESP32 SoC + Ultrasonic HC-SR04 + Status LED array",
      protocol: "HTTP/REST API payload serialized with compact JSON formatting",
      cloud: "Firebase Realtime Database syncing state to web observers",
      dashboard: "Client observer rendering live fill-percentage gauges",
    },

    timeline: [
      { title: "Hardware Prototyping", note: "Breadboard schematic and sensor calibration." },
      { title: "Firmware Development", note: "C++ code handling network loss gracefully." },
      { title: "Cloud Integration", note: "Firebase bridge and real-time dashboard UI." },
    ],

    outcomes: [
      "Demonstrated reliable remote sensor telemetry over standard campus Wi-Fi",
      "Published as undergraduate applied engineering research showcase",
      "Formed the bedrock for subsequent university IoT curriculum modules",
    ],

    metrics: {
      latency: "Near Real-Time",
      accuracy: "96% Sensor Precision",
      packetLoss: "<1% on Wi-Fi",
      nodes: "Multi-Node Setup",
    },
  },
];
