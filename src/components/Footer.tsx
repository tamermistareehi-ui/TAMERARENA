export default function Footer({ name, nameEn }: { name: string; nameEn: string }) {
  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[rgba(5,8,12,0.8)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row">
        <div className="font-mono text-xs text-[var(--color-muted)]" dir="ltr">
          <span className="text-[var(--color-neon)]">$</span> echo &quot;© {new Date().getFullYear()} {nameEn}&quot;
        </div>
        <div className="text-sm text-[var(--color-muted)]">
          صُمّم وبُني بشغف بواسطة <span className="text-[var(--color-ink)]">{name}</span> — Generative AI Engineer & Designer
        </div>
        <a href="/admin" className="font-mono text-[10px] text-[var(--color-line)] transition hover:text-[var(--color-neon)]" dir="ltr">
          [admin]
        </a>
      </div>
    </footer>
  );
}
