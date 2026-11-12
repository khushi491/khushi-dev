"use client";

import { useEffect, useRef } from "react";

export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.matchMedia("(pointer: coarse)").matches) {
      node.style.setProperty("--spot-x", "68%");
      node.style.setProperty("--spot-y", "28%");
      return;
    }

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty("--spot-x", `${x}%`);
        node.style.setProperty("--spot-y", `${y}%`);
      });
    };

    node.style.setProperty("--spot-x", "68%");
    node.style.setProperty("--spot-y", "28%");
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(520px 360px at var(--spot-x, 68%) var(--spot-y, 28%), rgba(197, 106, 66, 0.2), transparent 62%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 50% at 8% 80%, rgba(102, 104, 75, 0.16), transparent 70%)",
        }}
      />
    </div>
  );
}
