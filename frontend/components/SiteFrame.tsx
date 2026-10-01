'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Nav from '@frontend/components/Nav'
import Footer from '@frontend/components/Footer'
import CustomCursor from '@frontend/components/CustomCursor'
import ScrollProgress from '@frontend/components/ScrollProgress'

export default function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/notes')) {
    return <main>{children}</main>
  }

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <div className="nav-spacer" />
      <main>{children}</main>
      <Footer />
    </>
  )
}
