'use client'

import { BookingProvider, useBooking } from '@/lib/booking-context'
import { CallbackProvider, useCallback } from '@/lib/callback-context'
import BookingModal from '@/components/BookingModal'
import CallbackModal from '@/components/CallbackModal'
import { ReactNode } from 'react'

function ModalRenderer() {
  const { isOpen: bookingOpen, close: closeBooking } = useBooking()
  const { isOpen: callbackOpen, close: closeCallback } = useCallback()
  return (
    <>
      {bookingOpen && <BookingModal onClose={closeBooking} />}
      {callbackOpen && <CallbackModal onClose={closeCallback} />}
    </>
  )
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <BookingProvider>
      <CallbackProvider>
        {children}
        <ModalRenderer />
      </CallbackProvider>
    </BookingProvider>
  )
}
