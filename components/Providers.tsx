'use client'

import { BookingProvider, useBooking } from '@/lib/booking-context'
import BookingModal from '@/components/BookingModal'
import { ReactNode } from 'react'

function ModalRenderer() {
  const { isOpen, close } = useBooking()
  return isOpen ? <BookingModal onClose={close} /> : null
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      {children}
      <ModalRenderer />
    </BookingProvider>
  )
}
