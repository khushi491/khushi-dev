import type { AgentId } from "@/lib/agents";

export type Scuffle = {
  a: AgentId;
  b: AgentId;
  speaker: AgentId;
  lineA: string;
  lineB: string;
  startedAt: number;
  duration: number;
};

export type Point = { x: number; y: number };

export type ScufflePose = {
  x: number;
  y: number;
  squash: number;
  rot: number;
  face: number;
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** Playful bump. `along` is toward the other character, then a shove back. */
export function scufflePose(
  id: AgentId,
  home: Point,
  other: Point,
  scuffle: Scuffle | null,
  now: number,
): ScufflePose | null {
  if (!scuffle || (id !== scuffle.a && id !== scuffle.b)) return null;

  const u = clamp01((now - scuffle.startedAt) / scuffle.duration);
  const dx = other.x - home.x;
  const dy = other.y - home.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const speaker = id === scuffle.speaker;

  let along = 0;
  let squash = 0;
  let rot = 0;

  if (u < 0.28) {
    along = smooth(u / 0.28) * 0.34;
  } else if (u < 0.42) {
    const k = (u - 0.28) / 0.14;
    along = 0.34;
    squash = Math.sin(k * Math.PI);
    rot = (speaker ? 1 : -1) * 0.28 * Math.sin(k * Math.PI);
  } else if (u < 0.68) {
    const k = smooth((u - 0.42) / 0.26);
    along = speaker ? 0.34 * (1 - k * 0.35) : 0.34 - k * 0.72;
    rot = speaker ? 0.06 : -0.32 * (1 - k);
    squash = (1 - k) * 0.35;
  } else {
    const k = smooth((u - 0.68) / 0.32);
    const from = speaker ? 0.22 : -0.38;
    along = from * (1 - k);
  }

  return {
    x: home.x + ux * along,
    y: home.y + uy * along + squash * 0.05,
    squash,
    rot,
    face: ux * 0.4 * Math.min(1, u * 3),
  };
}
