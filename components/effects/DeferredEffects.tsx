'use client';

import dynamic from 'next/dynamic';

const CosmicBackground = dynamic(() => import('@/components/CosmicBackground'), {
  ssr: false,
});
const DepthAtmosphere = dynamic(() => import('@/components/effects/DepthAtmosphere'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('@/components/effects/CustomCursor'), {
  ssr: false,
});

/** Client-only decorative layers — kept out of the RSC graph for faster LCP. */
export function DeferredPageEffects() {
  return (
    <>
      <CosmicBackground />
      <DepthAtmosphere />
    </>
  );
}

export function DeferredCursor() {
  return <CustomCursor />;
}
