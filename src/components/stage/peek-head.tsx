"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { NoToneMapping, SRGBColorSpace } from "three";
import type { Group } from "three";
import type { AgentId, PeekSlot } from "@/lib/agents";
import { metrics } from "@/components/stage/art";
import { CharacterModel, type LookRef } from "@/components/stage/characters";

/**
 * Crop offsets, in head-local space, so the window border hides the body.
 * left: Muse's hair stays in frame. topRight: a face in the corner.
 * bottom: the top of a head rising into view.
 */
const shift: Record<PeekSlot, [number, number, number]> = {
  left: [-0.22, 0.02, 0],
  topRight: [0.34, 0.3, 0],
  bottom: [0.0, -0.48, 0],
};

const rot: Record<PeekSlot, [number, number, number]> = {
  left: [0.08, 0.5, 0],
  topRight: [0.42, -0.62, -0.06],
  bottom: [-0.48, 0.04, 0],
};

const duckDir: Record<PeekSlot, [number, number]> = {
  left: [-1, 0],
  topRight: [0.65, 1],
  bottom: [0, -1],
};

const baseLook: Record<PeekSlot, { x: number; y: number }> = {
  left: { x: 0.7, y: 0.05 },
  topRight: { x: -0.75, y: -0.4 },
  bottom: { x: 0.05, y: 0.75 },
};

function PeekRig({
  id,
  slot,
  lookRef,
  motion,
}: {
  id: AgentId;
  slot: PeekSlot;
  lookRef: LookRef;
  motion: boolean;
}) {
  const ref = useRef<Group>(null);
  const eyes = useRef({ x: baseLook[slot].x, y: baseLook[slot].y });
  const phase = metrics[id].headY;

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const bob = motion ? Math.sin(t * 1.45 + phase) * 0.03 : 0;
    let duck = 0;
    if (motion) {
      const cycle = (t + phase) % 7.2;
      if (cycle > 5.8) duck = Math.sin(((cycle - 5.8) / 1.4) * Math.PI);
    }
    const [ox, oy] = duckDir[slot];
    const [sx, sy, sz] = shift[slot];
    group.position.set(
      sx + ox * duck * 0.42,
      sy + bob + oy * duck * 0.42 - metrics[id].headY,
      sz,
    );
    const [rx, ry] = rot[slot];
    group.rotation.set(rx, ry, motion ? Math.sin(t * 0.7 + phase) * 0.04 : 0);
    const typed = lookRef.current ?? { x: 0, y: 0 };
    eyes.current.x = baseLook[slot].x + typed.x;
    eyes.current.y = baseLook[slot].y + typed.y;
  });

  return (
    <group
      ref={ref}
      position={[
        shift[slot][0],
        shift[slot][1] - metrics[id].headY,
        shift[slot][2],
      ]}
      rotation={rot[slot]}
    >
      <CharacterModel id={id} motion={motion} lookRef={eyes} />
    </group>
  );
}

export function PeekHead({
  id,
  slot,
  lookRef,
  motion,
}: {
  id: AgentId;
  slot: PeekSlot;
  lookRef: LookRef;
  motion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      frameloop={motion ? "always" : "never"}
      camera={{ position: [0, 0.05, slot === "left" ? 2.55 : 2.15], fov: slot === "left" ? 34 : 30 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        toneMapping: NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = SRGBColorSpace;
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} color="#f4ead8" />
      <directionalLight position={[2, 3, 3]} intensity={1.3} color="#fff6e8" />
      <PeekRig id={id} slot={slot} lookRef={lookRef} motion={motion} />
    </Canvas>
  );
}
