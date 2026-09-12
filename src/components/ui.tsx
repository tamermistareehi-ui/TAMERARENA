"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Adds `.in` when the element scrolls into view */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Comp>
  );
}

export function SectionHeader({
  code,
  title,
  subtitle,
}: {
  code: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-12">
      <div className="font-mono text-sm text-[var(--color-neon)]" dir="ltr">
        <span className="text-[var(--color-muted)]">{"// "}</span>
        {code}
      </div>
      <h2 className="mt-2 text-3xl font-bold md:text-4xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{subtitle}</p>}
      <div className="mt-4 h-px w-24 bg-gradient-to-l from-[var(--color-neon)] to-transparent" />
    </Reveal>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-[var(--color-line)] bg-[rgba(0,255,195,0.05)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-cyan)]">
      {children}
    </span>
  );
}
