'use client';

import { useMotionParallax, parallaxStyle } from '@/hooks/useMotionParallax';

/** Floating depth orbs + grid that track the cursor across the homepage. */
export default function DepthAtmosphere() {
  const p = useMotionParallax(1);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <div
        className="absolute -left-[15%] top-[10%] h-[48vmin] w-[48vmin] rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.18),transparent_68%)] blur-2xl"
        style={parallaxStyle(p, 0.35)}
      />
      <div
        className="absolute -right-[10%] top-[35%] h-[42vmin] w-[42vmin] rounded-full bg-[radial-gradient(circle,rgba(30,58,138,0.12),transparent_70%)] blur-2xl"
        style={parallaxStyle(p, 0.55)}
      />
      <div
        className="absolute bottom-[5%] left-[30%] h-[36vmin] w-[36vmin] rounded-full bg-[radial-gradient(circle,rgba(180,83,9,0.1),transparent_70%)] blur-3xl"
        style={parallaxStyle(p, 0.8)}
      />

      {/* Perspective mesh */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55vh] origin-bottom opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to top, #0f172a 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          transform: `perspective(700px) rotateX(62deg) translate3d(${p.x * -40}px, ${p.scroll * 120}px, 0)`,
          maskImage: 'linear-gradient(to top, black, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent 85%)',
        }}
      />
    </div>
  );
}
