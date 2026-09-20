'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

interface AdminNavContextValue {
  startNavigation: () => void;
  navigating: boolean;
}

const AdminNavContext = createContext<AdminNavContextValue>({
  startNavigation: () => {},
  navigating: false,
});

export function useAdminNav() {
  return useContext(AdminNavContext);
}

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const pendingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const finish = useCallback(() => {
    clearTimers();
    setProgress(100);
    const hide = window.setTimeout(() => {
      setVisible(false);
      setNavigating(false);
      setProgress(0);
      pendingRef.current = false;
    }, 160);
    timersRef.current.push(hide);
  }, []);

  const startNavigation = useCallback(() => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    clearTimers();
    setNavigating(true);
    setVisible(true);
    setProgress(18);
    const mid = window.setTimeout(() => setProgress(68), 40);
    const near = window.setTimeout(() => setProgress(86), 160);
    timersRef.current.push(mid, near);
  }, []);

  useEffect(() => {
    if (!pendingRef.current) return;
    finish();
  }, [pathname, finish]);

  useEffect(() => () => clearTimers(), []);

  return (
    <AdminNavContext.Provider value={{ startNavigation, navigating }}>
      {visible && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] overflow-hidden md:left-[272px]"
          aria-hidden
        >
          <div
            className="h-full origin-left rounded-r-full bg-gradient-to-r from-[#c4a574] via-[#d4bc8a] to-[#c4a574] shadow-[0_0_12px_rgba(196,165,116,0.55)] transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {children}
    </AdminNavContext.Provider>
  );
}

export function AdminContentTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { navigating } = useAdminNav();
  const [showPulse, setShowPulse] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!navigating) {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setShowPulse(false);
      return;
    }
    // Only show soft pulse if navigation takes a moment — keeps fast switches snappy
    timeoutRef.current = window.setTimeout(() => setShowPulse(true), 90);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [navigating]);

  useEffect(() => {
    setShowPulse(false);
  }, [pathname]);

  return (
    <div className="relative">
      {showPulse && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c4a574]/25 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-[#8a6d42] shadow-sm backdrop-blur-md">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#c4a574]/25 border-t-[#c4a574]" />
            Loading…
          </div>
        </div>
      )}
      <div
        key={pathname}
        className={`transition-opacity duration-150 ease-out ${
          navigating && showPulse ? 'opacity-55' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
