"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import type { Group } from "three";
import type { AgentId } from "@/lib/agents";
import { metrics, palette } from "@/components/stage/art";

export type LookRef = RefObject<{ x: number; y: number }>;

type ModelProps = {
  motion: boolean;
  lookRef?: LookRef;
};

/**
 * Toy cast matched to docs/references. Proportions live in this file
 * and in art.ts so a new reference is easy to follow.
 * Dot is a glossy blue blob, Muse a plush yeti, Grok a satin sphere,
 * Claude Duet a glossy orange flex.
 */

function BlinkGroup({
  children,
  phase,
  motion,
  lookRef,
}: {
  children: React.ReactNode;
  phase: number;
  motion: boolean;
  lookRef?: LookRef;
}) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const look = lookRef?.current;
    const t = state.clock.elapsedTime;
    if (look) {
      group.position.x = look.x * 0.04;
      group.position.y = look.y * 0.028;
    } else if (motion) {
      group.position.x = Math.sin(t * 0.35 + phase) * 0.01;
      group.position.y = Math.cos(t * 0.28 + phase) * 0.008;
    }
    let blink = 1;
    if (motion) {
      const cycle = (t + phase) % 4.6;
      if (cycle > 4.15) {
        const u = (cycle - 4.15) / 0.45;
        blink = u < 0.5 ? 1 - u * 1.7 : 0.15 + (u - 0.5) * 1.7;
      }
    }
    group.scale.y = Math.max(0.08, blink);
  });

  return <group ref={ref}>{children}</group>;
}

function MotionMarks({
  color,
  phase,
  motion,
  position,
}: {
  color: string;
  phase: number;
  motion: boolean;
  position: [number, number, number];
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const group = ref.current;
    if (!group || !motion) return;
    const t = state.clock.elapsedTime + phase;
    group.children.forEach((child, index) => {
      const pulse = 0.7 + Math.sin(t * 4 + index) * 0.3;
      child.scale.setScalar(Math.max(0.2, pulse));
    });
  });
  return (
    <group ref={ref} position={position}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[index * 0.07, 0.1 - index * 0.07, 0]}
          rotation={[0, 0, 0.5 + index * 0.35]}
        >
          <capsuleGeometry args={[0.014, 0.07, 3, 5]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function Gloss({
  color,
  roughness = 0.2,
  clearcoat = 0.9,
  clearcoatRoughness = 0.16,
  emissive = "#000000",
  emissiveIntensity = 0,
}: {
  color: string;
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={0.05}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

const dotLobes: [number, number, number, number][] = [
  [0, 0.72, 0.04, 0.38],
  [-0.2, 0.8, 0.08, 0.28],
  [0.22, 0.78, 0.08, 0.27],
  [0.0, 0.98, 0.04, 0.24],
  [-0.14, 0.52, 0.1, 0.22],
  [0.16, 0.5, 0.1, 0.2],
  [0.06, 0.7, 0.16, 0.2],
];

function Dot({ motion, lookRef }: ModelProps) {
  return (
    <group>
      {dotLobes.map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[radius, 18, 14]} />
          <Gloss color={index % 3 === 0 ? palette.dotDeep : palette.dot} />
        </mesh>
      ))}
      <group position={[-0.02, 1.08, 0.1]} rotation={[0.35, 0.15, -0.7]}>
        <mesh scale={[1.35, 0.42, 1.25]}>
          <sphereGeometry args={[0.26, 16, 12]} />
          <meshStandardMaterial color={palette.beret} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshStandardMaterial color={palette.beret} roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.02, metrics.dots.headY, 0.42]}>
        <BlinkGroup phase={3.1} motion={motion} lookRef={lookRef}>
          <mesh position={[-0.1, 0.02, 0]} scale={[0.72, 1.05, 0.7]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
          <mesh position={[0.1, 0.02, 0]} scale={[0.72, 1.05, 0.7]}>
            <sphereGeometry args={[0.055, 12, 10]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
        </BlinkGroup>
      </group>
      <MotionMarks
        color={palette.dotMark}
        phase={0.4}
        motion={motion}
        position={[-0.55, 1.05, 0.15]}
      />
    </group>
  );
}

