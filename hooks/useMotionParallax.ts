'use client';

import { useEffect, useRef, useState } from 'react';

export type ParallaxPoint = { x: number; y: number; scroll: number };

const DEFAULT: ParallaxPoint = { x: 0, y: 0, scroll: 0 };

/**
 * Smooth parallax driven by:
 * - pointer / touch drag
 * - scroll progress
 * - device orientation (mobile gyro, when available)
 * - gentle idle drift so motion never feels static on phones
 */
export function useMotionParallax(strength = 1) {
  const [point, setPoint] = useState<ParallaxPoint>(DEFAULT);
  const target = useRef(DEFAULT);
  const current = useRef(DEFAULT);
  const gyro = useRef({ x: 0, y: 0 });
  const idle = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const reduced = useRef(false);
  const start = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current = mq.matches;
    const onMq = () => {
      reduced.current = mq.matches;
      if (mq.matches) {
        target.current = DEFAULT;
        current.current = DEFAULT;
        setPoint(DEFAULT);
      }
    };
    mq.addEventListener('change', onMq);

    const applyPointer = (clientX: number, clientY: number) => {
      if (reduced.current) return;
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = (clientY / window.innerHeight) * 2 - 1;
      target.current = {
        ...target.current,
        x: nx * strength,
        y: ny * strength,
      };
    };

    const onPointer = (e: PointerEvent) => {
      applyPointer(e.clientX, e.clientY);
    };

    const onScroll = () => {
      if (reduced.current) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      target.current = {
        ...target.current,
        scroll: window.scrollY / max,
      };
    };

    const onOrient = (e: DeviceOrientationEvent) => {
      if (reduced.current) return;
      // gamma: left-right (-90..90), beta: front-back (-180..180)
      const g = typeof e.gamma === 'number' ? e.gamma : 0;
      const b = typeof e.beta === 'number' ? e.beta : 0;
      gyro.current = {
        x: Math.max(-1, Math.min(1, g / 35)) * strength,
        y: Math.max(-1, Math.min(1, (b - 45) / 45)) * strength,
      };
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    onScroll();

    const tick = () => {
      if (!reduced.current) {
        const t = (performance.now() - start.current) / 1000;
        idle.current = {
          x: Math.sin(t * 0.35) * 0.12 * strength,
          y: Math.cos(t * 0.28) * 0.1 * strength,
        };
      }

      const c = current.current;
      const blendX = target.current.x * 0.55 + gyro.current.x * 0.35 + idle.current.x * 0.35;
      const blendY = target.current.y * 0.55 + gyro.current.y * 0.35 + idle.current.y * 0.35;
      const ease = 0.1;
      c.x += (blendX - c.x) * ease;
      c.y += (blendY - c.y) * ease;
      c.scroll += (target.current.scroll - c.scroll) * ease;
      setPoint({ x: c.x, y: c.y, scroll: c.scroll });
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      mq.removeEventListener('change', onMq);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('deviceorientation', onOrient);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [strength]);

  return point;
}

export function parallaxStyle(
  point: ParallaxPoint,
  depth: number,
  opts?: { rotate?: boolean; scale?: number }
) {
  const tx = point.x * depth * -32;
  const ty = point.y * depth * -26 + point.scroll * depth * -48;
  const rx = opts?.rotate ? point.y * depth * -8 : 0;
  const ry = opts?.rotate ? point.x * depth * 10 : 0;
  const scale = opts?.scale ?? 1;

  return {
    transform: `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`,
    willChange: 'transform' as const,
  };
}
