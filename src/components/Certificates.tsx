"use client";

import type { Certificate } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui";
import { useSound } from "./SoundProvider";

export default function Certificates({ certs }: { certs: Certificate[] }) {
  const { play } = useSound();
  return (
    <section id="certs" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeader code="git log --oneline ./certificates" title="الدورات والشهادات" subtitle="رحلة تعلم مستمرة في الذكاء الاصطناعي والتصميم" />

      <ol className="relative border-s border-[var(--color-line)] ps-8">
        {certs.map((c, i) => (
          <Reveal key={c.id} as="li" delay={i * 80} className="group relative mb-8 last:mb-0">
            {/* commit dot */}
            <span className="absolute -start-[41px] top-4 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-neon)] bg-[var(--color-void)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-neon)] shadow-[0_0_10px_var(--color-neon)] transition group-hover:scale-150" />
            </span>

            <div
              className="panel corner-brackets flex flex-col gap-4 rounded-xl p-5 transition hover:border-[var(--color-neon)] sm:flex-row sm:items-center"
              onMouseEnter={() => play("hover")}
            >
              {c.imageUrl && (
                <a href={c.link || c.imageUrl} target="_blank" rel="noreferrer" className="shrink-0" onClick={() => play("click")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.imageUrl} alt={c.title} className="h-20 w-28 rounded-lg border border-[var(--color-line)] object-cover" loading="lazy" />
                </a>
              )}
              <div className="flex-1">
                <div className="font-mono text-[11px] text-[var(--color-muted)]" dir="ltr">
                  <span className="text-[var(--color-amber)]">{(0xa1b2c3 + c.id * 7919).toString(16).slice(0, 7)}</span>{" "}
                  feat(cert): completed
                </div>
                <h3 className="mt-1 text-lg font-bold text-[var(--color-ink)]" dir="auto">
                  {c.title}
                </h3>
                <p className="text-sm text-[var(--color-cyan)]" dir="auto">
                  {c.issuer}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded border border-[var(--color-line)] px-3 py-1 font-mono text-sm text-[var(--color-neon)]">{c.year}</span>
                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => play("click")}
                    className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-neon)]"
                  >
                    verify ↗
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
