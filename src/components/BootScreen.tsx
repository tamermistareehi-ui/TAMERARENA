"use client";

import { useEffect, useState } from "react";
import { useSound } from "./SoundProvider";

const LINES = [
  "> booting portfolio.sys ...",
  "> loading neural_core [████████████] 100%",
  "> mounting /works /certs /about",
  "> initializing generative_engine ✓",
  "> handshake with visitor ... OK",
];

export default function BootScreen() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const { toggle, enabled } = useSound();

  useEffect(() => {
    if (step < LINES.length) {
      const t = setTimeout(() => setStep((s) => s + 1), 260);
      return () => clearTimeout(t);
    }
  }, [step]);

  if (!visible) return null;
  const done = step >= LINES.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-void)] px-5">
      <div className="w-full max-w-lg" dir="ltr">
        <div className="panel rounded-xl p-6 font-mono text-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 text-xs text-[var(--color-muted)]">tamer@genai:~</span>
          </div>
          {LINES.slice(0, step).map((l, i) => (
            <div key={i} className="text-[var(--color-neon)]">
              {l}
            </div>
          ))}
          {!done && <div className="caret text-[var(--color-muted)]" />}
          {done && (
            <div className="mt-6 space-y-3" dir="rtl">
              <p className="font-sans text-[var(--color-ink)]">
                هذه التجربة مصمّمة بمؤثرات صوتية مستوحاة من عالم الحاسوب والذكاء الاصطناعي. هل تريد تفعيلها؟
              </p>
              <div className="flex flex-wrap gap-3 font-sans">
                <button
                  className="btn-neon"
                  onClick={() => {
                    if (!enabled) toggle();
                    setTimeout(() => setVisible(false), 350);
                  }}
                >
                  🔊 ادخل مع الصوت
                </button>
                <button className="btn-ghost" onClick={() => setVisible(false)}>
                  🔇 ادخل بدون صوت
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