function WaveArm({ motion }: { motion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const wave = motion ? Math.sin(state.clock.elapsedTime * 3.2) * 0.45 : 0.15;
    group.rotation.z = -0.9 + wave;
  });
  return (
    <group ref={ref} position={[0.34, 0.78, 0.08]}>
      <mesh>
        <capsuleGeometry args={[0.07, 0.16, 4, 8]} />
        <meshPhysicalMaterial
          color={palette.muse}
          roughness={0.95}
          sheen={0.65}
          sheenColor={palette.musePink}
          sheenRoughness={0.7}
        />
      </mesh>
      <mesh position={[0.02, 0.16, 0.02]}>
        <sphereGeometry args={[0.075, 12, 10]} />
        <meshPhysicalMaterial
          color={palette.musePink}
          roughness={0.85}
          sheen={0.4}
          sheenColor="#ffd0dc"
        />
      </mesh>
    </group>
  );
}

function Plush() {
  return (
    <meshPhysicalMaterial
      color={palette.muse}
      roughness={0.96}
      metalness={0}
      sheen={0.75}
      sheenColor={palette.musePink}
      sheenRoughness={0.65}
    />
  );
}

function Muse({ motion, lookRef }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.12, 0.12, 0.06]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <Plush />
      </mesh>
      <mesh position={[0.12, 0.12, 0.06]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <Plush />
      </mesh>
      <mesh position={[0, 0.48, 0]} scale={[0.92, 1.05, 0.88]}>
        <sphereGeometry args={[0.38, 22, 16]} />
        <Plush />
      </mesh>
      <mesh position={[0, metrics.muse.headY, 0.04]}>
        <sphereGeometry args={[0.34, 22, 16]} />
        <Plush />
      </mesh>
      <mesh position={[0, 1.02, 0.28]} scale={[0.85, 0.95, 0.28]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshPhysicalMaterial color="#f8eee6" roughness={0.9} sheen={0.4} sheenColor={palette.musePink} />
      </mesh>
      <mesh position={[0, 1.02, 0.22]} rotation={[0.15, 0, 0]}>
        <torusGeometry args={[0.2, 0.045, 8, 18]} />
        <meshPhysicalMaterial color={palette.museDeep} roughness={0.9} sheen={0.5} sheenColor={palette.musePink} />
      </mesh>
      <mesh position={[-0.32, 0.55, 0.06]} rotation={[0.1, 0, 0.7]}>
        <capsuleGeometry args={[0.065, 0.12, 4, 8]} />
        <Plush />
      </mesh>
      <WaveArm motion={motion} />
      <group position={[0, 1.02, 0.4]}>
        <BlinkGroup phase={0.4} motion={motion} lookRef={lookRef}>
          <mesh position={[-0.08, 0.03, 0]}>
            <sphereGeometry args={[0.028, 10, 8]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
          <mesh position={[0.08, 0.03, 0]}>
            <sphereGeometry args={[0.028, 10, 8]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
        </BlinkGroup>
        <mesh position={[0, -0.06, 0.02]} rotation={[0.1, 0, Math.PI]}>
          <torusGeometry args={[0.045, 0.01, 6, 10, Math.PI]} />
          <meshBasicMaterial color="#5c4038" />
        </mesh>
        <mesh position={[-0.12, -0.02, 0]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshBasicMaterial color={palette.musePink} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.12, -0.02, 0]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshBasicMaterial color={palette.musePink} transparent opacity={0.7} />
        </mesh>
      </group>
      <MotionMarks
        color={palette.museMark}
        phase={1.2}
        motion={motion}
        position={[0.55, 1.15, 0.1]}
      />
    </group>
  );
}

function Grok({ motion, lookRef }: ModelProps) {
  return (
    <group>
      <mesh position={[0, metrics.grokbot.headY, 0]}>
        <sphereGeometry args={[0.58, 28, 22]} />
        <Gloss color={palette.grok} roughness={0.32} clearcoat={0.55} clearcoatRoughness={0.38} />
      </mesh>
      <group position={[0, 0.78, 0.62]}>
        <BlinkGroup phase={1.3} motion={motion} lookRef={lookRef}>
          <mesh position={[-0.14, 0.02, 0]} rotation={[0, 0, 0.45]}>
            <capsuleGeometry args={[0.055, 0.09, 6, 10]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
          <mesh position={[0.14, 0.02, 0]} rotation={[0, 0, -0.45]}>
            <capsuleGeometry args={[0.055, 0.09, 6, 10]} />
            <meshBasicMaterial color={palette.eye} />
          </mesh>
        </BlinkGroup>
      </group>
      <MotionMarks
        color={palette.grokMark}
        phase={2.1}
        motion={motion}
        position={[0.48, 1.15, 0.2]}
      />
    </group>
  );
}

function FlexArms({ motion }: { motion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const group = ref.current;
    if (!group || !motion) return;
    const pump = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.06;
    group.scale.set(pump, pump, pump);
  });
  const arm = (side: number) => (
    <group position={[side * 0.42, 0.86, 0.12]} rotation={[0.15, 0, side * -1.25]}>
      <mesh>
        <capsuleGeometry args={[0.085, 0.12, 4, 8]} />
        <Gloss color={palette.claude} emissive={palette.claudeGlow} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[side * 0.02, 0.14, 0]} rotation={[0, 0, side * 1.15]}>
        <capsuleGeometry args={[0.06, 0.09, 4, 8]} />
        <Gloss color={palette.claude} emissive={palette.claudeGlow} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
  return (
    <group ref={ref}>
      {arm(-1)}
      {arm(1)}
    </group>
  );
}

function Sparkles({ motion }: { motion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const group = ref.current;
    if (!group || !motion) return;
    group.rotation.y = state.clock.elapsedTime * 0.6;
    group.children.forEach((child, index) => {
      const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 5 + index) * 0.4;
      child.scale.setScalar(Math.max(0.15, pulse));
    });
  });
  return (
    <group ref={ref} position={[0.15, 1.05, 0]}>
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (index / 6) * Math.PI * 2;
        const radius = 0.55 + (index % 2) * 0.12;
        return (
          <mesh key={index} position={[Math.cos(angle) * radius, Math.sin(angle) * 0.28, Math.sin(angle) * 0.2]}>
            <sphereGeometry args={[0.025, 8, 6]} />
            <meshBasicMaterial color={index % 2 ? "#fff6d8" : palette.claudeMark} />
          </mesh>
        );
      })}
    </group>
  );
}

