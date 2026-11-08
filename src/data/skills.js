export const skillCategories = [
  "All",
  "Frontend",
  "Backend & Systems",
  "Databases & Cloud",
  "IoT & Hardware",
  "Architecture & Tools",
];

export const skills = [
  /* ---------------- FRONTEND ---------------- */
  {
    name: "React",
    category: "Frontend",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    desc: "Component architecture, custom hooks, context, state optimization & SSR/SPA.",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    level: "Proficient",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    desc: "Strict type safety, generics, interfaces, and compile-time contract enforcement.",
  },
  {
    name: "JavaScript (ES6+)",
    category: "Frontend",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    desc: "Event loop, asynchronous patterns, DOM manipulation, and modern syntax.",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    desc: "Responsive design, theme tokens, bespoke utility systems & zero-runtime CSS.",
  },
  {
    name: "Framer Motion",
    category: "Frontend",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
    desc: "Layout animations, spring physics, scroll-linked visuals & micro-interactions.",
  },
  {
    name: "Vite",
    category: "Frontend",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg",
    desc: "Lightning-fast HMR, Rollup bundling, asset pipelines & production build optimization.",
  },
  {
    name: "HTML5 / CSS3",
    category: "Frontend",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    desc: "Semantic structure, WCAG accessibility, CSS grid, flexbox & modern fluid layouts.",
  },

  /* ---------------- BACKEND & SYSTEMS ---------------- */
  {
    name: "PHP",
    category: "Backend & Systems",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    desc: "Core enterprise backend language, MVC frameworks, secure auth & API services.",
  },
  {
    name: "Node.js",
    category: "Backend & Systems",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    desc: "Scalable async runtimes, event-driven microservices & backend tooling.",
  },
  {
    name: "Express.js",
    category: "Backend & Systems",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    desc: "RESTful API routing, middleware chains, token validation & request sanitization.",
  },
  {
    name: "Laravel",
    category: "Backend & Systems",
    level: "Proficient",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    desc: "Eloquent ORM, migrations, queue workers, Blade templating & robust MVC.",
  },
  {
    name: "Python",
    category: "Backend & Systems",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    desc: "Automation scripting, data analysis, algorithm prototyping & system utilities.",
  },
  {
    name: "REST APIs",
    category: "Backend & Systems",
    level: "Expert",
    icon: "https://img.icons8.com/color/48/api.png",
    desc: "Contract-first endpoint design, rate limiting, JSON serialization & error schemas.",
  },

  /* ---------------- DATABASES & CLOUD ---------------- */
  {
    name: "MySQL",
    category: "Databases & Cloud",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    desc: "Relational modeling, indexing, ACID transactions, complex queries & normalization.",
  },
  {
    name: "Firebase",
    category: "Databases & Cloud",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    desc: "Realtime Database, Firestore, authentication, security rules & cloud functions.",
  },
  {
    name: "MongoDB",
    category: "Databases & Cloud",
    level: "Proficient",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    desc: "NoSQL document collections, aggregation pipelines & dynamic schemas.",
  },
  {
    name: "Git & GitHub",
    category: "Databases & Cloud",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    desc: "Version control workflows, branching strategies, code reviews & CI/CD automation.",
  },
  {
    name: "Docker",
    category: "Databases & Cloud",
    level: "Working Knowledge",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    desc: "Containerization, Dockerfile recipes, reproducible dev environments.",
  },

  /* ---------------- IOT & HARDWARE ---------------- */
  {
    name: "ESP32 & Arduino",
    category: "IoT & Hardware",
    level: "Advanced",
    icon: "https://img.icons8.com/color/48/internet-of-things.png",
    desc: "Microcontroller firmware in C++, GPIO pin handling, Wi-Fi networking & sleep modes.",
  },
  {
    name: "Sensors & RFID",
    category: "IoT & Hardware",
    level: "Advanced",
    icon: "https://img.icons8.com/color/48/sensor.png",
    desc: "Ultrasonic, temperature, RFID card readers, serial HID communication & calibration.",
  },
  {
    name: "IoT Telemetry",
    category: "IoT & Hardware",
    level: "Advanced",
    icon: "https://img.icons8.com/color/48/combo-chart--v1.png",
    desc: "Real-time hardware-to-cloud streams, packet loss resilience & sensor monitoring.",
  },

  /* ---------------- ARCHITECTURE & TOOLS ---------------- */
  {
    name: "System Architecture",
    category: "Architecture & Tools",
    level: "Expert",
    icon: "https://img.icons8.com/color/48/server.png",
    desc: "Multi-tier platform architecture, failover planning, domain-driven boundaries.",
  },
  {
    name: "Technical Education",
    category: "Architecture & Tools",
    level: "Expert",
    icon: "https://img.icons8.com/color/48/graduation-cap.png",
    desc: "5+ years university instruction, curriculum design, mentorship & technical workshops.",
  },
  {
    name: "Postman",
    category: "Architecture & Tools",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    desc: "API test automation, mock servers, environment variables & payload validation.",
  },
  {
    name: "VS Code",
    category: "Architecture & Tools",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    desc: "Advanced workspace configuration, debugging runtimes, custom snippets & tooling.",
  },
];
