'use client';

import { useEffect, useRef } from 'react';
import { useMotionParallax } from '@/hooks/useMotionParallax';

/**
 * Creative mobile-first constellation:
 * touch ripples, floating nodes, and a magnetic orb that follows
 * finger / gyro / scroll.
 */
export default function TouchConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const p = useMotionParallax(1.15);
  const pRef = useRef(p);
  pRef.current = p;
  const ripples = useRef<Array<{ x: number; y: number; r: number; a: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const nodes = Array.from({ length: 28 }, (_, i) => ({
      a: (i / 28) * Math.PI * 2,
      r: 70 + (i % 7) * 28,
      size: 1.2 + (i % 3) * 0.7,
      phase: Math.random() * Math.PI * 2,
    }));

    const spawnRipple = (x: number, y: number) => {
      if (reduced) return;
      ripples.current.push({ x, y, r: 8, a: 0.45 });
      if (ripples.current.length > 8) ripples.current.shift();
    };

    const onPointer = (e: PointerEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', onPointer, { passive: true });

    const draw = (t: number) => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const motion = pRef.current;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5 + motion.x * 48;
      const cy = h * 0.42 + motion.y * 36 + motion.scroll * 40;

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
      core.addColorStop(0, 'rgba(196,165,116,0.28)');
      core.addColorStop(0.45, 'rgba(30,58,138,0.1)');
      core.addColorStop(1, 'transparent');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();

      nodes.forEach((n, i) => {
        const ang = n.a + t * 0.00035 * (i % 2 === 0 ? 1 : -1) + motion.x * 0.4;
        const rr = n.r + Math.sin(t * 0.001 + n.phase) * 10 + motion.y * 8;
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang) * rr * 0.72;

        ctx.beginPath();
        ctx.fillStyle =
          i % 4 === 0
            ? `rgba(196,165,116,${0.35 + Math.sin(t * 0.002 + n.phase) * 0.2})`
            : `rgba(15,23,42,${0.18 + (i % 3) * 0.05})`;
        ctx.arc(x, y, n.size, 0, Math.PI * 2);
        ctx.fill();

        if (i % 5 === 0) {
          ctx.strokeStyle = 'rgba(196,165,116,0.12)';
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });

      ripples.current = ripples.current.filter((r) => r.a > 0.02);
      ripples.current.forEach((r) => {
        r.r += 2.8;
        r.a *= 0.94;
        ctx.strokeStyle = `rgba(196,165,116,${r.a})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] opacity-40 md:opacity-30"
    />
  );
}
