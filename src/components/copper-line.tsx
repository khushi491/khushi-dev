"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CopperLine({
  className,
  length = "3.5rem",
}: {
  className?: string;
  length?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        height: 1,
        width: length,
        background: "linear-gradient(90deg, var(--accent), transparent)",
        transformOrigin: "left center",
      }}
      initial={reduced ? false : { scaleX: 0 }}
      whileInView={reduced ? undefined : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
