import type { AgentId } from "@/lib/agents";

/**
 * Shared colors for the 3D cast and the SVG fallbacks in /public/agents.
 * Change a character here first, then match the SVG if the fallback should follow.
 */
export const palette = {
  skin: "#f2c9a8",
  skinDeep: "#e3b08a",
  hair: "#32241f",
  hairDeep: "#2a1d1a",
  hairGold: "#c4a56a",
  dress: "#6a6d4e",
  dressLight: "#84886a",
  gold: "#c4a56a",
  grok: "#f3e6cb",
  grokDeep: "#e4d3ae",
  eye: "#1c1b18",
  sclera: "#f7f4ef",
  smile: "#7a403c",
  claude: "#f6d2bc",
  shirt: "#b86a4e",
  cloud: "#f7f1e6",
  cloudDeep: "#eadfcb",
  blush: "#e7a090",
  stage: "#12130f",
} as const;

/** Head center, in model space, so peek cameras can frame the face. Bubble sits above the body. */
export const metrics: Record<AgentId, { headY: number; bubbleY: number }> = {
  muse: { headY: 1.3, bubbleY: 1.92 },
  grokbot: { headY: 0.78, bubbleY: 1.48 },
  claude: { headY: 1.16, bubbleY: 1.74 },
  dots: { headY: 0.9, bubbleY: 1.52 },
};

export const bounce: Record<AgentId, { speed: number; phase: number }> = {
  muse: { speed: 2.15, phase: 0.2 },
  grokbot: { speed: 2.75, phase: 1.35 },
  claude: { speed: 2.4, phase: 2.15 },
  dots: { speed: 1.85, phase: 3.05 },
};
