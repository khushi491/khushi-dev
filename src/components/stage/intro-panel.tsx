"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  agentOrder,
  agents,
  assignPeeks,
  type AgentId,
  type AgentScript,
  type Beat,
  type PeekSlot,
} from "@/lib/agents";
import type { LookRef } from "@/components/stage/characters";

const PeekHead = dynamic(
  () => import("@/components/stage/peek-head").then((mod) => mod.PeekHead),
  { ssr: false },
);

const slotClass: Record<PeekSlot, string> = {
  left: "left-0 top-[7%] h-36 w-24 sm:h-52 sm:w-36",
  topRight: "right-0 top-0 h-24 w-24 sm:h-36 sm:w-36",
  bottom: "bottom-0 left-1/2 h-20 w-28 -translate-x-1/2 sm:h-28 sm:w-40",
};

function cropClass(slot: PeekSlot) {
  if (slot === "left") {
    return "absolute -left-[22%] bottom-0 h-[118%] w-[140%] object-cover object-top";
  }
  if (slot === "topRight") {
    return "absolute -right-[18%] -top-[22%] h-[140%] w-[140%] object-cover";
  }
  return "absolute left-1/2 top-0 h-[165%] w-[130%] -translate-x-1/2 object-cover object-top";
}

function LinkList({
  links,
  codeOnRequest,
  onNavigate,
}: {
  links: { href: string; label: string; external?: boolean }[];
  codeOnRequest?: boolean;
  onNavigate?: () => void;
}) {
  if (links.length === 0 && !codeOnRequest) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {links.map((link, index) => {
        const external = link.external ?? link.href.startsWith("http");
        const file = link.href.endsWith(".pdf");
        return (
          <a
            key={link.href}
            href={link.href}
            {...(external || file
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={() => {
              if (link.href.startsWith("#")) onNavigate?.();
            }}
            className={index === 0 ? "btn-link" : "btn-link btn-link-ghost"}
          >
            {link.label}
            {external || file ? (
              <span className="sr-only"> (opens in a new tab)</span>
            ) : null}
          </a>
        );
      })}
      {codeOnRequest ? (
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          Code available on request
        </span>
      ) : null}
    </div>
  );
}

function Caret() {
  return <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-[#1c1914]" />;
}

function PanelBody({
  agent,
  lookRef,
  onClose,
  onSwitch,
}: {
  agent: AgentScript;
  lookRef: LookRef;
  onClose: () => void;
  onSwitch: (id: AgentId) => void;
}) {
  const reduced = useReducedMotion() === true;
  const closeRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<"victory" | "intro" | "beat">("victory");
  const [n, setN] = useState(0);
  const [opened, setOpened] = useState<string[]>([]);
  const [beatId, setBeatId] = useState<string | null>(null);
  const [beatN, setBeatN] = useState(0);
  const phaseRef = useRef(phase);
  const nRef = useRef(0);
  const beatRef = useRef<Beat | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      const current = phaseRef.current;
      if (current === "beat") {
        const beat = beatRef.current;
        if (!beat || nRef.current >= beat.text.length) return;
        nRef.current += 1;
        setBeatN(nRef.current);
      } else {
        const text = current === "victory" ? agent.victory : agent.intro;
        if (nRef.current < text.length) {
          nRef.current += 1;
          setN(nRef.current);
        } else if (current === "victory") {
          phaseRef.current = "intro";
          nRef.current = 0;
          setPhase("intro");
          setN(0);
        }
      }
      const cursor = lookRef.current;
      if (cursor) {
        cursor.x = Math.sin(nRef.current * 0.45) * 0.22;
        cursor.y = Math.cos(nRef.current * 0.3) * 0.1;
      }
    }, 14);
    return () => window.clearInterval(id);
  }, [agent.intro, agent.victory, lookRef, reduced]);

  const victoryText = reduced
    ? agent.victory
    : phase === "victory"
      ? agent.victory.slice(0, n)
      : agent.victory;
  const showIntro = reduced || phase !== "victory";
  const introText = reduced
    ? agent.intro
    : phase === "intro"
      ? agent.intro.slice(0, n)
      : agent.intro;
  const introDone =
    reduced || phase === "beat" || (phase === "intro" && n >= agent.intro.length);
  const victoryTyping = !reduced && phase === "victory" && n < agent.victory.length;
  const introTyping = !reduced && phase === "intro" && n < agent.intro.length;

  const choose = (id: string) => {
    if (!introDone || opened.includes(id)) return;
    const beat = agent.beats.find((entry) => entry.id === id);
    if (!beat) return;
    beatRef.current = beat;
    phaseRef.current = "beat";
    nRef.current = reduced ? beat.text.length : 0;
    setPhase("beat");
    setBeatId(id);
    setBeatN(nRef.current);
    setOpened((current) => [...current, id]);
  };

  const others = agentOrder.filter((id) => id !== agent.id);

  return (
    <div className="relative z-10 flex flex-col px-4 pb-24 pt-4 sm:px-8 sm:pb-28 sm:pl-40 sm:pr-32 sm:pt-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
            {agent.role}
          </p>
          <h3 id="intro-title" className="mt-1 font-serif text-4xl tracking-tight sm:text-5xl">
            {agent.name}
          </h3>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="btn-link btn-link-ghost shrink-0">
          Close
          <span className="sr-only"> the introduction</span>
        </button>
      </div>

      <div className="mt-5 max-w-2xl space-y-3">
        <p className="speech-bubble !max-w-none !text-left">
          {victoryText}
          {victoryTyping ? <Caret /> : null}
        </p>
        {showIntro ? (
          <p className="speech-bubble !max-w-xl !text-left">
            {introText}
            {introTyping ? <Caret /> : null}
          </p>
        ) : null}
        {opened.map((id) => {
          const beat = agent.beats.find((entry) => entry.id === id);
          if (!beat) return null;
          const typing = !reduced && id === beatId && beatN < beat.text.length;
          const text = typing ? beat.text.slice(0, beatN) : beat.text;
          return (
            <div key={id}>
              <p className="speech-bubble !max-w-xl !text-left">
                {text}
                {typing ? <Caret /> : null}
              </p>
              {!typing ? (
                <LinkList
                  links={beat.links ?? []}
                  codeOnRequest={beat.codeOnRequest}
                  onNavigate={onClose}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="sr-only" aria-live="polite">
        {reduced || phase !== "victory" ? agent.victory : ""}
        {introDone ? ` ${agent.intro}` : ""}
        {opened.map((id) => {
          const beat = agent.beats.find((entry) => entry.id === id);
          if (!beat) return null;
          const done = reduced || id !== beatId || beatN >= beat.text.length;
          return done ? <span key={id}> {beat.text}</span> : null;
        })}
      </div>

      {agent.always ? (
        <div className="mt-5 max-w-xl">
          <LinkList links={agent.always} onNavigate={onClose} />
        </div>
      ) : null}

      <div className="mt-6 flex max-w-2xl flex-wrap gap-2">
        {agent.beats.map((beat) => (
          <button
            key={beat.id}
            type="button"
            disabled={!introDone || opened.includes(beat.id)}
            onClick={() => choose(beat.id)}
            className="rounded-full border border-gold/40 px-3 py-1.5 text-left text-sm text-ink transition-colors hover:border-gold disabled:cursor-default disabled:opacity-40"
          >
            {beat.chip}
          </button>
        ))}
      </div>

      {agent.more && introDone ? (
        <a
          href={agent.more.href}
          onClick={onClose}
          className="mt-4 w-fit font-mono text-[11px] uppercase tracking-[0.16em] text-gold underline decoration-gold/50 underline-offset-4"
        >
          {agent.more.label}
        </a>
      ) : null}

      <div className="mt-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          Meet the others
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {others.map((id) => (
            <li key={id}>
              <button type="button" onClick={() => onSwitch(id)} className="btn-link btn-link-ghost">
                {agents[id].name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function IntroPanel({
  id,
  visual,
  onClose,
  onSwitch,
}: {
  id: AgentId;
  visual: "webgl" | "fallback";
  onClose: () => void;
  onSwitch: (id: AgentId) => void;
}) {
  const lookRef = useRef({ x: 0, y: 0 });
  const peeks = useMemo(() => assignPeeks(id), [id]);
  const slots = Object.entries(peeks) as [PeekSlot, AgentId][];

  return (
    <div className="absolute inset-0 bg-[#12130f]">
      {slots.map(([slot, agentId]) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSwitch(agentId)}
          aria-label={`Let ${agents[agentId].name} take a turn`}
          className={`absolute z-20 overflow-hidden bg-transparent focus-visible:shadow-[inset_0_0_0_2px_#c4a56a] ${slotClass[slot]}`}
        >
          {visual === "webgl" ? (
            <div className="absolute inset-0">
              <PeekHead id={agentId} slot={slot} lookRef={lookRef} motion />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/agents/${agentId}.svg`} alt="" className={cropClass(slot)} />
          )}
        </button>
      ))}
      <PanelBody key={id} agent={agents[id]} lookRef={lookRef} onClose={onClose} onSwitch={onSwitch} />
    </div>
  );
}
