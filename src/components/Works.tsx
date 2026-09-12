"use client";

import { useMemo, useState, type MouseEvent } from "react";
import type { Project } from "@/lib/data";
import { DRIVE_CATEGORIES, driveDownloadUrl, drivePreviewUrl } from "@/lib/drive";
import { Reveal, SectionHeader, Tag } from "./ui";
import { useSound } from "./SoundProvider";

function tilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
  el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
}

function untilt(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = "";
}

function idFromDriveLink(link: string | null) {
  return link?.match(/\/d\/([^/]+)/)?.[1] ?? null;
}

const TYPE_LABELS: Record<string, string> = {
  image: "صورة",
  video: "فيديو",
  audio: "صوت",
  presentation: "عرض",
};

export default function Works({ projects }: { projects: Project[] }) {
  const { play } = useSound();
  const [active, setActive] = useState<string>("all");
  const [open, setOpen] = useState<Project | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of projects) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [projects]);

  const list = active === "all" ? projects : projects.filter((p) => p.category === active);
  const activeFolder = DRIVE_CATEGORIES.find((c) => c.key === active);

  return (
    <section id="works" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeader
        code="mount ./drive/works/*"
        title="الأعمال والملفات"
        subtitle="تم تقسيم أرشيف Drive إلى مجلدات: صور، افتار، إعلانات، صوتيات، وعروض تقديمية."
      />

      <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FolderTab
            label="الكل"
            command="works/"
            count={projects.length}
            icon="⌘"
            active={active === "all"}
            onClick={() => {
              setActive("all");
              play("click");
            }}
          />
          {DRIVE_CATEGORIES.map((folder) => (
            <FolderTab
              key={folder.key}
              label={folder.label}
              command={folder.command}
              count={counts.get(folder.key) ?? 0}
              icon={folder.icon}
              active={active === folder.key}
              onClick={() => {
                setActive(folder.key);
                play("click");
              }}
            />
          ))}
        </div>
        {activeFolder && (
          <a
            href={activeFolder.folderUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost shrink-0 py-2 text-xs"
            onClick={() => play("click")}
          >
            فتح مجلد Drive ↗
          </a>
        )}
      </Reveal>

      <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-line)] bg-[rgba(0,255,195,0.035)] px-4 py-3 font-mono text-xs" delay={100}>
        <span className="text-[var(--color-muted)]" dir="ltr">
          <span className="text-[var(--color-neon)]">$</span> ls -la ./{activeFolder?.command ?? "works/"}
        </span>
        <span className="text-[var(--color-cyan)]">
          {list.length} ملف متاح من Google Drive
        </span>
      </Reveal>

      {list.length === 0 && <p className="font-mono text-[var(--color-muted)]">// لا توجد ملفات في هذا المجلد بعد</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 90} as="article">
            <article
              onMouseMove={tilt}
              onMouseLeave={untilt}
              onMouseEnter={() => play("hover")}
              className="tilt group relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] text-start transition-colors hover:border-[var(--color-cyan)]"
              style={{
                backgroundImage:
                  "radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(0,255,195,0.12), transparent 60%)",
              }}
            >
              <button
                type="button"
                className="block w-full text-start"
                onClick={() => {
                  setOpen(p);
                  play("whoosh");
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <DriveMedia project={p} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-panel)] via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded bg-[rgba(5,8,12,0.82)] px-2 py-1 font-mono text-[10px] text-[var(--color-neon)]">
                    {TYPE_LABELS[p.fileType] || "ملف"}
                  </span>
                  {p.featured && (
                    <span className="absolute left-3 top-3 rounded bg-[var(--color-neon)] px-2 py-1 font-mono text-[10px] font-bold text-[#03110d]">
                      ★ FEATURED
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-full border border-[var(--color-neon)] bg-[rgba(5,8,12,0.78)] px-4 py-2 font-mono text-xs text-[var(--color-neon)] backdrop-blur">
                      preview( ) →
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-lg font-bold text-[var(--color-ink)] transition group-hover:text-[var(--color-neon)]">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
                    {p.tags
                      .split(",")
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((t) => (
                        <Tag key={t}>{t.trim()}</Tag>
                      ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2 font-mono text-[10px] text-[var(--color-muted)]" dir="ltr">
                    <span className="max-w-[80%] truncate">{p.fileName || p.title}</span>
                    <span className="text-[var(--color-neon)]">Drive ↗</span>
                  </div>
                </div>
              </button>
            </article>
          </Reveal>
        ))}
      </div>

      {open && <WorkModal project={open} close={() => setOpen(null)} play={play} />}
    </section>
  );
}

function DriveMedia({ project, modal = false }: { project: Project; modal?: boolean }) {
  const imageClass = modal ? "h-full w-full object-contain" : "h-full w-full object-cover transition duration-700 group-hover:scale-110";

  if (project.fileType === "image" || project.fileType === "video") {
    return (
      <div className="relative h-full w-full bg-[#071016]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.imageUrl} alt={project.title} className={imageClass} loading={modal ? "eager" : "lazy"} />
        {project.fileType === "video" && (
          <span className="absolute inset-0 flex items-center justify-center text-4xl drop-shadow-[0_0_14px_rgba(0,255,195,0.8)]">▶</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#071016]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={project.imageUrl} alt="" className="absolute h-full w-full object-cover opacity-25 blur-sm" />
      <div className="relative text-center">
        <div className="text-6xl text-[var(--color-neon)] drop-shadow-[0_0_18px_rgba(0,255,195,0.55)]">
          {project.fileType === "audio" ? "♫" : "▤"}
        </div>
        <div className="mt-2 font-mono text-xs text-[var(--color-cyan)]">{TYPE_LABELS[project.fileType]}</div>
      </div>
    </div>
  );
}

function WorkModal({ project, close, play }: { project: Project; close: () => void; play: (name: "click" | "blip" | "success") => void }) {
  const id = idFromDriveLink(project.link);
  const preview = id ? drivePreviewUrl(id) : project.link;
  const download = id ? driveDownloadUrl(id) : project.link;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(5,8,12,0.88)] p-4 backdrop-blur-sm" onClick={close}>
      <div className="panel max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video bg-[#071016]">
          {project.fileType === "image" ? (
            <DriveMedia project={project} modal />
          ) : id ? (
            <iframe
              src={preview || undefined}
              title={project.title}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <DriveMedia project={project} modal />
          )}
          <button
            type="button"
            className="absolute left-3 top-3 rounded-full border border-[var(--color-line)] bg-[rgba(5,8,12,0.86)] px-3 py-1 font-mono text-xs text-[var(--color-ink)] hover:border-[var(--color-neon)]"
            onClick={() => {
              close();
              play("blip");
            }}
          >
            ESC ✕
          </button>
        </div>
        <div className="p-6">
          <div className="font-mono text-xs text-[var(--color-neon)]" dir="ltr">
            drive://works/{project.category}/{project.fileName || project.title}
          </div>
          <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
          <p className="mt-3 leading-relaxed text-[var(--color-ink)]/85">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
            {project.tags
              .split(",")
              .filter(Boolean)
              .map((t) => (
                <Tag key={t}>{t.trim()}</Tag>
              ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.fileType === "audio" && download && (
              <audio controls className="h-10 max-w-full" src={download}>
                متصفحك لا يدعم تشغيل الصوت.
              </audio>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-neon" onClick={() => play("success")}>
                فتح الملف في Google Drive ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FolderTab({
  label,
  command,
  count,
  icon,
  active,
  onClick,
}: {
  label: string;
  command: string;
  count: number;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-start transition ${
        active
          ? "border-[var(--color-neon)] bg-[rgba(0,255,195,0.1)] text-[var(--color-neon)] shadow-[0_0_16px_rgba(0,255,195,0.25)]"
          : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-cyan)] hover:text-[var(--color-cyan)]"
      }`}
    >
      <span className="font-mono text-base">{icon}</span>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="block font-mono text-[10px] opacity-60" dir="ltr">{command}</span>
      </span>
      <span className="rounded bg-[rgba(255,255,255,0.06)] px-1.5 py-0.5 font-mono text-[10px]">{count}</span>
    </button>
  );
}
