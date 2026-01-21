import { motion, useReducedMotion } from "framer-motion";

export default function Badge({
  icon,
  label,
  variant = "soft",   // soft | solid | outline | subtle
  size = "sm",        // sm | md
  animated = false,
}) {
  const reduceMotion = useReducedMotion();

  /* ================= VARIANTS ================= */
  const variants = {
    soft: `
      bg-brand-primary/10 text-brand-primary
      ring-1 ring-brand-primary/30
    `,
    solid: `
      bg-brand-primary text-white
      shadow-sm
    `,
    outline: `
      bg-transparent text-brand-primary
      ring-1 ring-brand-primary/50
    `,
    subtle: `
      bg-black/5 text-brand-text
      dark:bg-white/10 dark:text-white
    `,
  };

  /* ================= SIZES ================= */
  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
  };

  const content = (
    <span
      className={`
        inline-flex items-center rounded-full font-semibold
        whitespace-nowrap
        ${variants[variant]}
        ${sizes[size]}
        transition-colors duration-200
      `}
    >
      {icon && (
        <span
          aria-hidden
          className="text-base leading-none flex-shrink-0"
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
    </span>
  );

  /* ================= NON-ANIMATED ================= */
  if (!animated || reduceMotion) return content;

  /* ================= ANIMATED ================= */
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="inline-block"
    >
      {content}
    </motion.span>
  );
}
