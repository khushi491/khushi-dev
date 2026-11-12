import { MonogramSeal } from "@/components/monogram-seal";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-3">
        <MonogramSeal size={28} />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
          © 2026 {site.name}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        {[
          { href: site.github, label: "GitHub" },
          { href: site.linkedin, label: "LinkedIn" },
          { href: site.x, label: "X" },
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
        <span>New York, NY</span>
      </div>
    </footer>
  );
}
