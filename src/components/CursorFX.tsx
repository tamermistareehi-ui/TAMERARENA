"use client";

import { useEffect, useRef } from "react";
import { useSound } from "./SoundProvider";

/**
 * Custom cursor: glowing dot + lagging ring + particle trail on a canvas,
 * plus hover/click sounds for interactive elements.
 */
export default function CursorFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!canvas || !ring || !dot) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const mouse = { x: w / 2, y: h / 2 };
    const ringPos = { x: w / 2, y: h / 2 };
    let hovering = false;
    let raf = 0;

    type P = { x: number; y: number; vx: number; vy: number; life: number; size: number; hue: number; char?: string };
    const particles: P[] = [];
    const chars = "01{}<>/=;λΣ∆π#$%&*+";

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.3,
          life: 1,
          size: Math.random() * 2 + 1,
          hue: 160 + Math.random() * 60,
          char: Math.random() < 0.15 ? chars[Math.floor(Math.random() * chars.length)] : undefined,
        });
      }
      if (particles.length > 160) particles.splice(0, particles.length - 160);
    };

    const onDown = () => {
      ring.style.transform += " scale(0.7)";
      playRef.current("click");
      for (let i = 0; i < 18; i++) {
        const a = (Math.PI * 2 * i) / 18;
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: Math.cos(a) * 3,
          vy: Math.sin(a) * 3,
          life: 1,
          size: 2,
          hue: 180 + Math.random() * 100,
        });
      }
    };

    const isInteractive = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("a, button, [role=button], input, textarea, select, label, .interactive");

    const onOver = (e: MouseEvent) => {
      const inter = isInteractive(e.target);
      if (inter && !hovering) playRef.current("hover");
      hovering = inter;
      ring.dataset.hover = inter ? "1" : "0";
    };

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const loop = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) scale(${hovering ? 1.8 : 1})`;

      ctx.clearRect(0, 0, w, h);
      ctx.font = "11px monospace";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue} 100% 65%)`;
        ctx.shadowColor = `hsl(${p.hue} 100% 60%)`;
        ctx.shadowBlur = 8;
        if (p.char) ctx.fillText(p.char, p.x, p.y);
        else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-fx" />
      <div
        ref={ringRef}
        className="cursor-fx -ml-5 -mt-5 h-10 w-10 rounded-full border border-[var(--color-neon)] transition-[width,height,border-color] duration-200 data-[hover=1]:border-[var(--color-cyan)]"
        style={{ boxShadow: "0 0 12px rgba(0,255,195,0.5), inset 0 0 12px rgba(0,255,195,0.15)" }}
      />
      <div
        ref={dotRef}
        className="cursor-fx -ml-1 -mt-1 h-2 w-2 rounded-full bg-[var(--color-neon)]"
        style={{ boxShadow: "0 0 10px var(--color-neon)" }}
      />
    </>
  );
}
