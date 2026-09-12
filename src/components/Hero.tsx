"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "./SoundProvider";

const ROLES = [
  "Generative AI Engineer",
  "AI Product Designer",
  "LLM & Agents Builder",
  "Diffusion Models Artist",
  "Prompt Architect",
];

export default function Hero({
  nameEn,
  name,
  title,
  stats,
}: {
  nameEn: string;
  name: string;
  title: string;
  stats: { label: string; value: string }[];
}) {
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { play } = useSound();
  const wrapRef = useRef<HTMLDivElement>(null);

  // typewriter
  useEffect(() => {
    const full = ROLES[roleIdx];
    const speed = deleting ? 35 : 75;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, text.length + 1);
        setText(next);
        play("type");
        if (next === full) setTimeout(() => setDeleting(true), 1600);
      } else {
        const next = full.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, roleIdx, play]);

  // parallax on mouse
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.setProperty("--px", `${x}`);
      el.style.setProperty("--py", `${y}`);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="top" ref={wrapRef} className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
        {/* Text */}
        <div className="order-2 md:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[rgba(0,255,195,0.05)] px-3 py-1 font-mono text-xs text-[var(--color-neon)]">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[var(--color-neon)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-neon)]" />
            </span>
            متاح لمشاريع جديدة — status: online
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            <span className="block text-[var(--color-muted)] text-lg font-normal font-mono mb-2" dir="ltr">
              {"const engineer = {"}
            </span>
            <span className="glitch neon-text text-[var(--color-ink)]" data-text={name}>
              {name}
            </span>
            <span className="mt-2 block font-mono text-2xl text-[var(--color-cyan)] md:text-3xl" dir="ltr">
              {nameEn}
            </span>
          </h1>

          <p className="mt-5 text-lg text-[var(--color-ink)]">{title}</p>

          <div className="mt-3 font-mono text-base text-[var(--color-neon)] md:text-xl" dir="ltr">
            <span className="text-[var(--color-muted)]">role: </span>
            <span className="caret">&quot;{text}&quot;</span>
          </div>
          <span className="mt-1 block font-mono text-lg text-[var(--color-muted)]" dir="ltr">
            {"}"}
          </span>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#works" className="btn-neon" onClick={() => play("whoosh")}>
              <span>استعرض الأعمال</span>
              <span className="font-mono">→</span>
            </a>
            <a href="#contact" className="btn-ghost" onClick={() => play("blip")}>
              <span className="font-mono">$</span> تواصل معي
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="corner-brackets panel rounded-lg p-3 text-center">
                <dt className="font-mono text-2xl font-bold text-[var(--color-neon)]">{s.value}</dt>
                <dd className="mt-1 text-xs text-[var(--color-muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual */}
        <div
          className="order-1 flex items-center justify-center md:order-2"
          style={{
            transform: "translate(calc(var(--px, 0) * -12px), calc(var(--py, 0) * -12px))",
            transition: "transform 0.2s ease-out",
          }}
        >
          <div className="relative h-[320px] w-[320px] md:h-[440px] md:w-[440px]">
            {/* orbit rings */}
            <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-[rgba(56,229,255,0.35)]" />
            <div className="animate-spin-rev absolute inset-8 rounded-full border border-[rgba(0,255,195,0.25)]" />
            <div className="animate-spin-slow absolute inset-16 rounded-full border border-dotted border-[rgba(167,139,250,0.4)]" />

            {/* orbiting chips */}
            {["LLM", "GAN", "RAG", "SDXL", "Agents", "CV"].map((c, i) => (
              <div
                key={c}
                className="absolute left-1/2 top-1/2 h-0 w-0"
                style={{ transform: `rotate(${i * 60}deg)`, animation: `spin-slow ${20 + i * 2}s linear infinite` }}
              >
                <span
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded border border-[var(--color-line)] bg-[var(--color-panel)] px-2 py-1 font-mono text-[10px] text-[var(--color-cyan)] shadow-[0_0_12px_rgba(56,229,255,0.3)]"
                  style={{ top: "-50%", left: 0, transform: `translate(-50%, -50%) translateY(${i % 2 ? -20 : 0}px)` }}
                  dir="ltr"
                >
                  {c}
                </span>
              </div>
            ))}

            {/* core */}
            <div className="animate-float absolute inset-[22%] overflow-hidden rounded-3xl border border-[var(--color-neon)] bg-[var(--color-panel)] shadow-[0_0_60px_rgba(0,255,195,0.35)]">
              <div className="scan-line" />
              <div className="flex h-full flex-col justify-between p-4 font-mono text-[10px] text-[var(--color-neon)]" dir="ltr">
                <div className="space-y-1 opacity-80">
                  <div>{"> model.load('tamer-v3')"}</div>
                  <div>{"> temperature = 0.8"}</div>
                  <div>{"> creativity: MAX"}</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient md:text-6xl">AI</div>
                  <div className="text-[var(--color-muted)]">generative.core</div>
                </div>
                <div className="flex justify-between opacity-80">
                  <span>tokens/s: ∞</span>
                  <span className="animate-pulse">●REC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-[var(--color-muted)]" dir="ltr">
        <div className="flex flex-col items-center gap-1">
          <span>scroll</span>
          <span className="block h-8 w-px bg-gradient-to-b from-[var(--color-neon)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
