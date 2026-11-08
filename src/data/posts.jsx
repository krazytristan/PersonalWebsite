import React from "react";

export const POSTS = [
  {
    id: "ship-fast-react",
    slug: "ship-fast-react",
    title: "How I Ship React Apps Fast (Without the Technical Debt)",
    date: "2025-06-30",
    readTime: "5 min read",
    readingTimeText: "5 min read",
    tags: ["React", "Architecture", "Engineering"],
    excerpt:
      "My practical battle-tested rubric for transitioning from initial specification to production deployment with crisp UX, zero clutter, and predictable state.",
    cover: "/images/React-app.jpg",
    content: (
      <div className="space-y-6 text-brand-text text-sm sm:text-base leading-relaxed">
        <p className="text-base sm:text-lg font-medium text-brand-muted">
          Speed in software engineering is rarely about typing faster; it’s about avoiding architectural dead-ends that force you to rewrite your core state two weeks later.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          1. The Routing & Data Skeleton First
        </h4>
        <p className="text-brand-muted">
          Before spending hours perfecting buttons and drop-shadows, wire up all application routes and establish your data contracts. If the shape of the data flowing from your API doesn’t match your UI boundaries, cosmetic polish won't save it.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          2. Minimize Global State
        </h4>
        <p className="text-brand-muted">
          Keep state as local as possible. In 90% of web apps, complex Redux stores are unnecessary. Leverage standard React hooks, URL state (for query parameters, active tabs, filters), and lightweight context providers for global cross-cutting concerns like authentication or themes.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          3. Accessibility & Performance as Baseline Invariants
        </h4>
        <p className="text-brand-muted">
          Build with semantic HTML elements (&lt;main&gt;, &lt;nav&gt;, &lt;article&gt;) from minute one. Adding ARIA tags and fixing keyboard accessibility at the end is three times harder than getting it right during initial markup.
        </p>

        <div className="p-4 rounded-2xl glass-panel border border-brand-primary/30 bg-brand-primary/5 mt-6">
          <div className="font-bold text-xs font-mono uppercase text-brand-primary mb-1">
            Key Architectural Takeaway
          </div>
          <p className="text-xs sm:text-sm text-brand-text">
            "Ship small slices that are complete from database query to rendered DOM. Velocity comes from certainty, not rush."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "teaching-tech",
    slug: "teaching-tech",
    title: "Teaching Tech: What Actually Works in the Classroom",
    date: "2025-04-12",
    readTime: "6 min read",
    readingTimeText: "6 min read",
    tags: ["Education", "Pedagogy", "Computer Science"],
    excerpt:
      "Field reflections from five years of instructing university IT & CS students — how to transform passive tutorial watchers into independent system builders.",
    cover: "/images/tech.jpg",
    content: (
      <div className="space-y-6 text-brand-text text-sm sm:text-base leading-relaxed">
        <p className="text-base sm:text-lg font-medium text-brand-muted">
          The most insidious trap for aspiring developers is "tutorial hell" — the comfortable illusion that watching someone else build a clone equals software competence.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          1. Build for Real Stakeholders Early
        </h4>
        <p className="text-brand-muted">
          In my coursework, I eliminate hypothetical to-do apps. Students are assigned to interview local university offices, barangay councils, or student organizations to uncover real workflow friction. When students know an actual human is waiting for their software, engagement skyrockets.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          2. Debugging is a Core Skill, Not an Accident
        </h4>
        <p className="text-brand-muted">
          We explicitly teach how to read stack traces, inspect HTTP request payloads in DevTools, and isolate variables. A student who can read errors systematically will learn any framework in three weeks.
        </p>

        <div className="p-4 rounded-2xl glass-panel border border-brand-primary/30 bg-brand-primary/5 mt-6">
          <div className="font-bold text-xs font-mono uppercase text-brand-primary mb-1">
            Pedagogical Truth
          </div>
          <p className="text-xs sm:text-sm text-brand-text">
            "Students don't learn from clean presentations; they learn from navigating messy errors and realizing they have the tools to solve them."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "iot-in-batangas",
    slug: "iot-in-batangas",
    title: "IoT in Batangas: Real-World Wins & Sensor Pitfalls",
    date: "2025-02-20",
    readTime: "7 min read",
    readingTimeText: "7 min read",
    tags: ["IoT", "ESP32", "Hardware", "Case Study"],
    excerpt:
      "A candid field engineering retrospective from deploying microcontroller sensor nodes on campus Wi-Fi — and why edge systems require defensive architectures.",
    cover: "/images/IoT.webp",
    content: (
      <div className="space-y-6 text-brand-text text-sm sm:text-base leading-relaxed">
        <p className="text-base sm:text-lg font-medium text-brand-muted">
          On a software whiteboard, IoT looks trivial: read a sensor value, call an HTTP endpoint, update a dashboard. In the physical world, hardware is hostile.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          1. Wi-Fi Drops Are Not Anomalies
        </h4>
        <p className="text-brand-muted">
          Campus Wi-Fi resets, power fluctuations, and DHCP lease expirations happen daily. An ESP32 firmware that halts when a socket connection times out is a dead node. We implemented exponential backoff retry loops and local ring-buffer caching so data persists until connectivity resumes.
        </p>

        <h4 className="text-lg font-bold text-brand-text mt-6">
          2. Keep the Dashboard Boring & Resilient
        </h4>
        <p className="text-brand-muted">
          Operators don’t want 3D canvas animations; they want to know immediately if a node is offline, its current battery voltage, and whether capacity has crossed 85%. Reliability beats visual flash every time.
        </p>

        <div className="p-4 rounded-2xl glass-panel border border-brand-primary/30 bg-brand-primary/5 mt-6">
          <div className="font-bold text-xs font-mono uppercase text-brand-primary mb-1">
            Hardware Engineering Rule
          </div>
          <p className="text-xs sm:text-sm text-brand-text">
            "Assume the network is dead, the sensor is sending noise, and the power just blinked. When your code survives that, it's ready for production."
          </p>
        </div>
      </div>
    ),
  },
];

/* -------------------- DYNAMIC ADMIN PERSISTENCE -------------------- */
export function getStoredPosts() {
  if (typeof window === "undefined") return POSTS;
  try {
    const raw = localStorage.getItem("admin_portfolio_posts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => {
          const defaultMatch = POSTS.find((def) => def.id === p.id || def.slug === p.slug);
          return {
            ...p,
            content:
              p.contentString ? (
                <div className="space-y-4 text-brand-text text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {p.contentString}
                </div>
              ) : (
                defaultMatch?.content || (
                  <p className="text-brand-muted leading-relaxed">{p.excerpt}</p>
                )
              ),
          };
        });
      }
    }
  } catch (e) {
    console.error("Error loading stored posts:", e);
  }
  return POSTS;
}

export function saveStoredPosts(updatedList) {
  if (typeof window === "undefined") return;
  try {
    const serializable = updatedList.map(({ content, ...rest }) => ({
      ...rest,
      contentString:
        typeof content === "string"
          ? content
          : rest.contentString || rest.excerpt || "",
    }));
    localStorage.setItem("admin_portfolio_posts", JSON.stringify(serializable));
    window.dispatchEvent(new CustomEvent("posts-updated", { detail: updatedList }));
  } catch (e) {
    console.error("Error saving posts:", e);
  }
}

export function resetStoredPosts() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("admin_portfolio_posts");
    window.dispatchEvent(new CustomEvent("posts-updated", { detail: POSTS }));
  } catch (e) {}
}

export function getAllPosts() {
  return getStoredPosts();
}

export function getPost(slug) {
  if (!slug) return null;
  return getStoredPosts().find((p) => p.slug === slug || p.id === slug) || null;
}