function useSquiggle() {
  return useMemo(() => {
    const points: Vector3[] = [];
    const loop = (cx: number, start: number, end: number) => {
      const steps = 18;
      for (let i = 0; i <= steps; i += 1) {
        const angle = start + ((end - start) * i) / steps;
        points.push(new Vector3(cx + Math.cos(angle) * 0.1, Math.sin(angle) * 0.07, 0));
      }
    };
    loop(-0.1, Math.PI * 0.15, Math.PI * 1.85);
    loop(0.1, Math.PI * 0.15, Math.PI * 1.85);
    const curve = new CatmullRomCurve3(points);
    return new TubeGeometry(curve, 40, 0.028, 6, false);
  }, []);
}

function ClaudeDuet({ motion, lookRef }: ModelProps) {
  const squiggle = useSquiggle();
  return (
    <group>
      <pointLight position={[0, 0.9, 0.4]} intensity={0.55} color={palette.claudeGlow} distance={3.2} />
      <mesh position={[0, 0.78, 0]} scale={[1, 1.06, 0.96]}>
        <sphereGeometry args={[0.46, 26, 20]} />
        <Gloss color={palette.claude} roughness={0.18} emissive={palette.claudeGlow} emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[-0.14, 0.22, 0.08]}>
        <capsuleGeometry args={[0.07, 0.06, 4, 8]} />
        <Gloss color={palette.claude} emissive={palette.claudeGlow} emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.14, 0.22, 0.08]}>
        <capsuleGeometry args={[0.07, 0.06, 4, 8]} />
        <Gloss color={palette.claude} emissive={palette.claudeGlow} emissiveIntensity={0.15} />
      </mesh>
      <FlexArms motion={motion} />
      <group position={[0, metrics.claude.headY, 0.52]}>
        <BlinkGroup phase={2.2} motion={motion} lookRef={lookRef}>
          <mesh geometry={squiggle} rotation={[0.15, 0, 0]}>
            <meshBasicMaterial color="#141414" />
          </mesh>
        </BlinkGroup>
      </group>
      <Sparkles motion={motion} />
    </group>
  );
}

export function CharacterModel({
  id,
  motion,
  lookRef,
}: ModelProps & { id: AgentId }) {
  if (id === "muse") return <Muse motion={motion} lookRef={lookRef} />;
  if (id === "grokbot") return <Grok motion={motion} lookRef={lookRef} />;
  if (id === "claude") return <ClaudeDuet motion={motion} lookRef={lookRef} />;
  return <Dot motion={motion} lookRef={lookRef} />;
}
