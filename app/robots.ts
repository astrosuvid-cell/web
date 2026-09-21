import type { MetadataRoute } from 'next';
import { getIndexedSiteUrl, isProductionIndexing } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getIndexedSiteUrl();

  // Preview / staging: block all crawlers so they never index temporary hosts
  if (!isProductionIndexing()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
