import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${SITE_NAME}` },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-28 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#c4a574]">404</p>
        <h1 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          This page does not exist or was moved. Explore our services or return home.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#0f172a] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            View services
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Contact us
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
