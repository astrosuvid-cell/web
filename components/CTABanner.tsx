'use client';

import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useSiteSettings } from '@/lib/SiteSettingsContext';

/**
 * Classic North-Indian kundli (300×300):
 * outer square + side-midpoint diamond + both diagonals = 12 bhavas.
 * House 1 (Lagna) = top kendra; houses run anticlockwise.
 *
 * Layout (anticlockwise from Lagna):
 *          2 | 1 | 12
 *        3 |       | 11
 *        4 |       | 10
 *        5 |       |  9
 *          6 | 7 |  8
 */
const HOUSE_POLYGONS: Record<number, string> = {
  1: '150,0 225,75 150,150 75,75', // top kendra
  2: '0,0 150,0 75,75', // top-left corner
  3: '0,0 75,75 0,150', // left-upper
  4: '0,150 75,75 150,150 75,225', // left kendra
  5: '0,300 0,150 75,225', // left-lower
  6: '0,300 75,225 150,300', // bottom-left corner
  7: '150,300 75,225 150,150 225,225', // bottom kendra
  8: '300,300 225,225 150,300', // bottom-right corner
  9: '300,300 300,150 225,225', // right-lower
  10: '300,150 225,75 150,150 225,225', // right kendra
  11: '300,0 225,75 300,150', // right-upper
  12: '300,0 150,0 225,75', // top-right corner
};

/** Centroids / label anchors (number above, grahas below or beside) */
const HOUSE_LABELS: Record<
  number,
  { num: [number, number]; planets: [number, number] }
> = {
  1: { num: [150, 38], planets: [150, 68] },
  2: { num: [62, 28], planets: [48, 48] },
  3: { num: [28, 62], planets: [42, 88] },
  4: { num: [42, 150], planets: [70, 150] },
  5: { num: [28, 238], planets: [42, 212] },
  6: { num: [62, 272], planets: [48, 252] },
  7: { num: [150, 262], planets: [150, 232] },
  8: { num: [238, 272], planets: [252, 252] },
  9: { num: [272, 238], planets: [258, 212] },
  10: { num: [258, 150], planets: [230, 150] },
  11: { num: [272, 62], planets: [258, 88] },
  12: { num: [238, 28], planets: [252, 48] },
};

/** Illustrative graha placement — Rahu/Ketu always opposite */
const SAMPLE_PLANETS: Record<number, string[]> = {
  1: ['Su', 'Me'],
  2: ['Ke'],
  4: ['Mo'],
  5: ['Ve'],
  7: ['Sa'],
  8: ['Ra'],
  9: ['Ju'],
  10: ['Ma'],
};

