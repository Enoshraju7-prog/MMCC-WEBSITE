import { NextRequest, NextResponse } from 'next/server'
import {
  notesSessionCookie,
  verifyNotesSessionToken,
} from '@backend/auth/notes-session'

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const isLogin = pathname === '/notes/login'
  const token = request.cookies.get(notesSessionCookie.name)?.value
  const isAuthenticated = await verifyNotesSessionToken(token)

  if (isLogin && isAuthenticated) {
    return NextResponse.redirect(new URL('/notes', request.url))
  }

  if (!isLogin && !isAuthenticated) {
    const loginUrl = new URL('/notes/login', request.url)
    loginUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/notes/:path*'],
}
