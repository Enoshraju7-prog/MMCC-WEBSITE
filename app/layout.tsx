import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'
import { SITE_URL, BUSINESS } from '@/lib/business'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MM Car Care – Best Car Service in Kakinada, Andhra Pradesh',
    template: '%s | MM Car Care Kakinada',
  },
  description:
    "MM Car Care is Kakinada's most trusted car wash, detailing & maintenance centre. Ceramic coating, paint correction, interior detailing, AC service, engine work. Serving Kakinada for 25+ years.",
  keywords: [
    'car service kakinada', 'car wash kakinada', 'car detailing kakinada',
    'ceramic coating kakinada', 'paint correction kakinada', 'car care kakinada',
    'MM Car Care', 'car maintenance kakinada', 'auto detailing kakinada',
    'car AC service kakinada', 'engine work kakinada', 'best car garage kakinada',
    'car service andhra pradesh', 'mmcarcarekakinada',
  ],
  openGraph: {
    title: 'MM Car Care – Best Car Service in Kakinada',
    description:
      "Kakinada's most trusted car detailing & maintenance centre. 25+ years, 1500+ customers. Ceramic coating, paint correction, engine work and more.",
    url: SITE_URL,
    siteName: 'MM Car Care',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MM Car Care – Kakinada' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MM Car Care – Best Car Service in Kakinada',
    description: "Kakinada's most trusted car care centre. 25+ years. Ceramic coating, detailing, engine work.",
    images: ['/opengraph-image'],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: BUSINESS.name,
  description: BUSINESS.description,
  url: SITE_URL,
  telephone: BUSINESS.phoneE164,
  foundingDate: BUSINESS.founded,
  founder: { '@type': 'Person', name: BUSINESS.founder },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  },
  areaServed: BUSINESS.serviceAreas.map(area => ({ '@type': 'City', name: area })),
  openingHoursSpecification: BUSINESS.hours.map(h => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.open,
    closes: h.close,
  })),
  hasMap: BUSINESS.mapsUrl,
  priceRange: BUSINESS.priceRange,
  sameAs: [BUSINESS.mapsUrl],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is MM Car Care located in Kakinada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MM Car Care is located opposite APSP Petrol Bunk, Kakinada, Andhra Pradesh – 533 001.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are MM Car Care working hours?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MM Car Care is open Monday to Saturday, 9:00 AM to 9:00 PM. Closed on Sundays.',
      },
    },
    {
      '@type': 'Question',
      name: 'What services does MM Car Care offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MM Car Care offers car wash, full body detailing, ceramic coating, paint correction, interior detailing, AC service, engine work, oil change, tyre service, brake service, and wheel alignment.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a car service at MM Car Care Kakinada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can call MM Car Care at 9848377309 or use the Book button on the website to schedule a service.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MM Car Care do ceramic coating in Kakinada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. MM Car Care offers professional ceramic coating using high-grade products. Call 9848377309 for pricing and availability.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700&family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300..700&family=Barlow:wght@700;800;900&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
