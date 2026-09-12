"use client";

import { useState, type FormEvent } from "react";
import { Reveal, SectionHeader } from "./ui";
import { useSound } from "./SoundProvider";

export default function Contact({ email }: { email: string }) {
  const { play } = useSound();
  const [form, setForm] = useState({ name: "", email: "", note: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const pushLog = (l: string) => setLog((prev) => [...prev.slice(-5), l]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setLog([]);
    play("whoosh");
    pushLog("> validating payload ...");
    try {
      await new Promise((r) => setTimeout(r, 350));
      pushLog("> encrypting message ✓");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "فشل الإرسال");
      pushLog(`> POST /api/contact 200 OK`);
      pushLog(`> routed to ${email}`);
      setStatus("ok");
      setMsg(data.message);
      setForm({ name: "", email: "", note: "" });
      play("success");
    } catch (err) {
      setStatus("err");
      setMsg(err instanceof Error ? err.message : "حدث خطأ");
      pushLog("> ERROR: transmission failed");
      play("error");
    }
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-5 py-24">
      <SectionHeader code="await sendMessage({ to: 'tamer' })" title="تواصل معي" subtitle="لديك فكرة أو مشروع؟ أرسل رسالتك وسأرد عليك في أقرب وقت" />

      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <form onSubmit={submit} className="panel corner-brackets space-y-5 rounded-2xl p-6 md:p-8">
            <Field label="name" hint="الاسم">
              <input
                className="input"
                required
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  play("type");
                }}
                placeholder="اسمك الكريم"
              />
            </Field>
            <Field label="email" hint="البريد الإلكتروني">
              <input
                className="input"
                type="email"
                required
                dir="ltr"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  play("type");
                }}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="note" hint="ملاحظتك / رسالتك">
              <textarea
                className="input min-h-[140px] resize-y"
                required
                value={form.note}
                onChange={(e) => {
                  setForm({ ...form, note: e.target.value });
                  play("type");
                }}
                placeholder="أخبرني عن مشروعك أو فكرتك..."
              />
            </Field>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === "sending"} className="btn-neon disabled:opacity-60">
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#03110d] border-t-transparent" />
                    جارٍ الإرسال...
                  </>
                ) : (
                  <>
                    <span className="font-mono">▶</span> إرسال الرسالة
                  </>
                )}
              </button>
              {msg && (
                <p className={`text-sm ${status === "ok" ? "text-[var(--color-neon)]" : "text-[#ff5f56]"}`}>{msg}</p>
              )}
            </div>
          </form>
        </Reveal>

        <Reveal delay={150} className="space-y-6">
          {/* Terminal log */}
          <div className="panel rounded-2xl p-5 font-mono text-xs" dir="ltr">
            <div className="mb-3 flex items-center gap-2 text-[var(--color-muted)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2">transmission.log</span>
            </div>
            <div className="min-h-[110px] space-y-1 text-[var(--color-neon)]">
              {log.length === 0 && <div className="text-[var(--color-muted)]">{"> awaiting input ..."}</div>}
              {log.map((l, i) => (
                <div key={i} className={l.includes("ERROR") ? "text-[#ff5f56]" : ""}>
                  {l}
                </div>
              ))}
              <div className="caret" />
            </div>
          </div>

          {/* Direct contact */}
          <div className="panel rounded-2xl p-5">
            <h3 className="font-bold">قنوات مباشرة</h3>
            <a
              href={`mailto:${email}`}
              className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--color-line)] p-3 transition hover:border-[var(--color-neon)]"
              onClick={() => play("click")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgba(0,255,195,0.1)] text-[var(--color-neon)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <span>
                <span className="block text-xs text-[var(--color-muted)]">Email</span>
                <span className="font-mono text-sm text-[var(--color-ink)]" dir="ltr">
                  {email}
                </span>
              </span>
            </a>
            <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
              تُحفظ جميع الرسائل بأمان وتُرسل مباشرة إلى بريدي الإلكتروني. متوسط وقت الرد: أقل من 24 ساعة.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[var(--color-ink)]">{hint}</span>
        <span className="font-mono text-xs text-[var(--color-muted)]" dir="ltr">
          {label}: string
        </span>
      </span>
      {children}
    </label>
  );
}
