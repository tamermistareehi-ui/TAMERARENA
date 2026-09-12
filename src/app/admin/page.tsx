"use client";

import { useCallback, useEffect, useState } from "react";
import type { Certificate, Project } from "@/lib/data";
import { DRIVE_CATEGORIES } from "@/lib/drive";

type Msg = { id: number; name: string; email: string; note: string; emailed: boolean; createdAt: string };
type Tab = "profile" | "projects" | "certs" | "messages";

async function upload(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/media", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "فشل الرفع");
  return data.url as string;
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const [s, p, c, m] = await Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
      fetch("/api/messages").then((r) => r.json()),
    ]);
    setSettings(s);
    setProjects(p);
    setCerts(c);
    setMsgs(m);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const notify = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-void)] px-5 py-10 text-[var(--color-ink)]" style={{ cursor: "auto" }}>
      <style>{`body, a, button, input, textarea, select, label { cursor: auto !important; }`}</style>
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[var(--color-neon)]" dir="ltr">
              sudo ./admin --portfolio
            </div>
            <h1 className="text-3xl font-bold">لوحة تحكم البورتفوليو</h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              ارفع صورتك الشخصية، وأضف أعمالك حسب مجلدات التصنيف، وشهاداتك، وراجع الرسائل الواردة.
            </p>
          </div>
          <a href="/" className="btn-ghost">
            ← عرض الموقع
          </a>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {(
            [
              ["profile", "الملف الشخصي"],
              ["projects", `الأعمال (${projects.length})`],
              ["certs", `الشهادات (${certs.length})`],
              ["messages", `الرسائل (${msgs.length})`],
            ] as [Tab, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                tab === k
                  ? "border-[var(--color-neon)] bg-[rgba(0,255,195,0.1)] text-[var(--color-neon)]"
                  : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {l}
            </button>
          ))}
        </nav>

        {tab === "profile" && <ProfileTab settings={settings} onSaved={(s) => { setSettings(s); notify("تم حفظ الملف الشخصي ✓"); }} />}
        {tab === "projects" && <ProjectsTab projects={projects} reload={load} notify={notify} />}
        {tab === "certs" && <CertsTab certs={certs} reload={load} notify={notify} />}
        {tab === "messages" && <MessagesTab msgs={msgs} reload={load} notify={notify} />}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-[var(--color-neon)] bg-[var(--color-panel)] px-5 py-3 font-mono text-sm text-[var(--color-neon)] shadow-[0_0_24px_rgba(0,255,195,0.35)]">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- Profile ---------------- */
