"use client";

import { useRef, type RefObject } from "react";
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
 * Stylized cast. Proportions and colors live here (and in art.ts) so a
 * later sketch can be matched without hunting through the stage logic.
 * Hair strands are head-local: y 0 is the head center, negative y falls
 * toward the dress.
 */
const hairStrands: { color: string; radius: number; pts: [number, number, number][] }[] = [
  {
    color: palette.hair,
    radius: 0.046,
    pts: [
      [-0.02, 0.18, -0.1],
      [-0.04, -0.2, -0.14],
      [0.0, -0.55, -0.06],
      [0.04, -0.95, 0.02],
    ],
  },
  {
    color: palette.hairDeep,
    radius: 0.04,
    pts: [
      [0.14, 0.14, -0.02],
      [0.24, -0.22, 0.04],
      [0.26, -0.62, 0.1],
      [0.14, -1.0, 0.1],
    ],
  },
  {
    color: palette.hair,
    radius: 0.04,
    pts: [
      [-0.16, 0.12, 0.0],
      [-0.28, -0.24, 0.08],
      [-0.26, -0.66, 0.12],
      [-0.12, -1.02, 0.06],
    ],
  },
  {
    color: palette.hair,
    radius: 0.034,
    pts: [
      [0.22, 0.06, 0.1],
      [0.34, -0.28, 0.16],
      [0.28, -0.7, 0.14],
    ],
  },
  {
    color: palette.hairDeep,
    radius: 0.034,
    pts: [
      [-0.22, 0.04, 0.12],
      [-0.36, -0.3, 0.16],
      [-0.28, -0.74, 0.12],
    ],
  },
  {
    color: palette.hairGold,
    radius: 0.016,
    pts: [
      [0.05, 0.16, -0.12],
      [0.1, -0.25, -0.14],
      [0.06, -0.7, -0.04],
    ],
  },
];

const hairGeometry = hairStrands.map((strand) => {
  const curve = new CatmullRomCurve3(
    strand.pts.map((point) => new Vector3(...point)),
  );
  return new TubeGeometry(curve, 14, strand.radius, 5, false);
});

function BlinkGroup({
  children,
  rest,
  phase,
  motion,
  lookRef,
}: {
  children: React.ReactNode;
  rest: number;
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
      group.position.x = look.x * 0.045;
      group.position.y = look.y * 0.03;
    } else if (motion) {
      group.position.x = Math.sin(t * 0.35 + phase) * 0.012;
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
    group.scale.y = rest * Math.max(0.08, blink);
  });

  return (
    <group ref={ref} scale={[1, rest, 1]}>
      {children}
    </group>
  );
}

function Muse({ motion, lookRef }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.1, 0.07, 0.08]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={palette.skin} roughness={0.62} />
      </mesh>
      <mesh position={[0.1, 0.07, 0.08]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color={palette.skin} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.4, 0.78, 18]} />
        <meshStandardMaterial color={palette.dress} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.012, 6, 18]} />
        <meshStandardMaterial color={palette.gold} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.96, 0]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color={palette.dressLight} roughness={0.8} />
      </mesh>
      <mesh position={[0.34, 0.9, 0.05]} rotation={[0.15, 0, 0.85]}>
        <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
        <meshStandardMaterial color={palette.skin} roughness={0.62} />
      </mesh>
      <mesh position={[-0.34, 0.9, 0.05]} rotation={[0.15, 0, -0.85]}>
        <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
        <meshStandardMaterial color={palette.skin} roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.14, 0]}>
        <cylinderGeometry args={[0.055, 0.07, 0.12, 10]} />
        <meshStandardMaterial color={palette.skin} roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.16, 0.05]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.09, 0.011, 6, 14]} />
        <meshStandardMaterial color={palette.gold} metalness={0.45} roughness={0.32} />
      </mesh>
      <group position={[0, metrics.muse.headY, 0]}>
        <mesh>
          <sphereGeometry args={[0.29, 24, 18]} />
          <meshStandardMaterial color={palette.skin} roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.06, -0.14]} scale={[1.05, 1.12, 0.82]}>
          <sphereGeometry args={[0.31, 20, 14]} />
          <meshStandardMaterial color={palette.hair} roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.16, 0.16]} scale={[1.2, 0.38, 0.5]}>
          <sphereGeometry args={[0.2, 14, 10]} />
          <meshStandardMaterial color={palette.hair} roughness={0.74} />
        </mesh>
        {hairGeometry.map((geometry, index) => (
          <mesh key={index} geometry={geometry}>
            <meshStandardMaterial color={hairStrands[index].color} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.2, 0.16, 0.06]} rotation={[0.2, 0.2, 0.9]}>
          <torusGeometry args={[0.045, 0.01, 6, 10]} />
          <meshStandardMaterial color={palette.gold} metalness={0.55} roughness={0.3} />
        </mesh>
        <group position={[0, 0.02, 0.25]}>
          <BlinkGroup rest={0.48} phase={0.4} motion={motion} lookRef={lookRef}>
            <mesh position={[-0.09, 0, 0]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshBasicMaterial color={palette.eye} />
            </mesh>
            <mesh position={[0.09, 0, 0]}>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshBasicMaterial color={palette.eye} />
            </mesh>
          </BlinkGroup>
        </group>
        <mesh position={[0, -0.1, 0.27]} rotation={[0.15, 0, Math.PI]}>
          <torusGeometry args={[0.055, 0.012, 6, 12, Math.PI]} />
          <meshBasicMaterial color={palette.smile} />
        </mesh>
        <mesh position={[-0.16, -0.02, 0.2]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshBasicMaterial color={palette.blush} transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.16, -0.02, 0.2]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshBasicMaterial color={palette.blush} transparent opacity={0.45} />
        </mesh>
      </group>
    </group>
  );
}

