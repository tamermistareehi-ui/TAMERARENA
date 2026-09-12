"use client";

import { Reveal, SectionHeader } from "./ui";
import { useSound } from "./SoundProvider";

const GROUPS = [
  {
    name: "Generative AI",
    icon: "🧠",
    skills: [
      { n: "LLMs / Prompt Engineering", w: 95 },
      { n: "RAG & AI Agents", w: 90 },
      { n: "Fine-tuning (LoRA, PEFT)", w: 85 },
      { n: "Diffusion Models (SD, Flux)", w: 92 },
    ],
  },
  {
    name: "Engineering",
    icon: "⚙️",
    skills: [
      { n: "Python / PyTorch", w: 90 },
      { n: "TypeScript / Next.js", w: 88 },
      { n: "APIs & MLOps", w: 82 },
      { n: "Vector DBs & Cloud", w: 80 },
    ],
  },
  {
    name: "Design",
    icon: "🎨",
    skills: [
      { n: "UI/UX & Design Systems", w: 90 },
      { n: "Figma / Prototyping", w: 88 },
      { n: "Generative Art Direction", w: 93 },
      { n: "Motion & Interaction", w: 84 },
    ],
  },
];

const STACK = [
  "OpenAI", "Anthropic", "Gemini", "LangChain", "LlamaIndex", "Hugging Face", "PyTorch", "ComfyUI",
  "Stable Diffusion", "Flux", "Midjourney", "Runway", "ElevenLabs", "Pinecone", "Next.js", "React",
  "Tailwind", "PostgreSQL", "Docker", "Figma", "Vercel", "n8n",
];

export default function Skills() {
  const { play } = useSound();
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeader code="import { skills } from './stack'" title="المهارات والتقنيات" subtitle="الأدوات التي أستخدمها لتحويل الأفكار إلى منتجات ذكية" />

      <div className="grid gap-6 md:grid-cols-3">
        {GROUPS.map((g, gi) => (
          <Reveal key={g.name} delay={gi * 120} className="panel corner-brackets rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-mono text-lg font-bold text-[var(--color-ink)]" dir="ltr">
                {g.name}
              </h3>
              <span className="text-2xl">{g.icon}</span>
            </div>
            <ul className="space-y-4">
              {g.skills.map((s) => (
                <li key={s.n} className="interactive" onMouseEnter={() => play("hover")}>
                  <div className="mb-1.5 flex items-center justify-between font-mono text-xs" dir="ltr">
                    <span className="text-[var(--color-ink)]">{s.n}</span>
                    <span className="text-[var(--color-neon)]">{s.w}%</span>
                  </div>
                  <div className="skill-bar">
                    <span style={{ "--w": `${s.w}%` } as React.CSSProperties} />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* Marquee stack */}
      <Reveal className="mt-12 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[rgba(10,17,24,0.6)] py-4" delay={200}>
        <div className="marquee flex w-max gap-3" dir="ltr">
          {[...STACK, ...STACK].map((s, i) => (
            <span
              key={i}
              className="interactive rounded border border-[var(--color-line)] px-3 py-1 font-mono text-xs text-[var(--color-cyan)] transition hover:border-[var(--color-neon)] hover:text-[var(--color-neon)]"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
