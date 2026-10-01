import { scryptSync, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  createNotesSessionToken,
  notesSessionCookie,
} from '@backend/auth/notes-session'

function passwordsMatch(candidate: string, expected: string) {
  const candidateBytes = Buffer.from(candidate)
  const expectedBytes = Buffer.from(expected)
  return (
    candidateBytes.length === expectedBytes.length &&
    timingSafeEqual(candidateBytes, expectedBytes)
  )
}

const NOTES_PASSWORD_VERIFIER =
  'eff45e6f868f722dc40fa40693e264d3:5f96a1fe54a554bef9bfc46dfc5c32458176be9d10bd902d4b0607f2f0a09405'

function notesPasswordMatches(candidate: string) {
  const configuredPassword = process.env.NOTES_PASSWORD
  if (configuredPassword) return passwordsMatch(candidate, configuredPassword)

  const [salt, expectedHash] = NOTES_PASSWORD_VERIFIER.split(':')
  const candidateHash = scryptSync(candidate, salt, 32)
  return timingSafeEqual(candidateHash, Buffer.from(expectedHash, 'hex'))
}

function safeDestination(value: unknown) {
  return (
    typeof value === 'string' &&
    value.startsWith('/notes') &&
    !value.startsWith('//') &&
    !value.startsWith('/notes/login')
  )
    ? value
    : '/notes'
}

function redirectToLogin(request: NextRequest, next: string) {
  const loginUrl = new URL('/notes/login', request.url)
  loginUrl.searchParams.set('next', next)
  loginUrl.searchParams.set('error', 'password')
  return NextResponse.redirect(loginUrl, 303)
}

export async function POST(request: NextRequest) {
  const isHtmlForm = request.headers
    .get('content-type')
    ?.includes('application/x-www-form-urlencoded')
  let password = ''
  let next = '/notes'
  try {
    if (isHtmlForm) {
      const form = await request.formData()
      password = String(form.get('password') || '')
      next = safeDestination(form.get('next'))
    } else {
      const body = await request.json()
      password = typeof body?.password === 'string' ? body.password : ''
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!notesPasswordMatches(password)) {
    if (isHtmlForm) return redirectToLogin(request, next)
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const token = await createNotesSessionToken()
  const response = isHtmlForm
    ? NextResponse.redirect(new URL(next, request.url), 303)
    : NextResponse.json({ ok: true })
  response.cookies.set(notesSessionCookie.name, token, {
    ...notesSessionCookie.options,
    maxAge: notesSessionCookie.maxAge,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(notesSessionCookie.name, '', {
    ...notesSessionCookie.options,
    maxAge: 0,
    expires: new Date(0),
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
