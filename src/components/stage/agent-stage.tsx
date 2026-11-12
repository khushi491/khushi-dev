"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IntroPanel } from "@/components/stage/intro-panel";
import { agentOrder, agents, type AgentId } from "@/lib/agents";

const WebGLStage = dynamic(
  () => import("@/components/stage/webgl-stage").then((mod) => mod.WebGLStage),
  { ssr: false },
);

type Mode = "boot" | "webgl" | "fallback";
type Phase = { type: "idle" } | { type: "victory" | "intro"; id: AgentId };

class WebGLBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AgentStage() {
  const labelId = useId();
  const frameRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("boot");
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>({ type: "idle" });
  const [hovered, setHovered] = useState<AgentId | null>(null);
  const [row, setRow] = useState(true);
  const [visible, setVisible] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ok = !reduced && hasWebGL();
    let idleId = 0;
    let timer = 0;
    const start = () => setMode(ok ? "webgl" : "fallback");
    if (ok && typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start);
    } else {
      timer = window.setTimeout(start, ok ? 48 : 0);
    }
    return () => {
      if (idleId) window.cancelIdleCallback(idleId);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const apply = () => setRow(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const close = useCallback(() => {
    const current = phaseRef.current;
    const id = current.type === "idle" ? null : current.id;
    setPop(true);
    window.setTimeout(() => setPop(false), 520);
    setPhase({ type: "idle" });
    if (!id) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(`agent-${id}`)?.focus();
      });
    });
  }, []);

  useEffect(() => {
    if (phase.type === "idle") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onDown = (event: MouseEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => {
      window.addEventListener("mousedown", onDown);
    }, 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
      window.clearTimeout(timer);
    };
  }, [phase.type, close]);

  const select = (id: AgentId) => {
    if (phase.type !== "idle") {
      if (phase.id !== id) setPhase({ type: "intro", id });
      return;
    }
    if (mode === "webgl" && ready) setPhase({ type: "victory", id });
    else setPhase({ type: "intro", id });
  };

  useEffect(() => {
    if (phase.type !== "victory") return;
    const timer = window.setTimeout(() => {
      setPhase({ type: "intro", id: phase.id });
    }, 880);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const intro = phase.type === "intro";
  const showCanvas = mode === "webgl";
  const showArt = mode !== "webgl" || !ready;
  const playing = showCanvas && ready && !intro && visible && !tabHidden;

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden rounded-[1.35rem] border-[3px] border-[#c4a56a] bg-[#10110f] shadow-[inset_0_0_0_1px_rgba(196,165,106,0.35),0_24px_60px_rgba(0,0,0,0.35)] ${
        intro ? "min-h-[40rem] sm:min-h-[36rem]" : "h-[32rem] sm:h-[28rem]"
      } ${pop ? "stage-pop" : ""}`}
    >
      <p id={labelId} className="sr-only">
        A stage with four agents: Muse, Grokbot, Claude Duel, and dots. They
        bounce, and now and then they squabble over who introduces Khushi.
        Activate one to hear a short introduction. Press escape to close it.
      </p>

      {showCanvas ? (
        <WebGLBoundary onFail={() => setMode("fallback")}>
          <div
            className={`pointer-events-none absolute inset-0 z-10 isolate ${intro ? "invisible" : ""}`}
            aria-hidden="true"
          >
            <WebGLStage
              layout={row ? "row" : "grid"}
              playing={playing}
              hovered={hovered}
              victoryId={phase.type === "victory" ? phase.id : null}
              victoryLine={
                phase.type === "victory" ? agents[phase.id].victory : null
              }
              onReady={() => setReady(true)}
            />
          </div>
        </WebGLBoundary>
      ) : null}

      {intro && phase.type === "intro" ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="intro-title"
          className="absolute inset-0 z-30"
        >
          <IntroPanel
            id={phase.id}
            visual={mode === "webgl" && ready ? "webgl" : "fallback"}
            onClose={close}
            onSwitch={select}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-20 grid grid-cols-2 sm:grid-cols-4"
          role="group"
          aria-labelledby={labelId}
        >
          {agentOrder.map((id, index) => {
            const agent = agents[id];
            return (
              <button
                key={id}
                id={`agent-${id}`}
                type="button"
                className="group relative flex items-end justify-center pb-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-8px] focus-visible:outline-[#c4a56a]"
                aria-label={`${agent.name}, ${agent.role}. Hear this introduction.`}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered((current) => (current === id ? null : current))}
                onFocus={() => setHovered(id)}
                onBlur={() => setHovered((current) => (current === id ? null : current))}
                onClick={() => select(id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/agents/${id}.svg`}
                  alt=""
                  className={`h-[72%] w-auto max-w-[92%] object-contain transition-opacity duration-500 ${
                    showArt ? "opacity-100" : "opacity-0"
                  } ${mode === "fallback" ? "idle-bob" : ""}`}
                  style={{ animationDelay: `${index * 0.35}s` }}
                />
                <span
                  data-hot={hovered === id ? "true" : "false"}
                  className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0e0f0e]/85 px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-gold opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 data-[hot=true]:opacity-100 max-sm:opacity-100"
                >
                  {agent.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!intro ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 bottom-5 h-px bg-gradient-to-r from-transparent via-[#c4a56a]/50 to-transparent"
        />
      ) : null}
    </div>
  );
}

