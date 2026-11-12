"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CopperLine } from "@/components/copper-line";
import { ExternalLink } from "@/components/external-link";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/site";

export function Projects() {
  const reduced = useReducedMotion();

  return (
    <section
      id="projects"
      className="border-b border-line"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <header className="mb-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              02  /  More work
            </p>
            <h2
              id="projects-heading"
              className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl"
            >
              Projects
            </h2>
            <CopperLine className="mt-5" />
          </header>
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, index) => (
            <li key={project.id}>
              <Reveal delay={index * 0.06}>
                <motion.div
                  className="glass flex h-full flex-col p-6 sm:p-8"
                  whileHover={
                    reduced
                      ? undefined
                      : {
                          y: -6,
                          boxShadow:
                            "0 22px 60px rgba(0,0,0,0.38), 0 0 0 1px rgba(197,106,66,0.22)",
                        }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-serif text-2xl tracking-tight sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {project.summary}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    {project.links.map((link, linkIndex) => (
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
                    {project.codeOnRequest ? (
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
                        Code available on request
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
