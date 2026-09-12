"use client";

import { useEffect, useRef } from "react";

/**
 * Full-page background: neural network nodes that connect and get attracted
 * to the mouse, over a subtle "matrix" code rain.
 */
export default function NeuralBackground() {
  const netRef = useRef<HTMLCanvasElement>(null);
  const rainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const net = netRef.current;
    const rain = rainRef.current;
    if (!net || !rain) return;
    const nctx = net.getContext("2d");
    const rctx = rain.getContext("2d");
    if (!nctx || !rctx) return;

    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    let columns: number[] = [];
    const glyphs = "アイウエオカキクケコ0123456789ABCDEF<>{}[]=/\\|;:λΣ∆";
    const fontSize = 14;

    const setup = () => {
      w = net.width = rain.width = window.innerWidth;
      h = net.height = rain.height = window.innerHeight;
      const count = Math.min(120, Math.floor((w * h) / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 1,
      }));
      columns = Array.from({ length: Math.ceil(w / fontSize) }, () => Math.random() * -100);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let raf = 0;
    let frame = 0;

    const draw = () => {
      frame++;
      // --- Matrix rain (slower, every 2nd frame) ---
      if (frame % 2 === 0) {
        rctx.fillStyle = "rgba(5, 8, 12, 0.12)";
        rctx.fillRect(0, 0, w, h);
        rctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < columns.length; i++) {
          const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          const x = i * fontSize;
          const y = columns[i] * fontSize;
          rctx.fillStyle = Math.random() < 0.08 ? "rgba(0,255,195,0.9)" : "rgba(0,255,195,0.25)";
          rctx.fillText(ch, x, y);
          if (y > h && Math.random() > 0.985) columns[i] = 0;
          columns[i]++;
        }
      }

      // --- Neural network ---
      nctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220) {
          const d = Math.sqrt(d2) || 1;
          n.vx += (dx / d) * 0.02;
          n.vy += (dy / d) * 0.02;
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) {
            const alpha = (1 - Math.sqrt(d2) / 130) * 0.35;
            nctx.strokeStyle = `rgba(56, 229, 255, ${alpha})`;
            nctx.lineWidth = 1;
            nctx.beginPath();
            nctx.moveTo(a.x, a.y);
            nctx.lineTo(b.x, b.y);
            nctx.stroke();
          }
        }
        // mouse links
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 200 * 200) {
          const alpha = (1 - Math.sqrt(md2) / 200) * 0.7;
          nctx.strokeStyle = `rgba(0, 255, 195, ${alpha})`;
          nctx.beginPath();
          nctx.moveTo(a.x, a.y);
          nctx.lineTo(mouse.x, mouse.y);
          nctx.stroke();
        }
        nctx.fillStyle = "rgba(0, 255, 195, 0.8)";
        nctx.beginPath();
        nctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        nctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    setup();
    draw();
    window.addEventListener("resize", setup);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setup);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--color-void)]">
      <canvas ref={rainRef} className="absolute inset-0 opacity-40" />
      <canvas ref={netRef} className="absolute inset-0" />
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,255,195,0.12),transparent_60%)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.12),transparent_60%)] blur-3xl" />
    </div>
  );
}
