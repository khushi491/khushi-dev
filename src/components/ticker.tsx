"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const HALF_REPEAT = 3;

export function Ticker({
  items,
  offset,
  className,
  speed = 0.04,
}: {
  items: React.ReactNode[];
  offset: MotionValue<number>;
  className?: string;
  speed?: number;
}) {
  const half = Array.from({ length: HALF_REPEAT }, () => items).flat();
  const row = [...half, ...half];
  const x = useTransform(offset, (v) => `${wrap(-50, 0, v * speed)}%`);

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        aria-hidden="true"
        style={{ x }}
        className="flex w-max flex-nowrap will-change-transform"
      >
        {row.map((node, i) => (
          <span key={i} className="mr-10 whitespace-nowrap md:mr-16">
            {node}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
