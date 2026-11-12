import type { Link as LinkType } from "@/lib/site";

export function ExternalLink({
  href,
  label,
  className,
}: LinkType & { className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
