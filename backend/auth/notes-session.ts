const COOKIE_NAME = 'mmcc_notes_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12

type NotesSessionPayload = {
  v: 1
  scope: 'notes'
  exp: number
}

const encoder = new TextEncoder()

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function jsonToBase64Url(value: NotesSessionPayload) {
  return bytesToBase64Url(encoder.encode(JSON.stringify(value)))
}

async function getSigningKey() {
  const secret = process.env.NOTES_SESSION_SECRET || process.env.BILL_PASSWORD
  if (!secret) return null

  return crypto.subtle.importKey(
    'raw',
    encoder.encode(`mmcc-notes-session-v1:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function createNotesSessionToken() {
  const key = await getSigningKey()
  if (!key) throw new Error('Notes authentication is not configured')

  const payload: NotesSessionPayload = {
    v: 1,
    scope: 'notes',
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }
  const encodedPayload = jsonToBase64Url(payload)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(encodedPayload))
  return `${encodedPayload}.${bytesToBase64Url(new Uint8Array(signature))}`
}

export async function verifyNotesSessionToken(token?: string | null) {
  if (!token) return false

  try {
    const [encodedPayload, encodedSignature, extra] = token.split('.')
    if (!encodedPayload || !encodedSignature || extra) return false

    const key = await getSigningKey()
    if (!key) return false

    const signatureValid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(encodedSignature),
      encoder.encode(encodedPayload),
    )
    if (!signatureValid) return false

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlToBytes(encodedPayload)),
    ) as Partial<NotesSessionPayload>

    return (
      payload.v === 1 &&
      payload.scope === 'notes' &&
      typeof payload.exp === 'number' &&
      Number.isFinite(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
    )
  } catch {
    return false
  }
}

export const notesSessionCookie = {
  name: COOKIE_NAME,
  maxAge: SESSION_TTL_SECONDS,
  options: {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/notes',
  },
}
