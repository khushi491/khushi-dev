"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CopperLine } from "@/components/copper-line";
import { ExternalLink } from "@/components/external-link";
import { Reveal } from "@/components/reveal";
import { caseStudies } from "@/lib/site";

export function Featured() {
  const reduced = useReducedMotion();

  return (
    <section id="work" className="border-b border-line" aria-labelledby="work-heading">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <header className="mb-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                Selected work
              </p>
              <h2
                id="work-heading"
                className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl"
              >
                Case studies
              </h2>
              <CopperLine className="mt-5" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Two recent builds. Both are about payments and agents, and the
              backend work that has to hold up in production.
            </p>
          </header>
        </Reveal>
        <div className="flex flex-col gap-10">
          {caseStudies.map((study, index) => (
            <Reveal key={study.id} delay={index * 0.08}>
              <motion.article
                id={study.id}
                className="glass scroll-mt-24 p-6 sm:p-10"
                whileHover={
                  reduced
                    ? undefined
                    : { y: -6, boxShadow: "0 22px 60px rgba(0,0,0,0.38), 0 0 0 1px rgba(197,106,66,0.22)" }
                }
                transition={{ duration: 0.3 }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold">
                  {study.kicker}
                </p>
                <h3 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
                  {study.title}
                </h3>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
                  {study.lede}
                </p>
                <div className="mt-10 grid gap-12 lg:grid-cols-2">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        Problem
                      </h4>
                      <p className="mt-3 leading-relaxed text-ink">
                        {study.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        What I built
                      </h4>
                      <ul className="mt-3 space-y-3">
                        {study.built.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 leading-relaxed text-ink"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 bg-accent"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        Architecture
                      </h4>
                      <ol className="mt-4 space-y-4">
                        {study.flow.map((item) => (
                          <li
                            key={item.step}
                            className="grid grid-cols-[auto_1fr] gap-4"
                          >
                            <span className="font-mono text-[11px] text-gold">
                              {item.step}
                            </span>
                            <span className="leading-relaxed text-ink">
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                        Stack
                      </h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {study.stack.map((item) => (
                          <span key={item} className="chip">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {study.links.map((link, linkIndex) => (
                        <ExternalLink
                          key={link.href}
                          {...link}
                          className={
                            linkIndex === 0
                              ? "btn-link"
                              : "btn-link btn-link-ghost"
                          }
                        />
                      ))}
                      {study.codeOnRequest ? (
                        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                          Code available on request
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