function KundliChart() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="h-full w-full"
      role="img"
      aria-label="North Indian kundli: twelve houses anticlockwise from Lagna, with nine grahas"
    >
      {/* Outer square */}
      <rect
        x="1"
        y="1"
        width="298"
        height="298"
        fill="#0c1220"
        stroke="rgba(196,165,116,0.7)"
        strokeWidth="2.5"
      />

      {/* Soft house fills */}
      {Object.entries(HOUSE_POLYGONS).map(([n, points]) => (
        <polygon
          key={`fill-${n}`}
          points={points}
          fill={
            Number(n) === 1
              ? 'rgba(196,165,116,0.14)'
              : Number(n) % 2 === 0
                ? 'rgba(196,165,116,0.035)'
                : 'rgba(255,255,255,0.02)'
          }
        />
      ))}

      {/* Structure lines: diamond + diagonals (defines all 12 houses) */}
      <polygon
        points="150,0 300,150 150,300 0,150"
        fill="none"
        stroke="rgba(196,165,116,0.65)"
        strokeWidth="1.75"
      />
      <line x1="0" y1="0" x2="300" y2="300" stroke="rgba(196,165,116,0.55)" strokeWidth="1.75" />
      <line x1="300" y1="0" x2="0" y2="300" stroke="rgba(196,165,116,0.55)" strokeWidth="1.75" />

      {/* Lagna stroke */}
      <polygon
        points={HOUSE_POLYGONS[1]}
        fill="none"
        stroke="rgba(196,165,116,0.9)"
        strokeWidth="2"
      />

      {/* House numbers + grahas */}
      {Object.keys(HOUSE_POLYGONS).map((key) => {
        const n = Number(key);
        const label = HOUSE_LABELS[n];
        const planets = SAMPLE_PLANETS[n] || [];
        const isLagna = n === 1;

        return (
          <g key={`h-${n}`}>
            <text
              x={label.num[0]}
              y={label.num[1]}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={isLagna ? '#e8d5b5' : 'rgba(148,163,184,0.85)'}
              fontSize={isLagna ? 12 : 11}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {n}
            </text>
            {isLagna && (
              <text
                x={150}
                y={52}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(196,165,116,0.85)"
                fontSize="9"
                letterSpacing="0.06em"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                ASC
              </text>
            )}
            {planets.map((p, i) => (
              <text
                key={p}
                x={label.planets[0]}
                y={label.planets[1] + i * 15}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#c4a574"
                fontSize="14"
                fontWeight="600"
                fontFamily="ui-serif, Georgia, 'Times New Roman', serif"
              >
                {p}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

const GRAHAS = [
  { abbr: 'Su', name: 'Sun' },
  { abbr: 'Mo', name: 'Moon' },
  { abbr: 'Ma', name: 'Mars' },
  { abbr: 'Me', name: 'Mercury' },
  { abbr: 'Ju', name: 'Jupiter' },
  { abbr: 'Ve', name: 'Venus' },
  { abbr: 'Sa', name: 'Saturn' },
  { abbr: 'Ra', name: 'Rahu' },
  { abbr: 'Ke', name: 'Ketu' },
];

export default function CTABanner() {
  const { t } = useLanguage();
  const { whatsappHref } = useSiteSettings();

  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-[#f7f5f1]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(196,165,116,0.16),transparent_50%)]" />

      <div className="section-container relative grid items-center gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28">
        <div>
          <h2 className="font-serif text-[2rem] leading-[1.12] tracking-tight sm:text-4xl md:text-5xl">
            {t('cta.title')}{' '}
            <span className="italic text-[#c4a574]">{t('cta.title.highlight')}</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-stone-400 md:text-lg">
            {t('cta.subtitle')}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#c4a574] px-7 py-3.5 text-sm font-medium text-[#0f172a] transition-colors hover:bg-[#d4b884]"
            >
              {t('cta.button.book')}
              <ArrowRight size={16} />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 px-7 py-3.5 text-sm font-medium text-white/90 transition-colors hover:border-white/40 hover:bg-white/5"
            >
              <MessageCircle size={16} />
              {t('cta.button.whatsapp')}
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="border border-[#c4a574]/25 bg-[#121a2c] p-5 sm:p-7 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-xl text-[#e8d5b5] sm:text-2xl md:text-3xl">
                  {t('cta.chart.title')}
                </p>
                <p className="mt-1 text-sm text-stone-500">{t('cta.chart.subtitle')}</p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-[10px] uppercase tracking-wider text-stone-500">
                  {t('cta.response.label')}
                </p>
                <p className="font-serif text-lg text-white">{t('cta.response.value')}</p>
              </div>
            </div>

            <div className="relative mx-auto mt-6 aspect-square w-full max-w-[360px]">
              <KundliChart />
            </div>

            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-white/10 pt-4">
              {GRAHAS.map((g) => (
                <span key={g.abbr} className="text-[11px] text-stone-500">
                  <span className="font-medium text-[#c4a574]">{g.abbr}</span> {g.name}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 sm:hidden">
              <div>
                <p className="text-xs text-stone-500">{t('cta.response.label')}</p>
                <p className="mt-0.5 font-serif text-xl text-white">{t('cta.response.value')}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#c4a574]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
