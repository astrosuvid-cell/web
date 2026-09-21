'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const CosmicBackground = dynamic(() => import('@/components/CosmicBackground'), {
  ssr: false,
});
const DepthAtmosphere = dynamic(() => import('@/components/effects/DepthAtmosphere'), {
  ssr: false,
});
const TouchConstellation = dynamic(() => import('@/components/effects/TouchConstellation'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('@/components/effects/CustomCursor'), {
  ssr: false,
});

function useAfterLcp(delayMs = 1800) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let done = false;

    const enable = () => {
      if (done) return;
      done = true;
      setReady(true);
    };

    // Prefer idle after first paint; always fall back so effects still appear
    timeoutId = window.setTimeout(enable, delayMs);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(enable, { timeout: delayMs + 800 });
    }

    const onLoad = () => {
      window.setTimeout(enable, 400);
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad, { once: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('load', onLoad);
      if (idleId != null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [delayMs]);

  return ready;
}

/** All visual effects kept — started after LCP window so mobile score improves. */
export function DeferredPageEffects() {
  const ready = useAfterLcp(1600);
  if (!ready) return null;

  return (
    <>
      <CosmicBackground />
      <DepthAtmosphere />
      <TouchConstellation />
    </>
  );
}

export function DeferredCursor() {
  const ready = useAfterLcp(2000);
  if (!ready) return null;
  return <CustomCursor />;
}
