"use client";

import { Reveal, SectionHeader } from "./ui";

export default function About({
  avatar,
  name,
  nameEn,
  title,
  bio,
  location,
  email,
}: {
  avatar: string;
  name: string;
  nameEn: string;
  title: string;
  bio: string;
  location: string;
  email: string;
}) {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeader code="cat ./about.json" title="نبذة عني" subtitle="من أنا وماذا أبني" />

      <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* Photo with holographic frame */}
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-square">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[var(--color-neon)] via-transparent to-[var(--color-violet)] opacity-40 blur-xl" />
            <div className="corner-brackets relative h-full w-full overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
              <div className="scan-line" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(5,8,12,0.95)] to-transparent p-4">
                <div className="font-mono text-xs text-[var(--color-neon)]" dir="ltr">
                  {"<img src=\"me.jpg\" alt=\""}
                  {nameEn}
                  {"\" />"}
                </div>
              </div>
              {/* HUD corners */}
              <div className="absolute right-3 top-3 font-mono text-[10px] text-[var(--color-cyan)]" dir="ltr">
                ID: GEN-AI-001
              </div>
              <div className="absolute left-3 top-3 flex items-center gap-1 font-mono text-[10px] text-[var(--color-neon)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-neon)]" />
                LIVE
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bio as JSON-ish terminal */}
        <Reveal delay={150}>
          <div className="panel rounded-2xl p-6 md:p-8">
            <div className="mb-5 flex items-center gap-2 font-mono text-xs text-[var(--color-muted)]" dir="ltr">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-2">about.json — read only</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-ink)]">
              {name} <span className="font-mono text-base text-[var(--color-cyan)]" dir="ltr">/ {nameEn}</span>
            </h3>
            <p className="mt-1 font-mono text-sm text-[var(--color-neon)]">{title}</p>
            <p className="mt-5 leading-relaxed text-[var(--color-ink)]/90">{bio}</p>

            <ul className="mt-6 grid gap-3 font-mono text-sm sm:grid-cols-2" dir="ltr">
              <li className="flex items-center gap-2 text-[var(--color-muted)]">
                <span className="text-[var(--color-violet)]">"location"</span>: <span className="text-[var(--color-ink)]">"{location}"</span>
              </li>
              <li className="flex items-center gap-2 text-[var(--color-muted)]">
                <span className="text-[var(--color-violet)]">"email"</span>:{" "}
                <a href={`mailto:${email}`} className="text-[var(--color-neon)] underline-offset-4 hover:underline">
                  "{email}"
                </a>
              </li>
              <li className="flex items-center gap-2 text-[var(--color-muted)]">
                <span className="text-[var(--color-violet)]">"focus"</span>: <span className="text-[var(--color-ink)]">["LLMs", "Diffusion", "Agents"]</span>
              </li>
              <li className="flex items-center gap-2 text-[var(--color-muted)]">
                <span className="text-[var(--color-violet)]">"mode"</span>: <span className="text-[var(--color-amber)]">"creative + engineering"</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {["الهندسة", "التصميم", "الإبداع التوليدي", "الأتمتة الذكية", "تجربة المستخدم"].map((t) => (
                <span
                  key={t}
                  className="interactive rounded-full border border-[var(--color-line)] px-3 py-1 text-xs text-[var(--color-cyan)] transition hover:border-[var(--color-neon)] hover:text-[var(--color-neon)]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
