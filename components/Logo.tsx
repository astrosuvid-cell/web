'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { SITE_LOGO, SITE_LOGO_MARK } from '@/lib/seo';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  /** full = wordmark logo; mark = symbol only */
  variant?: 'full' | 'mark';
  /** When true with variant=mark, show brand text beside the mark */
  showText?: boolean;
  priority?: boolean;
}

export default function Logo({
  className = 'group flex shrink-0 items-center gap-2.5',
  imageClassName,
  textClassName = 'whitespace-nowrap text-xl font-serif font-bold tracking-tighter text-stone-600 md:text-2xl',
  variant = 'full',
  showText,
  priority = false,
}: LogoProps) {
  const { t } = useLanguage();
  const brandPrefix = t('brand.name.prefix');
  const brandHighlight = t('brand.name.highlight');
  const isMark = variant === 'mark';
  const withText = showText ?? isMark;

  const defaultImageClass = isMark
    ? 'h-9 w-9 shrink-0 md:h-10 md:w-10'
    : 'h-10 w-auto shrink-0 md:h-12';

  return (
    <Link href="/" className={`${className} overflow-visible`}>
      <Image
        src={isMark ? SITE_LOGO_MARK : SITE_LOGO}
        alt={t('brand.name.full')}
        width={isMark ? 80 : 220}
        height={isMark ? 80 : 105}
        className={`object-contain ${imageClassName ?? defaultImageClass}`}
        priority={priority}
      />
      {withText && (
        <>
          <span className={`flex flex-col leading-tight md:hidden ${textClassName}`}>
            <span>{brandPrefix}</span>
            <span>{brandHighlight}</span>
          </span>
          <span className={`hidden whitespace-nowrap md:inline ${textClassName}`}>
            {t('brand.name.full')}
          </span>
        </>
      )}
    </Link>
  );
}
