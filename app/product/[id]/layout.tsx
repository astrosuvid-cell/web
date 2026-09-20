import type { Metadata } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import { getProductById } from '@/lib/productServer';
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from '@/lib/seo';

interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  return buildMetadata({
    title: `${product.name} — Vedic Gemstone`,
    description:
      product.description ||
      `Buy authentic ${product.name} — lab-certified Vedic gemstone recommended by Astro Suvid astrologers.`,
    path: `/product/${id}`,
    keywords: [product.name, 'vedic gemstone', 'astromall', 'lucky stone'],
    image: product.image_url,
    imageAlt: product.name,
  });
}

export default async function ProductLayout({
  children,
  params,
}: ProductLayoutProps) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <>
      {product ? (
        <JsonLd
          data={[
            productJsonLd(product),
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Astromall', path: '/astromall' },
              { name: product.name, path: `/product/${id}` },
            ]),
          ]}
        />
      ) : null}
      {children}
    </>
  );
}
