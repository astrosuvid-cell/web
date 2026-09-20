'use client';

import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Gem } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';
import { whatsappHref as buildWhatsappHref } from '@/lib/siteSettings';
import {
  type AstroProduct,
  formatProductPrice,
  getProductImageUrl,
} from '@/lib/products';

interface MallShowcaseCardProps {
  product: AstroProduct;
  size?: 'hero' | 'standard';
}

export default function MallShowcaseCard({
  product,
  size = 'standard',
}: MallShowcaseCardProps) {
  const { t } = useLanguage();
  const { settings } = useSiteSettings();
  const isHero = size === 'hero';
  const imageUrl = getProductImageUrl(product.image_url, isHero ? 1000 : 720);

  const whatsappMessage = t('whatsapp.message')
    .replace('{productName}', product.name)
    .replace('{price}', product.price.toLocaleString('en-IN'));

  return (
    <article
      className={`group relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 shadow-sm transition-all duration-500 hover:border-[#c4a574]/50 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${
        isHero ? 'min-h-[420px] sm:min-h-[480px]' : 'min-h-[260px] sm:min-h-[280px]'
      }`}
    >
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-0 block">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
            <Gem size={48} className="text-amber-400/30" />
          </div>
        )}
      </Link>

      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06080f] via-[#06080f]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Top meta */}
      <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-md">
          {t('mall.authentic')}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 md:p-6">
        <div className={`${isHero ? 'max-w-md' : ''}`}>
          <Link href={`/product/${product.id}`}>
            <h3
              className={`font-serif leading-tight text-white transition-colors group-hover:text-amber-100 ${
                isHero ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-lg sm:text-xl'
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {!isHero && product.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              {product.description}
            </p>
          )}

          {isHero && product.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-400 md:text-base">
              {product.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-xl border border-white/10 bg-black/45 px-4 py-2 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">From</p>
              <p className="font-serif text-xl text-amber-300 sm:text-2xl">
                {formatProductPrice(product)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/product/${product.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 transition-transform hover:scale-[1.03]"
              >
                Details
                <ArrowUpRight size={13} />
              </Link>
              <a
                href={buildWhatsappHref(settings.phone, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Enquire about ${product.name}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:border-green-500 hover:bg-green-600"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MallShowcaseSkeleton({ hero = false }: { hero?: boolean }) {
  return (
    <div
      className={`animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-stone-200/60 ${
        hero ? 'min-h-[420px]' : 'min-h-[280px]'
      }`}
    />
  );
}
