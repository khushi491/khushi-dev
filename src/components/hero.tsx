import { HeroSpotlight } from "@/components/hero-spotlight";
import { AgentStage } from "@/components/stage/agent-stage";
import { site } from "@/lib/site";

const ctas = [
  { href: `mailto:${site.email}`, label: "Email", external: false },
  { href: site.github, label: "GitHub", external: true },
  { href: site.linkedin, label: "LinkedIn", external: true },
  { href: site.x, label: "X", external: true },
  { href: site.resume, label: "Resume", external: false },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-line"
      aria-labelledby="hero-name"
    >
      <HeroSpotlight />
      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">
          Software engineer in New York
        </p>
        <h1
          id="hero-name"
          className="mt-3 font-serif text-[clamp(3.1rem,7vw,5.4rem)] leading-[0.84] tracking-[-0.03em] text-ink"
        >
          <span className="block">Khushi</span>
          <span className="block italic text-gold">Parmar</span>
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {site.description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {ctas.map((cta) => {
            const newTab = cta.external || cta.label === "Resume";
            return (
              <li key={cta.label}>
                <a
                  href={cta.href}
                  {...(newTab
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={
                    cta.label === "Email" ? "btn-link" : "btn-link btn-link-ghost"
                  }
                >
                  {cta.label}
                  {newTab ? (
                    <span className="sr-only"> (opens in a new tab)</span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <AgentStage />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
            These four are my agents. They keep arguing over who gets to
            introduce me. Click one.
          </p>
        </div>
      </div>
    </section>
  );
}
