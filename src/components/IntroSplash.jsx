import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Terminal, CheckCircle2 } from "lucide-react";
import { sounds } from "../utils/audio";

export default function IntroSplash({ onComplete }) {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1); // 1: "Welcome to my portfolio", 2: Tristan's Name, 3: Picture / Image & Complete
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      onComplete?.();
      return;
    }

    // Step 1 -> Step 2 after 1.8s
    const t1 = setTimeout(() => {
      setStep(2);
      sounds.playClick();
    }, 1800);

    // Step 2 -> Step 3 after 3.8s
    const t2 = setTimeout(() => {
      setStep(3);
      sounds.playSuccess();
    }, 3800);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Auto complete after 6.2s
    const t3 = setTimeout(() => {
      onComplete?.();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(progressInterval);
    };
  }, [onComplete, reduceMotion]);

  const handleSkip = () => {
    sounds.playPop();
    onComplete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#07090E] text-white flex flex-col justify-between items-center px-6 py-8 select-none overflow-hidden"
    >
      {/* Radiant ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#FF6D1F]/20 via-[#38BDF8]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-[#FF6D1F]" />
          <span>INITIALIZING ENVIRONMENT // V2.5</span>
        </div>

        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-[#FF6D1F]/50 transition flex items-center gap-1.5"
        >
          <span>Enter Portfolio</span>
          <ArrowRight className="w-3 h-3 text-[#FF6D1F]" />
        </button>
      </div>

      {/* Middle Animated Stages */}
      <div className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center justify-center my-auto min-h-[380px]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: "Welcome to my portfolio" */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6D1F]/15 border border-[#FF6D1F]/30 text-[#FF6D1F] text-xs font-mono font-semibold tracking-widest uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Greetings</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Welcome to my{" "}
                <span className="bg-gradient-to-r from-[#FF6D1F] to-[#FFA14A] bg-clip-text text-transparent">
                  portfolio
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-400 font-mono tracking-wide">
                Architecting high-availability platforms & digital infrastructure
              </p>
            </motion.div>
          )}

          {/* STEP 2: Name & Role */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[#FF6D1F] mb-3">
                SYSTEMS ARCHITECT & EDUCATOR
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                Tristan Jorge{" "}
                <span className="block mt-2 bg-gradient-to-r from-[#FF6D1F] via-[#FF8A3D] to-[#38BDF8] bg-clip-text text-transparent">
                  Cuartero
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  Batangas, Philippines 🇵🇭
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                  Full-Stack & Cloud Architecture
                </span>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Picture / Image */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Picture Frame with Glowing Rim */}
              <div className="relative mb-5 group">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[#FF6D1F] via-[#38BDF8] to-[#FF9E42] opacity-70 blur-xl animate-pulse" />
                
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl p-1 bg-[#0D121D]">
                  <img
                    src="/images/portratit.png"
                    alt="Tristan Jorge Cuartero"
                    className="w-full h-full object-cover object-center rounded-full filter contrast-[1.05]"
                  />
                </div>

                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-500 text-white border-2 border-[#07090E] shadow-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="text-xl sm:text-2xl font-black text-white">
                Tristan Jorge Cuartero
              </div>

              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                Batangas State University • Systems Engineer
              </p>

              <button
                onClick={handleSkip}
                className="mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF6D1F] to-[#FF8A3D] text-white font-semibold text-xs tracking-wide shadow-lg shadow-[#FF6D1F]/30 hover:scale-105 active:scale-95 transition flex items-center gap-2"
              >
                <span>Launch Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-2">
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF6D1F] to-[#38BDF8] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[10px] font-mono text-slate-400">
          <span>Booting Services...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
