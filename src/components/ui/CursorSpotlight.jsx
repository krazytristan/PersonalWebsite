import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function CursorSpotlight({
  size = 420,
  baseStrength = 0.18,
  hoverStrength = 0.35,
  color = "255,109,31",
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [strength, setStrength] = useState(baseStrength);

  useEffect(() => {
    if (reduceMotion) return;

    const el = ref.current;
    if (!el) return;

    let raf = null;

    const move = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX - size / 2}px, ${
          e.clientY - size / 2
        }px, 0)`;
        raf = null;
      });
    };

    const enter = () => setStrength(hoverStrength);
    const leave = () => setStrength(baseStrength);

    window.addEventListener("pointermove", move);
    document.addEventListener("spotlight-enter", enter);
    document.addEventListener("spotlight-leave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("spotlight-enter", enter);
      document.removeEventListener("spotlight-leave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion, size, baseStrength, hoverStrength]);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-30"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle,
          rgba(${color}, ${strength}) 0%,
          rgba(${color}, ${strength * 0.6}) 30%,
          rgba(${color}, ${strength * 0.3}) 50%,
          rgba(${color}, 0) 70%)`,
        filter: "blur(14px)",
        mixBlendMode: "screen",
        willChange: "transform",
      }}
    />
  );
}
