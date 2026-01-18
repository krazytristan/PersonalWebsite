import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1], // cinematic easing
      }}
    >
      {children}
    </motion.div>
  );
}
