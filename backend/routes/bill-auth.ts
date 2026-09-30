import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  const correct = process.env.BILL_PASSWORD

  if (!correct) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  if (password === correct) {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
}
