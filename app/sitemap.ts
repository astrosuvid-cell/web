import type { MetadataRoute } from 'next';
import { getPublishedBlogPosts } from '@/lib/blogServer';
import { getActiveProducts } from '@/lib/productServer';
import {
  PUBLIC_STATIC_ROUTES,
  formatSitemapLastMod,
  getIndexedSiteUrl,
  isProductionIndexing,
} from '@/lib/seo';

function indexedUrl(path: string): string {
  const base = getIndexedSiteUrl();
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${base}${normalized === '/' ? '' : normalized || ''}`;
}

function homeUrl(): string {
  return getIndexedSiteUrl();
}

function staticSitemapEntries(now: Date): MetadataRoute.Sitemap {
  const lastModified = formatSitemapLastMod(now, now);

  return PUBLIC_STATIC_ROUTES.map((route) => ({
    url: route.path === '/' ? homeUrl() : indexedUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never expose preview/staging URLs in a sitemap Google might fetch
  if (!isProductionIndexing() && process.env.VERCEL_ENV === 'preview') {
    return [];
  }

  const now = new Date();

  try {
    const staticEntries = staticSitemapEntries(now);

    const [posts, products] = await Promise.all([
      getPublishedBlogPosts(),
      getActiveProducts(),
    ]);

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: indexedUrl(`/blog/${post.slug}`),
      lastModified: formatSitemapLastMod(
        post.updated_at ?? post.published_at ?? post.created_at,
        now
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
      url: indexedUrl(`/product/${product.id}`),
      lastModified: formatSitemapLastMod(product.updated_at ?? product.created_at, now),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticEntries, ...blogEntries, ...productEntries].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );
  } catch (error) {
    console.error('Sitemap generation failed, returning static routes only:', error);
    return staticSitemapEntries(now);
  }
}

export const revalidate = 3600;
