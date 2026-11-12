"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CopperLine } from "@/components/copper-line";
import { Reveal } from "@/components/reveal";
import { education, experience } from "@/lib/site";

export function Experience() {
  const reduced = useReducedMotion();

  return (
    <section
      id="experience"
      className="border-b border-line"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            04  /  Background
          </p>
          <h2
            id="experience-heading"
            className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl"
          >
            Experience
          </h2>
          <CopperLine className="mt-5" />
        </Reveal>
        <ol className="relative mt-14 space-y-6">
          <motion.span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[11px] hidden w-px bg-gradient-to-b from-accent via-gold/50 to-transparent md:block"
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={reduced ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
          />
          {experience.map((role, index) => (
            <li key={`${role.company}-${role.dates}`}>
              <Reveal delay={index * 0.05}>
                <div className="grid gap-6 md:grid-cols-[minmax(0,220px)_1fr] md:pl-10">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-2 -left-[35px] hidden h-2.5 w-2.5 rounded-full border border-accent bg-bg shadow-[0_0_12px_rgba(197,106,66,0.7)] md:block"
                    />
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                      {role.dates}
                    </p>
                    <h3 className="mt-3 font-serif text-2xl tracking-tight">
                      {role.company}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft">{role.title}</p>
                  </div>
                  <div className="glass p-6">
                    <ul className="space-y-3">
                      {role.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-[15px] leading-relaxed text-ink"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div id="education" className="scroll-mt-24 pt-20">
          <Reveal>
            <h3 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Education
            </h3>
            <CopperLine className="mt-5" />
          </Reveal>
          <ul className="mt-8 space-y-4">
            {education.map((item, index) => (
              <li key={item.school}>
                <Reveal delay={index * 0.06}>
                  <div className="glass flex flex-col gap-2 p-6 sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <p className="font-serif text-2xl tracking-tight">
                        {item.school}
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        {item.degree}
                        {item.detail ? `, ${item.detail}` : ""}
                        {`, ${item.place}`}
                      </p>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
                      {item.dates}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
