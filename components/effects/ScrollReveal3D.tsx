'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollReveal3DProps {
  children: ReactNode;
  className?: string;
}

/** Soft reveal on scroll. Mobile-safe: never stays hidden. */
export default function ScrollReveal3D({ children, className = '' }: ScrollReveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.pointerEvents = 'auto';
    };

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile / reduced motion: show immediately — no hide-then-reveal trap
    if (coarse || reduced) {
      reveal();
      return;
    }

    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 28px, 0)';
    el.style.transition =
      'opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)';

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.unobserve(el);
        }
      },
      // threshold 0 = fire as soon as any pixel enters (fixes tall sections on mobile/desktop)
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );

    io.observe(el);

    // Fail-safe: never leave content invisible
    const failSafe = window.setTimeout(reveal, 1200);

    return () => {
      io.disconnect();
      window.clearTimeout(failSafe);
    };
  }, []);

  return (
    <div ref={ref} className={className} style={{ transformOrigin: 'center top' }}>
      {children}
    </div>
  );
}
