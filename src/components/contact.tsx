"use client";

import { CopperLine } from "@/components/copper-line";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

const links = [
  { href: `mailto:${site.email}`, label: site.email, hint: "Email" },
  { href: site.github, label: "github.com/khushi491", hint: "GitHub" },
  {
    href: site.linkedin,
    label: "linkedin.com/in/khushieeparmar",
    hint: "LinkedIn",
  },
  { href: site.x, label: "x.com/khushi_js", hint: "X" },
  { href: site.resume, label: "Download resume", hint: "Resume" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 border-b border-line"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            06  /  Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-3 max-w-3xl font-serif text-4xl tracking-tight sm:text-6xl"
          >
            If you want to work together, I&apos;d like to hear from you.
          </h2>
          <CopperLine className="mt-6" length="5rem" />
        </Reveal>
        <ul className="mt-12 space-y-6">
          {links.map((link, index) => {
            const newTab =
              link.href.startsWith("http") || link.href.endsWith(".pdf");
            return (
              <li key={link.href}>
                <Reveal delay={index * 0.08}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                    {link.hint}
                  </p>
                  <a
                    href={link.href}
                    {...(newTab
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="mt-1 inline-block font-serif text-2xl tracking-tight text-ink underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent sm:text-3xl"
                  >
                    {link.label}
                    {newTab ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
