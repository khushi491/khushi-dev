import type { AgentId } from "@/lib/agents";

/**
 * Colors for the 3D cast and the SVG fallbacks in /public/agents.
 * Tuned to the references in docs/references/.
 */
export const palette = {
  dot: "#2b62f0",
  dotDeep: "#1d4ed8",
  dotMark: "#8eb6ff",
  beret: "#16181d",
  muse: "#f3e3d6",
  museDeep: "#e7d0c2",
  musePink: "#f4a8ba",
  museMark: "#ef4b5a",
  grok: "#f6f7f8",
  grokMark: "#ffffff",
  claude: "#ff7a18",
  claudeGlow: "#ff9a3c",
  claudeMark: "#ffe08a",
  eye: "#141414",
  stage: "#12130f",
} as const;

/** Face center in model space, so peek cameras can frame the head. */
export const metrics: Record<AgentId, { headY: number; bubbleY: number; nameY: number }> = {
  muse: { headY: 1.02, bubbleY: 1.62, nameY: -0.04 },
  grokbot: { headY: 0.72, bubbleY: 1.5, nameY: -0.05 },
  claude: { headY: 0.86, bubbleY: 1.55, nameY: -0.02 },
  dots: { headY: 0.78, bubbleY: 1.42, nameY: -0.02 },
};

export const bounce: Record<AgentId, { speed: number; phase: number }> = {
  muse: { speed: 2.15, phase: 0.2 },
  grokbot: { speed: 2.75, phase: 1.35 },
  claude: { speed: 2.4, phase: 2.15 },
  dots: { speed: 1.85, phase: 3.05 },
};
