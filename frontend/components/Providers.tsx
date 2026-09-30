'use client'

import { BookingProvider, useBooking } from '@frontend/contexts/booking-context'
import { CallbackProvider, useCallback } from '@frontend/contexts/callback-context'
import BookingModal from '@frontend/components/BookingModal'
import CallbackModal from '@frontend/components/CallbackModal'
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
