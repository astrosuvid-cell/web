'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  glare?: boolean;
  disabled?: boolean;
}

/** Desktop-only 3D tilt. Disabled on touch so taps/links work reliably. */
export default function Tilt3D({
  children,
  className = '',
  maxTilt = 10,
  perspective = 900,
  glare = true,
  disabled = false,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
  });
  const [glareStyle, setGlareStyle] = useState<CSSProperties>({ opacity: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (disabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setEnabled(true);
  }, [disabled]);

  const reset = () => {
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 420ms ease' });
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * maxTilt * 2;
    const rx = (0.5 - py) * maxTilt * 2;

    setStyle({
      transform: `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`,
      transition: 'transform 60ms linear',
    });

    if (glare) {
      setGlareStyle({
        opacity: 0.45,
        background: `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.5), transparent 55%)`,
        transition: 'opacity 60ms linear',
      });
    }
  };

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`relative [transform-style:preserve-3d] ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay"
          style={glareStyle}
        />
      )}
    </div>
  );
}
