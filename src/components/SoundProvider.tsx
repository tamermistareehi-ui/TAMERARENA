"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SoundName = "hover" | "click" | "type" | "whoosh" | "success" | "error" | "boot" | "blip";

type SoundCtx = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const Ctx = createContext<SoundCtx>({ enabled: false, toggle: () => {}, play: () => {} });

export function useSound() {
  return useContext(Ctx);
}

/**
 * Synthesizes retro-futuristic IT / AI sounds with the Web Audio API.
 * No audio files needed — everything is generated with oscillators & noise.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const ambientRef = useRef<{ osc: OscillatorNode[]; gain: GainNode } | null>(null);
  const lastHover = useRef(0);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (opts: {
      type?: OscillatorType;
      from: number;
      to?: number;
      dur: number;
      vol?: number;
      delay?: number;
      curve?: "exp" | "lin";
    }) => {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!ctx || !master) return;
      const t0 = ctx.currentTime + (opts.delay ?? 0);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = opts.type ?? "sine";
      osc.frequency.setValueAtTime(opts.from, t0);
      if (opts.to) {
        if (opts.curve === "lin") osc.frequency.linearRampToValueAtTime(opts.to, t0 + opts.dur);
        else osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + opts.dur);
      }
      const vol = opts.vol ?? 0.3;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
      osc.connect(g).connect(master);
      osc.start(t0);
      osc.stop(t0 + opts.dur + 0.02);
    },
    [getCtx],
  );

  const noise = useCallback(
    (dur: number, vol = 0.15, filterFrom = 4000, filterTo = 200) => {
      const ctx = getCtx();
      const master = masterRef.current;
      if (!ctx || !master) return;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 1.2;
      const t0 = ctx.currentTime;
      filter.frequency.setValueAtTime(filterFrom, t0);
      filter.frequency.exponentialRampToValueAtTime(filterTo, t0 + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(filter).connect(g).connect(master);
      src.start(t0);
    },
    [getCtx],
  );

  const play = useCallback(
    (name: SoundName) => {
      if (!enabled) return;
      switch (name) {
        case "hover": {
          const now = performance.now();
          if (now - lastHover.current < 60) return;
          lastHover.current = now;
          tone({ type: "square", from: 1200, to: 1800, dur: 0.05, vol: 0.05 });
          break;
        }
        case "blip":
          tone({ type: "sine", from: 880, to: 1760, dur: 0.08, vol: 0.08 });
          break;
        case "click":
          tone({ type: "square", from: 600, to: 300, dur: 0.07, vol: 0.12 });
          tone({ type: "sine", from: 1400, dur: 0.04, vol: 0.08, delay: 0.02 });
          break;
        case "type":
          tone({ type: "square", from: 2200 + Math.random() * 600, dur: 0.02, vol: 0.04 });
          break;
        case "whoosh":
          noise(0.35, 0.12, 300, 3000);
          break;
        case "success":
          tone({ type: "sine", from: 523, dur: 0.12, vol: 0.15 });
          tone({ type: "sine", from: 659, dur: 0.12, vol: 0.15, delay: 0.1 });
          tone({ type: "sine", from: 784, dur: 0.12, vol: 0.15, delay: 0.2 });
          tone({ type: "sine", from: 1046, dur: 0.3, vol: 0.18, delay: 0.3 });
          break;
        case "error":
          tone({ type: "sawtooth", from: 220, to: 110, dur: 0.25, vol: 0.15 });
          tone({ type: "sawtooth", from: 180, to: 90, dur: 0.25, vol: 0.12, delay: 0.15 });
          break;
        case "boot":
          tone({ type: "sine", from: 200, to: 1600, dur: 0.6, vol: 0.12 });
          tone({ type: "triangle", from: 1046, dur: 0.15, vol: 0.12, delay: 0.5 });
          tone({ type: "triangle", from: 1568, dur: 0.25, vol: 0.12, delay: 0.62 });
          noise(0.6, 0.06, 200, 4000);
          break;
      }
    },
    [enabled, tone, noise],
  );

  // Ambient server-room hum while enabled
  useEffect(() => {
    if (!enabled) {
      if (ambientRef.current) {
        const { osc, gain } = ambientRef.current;
        const ctx = ctxRef.current;
        if (ctx) gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => osc.forEach((o) => o.stop()), 600);
        ambientRef.current = null;
      }
      return;
    }
    const ctx = getCtx();
    const master = masterRef.current;
    if (!ctx || !master) return;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2);
    const freqs = [55, 110, 165.2];
    const osc = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + i * 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain).connect(o.frequency);
      lfo.start();
      o.connect(gain);
      o.start();
      return o;
    });
    gain.connect(master);
    ambientRef.current = { osc, gain };
    play("boot");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const toggle = useCallback(() => {
    getCtx();
    setEnabled((e) => !e);
  }, [getCtx]);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
