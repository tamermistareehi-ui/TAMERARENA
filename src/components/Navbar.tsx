"use client";

import { useEffect, useState } from "react";
import { useSound } from "./SoundProvider";

const links = [
  { href: "#about", label: "عني", code: "about" },
  { href: "#skills", label: "المهارات", code: "skills" },
  { href: "#works", label: "الأعمال", code: "works" },
  { href: "#certs", label: "الشهادات", code: "certs" },
  { href: "#contact", label: "تواصل", code: "contact" },
];

export default function Navbar({ name }: { name: string }) {
  const { enabled, toggle, play } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-[var(--color-line)] bg-[rgba(5,8,12,0.75)] backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="group flex items-center gap-2 font-mono text-sm" dir="ltr" onClick={() => play("blip")}>
          <span className="flex h-8 w-8 items-center justify-center rounded border border-[var(--color-neon)] text-[var(--color-neon)] shadow-[0_0_14px_rgba(0,255,195,0.4)]">
            {"</>"}
          </span>
          <span className="text-[var(--color-ink)]">
            <span className="text-[var(--color-neon)]">~/</span>
            {name.toLowerCase().replace(/\s+/g, "-")}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => play("blip")}
                className="group relative rounded px-3 py-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-neon)]"
              >
                <span className="font-mono text-[10px] text-[var(--color-neon)] opacity-0 transition group-hover:opacity-100">{"<"}</span>
                {l.label}
                <span className="font-mono text-[10px] text-[var(--color-neon)] opacity-0 transition group-hover:opacity-100">{"/>"}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="تبديل الصوت"
            title={enabled ? "إيقاف المؤثرات الصوتية" : "تشغيل المؤثرات الصوتية"}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition ${
              enabled
                ? "border-[var(--color-neon)] bg-[rgba(0,255,195,0.1)] text-[var(--color-neon)] shadow-[0_0_14px_rgba(0,255,195,0.35)]"
                : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-neon)]"
            }`}
          >
            <span className="flex items-end gap-[2px]" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-sm bg-current"
                  style={{
                    height: enabled ? `${6 + ((i * 5) % 9)}px` : "4px",
                    animation: enabled ? `eq 0.${6 + i}s ease-in-out infinite alternate` : "none",
                  }}
                />
              ))}
            </span>
            {enabled ? "SFX:ON" : "SFX:OFF"}
          </button>
          <button
            className="rounded border border-[var(--color-line)] p-2 text-[var(--color-neon)] md:hidden"
            onClick={() => {
              setOpen((o) => !o);
              play("click");
            }}
            aria-label="القائمة"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-[var(--color-line)] bg-[rgba(5,8,12,0.95)] px-5 py-3 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => {
                  setOpen(false);
                  play("blip");
                }}
                className="block py-2 font-mono text-sm text-[var(--color-ink)]"
              >
                <span className="text-[var(--color-neon)]">$ </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
      <style jsx global>{`
        @keyframes eq {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1.4); }
        }
      `}</style>
    </header>
  );
}
