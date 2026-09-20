'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

type Star = {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
};

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const stars: Star[] = [];
    const starCount = reduced ? 60 : 180;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z: Math.random() * 0.9 + 0.15,
        radius: Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.5 + 0.15,
        twinkleSpeed: Math.random() * 0.012 + 0.003,
      });
    }

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scroll.current = window.scrollY * 0.12;
    };

    window.addEventListener('resize', resizeCanvas);
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    const animate = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isDark = resolvedTheme === 'dark';

      if (isDark) {
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
        gradient.addColorStop(0, '#0f0a1e');
        gradient.addColorStop(0.5, '#05070a');
        gradient.addColorStop(1, '#020305');
        ctx.fillStyle = gradient;
      } else {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(253, 250, 245, 0.55)';
        ctx.fillRect(0, 0, w, h);
      }

      const px = reduced ? 0 : pointer.current.x;
      const py = reduced ? 0 : pointer.current.y;
      const sy = reduced ? 0 : scroll.current;

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.08, Math.min(0.85, star.opacity));

        const depth = star.z;
        const ox = px * depth * -36;
        const oy = py * depth * -28 + sy * depth * 0.35;
        const x = ((star.x + ox) % w + w) % w;
        const y = ((star.y + oy) % h + h) % h;

        ctx.fillStyle = isDark
          ? `rgba(255, 215, 130, ${star.opacity})`
          : `rgba(120, 90, 40, ${star.opacity * 0.35})`;

        ctx.beginPath();
        ctx.arc(x, y, star.radius * depth, 0, Math.PI * 2);
        ctx.fill();

        if (star.opacity > 0.55 && depth > 0.55 && isDark) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 215, 130, 0.45)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Soft comet streak near cursor (desktop only)
      if (!reduced && Math.abs(px) + Math.abs(py) > 0.02) {
        const cx = (px * 0.5 + 0.5) * w;
        const cy = (py * 0.5 + 0.5) * h;
        const streak = ctx.createLinearGradient(cx - 80, cy - 40, cx + 80, cy + 40);
        streak.addColorStop(0, 'transparent');
        streak.addColorStop(0.5, isDark ? 'rgba(196,165,116,0.18)' : 'rgba(196,165,116,0.12)');
        streak.addColorStop(1, 'transparent');
        ctx.strokeStyle = streak;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy - 35);
        ctx.lineTo(cx + 70, cy + 35);
        ctx.stroke();
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full opacity-100"
      aria-hidden
    />
  );
}
