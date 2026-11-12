"use client";

import {
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CopperLine } from "@/components/copper-line";
import { Ticker } from "@/components/ticker";
import { getSkillIcon } from "@/lib/skill-icons";
import { skillTickerLines } from "@/lib/site";

function Logo({ name }: { name: string }) {
  const { Icon, color, label } = getSkillIcon(name);
  return (
    <span className="skill-logo" title={label}>
      <Icon style={{ color }} aria-hidden="true" />
      <span className="skill-name">{label}</span>
    </span>
  );
}

export function SkillsTicker() {
  const { scrollY } = useScroll();
  const invertScroll = useTransform(scrollY, (v) => -v);
  const prefersReduced = useReducedMotion();
  const frozen = useMotionValue(0);

  return (
    <section
      id="skills"
      className="overflow-hidden border-b border-line py-20 sm:py-28"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto mb-14 max-w-6xl px-5 text-center sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          03  /  Skills
        </p>
        <h2
          id="skills-heading"
          className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl"
        >
          Skills
        </h2>
        <CopperLine className="mx-auto mt-6" length="4.5rem" />
      </div>

      <ul className="sr-only">
        {skillTickerLines.flat().map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <div
        className="flex select-none flex-col gap-8 md:gap-12"
        aria-hidden="true"
      >
        {skillTickerLines.map((names, index) => (
          <Ticker
            key={index}
            offset={
              prefersReduced
                ? frozen
                : index % 2 === 1
                  ? invertScroll
                  : scrollY
            }
            items={names.map((name) => (
              <Logo key={name} name={name} />
            ))}
          />
        ))}
      </div>
    </section>
  );
}
