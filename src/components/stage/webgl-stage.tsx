"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import {
  MathUtils,
  MeshBasicMaterial,
  NoToneMapping,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
} from "three";
import type { Group, Mesh } from "three";
import {
  agentOrder,
  scuffleLines,
  type AgentId,
} from "@/lib/agents";
import { bounce, metrics } from "@/components/stage/art";
import { CharacterModel } from "@/components/stage/characters";
import {
  scufflePose,
  type Point,
  type Scuffle,
} from "@/components/stage/scuffle";

type Layout = "row" | "grid";

const homes: Record<Layout, Record<AgentId, Point>> = {
  row: {
    muse: { x: -1.78, y: 0 },
    grokbot: { x: -0.58, y: 0 },
    claude: { x: 0.58, y: 0 },
    dots: { x: 1.78, y: 0 },
  },
  grid: {
    muse: { x: -0.92, y: 1.15 },
    grokbot: { x: 0.92, y: 1.15 },
    claude: { x: -0.92, y: -0.15 },
    dots: { x: 0.92, y: -0.15 },
  },
};

const scaleFor: Record<Layout, number> = { row: 1, grid: 0.72 };

function makeStar() {
  const shape = new Shape();
  const spikes = 4;
  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? 0.09 : 0.03;
    const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new ShapeGeometry(shape);
}

const cameraFor: Record<Layout, { position: [number, number, number]; fov: number }> = {
  row: { position: [0, 0.86, 6.75], fov: 32 },
  grid: { position: [0, 0.9, 8.3], fov: 36 },
};

function Actor({
  id,
  home,
  other,
  layoutScale,
  scuffle,
  hovered,
  victory,
  line,
}: {
  id: AgentId;
  home: Point;
  other: Point | null;
  layoutScale: number;
  scuffle: Scuffle | null;
  hovered: boolean;
  victory: boolean;
  line: string | null;
}) {
  const body = useRef<Group>(null);
  const shadow = useRef<Mesh>(null);
  const perk = useRef(0);
  const { speed, phase } = bounce[id];

  useFrame((_, delta) => {
    const group = body.current;
    if (!group) return;
    const now = performance.now();
    const fight = other ? scufflePose(id, home, other, scuffle, now) : null;
    perk.current = MathUtils.damp(perk.current, hovered || victory ? 1 : 0, 7, delta);

    let x = home.x;
    let y = home.y;
    let squash = 0;
    let stretch = 0;
    let rot = 0;
    let face = 0;

    if (fight) {
      x = fight.x;
      y = fight.y;
      squash = fight.squash;
      rot = fight.rot;
      face = fight.face;
    } else {
      const wave = Math.sin(now / 1000 * speed + phase);
      const hop = Math.pow(Math.abs(wave), 1.2) * 0.18;
      const grounded = Math.max(0, 1 - Math.abs(wave) * 4);
      squash = Math.min(1, grounded * grounded);
      stretch = Math.min(1, hop / 0.18);
      y = home.y + hop;
    }

    y += perk.current * 0.08;
    if (victory) rot += Math.sin(now / 140) * 0.08;

    group.position.set(x, y, 0);
    const sy = (1 - squash * 0.22 + stretch * 0.1) * (1 + perk.current * 0.06);
    const sx = (1 + squash * 0.16 - stretch * 0.05) * (1 + perk.current * 0.02);
    group.scale.set(sx * layoutScale, sy * layoutScale, sx * layoutScale);
    group.rotation.z = rot;
    group.rotation.y = face;

    if (shadow.current) {
      const hopAmount = Math.max(0, y - home.y);
      shadow.current.position.set(x, home.y + 0.02, 0.15);
      const spread = layoutScale * (1 + squash * 0.3 - hopAmount * 0.45);
      shadow.current.scale.setScalar(Math.max(0.4, spread));
      const material = shadow.current.material as MeshBasicMaterial;
      material.opacity = 0.18 + squash * 0.08;
    }
  });

  return (
    <>
      <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[home.x, home.y + 0.02, 0.15]}>
        <circleGeometry args={[0.36, 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <group ref={body} position={[home.x, home.y, 0]}>
        <CharacterModel id={id} motion />
        {line ? (
          <Html
            position={[0, metrics[id].bubbleY, 0]}
            center
            wrapperClass="speech-anchor"
            zIndexRange={[20, 0]}
          >
            <div className="speech-bubble">{line}</div>
          </Html>
        ) : null}
      </group>
    </>
  );
}

function Dust({
  scuffle,
  homesFor,
}: {
  scuffle: Scuffle | null;
  homesFor: Record<AgentId, Point>;
}) {
  const ref = useRef<Group>(null);
  const star = useMemo(() => makeStar(), []);

  useFrame(() => {
    const group = ref.current;
    if (!group || !scuffle) {
      if (group) group.visible = false;
      return;
    }
    const age = (performance.now() - scuffle.startedAt) / scuffle.duration;
    const puff = age > 0.26 && age < 0.62;
    group.visible = puff;
    if (!puff) return;
    const t = (age - 0.26) / 0.36;
    const a = homesFor[scuffle.a];
    const b = homesFor[scuffle.b];
    group.position.set((a.x + b.x) / 2, (a.y + b.y) / 2 + 0.78, 0.55);
    group.children.forEach((child, index) => {
      const angle = (index / group.children.length) * Math.PI * 2 + 0.4;
      const dist = t * (0.45 + (index % 3) * 0.08);
      child.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist + t * 0.08, 0);
      child.scale.setScalar(Math.max(0.001, (1 - t) * (index % 2 === 0 ? 1 : 0.65)));
      child.rotation.z = t * 2 + index;
    });
  });

  return (
    <group ref={ref} visible={false}>
      {Array.from({ length: 8 }, (_, index) =>
        index % 2 === 0 ? (
          <mesh key={index} geometry={star}>
            <meshBasicMaterial color={index % 4 === 0 ? "#c4a56a" : "#f3ead7"} />
          </mesh>
        ) : (
          <mesh key={index}>
            <sphereGeometry args={[0.045, 8, 6]} />
            <meshBasicMaterial color="#f6f0e4" transparent opacity={0.85} />
          </mesh>
        ),
      )}
    </group>
  );
}

