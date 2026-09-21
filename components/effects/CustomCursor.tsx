'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  rot: number;
  spin: number;
  hue: number;
};

/**
 * Glitter trail for desktop mouse + mobile touch.
 * Canvas overlay, pointer-events none — never blocks scroll.
 */
export default function CustomCursor() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    // Skip glitter canvas on touch phones — big LCP/TBT win on mobile Lighthouse
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let mx = -999;
    let my = -999;
    let px = -999;
    let py = -999;
    let active = false;
    let raf = 0;
    let running = true;
    let scrollSparkAt = 0;

    const sparks: Spark[] = [];
    const MAX = isTouch ? 55 : 70;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isTextField = (el: Element | null) =>
      Boolean(el?.closest('input, textarea, select, [contenteditable="true"]'));

    const spawn = (x: number, y: number, burst = 1) => {
      for (let i = 0; i < burst; i++) {
        if (sparks.length >= MAX) sparks.shift();
        const a = Math.random() * Math.PI * 2;
        const speed = (isTouch ? 0.35 : 0.2) + Math.random() * (isTouch ? 1.8 : 1.4);
        sparks.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - (isTouch ? 0.5 : 0.35),
          life: 1,
          maxLife: (isTouch ? 0.7 : 0.55) + Math.random() * 0.55,
          size: (isTouch ? 2.8 : 2.2) + Math.random() * (isTouch ? 4 : 3.2),
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.28,
          hue: Math.random() > 0.3 ? 0 : 1,
        });
      }
    };

    const drawStar = (
      x: number,
      y: number,
      size: number,
      rot: number,
      alpha: number,
      gold: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const a2 = a + Math.PI / 4;
        ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        ctx.lineTo(Math.cos(a2) * size * 0.35, Math.sin(a2) * size * 0.35);
      }
      ctx.closePath();
      ctx.fillStyle = gold
        ? `rgba(212, 175, 95, ${alpha})`
        : `rgba(255, 248, 230, ${alpha})`;
      ctx.fill();
      ctx.restore();
    };

    const trailFromMove = (x: number, y: number) => {
      const dx = x - px;
      const dy = y - py;
      const dist = Math.hypot(dx, dy);
      if (px > -100 && dist > 2) {
        const step = isTouch ? 6 : 8;
        const count = Math.min(isTouch ? 7 : 5, Math.max(1, Math.floor(dist / step)));
        for (let i = 0; i < count; i++) {
          const t = (i + 1) / (count + 1);
          spawn(px + dx * t, py + dy * t, isTouch ? 2 : 1);
        }
      } else if (px < -100) {
        spawn(x, y, isTouch ? 4 : 2);
      }
      px = x;
      py = y;
      mx = x;
      my = y;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isTextField(e.target as Element)) {
        active = false;
        return;
      }
      // On touch devices only draw while finger is down
      if (isTouch && e.pointerType === 'touch' && e.buttons === 0 && e.pressure === 0) {
        // Some browsers report move without press during scroll — ignore floating hover
        if (!active) return;
      }
      active = true;
      trailFromMove(e.clientX, e.clientY);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (isTextField(e.target as Element)) return;
      active = true;
      px = -999;
      trailFromMove(e.clientX, e.clientY);
      // Touch "nova" burst
      if (e.pointerType === 'touch' || isTouch) {
        spawn(e.clientX, e.clientY, 10);
      }
    };

    const onPointerUp = () => {
      if (isTouch) {
        active = false;
        px = -999;
      }
    };

    const onLeave = () => {
      active = false;
      px = -999;
    };

    // Scroll: soft constellation dust from top edge — mobile delight without blocking
    const onScroll = () => {
      if (!isTouch) return;
      const now = performance.now();
      if (now - scrollSparkAt < 80) return;
      scrollSparkAt = now;
      const x = 24 + Math.random() * (w - 48);
      spawn(x, 12 + Math.random() * 40, 1);
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      if (active) {
        const radius = isTouch ? 36 : 28;
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
        g.addColorStop(0, 'rgba(196,165,116,0.22)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mx, my, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.018;
        s.vx *= 0.98;
        s.rot += s.spin;
        s.life -= 1 / (60 * s.maxLife);

        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, s.life) * 0.95;
        drawStar(s.x, s.y, s.size * (0.6 + s.life * 0.5), s.rot, alpha, s.hue === 0);

        if (s.life > 0.7 && Math.random() > 0.9) {
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.85})`;
          ctx.fillRect(s.x - 0.6, s.y - 0.6, 1.2, 1.2);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    if (isTouch) window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998]"
    />
  );
}
