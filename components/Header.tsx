'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

const NAV_LINKS = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.services', href: '/services' },
  { key: 'nav.blog', href: '/blog' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { settings, telHref } = useSiteSettings();
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const isHomePage = pathname === '/';
  const darkPages = ['/astromall', '/astro-mall'];
  const isDarkHero =
    darkPages.includes(pathname) ||
    (pathname === '/tarot-reading' && resolvedTheme === 'dark');

  const showSolidNav = isScrolled || isOpen || !isHomePage;
  const useLightText = isDarkHero && !showSolidNav;

  const headerBgClass = showSolidNav
    ? 'py-3.5 bg-white border-b border-stone-200/90 shadow-[0_1px_0_rgba(0,0,0,0.04),0_6px_24px_rgba(15,23,42,0.07)]'
    : 'py-5 bg-transparent border-b border-transparent';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-out ${headerBgClass}`}
    >
      <div className="section-container max-md:px-4">
        <nav className="flex items-center justify-between gap-2 md:gap-3">
          <Logo
            variant={useLightText ? 'mark' : 'full'}
            showText={useLightText}
            className="group flex shrink-0 items-center gap-2 overflow-visible md:gap-2.5"
            imageClassName={
              useLightText
                ? 'h-11 w-11 shrink-0 md:h-12 md:w-12'
                : 'h-11 w-auto max-w-[180px] shrink-0 sm:h-12 sm:max-w-[210px] md:h-14 md:max-w-[240px]'
            }
            textClassName={`shrink-0 overflow-visible font-serif font-bold transition-colors duration-300 text-sm leading-tight tracking-tight md:text-xl md:leading-normal lg:text-2xl md:tracking-tighter ${
              useLightText ? 'text-white/90' : 'text-stone-600'
            }`}
          />

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`relative py-1 text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                    useLightText
                      ? active
                        ? 'text-white'
                        : 'text-white/65 hover:text-white'
                      : active
                        ? 'text-stone-900'
                        : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {t(link.key)}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                      active ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className={`h-10 shrink-0 rounded-full border-2 bg-transparent px-3 text-xs font-semibold whitespace-nowrap shadow-none transition-colors sm:px-4 sm:text-sm md:h-11 md:px-5 md:text-base ${
                    useLightText
                      ? 'border-white/60 text-white hover:bg-white/10 hover:text-white'
                      : 'border-stone-300 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {language === 'en' ? 'English' : 'हिंदी'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background/90 backdrop-blur-md border-white/10"
              >
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer ${language === 'en' ? 'text-primary' : ''}`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('hi')}
                  className={`cursor-pointer ${language === 'hi' ? 'text-primary' : ''}`}
                >
                  हिंदी
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href={telHref}
              className={`hidden transition-colors sm:flex ${
                useLightText
                  ? 'text-white/70 hover:text-white'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title={t('hero.call')}
            >
              <Phone size={18} />
            </a>

            <Link
              href="/contact"
              className={`hidden items-center justify-center rounded-full px-4 py-2 text-[10px] font-semibold tracking-wide transition-all duration-300 sm:inline-flex md:px-5 md:text-xs ${
                useLightText
                  ? 'border border-white/30 text-white hover:bg-white hover:text-stone-900'
                  : 'bg-stone-900 text-white shadow-sm hover:bg-stone-800'
              }`}
            >
              {t('nav.consult')}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((open) => !open)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors md:hidden ${
                useLightText && !isOpen
                  ? 'bg-white/10 text-white hover:bg-white/15'
                  : 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
              }`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu — portaled via Sheet so it renders above the fixed header */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          overlayClassName="z-[200] bg-black/60 backdrop-blur-sm"
          className="z-[201] flex h-full w-full max-w-[320px] flex-col gap-0 border-l border-border/60 bg-background p-0 shadow-2xl sm:max-w-[360px] [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-border/50 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <Logo
              variant="full"
              imageClassName="h-11 w-auto max-w-[200px] shrink-0"
            />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex min-h-[52px] items-center justify-between rounded-xl px-4 py-3 transition-all ${
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span className="font-serif text-xl tracking-tight">
                        {t(link.key)}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`transition-transform group-hover:translate-x-0.5 ${
                          active ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Panel footer */}
          <div className="space-y-4 border-t border-border/50 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t('nav.language')}
              </span>
              <div className="flex rounded-full border-2 border-border p-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    language === 'en'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    language === 'hi'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <a
              href={telHref}
              className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3 transition-colors hover:bg-muted"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone size={18} />
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {t('nav.expert')}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {settings.phoneDisplay}
                </span>
              </div>
            </a>

            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="shine-effect flex h-12 w-full items-center justify-center rounded-full border border-primary/30 bg-primary text-sm font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t('nav.consult')}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
