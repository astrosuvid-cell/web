import type { Metadata } from 'next';
import type { BlogPost } from '@/lib/blog';
import type { AstroProduct } from '@/lib/products';
import type { SiteSettings } from '@/lib/siteSettings';
import { DEFAULT_SITE_SETTINGS } from '@/lib/siteSettings';

export const SITE_NAME = 'Astro Suvid';
export const SITE_TAGLINE = 'Vedic Astrology & Tarot Card Reading';
export const SITE_DESCRIPTION =
  'Expert Vedic astrology, tarot readings, kundli matching, Vastu and gemstone guidance in Lucknow. Personalized consultations for career, marriage, health and business.';
export const SITE_LOCALE = 'en_IN';
export const SITE_LOGO = '/logo.png';
export const SITE_LOGO_MARK = '/logo-mark.png';
export const DEFAULT_OG_IMAGE = '/og-image.png';
export const CONTACT_PHONE = '+919198969988';
export const CONTACT_EMAIL = 'Astrosuvid@gmail.com';
export const BUSINESS_ADDRESS = {
  streetAddress: 'Lucknow',
  addressLocality: 'Lucknow',
  addressRegion: 'Uttar Pradesh',
  postalCode: '226001',
  addressCountry: 'IN',
};

export const CANONICAL_SITE_URL = 'https://www.astrosuvid.com';

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) return envUrl;
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return CANONICAL_SITE_URL;
}

export function absoluteUrl(path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${getSiteUrl()}${normalized}`;
}

/** Normalize DB/API dates to W3C datetime for sitemap lastmod (Google Search Console). */
export function formatSitemapLastMod(value: unknown, fallback: Date = new Date()): string {
  const fallbackIso = fallback.toISOString();

  if (value == null || value === '') {
    return fallbackIso;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? fallbackIso : value.toISOString();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? fallbackIso : parsed.toISOString();
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallbackIso;

    // Postgres timestamps sometimes arrive as "YYYY-MM-DD HH:mm:ss.sss"
    const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(trimmed)
      ? `${trimmed.replace(' ', 'T')}Z`
      : trimmed;

    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? fallbackIso : parsed.toISOString();
  }

  return fallbackIso;
}

export function resolveImageUrl(image?: string | null): string {
  if (!image) return absoluteUrl(DEFAULT_OG_IMAGE);
  if (image.startsWith('http')) return image;
  return absoluteUrl(image);
}

export interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string | string[];
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string;
  noIndex?: boolean;
}

export function buildMetadata(options: BuildMetadataOptions): Metadata {
  const {
    title,
    description,
    path = '',
    keywords,
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noIndex = false,
  } = options;

  const canonical = absoluteUrl(path);
  const ogImage = resolveImageUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const keywordList = keywords
    ? Array.isArray(keywords)
      ? keywords
      : keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywordList,
    alternates: { canonical },
    openGraph: {
      type,
      locale: SITE_LOCALE.replace('_', '-'),
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || fullTitle,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: author ? [author] : [SITE_NAME],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

const homeMetadata = buildMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  path: '/',
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'vedic astrology',
    'tarot reading',
    'astrologer in lucknow',
    'kundli matching',
    'birth chart analysis',
    'vastu consultation',
    'gemstone consultation',
    'daily horoscope',
    'marriage astrology',
    'career astrology',
  ],
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Astrology',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32.png',
  },
  alternates: homeMetadata.alternates,
  openGraph: homeMetadata.openGraph,
  twitter: homeMetadata.twitter,
  robots: homeMetadata.robots,
};

export function organizationJsonLd(settings: SiteSettings = DEFAULT_SITE_SETTINGS) {
  const sameAs = [settings.social.instagram, settings.social.youtube, settings.social.facebook].filter(
    Boolean
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getSiteUrl()}/#organization`,
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl(SITE_LOGO),
    description: SITE_DESCRIPTION,
    email: settings.email,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      postalCode: settings.postalCode,
      addressCountry: settings.addressCountry,
    },
    sameAs,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.phone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getSiteUrl()}/#website`,
    name: SITE_NAME,
    url: getSiteUrl(),
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${getSiteUrl()}/#organization` },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${getSiteUrl()}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function localBusinessJsonLd(settings: SiteSettings = DEFAULT_SITE_SETTINGS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${getSiteUrl()}/#localbusiness`,
    name: SITE_NAME,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    url: getSiteUrl(),
    telephone: settings.phone,
    email: settings.email,
    description: SITE_DESCRIPTION,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.streetAddress,
      addressLocality: settings.addressLocality,
      addressRegion: settings.addressRegion,
      postalCode: settings.postalCode,
      addressCountry: settings.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.8467,
      longitude: 80.9462,
    },
    areaServed: {
      '@type': 'City',
      name: 'Lucknow',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:00',
        closes: '20:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Astrology Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Vedic Astrology Consultation',
            url: absoluteUrl('/vedic-astrology'),
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tarot Card Reading',
            url: absoluteUrl('/tarot-reading'),
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kundli Matching',
            url: absoluteUrl('/kundli-matching'),
          },
        },
      ],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || SITE_DESCRIPTION,
    image: post.image_url ? [resolveImageUrl(post.image_url)] : [absoluteUrl(DEFAULT_OG_IMAGE)],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/blog/${post.slug}`),
    },
    articleSection: post.category || 'Astrology',
    inLanguage: 'en-IN',
  };
}

export function productJsonLd(product: AstroProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} — authentic Vedic gemstone from Astro Suvid`,
    image: product.image_url ? resolveImageUrl(product.image_url) : absoluteUrl(DEFAULT_OG_IMAGE),
    url: absoluteUrl(`/product/${product.id}`),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.is_active
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.id}`),
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
}

export function servicesItemListJsonLd() {
  const services = [
    { name: 'Vedic Astrology', path: '/vedic-astrology' },
    { name: 'Tarot Card Reading', path: '/tarot-reading' },
    { name: 'Kundli Matching', path: '/kundli-matching' },
    { name: 'Marriage Astrology', path: '/marriage-astrology' },
    { name: 'Career Astrology', path: '/career-astrology' },
    { name: 'Vastu Consultation', path: '/vastu-consultation' },
    { name: 'Numerology Services', path: '/numerology-services' },
    { name: 'Gemstone Consultation', path: '/gemstone-consultation' },
    { name: 'Business Growth Astrology', path: '/business-growth' },
    { name: 'Matrimonial Services', path: '/matrimonial' },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Astro Suvid Services',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      url: absoluteUrl(service.path),
    })),
  };
}

export const PUBLIC_STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/astromall', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/vedic-astrology', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/tarot-reading', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/matchmaking', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/kundli-matching', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/marriage-astrology', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/career-astrology', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/business-growth', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/vastu-consultation', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/gemstone-consultation', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/numerology-services', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/matrimonial', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/daily-horoscope', priority: 0.8, changeFrequency: 'daily' },
  { path: '/best-vedic-astrologer-in-lucknow', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/best-tarot-readers-in-lucknow', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/best-astrologers-in-lucknow', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/best-astrologers', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cancellation-refund', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/shipping-delivery', priority: 0.3, changeFrequency: 'yearly' },
];