function StageScene({
  layout,
  scuffle,
  hovered,
  victoryId,
  victoryLine,
}: {
  layout: Layout;
  scuffle: Scuffle | null;
  hovered: AgentId | null;
  victoryId: AgentId | null;
  victoryLine: string | null;
}) {
  const spots = homes[layout];
  const layoutScale = scaleFor[layout];

  const otherFor = (id: AgentId): Point | null => {
    if (!scuffle || (id !== scuffle.a && id !== scuffle.b)) return null;
    const otherId = id === scuffle.a ? scuffle.b : scuffle.a;
    return spots[otherId];
  };

  const lineFor = (id: AgentId) => {
    if (victoryId === id && victoryLine) return victoryLine;
    if (!scuffle) return null;
    if (id === scuffle.a) return scuffle.lineA;
    if (id === scuffle.b) return scuffle.lineB;
    return null;
  };

  return (
    <>
      <hemisphereLight args={["#f4ead8", "#2a261c", 0.72]} />
      <ambientLight intensity={0.32} color="#f3ead7" />
      <directionalLight position={[3.2, 5.4, 4]} intensity={1.55} color="#fff6e8" />
      <directionalLight position={[-3.4, 2.4, -2]} intensity={0.4} color="#e7c98a" />
      <pointLight position={[0, 1.5, 3.4]} intensity={0.28} color="#c56a42" distance={9} />
      {layout === "row" ? (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
            <circleGeometry args={[3.2, 48]} />
            <meshStandardMaterial color="#171814" roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
            <ringGeometry args={[3.0, 3.16, 48]} />
            <meshBasicMaterial color="#c4a56a" />
          </mesh>
        </group>
      ) : null}
      {agentOrder.map((id) => (
        <Actor
          key={id}
          id={id}
          home={spots[id]}
          other={otherFor(id)}
          layoutScale={layoutScale}
          scuffle={scuffle}
          hovered={hovered === id}
          victory={victoryId === id}
          line={lineFor(id)}
        />
      ))}
      <Dust scuffle={scuffle} homesFor={spots} />
    </>
  );
}

function useScuffle(playing: boolean, hovered: AgentId | null, victoryId: AgentId | null) {
  const [scuffle, setScuffle] = useState<Scuffle | null>(null);
  const hoveredRef = useRef(hovered);
  const victoryRef = useRef(victoryId);

  useEffect(() => {
    hoveredRef.current = hovered;
    victoryRef.current = victoryId;
  }, [hovered, victoryId]);

  useEffect(() => {
    if (!playing) return;
    let alive = true;
    const timers: number[] = [];
    let line = 0;

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (alive) fn();
      }, ms);
      timers.push(id);
    };

    const kick = () => {
      if (hoveredRef.current || victoryRef.current) {
        later(kick, 700);
        return;
      }
      const first = Math.floor(Math.random() * agentOrder.length);
      let second = Math.floor(Math.random() * (agentOrder.length - 1));
      if (second >= first) second += 1;
      const a = agentOrder[first];
      const b = agentOrder[second];
      const duration = 2600;
      setScuffle({
        a,
        b,
        speaker: a,
        lineA: scuffleLines[line % scuffleLines.length],
        lineB: scuffleLines[(line + 1) % scuffleLines.length],
        startedAt: performance.now(),
        duration,
      });
      line += 2;
      later(() => setScuffle(null), duration);
      later(kick, duration + 4200 + Math.random() * 1800);
    };

    later(kick, 2200);
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
      window.setTimeout(() => setScuffle(null), 0);
    };
  }, [playing]);

  return scuffle;
}

export function WebGLStage({
  layout,
  playing,
  hovered,
  victoryId,
  victoryLine,
  onReady,
}: {
  layout: Layout;
  playing: boolean;
  hovered: AgentId | null;
  victoryId: AgentId | null;
  victoryLine: string | null;
  onReady: () => void;
}) {
  const scuffle = useScuffle(playing && !victoryId, hovered, victoryId);
  const readySent = useRef(false);

  return (
    <Canvas
      key={layout}
      dpr={[1, 1.5]}
      frameloop={playing ? "always" : "never"}
      camera={cameraFor[layout]}
      performance={{ min: 0.5 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: NoToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = SRGBColorSpace;
        if (!readySent.current) {
          readySent.current = true;
          onReady();
        }
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <StageScene
        layout={layout}
        scuffle={playing ? scuffle : null}
        hovered={hovered}
        victoryId={victoryId}
        victoryLine={victoryLine}
      />
    </Canvas>
  );
}
