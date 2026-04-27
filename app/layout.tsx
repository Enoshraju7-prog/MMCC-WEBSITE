import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'MM Car Care – Kakinada, Andhra Pradesh',
  description:
    'Professional car wash, detailing, and maintenance in Kakinada, AP. Ceramic coating, paint correction, interior detail and more. Mobile service available.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;700&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <CustomCursor />
          <ScrollProgress />
          <Nav />
          <div style={{ height: '72px' }} />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