function Grokbot({ motion, lookRef }: ModelProps) {
  return (
    <group>
      <mesh position={[-0.2, 0.1, 0.12]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color={palette.grokDeep} roughness={0.6} />
      </mesh>
      <mesh position={[0.2, 0.1, 0.12]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color={palette.grokDeep} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0]} scale={[1.02, 1.08, 0.96]}>
        <sphereGeometry args={[0.56, 26, 20]} />
        <meshStandardMaterial color={palette.grok} roughness={0.55} />
      </mesh>
      <group position={[0, metrics.grokbot.headY, 0.56]}>
        <BlinkGroup rest={1} phase={1.3} motion={motion} lookRef={lookRef}>
          <mesh position={[-0.16, 0.02, 0]}>
            <sphereGeometry args={[0.078, 14, 12]} />
            <meshBasicMaterial color={palette.eye} />
            <mesh position={[-0.02, 0.03, 0.05]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#fffaf2" />
            </mesh>
          </mesh>
          <mesh position={[0.16, 0.02, 0]}>
            <sphereGeometry args={[0.078, 14, 12]} />
            <meshBasicMaterial color={palette.eye} />
            <mesh position={[-0.02, 0.03, 0.05]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#fffaf2" />
            </mesh>
          </mesh>
        </BlinkGroup>
      </group>
      <mesh position={[0, 0.46, 0.58]} rotation={[0.1, 0, Math.PI]}>
        <torusGeometry args={[0.07, 0.014, 6, 12, Math.PI]} />
        <meshBasicMaterial color={palette.smile} />
      </mesh>
      <mesh position={[-0.28, 0.58, 0.42]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshBasicMaterial color={palette.blush} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0.28, 0.58, 0.42]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshBasicMaterial color={palette.blush} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ClaudeDuel({ motion, lookRef }: ModelProps) {
  return (
    <group>
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.32, 18, 14]} />
        <meshStandardMaterial color={palette.shirt} roughness={0.72} />
      </mesh>
      <mesh position={[0.36, 0.5, 0.08]} rotation={[0.3, 0, -1.05]}>
        <capsuleGeometry args={[0.045, 0.2, 4, 8]} />
        <meshStandardMaterial color={palette.claude} roughness={0.6} />
      </mesh>
      <mesh position={[-0.36, 0.5, 0.08]} rotation={[0.3, 0, 1.05]}>
        <capsuleGeometry args={[0.045, 0.2, 4, 8]} />
        <meshStandardMaterial color={palette.claude} roughness={0.6} />
      </mesh>
      <mesh position={[0.46, 0.32, 0.12]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color={palette.claude} roughness={0.6} />
      </mesh>
      <mesh position={[-0.46, 0.32, 0.12]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color={palette.claude} roughness={0.6} />
      </mesh>
      <group position={[0, metrics.claude.headY, 0]}>
        <mesh>
          <sphereGeometry args={[0.34, 24, 18]} />
          <meshStandardMaterial color={palette.claude} roughness={0.55} />
        </mesh>
        <mesh position={[0.08, 0.32, 0.02]} rotation={[0.1, 0, 0.45]}>
          <coneGeometry args={[0.07, 0.22, 8]} />
          <meshStandardMaterial color={palette.hair} roughness={0.7} />
        </mesh>
        <mesh position={[-0.04, 0.34, 0]} rotation={[0, 0, -0.25]}>
          <coneGeometry args={[0.055, 0.16, 8]} />
          <meshStandardMaterial color={palette.hair} roughness={0.7} />
        </mesh>
        <mesh position={[-0.11, 0.16, 0.32]} rotation={[0, 0, 0.55]}>
          <capsuleGeometry args={[0.014, 0.09, 4, 6]} />
          <meshBasicMaterial color={palette.hair} />
        </mesh>
        <mesh position={[0.12, 0.11, 0.32]} rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.014, 0.1, 4, 6]} />
          <meshBasicMaterial color={palette.hair} />
        </mesh>
        <group position={[0, 0.04, 0.31]}>
          <BlinkGroup rest={1} phase={2.1} motion={motion} lookRef={lookRef}>
            <mesh position={[-0.1, 0, 0]}>
              <sphereGeometry args={[0.07, 14, 12]} />
              <meshBasicMaterial color={palette.sclera} />
              <mesh position={[-0.02, -0.005, 0.04]}>
                <sphereGeometry args={[0.038, 12, 10]} />
                <meshBasicMaterial color={palette.eye} />
              </mesh>
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <sphereGeometry args={[0.07, 14, 12]} />
              <meshBasicMaterial color={palette.sclera} />
              <mesh position={[-0.015, -0.005, 0.04]}>
                <sphereGeometry args={[0.038, 12, 10]} />
                <meshBasicMaterial color={palette.eye} />
              </mesh>
            </mesh>
          </BlinkGroup>
        </group>
        <mesh position={[0.04, -0.1, 0.32]} rotation={[0.2, 0, Math.PI + 0.4]}>
          <torusGeometry args={[0.06, 0.013, 6, 12, Math.PI * 0.9]} />
          <meshBasicMaterial color={palette.smile} />
        </mesh>
        <mesh position={[0.18, -0.02, 0.26]}>
          <sphereGeometry args={[0.055, 10, 8]} />
          <meshBasicMaterial color={palette.blush} transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

const puffs: [number, number, number, number, string][] = [
  [0, 0.86, 0, 0.4, palette.cloud],
  [-0.34, 0.9, 0.04, 0.3, palette.cloudDeep],
  [0.36, 0.88, 0.02, 0.29, palette.cloud],
  [0.04, 1.16, -0.02, 0.26, palette.cloud],
  [-0.12, 0.7, 0.2, 0.24, palette.cloudDeep],
  [0.24, 0.68, 0.18, 0.22, palette.cloud],
  [-0.28, 1.06, 0.08, 0.2, palette.cloud],
  [0.2, 1.08, 0.1, 0.18, palette.cloudDeep],
  [0.06, 0.78, 0.24, 0.2, palette.cloud],
];

function Dots({ motion, lookRef }: ModelProps) {
  return (
    <group>
      {puffs.map(([x, y, z, radius, color], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[radius, 16, 12]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}
      <group position={[0.02, metrics.dots.headY, 0.5]}>
        <BlinkGroup rest={1} phase={3.1} motion={motion} lookRef={lookRef}>
          <mesh position={[-0.07, 0, 0]}>
            <sphereGeometry args={[0.042, 12, 10]} />
            <meshBasicMaterial color={palette.eye} />
            <mesh position={[-0.012, 0.014, 0.028]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#fffaf2" />
            </mesh>
          </mesh>
          <mesh position={[0.08, 0, 0]}>
            <sphereGeometry args={[0.042, 12, 10]} />
            <meshBasicMaterial color={palette.eye} />
            <mesh position={[-0.012, 0.014, 0.028]}>
              <sphereGeometry args={[0.012, 8, 8]} />
              <meshBasicMaterial color="#fffaf2" />
            </mesh>
          </mesh>
        </BlinkGroup>
      </group>
      <mesh position={[0.04, 0.74, 0.5]} rotation={[0.2, 0, Math.PI]}>
        <torusGeometry args={[0.04, 0.01, 6, 10, Math.PI]} />
        <meshBasicMaterial color={palette.smile} />
      </mesh>
      <mesh position={[-0.16, 0.78, 0.4]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshBasicMaterial color={palette.blush} transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.22, 0.78, 0.4]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshBasicMaterial color={palette.blush} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

export function CharacterModel({
  id,
  motion,
  lookRef,
}: ModelProps & { id: AgentId }) {
  if (id === "muse") return <Muse motion={motion} lookRef={lookRef} />;
  if (id === "grokbot") return <Grokbot motion={motion} lookRef={lookRef} />;
  if (id === "claude") return <ClaudeDuel motion={motion} lookRef={lookRef} />;
  return <Dots motion={motion} lookRef={lookRef} />;
}
