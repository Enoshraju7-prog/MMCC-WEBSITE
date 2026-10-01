import { Suspense } from 'react'
import NotesLogin from '@frontend/components/notes/NotesLogin'

export const dynamic = 'force-dynamic'

export default function NotesLoginPage() {
  return (
    <Suspense fallback={<main className="login-shell" />}>
      <NotesLogin />
    </Suspense>
  )
}
