import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Server,
  Layers,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  Lock,
  QrCode,
  ShieldCheck,
  Send,
  Database,
  Radio,
} from "lucide-react";
import { sounds } from "../utils/audio";

export default function SystemSimulator() {
  const [activeTab, setActiveTab] = useState("iot"); // "iot" | "concurrency" | "govtech"

  /* ================= IOT SIMULATOR STATE ================= */
  const [sensorDistance, setSensorDistance] = useState(42.5);
  const [pingHistory, setPingHistory] = useState([
    { id: 1, dist: 42.5, time: "10:14:02", latency: 24, status: "OK" },
    { id: 2, dist: 43.1, time: "10:14:05", latency: 22, status: "OK" },
    { id: 3, dist: 41.8, time: "10:14:08", latency: 26, status: "OK" },
  ]);
  const [isPinging, setIsPinging] = useState(false);

  const triggerPing = () => {
    setIsPinging(true);
    sounds.playClick();

    setTimeout(() => {
      const newDist = parseFloat((Math.random() * 25 + 30).toFixed(1));
      const newLatency = Math.floor(Math.random() * 15 + 18);
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      setSensorDistance(newDist);
      setPingHistory((prev) => [
        {
          id: Date.now(),
          dist: newDist,
          time: timeStr,
          latency: newLatency,
          status: "TRANSMITTED",
        },
        ...prev.slice(0, 4),
      ]);
      setIsPinging(false);
      sounds.playSuccess();
    }, 450);
  };

  /* ================= CONCURRENCY LOCK STATE ================= */
  const [terminals, setTerminals] = useState([
    { id: "PC-01", status: "VACANT", user: null },
    { id: "PC-02", status: "OCCUPIED", user: "STU-8821" },
    { id: "PC-03", status: "VACANT", user: null },
    { id: "PC-04", status: "OCCUPIED", user: "STU-9412" },
    { id: "PC-05", status: "VACANT", user: null },
    { id: "PC-06", status: "VACANT", user: null },
    { id: "PC-07", status: "OCCUPIED", user: "STU-1049" },
    { id: "PC-08", status: "VACANT", user: null },
  ]);
  const [lockLog, setLockLog] = useState(
    "ENGINE READY: Isolation level REPEATABLE READ active."
  );

  const toggleTerminal = (termId) => {
    sounds.playClick();
    setTerminals((prev) =>
      prev.map((t) => {
        if (t.id === termId) {
          const nextStatus = t.status === "VACANT" ? "RESERVED" : "VACANT";
          setLockLog(
            nextStatus === "RESERVED"
              ? `ACQUIRED TRANSACTION LOCK: ${termId} successfully assigned via row-level lock.`
              : `RELEASED LOCK: ${termId} returned to open pool.`
          );
          return {
            ...t,
            status: nextStatus,
            user: nextStatus === "RESERVED" ? "TEST-USER" : null,
          };
        }
        return t;
      })
    );
  };

  /* ================= GOVTECH QR CLEARANCE STATE ================= */
  const [citizenName, setCitizenName] = useState("Maria Clara Santos");
  const [certType, setCertType] = useState("Barangay Clearance");
  const [generatedDoc, setGeneratedDoc] = useState({
    name: "Maria Clara Santos",
    type: "Barangay Clearance",
    hash: "SHA256: 8f4e2b01c9a63e9f...",
    qrToken: "BGY-2025-0918-VERIFIED",
    timestamp: "2026-09-27 20:45:10",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateClearance = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    sounds.playClick();

    setTimeout(() => {
      const mockHash = "SHA256: " + Math.random().toString(16).substring(2, 12) + "...";
      const token = `BGY-2025-${Math.floor(Math.random() * 8999 + 1000)}-VERIFIED`;
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);

      setGeneratedDoc({
        name: citizenName,
        type: certType,
        hash: mockHash,
        qrToken: token,
        timestamp: now,
      });
      setIsGenerating(false);
      sounds.playSuccess();
    }, 400);
  };

  return (
    <section
      id="simulator"
      className="relative py-24 sm:py-32 bg-brand-bg text-brand-text overflow-hidden bg-grid-pattern"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4">
            <Radio className="w-3.5 h-3.5" />
            Interactive Lab Sandbox
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-text leading-tight">
            System Architecture{" "}
            <span className="gradient-brand">Interactive Simulator</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-brand-muted leading-relaxed">
            Test the architectural algorithms and hardware telemetry models powering Tristan’s systems in real time.
          </p>

          {/* Module Switcher Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              { id: "iot", label: "IoT Sensor Telemetry (ESP32)", icon: Cpu },
              { id: "concurrency", label: "Transactional PC Allocator", icon: Database },
              { id: "govtech", label: "GovTech Sealed QR Generator", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    sounds.playClick();
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white shadow-md shadow-brand-primary/25 scale-[1.02]"
                      : "glass-card text-brand-muted hover:text-brand-text hover:border-brand-primary/30"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= SIMULATOR DISPLAY WINDOW ================= */}
        <div className="max-w-5xl mx-auto rounded-3xl glass-card border border-brand-border p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          
          {/* ================= TAB 1: IOT SIMULATOR ================= */}
          {activeTab === "iot" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
                <div>
                  <div className="text-xs font-mono text-brand-primary font-bold uppercase tracking-wider">
                    Edge Firmware v1.4 • ESP32 DevKit C
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-text mt-1">
                    Ultrasonic Sensor Node Telemetry
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-muted">
                    Simulates depth-measurement serialization and real-time HTTP transmission to cloud databases.
                  </p>
                </div>

                <button
                  onClick={triggerPing}
                  disabled={isPinging}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-orange-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-brand-primary/25 hover:scale-105 active:scale-95 transition flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
                  <span>Broadcast Hardware Ping</span>
                </button>
              </div>

              {/* Hardware Visual & Gauges */}
              <div className="grid md:grid-cols-12 gap-6 items-center">
                {/* Gauge Left (5 Cols) */}
                <div className="md:col-span-5 p-6 rounded-2xl glass-panel border border-brand-border text-center flex flex-col items-center justify-center">
                  <div className="text-xs font-mono uppercase text-brand-muted mb-2">
                    Current Echo Distance
                  </div>
                  <div className="text-5xl font-black font-mono text-brand-primary">
                    {sensorDistance} <span className="text-xl text-brand-muted font-normal">cm</span>
                  </div>
                  
                  {/* Visual container fill bar */}
                  <div className="w-full bg-brand-surface rounded-full h-3 mt-6 p-0.5 border border-brand-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-brand-primary"
                      animate={{ width: `${Math.min(100, Math.max(15, (sensorDistance / 60) * 100))}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    />
                  </div>
                  <div className="flex justify-between w-full text-[10px] font-mono text-brand-muted mt-1.5">
                    <span>0 cm (Full)</span>
                    <span>60 cm (Empty)</span>
                  </div>
                </div>

                {/* Packet Stream Right (7 Cols) */}
                <div className="md:col-span-7 space-y-3">
                  <div className="text-xs font-mono uppercase font-bold text-brand-muted">
                    Live Telemetry Ingestion Log
                  </div>

                  <div className="space-y-2">
                    {pingHistory.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-xl glass-panel border border-brand-border flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-brand-text font-bold">
                            {p.dist} cm
                          </span>
                          <span className="text-brand-muted hidden sm:inline">
                            • Node: ESP32_BAT_01
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-brand-muted">
                          <span>{p.time}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {p.latency}ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 2: CONCURRENCY ALLOCATOR ================= */}
          {activeTab === "concurrency" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="pb-6 border-b border-brand-border">
                <div className="text-xs font-mono text-brand-primary font-bold uppercase tracking-wider">
                  iLab Transaction Engine • Capstone Module
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-text mt-1">
                  Zero-Collision Terminal Slot Allocator
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Click any terminal card below to simulate atomic row-locking and real-time seat acquisition.
                </p>
              </div>

              {/* Terminals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {terminals.map((t) => {
                  const isReserved = t.status === "RESERVED" || t.status === "OCCUPIED";
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTerminal(t.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isReserved
                          ? "bg-brand-primary/10 border-brand-primary/40 shadow-sm"
                          : "glass-panel border-brand-border hover:border-emerald-500/50 hover:bg-emerald-500/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold text-brand-text">
                          {t.id}
                        </span>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isReserved ? "bg-brand-primary" : "bg-emerald-500"
                          }`}
                        />
                      </div>
                      <div className="text-[11px] font-mono font-semibold text-brand-muted">
                        {t.status}
                      </div>
                      <div className="text-[10px] text-brand-muted mt-1">
                        {t.user ? `User: ${t.user}` : "Available to book"}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Transaction Terminal Log */}
              <div className="p-4 rounded-xl glass-panel text-brand-text border border-brand-border font-mono text-xs flex items-center gap-2">
                <span className="text-emerald-500 dark:text-emerald-400">➜ [SQL_LOG]:</span>
                <span className="text-brand-text font-medium">{lockLog}</span>
              </div>
            </motion.div>
          )}

          {/* ================= TAB 3: GOVTECH QR CLEARANCE ================= */}
          {activeTab === "govtech" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="pb-6 border-b border-brand-border">
                <div className="text-xs font-mono text-brand-primary font-bold uppercase tracking-wider">
                  Barangay Cloud ERP • Digital Cryptography
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-text mt-1">
                  Tamper-Proof Document Verification
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Generates an authenticated clearance record with verifiable anti-fraud cryptographic token.
                </p>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-start">
                {/* Form Left (6 Cols) */}
                <form onSubmit={generateClearance} className="md:col-span-6 space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-brand-muted mb-1.5">
                      Citizen Name
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-brand-muted mb-1.5">
                      Clearance Type
                    </label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl glass-panel border border-brand-border text-sm text-brand-text focus:outline-none focus:border-brand-primary transition"
                    >
                      <option className="bg-brand-surface text-brand-text" value="Barangay Clearance">Barangay Clearance</option>
                      <option className="bg-brand-surface text-brand-text" value="Certificate of Residency">Certificate of Residency</option>
                      <option className="bg-brand-surface text-brand-text" value="Certificate of Indigency">Certificate of Indigency</option>
                      <option className="bg-brand-surface text-brand-text" value="Business Permit Endorsement">Business Permit Endorsement</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isGenerating ? "Synthesizing Security Hash..." : "Generate Sealed Document Token"}</span>
                  </button>
                </form>

                {/* Sealed Preview Right (6 Cols) */}
                <div className="md:col-span-6 p-5 rounded-2xl glass-panel border border-brand-border relative">
                  <div className="flex items-center justify-between border-b border-brand-border pb-3 mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      AUTHENTICATED RECORD
                    </span>
                    <span className="text-[10px] font-mono text-brand-muted">
                      Republic of the Philippines
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-brand-muted">Resident: </span>
                      <span className="font-bold text-brand-text">{generatedDoc.name}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted">Document: </span>
                      <span className="font-semibold text-brand-text">{generatedDoc.type}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted">Security Hash: </span>
                      <span className="font-mono text-brand-primary">{generatedDoc.hash}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted">QR Token: </span>
                      <span className="font-mono text-emerald-500 font-bold">{generatedDoc.qrToken}</span>
                    </div>
                    <div>
                      <span className="text-brand-muted">Timestamp: </span>
                      <span className="font-mono text-brand-muted">{generatedDoc.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
