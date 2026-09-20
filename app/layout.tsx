import type { Metadata, Viewport } from 'next'
import { Hind, Noto_Serif, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/lib/LanguageContext'
import { SelectedServiceProvider } from '@/lib/SelectedServiceContext'
import { SiteSettingsProvider } from '@/lib/SiteSettingsContext'
import { fetchSiteSettings } from '@/lib/siteSettingsServer'
import JsonLd from '@/components/seo/JsonLd'
import {
  localBusinessJsonLd,
  organizationJsonLd,
  rootMetadata,
  websiteJsonLd,
} from '@/lib/seo'
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt'
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister'
import './globals.css'

const hind = Hind({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
})

const notoSerif = Noto_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-noto-serif',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  ...rootMetadata,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Astro Suvid',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await fetchSiteSettings()

  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${hind.variable} ${notoSerif.variable} ${playfair.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <JsonLd
          data={[
            organizationJsonLd(settings),
            websiteJsonLd(),
            localBusinessJsonLd(settings),
          ]}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteSettingsProvider>
            <LanguageProvider>
              <SelectedServiceProvider>
                {children}
                <ServiceWorkerRegister />
                <PWAInstallPrompt />
                {process.env.NODE_ENV === 'production' && <Analytics />}
              </SelectedServiceProvider>
            </LanguageProvider>
          </SiteSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
