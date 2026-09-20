'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Download, Share, X, Plus, Smartphone } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  dismissInstallPrompt,
  isIosSafari,
  isStandaloneMode,
  shouldShowInstallPrompt,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa';
import { Button } from '@/components/ui/button';

export default function PWAInstallPrompt() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIosGuide, setIsIosGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin || isStandaloneMode() || !shouldShowInstallPrompt()) return;

    setVisible(true);

    const modalShown = sessionStorage.getItem('pwa-modal-shown');
    if (!modalShown) {
      const timer = window.setTimeout(() => {
        setShowModal(true);
        sessionStorage.setItem('pwa-modal-shown', '1');
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [isAdmin, pathname]);

  useEffect(() => {
    if (isAdmin) return;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsIosGuide(false);
      setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setShowModal(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    if (isIosSafari() && !isStandaloneMode() && shouldShowInstallPrompt()) {
      setIsIosGuide(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [isAdmin]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      if (isIosGuide) setShowModal(true);
      return;
    }

    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setVisible(false);
        setShowModal(false);
      }
    } finally {
      setDeferredPrompt(null);
      setInstalling(false);
    }
  }, [deferredPrompt, isIosGuide]);

  const handleLater = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleDismiss = useCallback(() => {
    dismissInstallPrompt();
    setShowModal(false);
    setVisible(false);
  }, []);

  if (isAdmin || !visible || isStandaloneMode()) return null;

  return (
    <>
      {/* Sticky bottom bar — always visible on mobile until installed/dismissed */}
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-amber-200/80 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-amber-50 ring-1 ring-amber-200/60">
            <Image src="/logo-mark.png" alt="Astro Suvid" width={44} height={44} className="h-9 w-9 object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-900">{t('pwa.bar.title')}</p>
            <p className="truncate text-xs text-stone-500">{t('pwa.bar.subtitle')}</p>
          </div>
          <Button
            size="sm"
            onClick={() => (deferredPrompt || isIosGuide ? setShowModal(true) : handleInstall())}
            className="shrink-0 rounded-full bg-amber-700 px-4 text-xs font-semibold text-white hover:bg-amber-800"
          >
            <Download size={14} className="mr-1.5" />
            {t('pwa.install')}
          </Button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={t('pwa.dismiss')}
            className="shrink-0 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Full-screen install modal */}
      {showModal && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center md:hidden">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 px-6 pb-8 pt-6 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Image src="/icon-192.png" alt="" width={56} height={56} className="h-12 w-12 rounded-xl object-cover" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-100/80">Astro Suvid</p>
                    <h2 id="pwa-install-title" className="text-lg font-semibold leading-tight">
                      {t('pwa.modal.title')}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLater}
                  className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label={t('pwa.later')}
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-amber-50/90">{t('pwa.modal.subtitle')}</p>
            </div>

            <div className="space-y-4 px-6 py-5">
              {isIosGuide ? (
                <ol className="space-y-3 text-sm text-stone-700">
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <Share size={14} />
                    </span>
                    <span>{t('pwa.ios.step1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <Plus size={14} />
                    </span>
                    <span>{t('pwa.ios.step2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <Smartphone size={14} />
                    </span>
                    <span>{t('pwa.ios.step3')}</span>
                  </li>
                </ol>
              ) : (
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• {t('pwa.benefit1')}</li>
                  <li>• {t('pwa.benefit2')}</li>
                  <li>• {t('pwa.benefit3')}</li>
                </ul>
              )}

              {!isIosGuide && deferredPrompt && (
                <Button
                  onClick={handleInstall}
                  disabled={installing}
                  className="h-12 w-full rounded-2xl bg-amber-700 text-base font-semibold text-white hover:bg-amber-800"
                >
                  <Download size={18} className="mr-2" />
                  {installing ? t('pwa.installing') : t('pwa.installNow')}
                </Button>
              )}

              {!isIosGuide && !deferredPrompt && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                  {t('pwa.android.fallback')}
                </p>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleLater} className="h-11 flex-1 rounded-xl">
                  {t('pwa.later')}
                </Button>
                {!isIosGuide && (
                  <Button variant="ghost" onClick={handleDismiss} className="h-11 flex-1 rounded-xl text-stone-500">
                    {t('pwa.dismiss')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
