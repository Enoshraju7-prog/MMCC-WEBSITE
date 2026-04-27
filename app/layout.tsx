import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

const SITE_URL = 'https://mmcc-website-six.vercel.app'

export const metadata: Metadata = {
  title: 'MM Car Care – Best Car Service in Kakinada, Andhra Pradesh',
  description:
    'MM Car Care is Kakinada\'s most trusted car wash, detailing & maintenance centre. Ceramic coating, paint correction, interior detailing, car service. Serving Kakinada, AP for 25+ years.',
  keywords: [
    'car service kakinada',
    'car wash kakinada',
    'car detailing kakinada',
    'ceramic coating kakinada',
    'paint correction kakinada',
    'car care kakinada',
    'MM Car Care',
    'car maintenance kakinada',
    'auto detailing kakinada',
    'car polish kakinada',
    'best car wash kakinada',
    'car service andhra pradesh',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'MM Car Care – Best Car Service in Kakinada',
    description: 'Kakinada\'s most trusted car detailing & maintenance centre. Ceramic coating, paint correction, interior detailing and more.',
    url: SITE_URL,
    siteName: 'MM Car Care',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'MM Car Care',
  description: 'Professional car wash, detailing, ceramic coating and maintenance in Kakinada, Andhra Pradesh.',
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kakinada',
    addressRegion: 'Andhra Pradesh',
    addressCountry: 'IN',
  },
  areaServed: {
    '@type': 'City',
    name: 'Kakinada',
  },
  priceRange: '$$',
  hasMap: 'https://maps.app.goo.gl/SRBWNggKuSY9ge8k7',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <CustomCursor />
          <ScrollProgress />
          <Nav />
          <div style={{ height: '110px' }} />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
