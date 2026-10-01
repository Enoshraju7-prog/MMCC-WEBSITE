import type { Metadata } from 'next'
import '@fontsource-variable/geist'
import './notes.css'

export const metadata: Metadata = {
  title: 'Crew Notes',
  description: 'Private browser-local notes for the MM Car Care crew.',
  robots: { index: false, follow: false, nocache: true },
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <div className="fieldnotes-root">{children}</div>
}
