"use client";

import { CopperLine } from "@/components/copper-line";
import { Reveal } from "@/components/reveal";

export function Story() {
  return (
    <section
      id="story"
      className="border-b border-line"
      aria-labelledby="story-heading"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            05  /  About
          </p>
        </Reveal>
        <div className="mt-3 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <h2
              id="story-heading"
              className="font-serif text-4xl tracking-tight sm:text-5xl"
            >
              A short story
            </h2>
            <CopperLine className="mt-5" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
              <p>
                I&apos;m a software engineer in New York. I spend most of my time
                on backend and full stack work, often with applied AI.
              </p>
              <p>
                What I like is taking a messy brief and turning it into something
                that actually ships. That might be a payment that has to settle
                across chains, or an agent that can spend only what a policy
                allows.
              </p>
              <p>
                Lately that has meant Node.js and TypeScript services, interfaces
                that use LLMs, and the production work that makes them reliable
                enough to put in front of people. I finished my M.S. in Computer
                Science at Monroe University in December 2025.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
