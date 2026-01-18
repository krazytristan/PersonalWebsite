import { motion } from "framer-motion";

export default function Badge({
  icon,
  label,
  variant = "soft",   // soft | solid | outline | subtle
  size = "sm",        // sm | md
  animated = false,
}) {
  const variants = {
    soft: "bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary/30",
    solid: "bg-brand-primary text-white",
    outline: "bg-transparent text-brand-primary ring-1 ring-brand-primary",
    subtle: "bg-black/5 text-brand-text",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
  };

  const Base = (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        transition
      `}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {label}
    </span>
  );

  if (!animated) return Base;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="inline-block"
    >
      {Base}
    </motion.div>
  );
}