function ProfileTab({ settings, onSaved }: { settings: Record<string, string>; onSaved: (s: Record<string, string>) => void }) {
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm(settings), [settings]);

  const fields: [string, string, boolean?][] = [
    ["name", "الاسم بالعربية"],
    ["nameEn", "الاسم بالإنجليزية"],
    ["title", "المسمى الوظيفي"],
    ["location", "الموقع"],
    ["email", "البريد الإلكتروني للعرض"],
    ["yearsExp", "سنوات الخبرة"],
    ["projectsCount", "عدد المشاريع"],
    ["modelsCount", "عدد النماذج"],
    ["bio", "النبذة التعريفية", true],
  ];

  async function save() {
    setBusy(true);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    onSaved(await res.json());
    setBusy(false);
  }

  return (
    <div className="panel rounded-2xl p-6">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div>
          <label className="mb-2 block text-sm">الصورة الشخصية</label>
          <div className="aspect-square overflow-hidden rounded-xl border border-[var(--color-line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {form.avatar && <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" />}
          </div>
          <input
            type="file"
            accept="image/*"
            className="mt-3 block w-full text-xs text-[var(--color-muted)] file:mr-3 file:rounded file:border-0 file:bg-[var(--color-neon)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#03110d]"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                const url = await upload(f);
                setForm((p) => ({ ...p, avatar: url }));
              } finally {
                setBusy(false);
              }
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([k, label, multi]) => (
            <label key={k} className={`block ${multi ? "sm:col-span-2" : ""}`}>
              <span className="mb-1 block text-xs text-[var(--color-muted)]">{label}</span>
              {multi ? (
                <textarea className="input min-h-[120px]" value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              ) : (
                <input className="input" value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={save} disabled={busy} className="btn-neon disabled:opacity-60">
          {busy ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Projects ---------------- */
function ProjectsTab({ projects, reload, notify }: { projects: Project[]; reload: () => Promise<void>; notify: (t: string) => void }) {
  const empty = { title: "", description: "", category: "", imageUrl: "", fileName: "", fileType: "image", link: "", tags: "", featured: false, sortOrder: 0 };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const cats = Array.from(new Set(projects.map((p) => p.category)));

  async function add() {
    if (!form.title || !form.category || !form.imageUrl) return notify("العنوان والتصنيف والصورة مطلوبة");
    setBusy(true);
    await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(empty);
    await reload();
    setBusy(false);
    notify("تمت إضافة المشروع ✓");
  }

  async function del(id: number) {
    if (!confirm("حذف هذا المشروع؟")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    await reload();
    notify("تم الحذف");
  }

  return (
    <div className="space-y-8">
      <div className="panel rounded-2xl p-6">
        <h2 className="mb-4 font-bold">إضافة عمل جديد</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="عنوان العمل" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <input className="input" list="cats" placeholder="اسم المجلد / التصنيف" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <datalist id="cats">
              {[...DRIVE_CATEGORIES.map((c) => c.key), ...cats].filter((c, i, a) => a.indexOf(c) === i).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <textarea className="input sm:col-span-2" placeholder="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input" placeholder="الوسوم مفصولة بفواصل: GPT-4,LangChain" dir="ltr" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <input className="input" placeholder="رابط المشروع أو ملف Drive (اختياري)" dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*,video/*,audio/*,.ppt,.pptx,.pdf"
              className="block w-full text-xs text-[var(--color-muted)] file:mr-3 file:rounded file:border-0 file:bg-[var(--color-neon)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#03110d]"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setBusy(true);
                try {
                  const url = await upload(f);
                  const fileType = f.type.startsWith("video/") ? "video" : f.type.startsWith("audio/") ? "audio" : f.type.includes("presentation") || f.name.endsWith(".ppt") || f.name.endsWith(".pptx") || f.type === "application/pdf" ? "presentation" : "image";
                  setForm((p) => ({ ...p, imageUrl: fileType === "image" || fileType === "video" ? url : "/images/p5.jpg", link: url, fileName: f.name, fileType }));
                } finally {
                  setBusy(false);
                }
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {form.imageUrl && <img src={form.imageUrl} alt="" className="h-12 w-16 rounded object-cover" />}
          </div>
          <input className="input" placeholder="أو ضع رابط صورة مباشرة" dir="ltr" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> عمل مميز
          </label>
          <input className="input" type="number" placeholder="الترتيب" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={add} disabled={busy} className="btn-neon disabled:opacity-60">
            {busy ? "..." : "+ إضافة"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="panel overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt="" className="aspect-video w-full object-cover" />
            <div className="p-4">
              <div className="font-mono text-[10px] text-[var(--color-neon)]" dir="ltr">
                📁 {p.category}
              </div>
              <div className="mt-1 font-bold">{p.title}</div>
              <button onClick={() => del(p.id)} className="mt-3 text-xs text-[#ff5f56] hover:underline">
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Certificates ---------------- */
function CertsTab({ certs, reload, notify }: { certs: Certificate[]; reload: () => Promise<void>; notify: (t: string) => void }) {
  const empty = { title: "", issuer: "", year: "", imageUrl: "", link: "", sortOrder: 0 };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!form.title || !form.issuer) return notify("العنوان والجهة المانحة مطلوبان");
    setBusy(true);
    await fetch("/api/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm(empty);
    await reload();
    setBusy(false);
    notify("تمت إضافة الشهادة ✓");
  }
  async function del(id: number) {
    if (!confirm("حذف هذه الشهادة؟")) return;
    await fetch(`/api/certificates?id=${id}`, { method: "DELETE" });
    await reload();
    notify("تم الحذف");
  }

  return (
    <div className="space-y-8">
      <div className="panel rounded-2xl p-6">
        <h2 className="mb-4 font-bold">إضافة شهادة / دورة</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input" placeholder="اسم الدورة / الشهادة" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="الجهة المانحة" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
          <input className="input" placeholder="السنة" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          <input className="input" placeholder="رابط التحقق (اختياري)" dir="ltr" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="block w-full text-xs text-[var(--color-muted)] file:mr-3 file:rounded file:border-0 file:bg-[var(--color-neon)] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#03110d]"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setBusy(true);
                try {
                  const url = await upload(f);
                  if (f.type === "application/pdf") setForm((p) => ({ ...p, link: url }));
                  else setForm((p) => ({ ...p, imageUrl: url }));
                } finally {
                  setBusy(false);
                }
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {form.imageUrl && <img src={form.imageUrl} alt="" className="h-12 w-16 rounded object-cover" />}
          </div>
          <input className="input" type="number" placeholder="الترتيب" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={add} disabled={busy} className="btn-neon disabled:opacity-60">
            {busy ? "..." : "+ إضافة"}
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {certs.map((c) => (
          <li key={c.id} className="panel flex items-center justify-between gap-4 rounded-xl p-4">
            <div>
              <div className="font-bold">{c.title}</div>
              <div className="text-xs text-[var(--color-muted)]">
                {c.issuer} · {c.year}
              </div>
            </div>
            <button onClick={() => del(c.id)} className="text-xs text-[#ff5f56] hover:underline">
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Messages ---------------- */
function MessagesTab({ msgs, reload, notify }: { msgs: Msg[]; reload: () => Promise<void>; notify: (t: string) => void }) {
  async function del(id: number) {
    await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
    await reload();
    notify("تم الحذف");
  }
  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-[var(--color-line)] bg-[rgba(255,181,71,0.06)] p-3 text-xs text-[var(--color-amber)]">
        لتفعيل الإرسال الفعلي إلى tamermistareehi@gmail.com أضف متغيرات البيئة: <code dir="ltr">RESEND_API_KEY</code> أو{" "}
        <code dir="ltr">SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS</code> (كلمة مرور تطبيق Gmail). جميع الرسائل تُحفظ هنا في كل الأحوال.
      </p>
      {msgs.length === 0 && <p className="text-sm text-[var(--color-muted)]">لا توجد رسائل بعد.</p>}
      {msgs.map((m) => (
        <div key={m.id} className="panel rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-bold">{m.name}</span>{" "}
              <a href={`mailto:${m.email}`} className="font-mono text-xs text-[var(--color-neon)]" dir="ltr">
                {m.email}
              </a>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-[var(--color-muted)]" dir="ltr">
              <span className={m.emailed ? "text-[var(--color-neon)]" : "text-[var(--color-amber)]"}>{m.emailed ? "emailed ✓" : "saved only"}</span>
              <span>{new Date(m.createdAt).toLocaleString("ar")}</span>
              <button onClick={() => del(m.id)} className="text-[#ff5f56] hover:underline">
                delete
              </button>
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink)]/85">{m.note}</p>
        </div>
      ))}
    </div>
  );
}
