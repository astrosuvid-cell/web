'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useSelectedService } from '@/lib/SelectedServiceContext';
import { useMemo } from 'react';
import { useProducts } from '@/hooks/useProducts';
import MallShowcaseCard, { MallShowcaseSkeleton } from './products/MallShowcaseCard';

export default function AstroMall() {
  const { t } = useLanguage();
  const { selectedService } = useSelectedService();
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    if (!selectedService || selectedService === 'matrimonial') return products;

    if (selectedService === 'gemstone') {
      const gemstoneKeywords = [
        'sapphire', 'ruby', 'emerald', 'diamond', 'pearl', 'coral', 'eye',
        'hessonite', 'stone', 'gemstone', 'panna', 'manak', 'pukhraj', 'neelam', 'moti', 'ring',
      ];
      return products.filter(
        (p) =>
          gemstoneKeywords.some((kw) => p.name.toLowerCase().includes(kw)) ||
          (p.description && gemstoneKeywords.some((kw) => p.description!.toLowerCase().includes(kw)))
      );
    }

    if (selectedService === 'vastu') {
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes('vastu') ||
          (p.description && p.description.toLowerCase().includes('vastu'))
      );
    }

    return products;
  }, [products, selectedService]);

  const heroProduct = filteredProducts[0];
  const sideProducts = filteredProducts.slice(1, 3);
  const moreProducts = filteredProducts.slice(3);

  return (
    <section id="astro-mall" className="relative overflow-hidden bg-[#f7f5f1] py-20 text-stone-900 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_10%,rgba(196,165,116,0.18),transparent_45%)]" />

      <div className="section-container relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(240px,320px)_1fr] lg:gap-16 xl:gap-20">
          <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-serif text-[2rem] leading-[1.08] tracking-tight sm:text-4xl md:text-[2.75rem]">
              {t('mall.title')}{' '}
              <span className="italic text-[#8a6d42]">{t('mall.title.highlight')}</span>{' '}
              {t('mall.mall')}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-stone-600 sm:text-base">
              {t('mall.subtitle')}
            </p>

            <ul className="mt-8 space-y-3 border-t border-stone-300/70 pt-8 text-sm text-stone-600">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c4a574]" />
                {t('mall.trust.certified')}
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c4a574]" />
                {t('mall.trust.energized')}
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c4a574]" />
                {t('mall.trust.matched')}
              </li>
            </ul>

            {!loading && filteredProducts.length > 0 && (
              <Link
                href="/astromall"
                className="mt-10 inline-flex w-fit items-center gap-2 bg-[#0f172a] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1e293b]"
              >
                {t('mall.explore')}
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 md:grid-rows-2 md:gap-5">
                <MallShowcaseSkeleton hero />
                <MallShowcaseSkeleton />
                <MallShowcaseSkeleton />
              </div>
            ) : error ? (
              <div className="border border-stone-200 bg-white px-6 py-16 text-center">
                <p className="text-stone-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="border border-dashed border-stone-300 bg-white/60 px-6 py-20 text-center">
                <p className="text-sm text-stone-500">
                  {selectedService ? t('mall.noProducts') : t('mall.coming_soon')}
                </p>
                <Link
                  href="/astromall"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#8a6d42] hover:underline"
                >
                  {t('mall.visitMall')}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5">
                <div className="grid gap-4 md:min-h-[520px] md:grid-cols-2 md:grid-rows-2 md:gap-5">
                  {heroProduct && (
                    <div className="md:row-span-2">
                      <MallShowcaseCard product={heroProduct} size="hero" />
                    </div>
                  )}
                  {sideProducts.map((product) => (
                    <MallShowcaseCard key={product.id} product={product} size="standard" />
                  ))}
                  {filteredProducts.length === 1 && (
                    <div className="flex min-h-[200px] flex-col items-center justify-center border border-dashed border-stone-300 bg-white/60 p-8 text-center md:row-span-2">
                      <p className="font-serif text-lg text-stone-500">{t('mall.moreComing')}</p>
                      <Link
                        href="/astromall"
                        className="mt-4 text-sm text-[#8a6d42] hover:underline"
                      >
                        {t('mall.viewMall')}
                      </Link>
                    </div>
                  )}
                  {filteredProducts.length === 2 && (
                    <div className="flex min-h-[160px] flex-col items-center justify-center border border-dashed border-stone-300 bg-white/60 p-6 text-center">
                      <p className="text-sm text-stone-500">{t('mall.newArrivals')}</p>
                    </div>
                  )}
                </div>

                {moreProducts.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                    {moreProducts.map((product) => (
                      <MallShowcaseCard key={product.id} product={product} size="standard" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
