import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
        404
      </p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight sm:text-7xl">
        This page isn&apos;t here.
      </h1>
      <p className="mt-6 max-w-md text-ink-soft">
        The link may be outdated. Head back to the homepage to see selected
        work and how to get in touch.
      </p>
      <Link
        href="/"
        className="mt-10 w-fit font-mono text-[12px] uppercase tracking-[0.16em] underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent"
      >
        Back home
      </Link>
    </div>
  );
}
