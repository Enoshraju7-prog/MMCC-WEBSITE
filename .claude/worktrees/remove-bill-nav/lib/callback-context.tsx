'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CallbackContextType {
  isOpen: boolean
  open: () => void
  close: () => void
}

const CallbackContext = createContext<CallbackContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

export function CallbackProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CallbackContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </CallbackContext.Provider>
  )
}

export const useCallback = () => useContext(CallbackContext)
