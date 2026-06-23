import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('[vapi-webhook] Event type:', body.message?.type)

  // Only act when a call fully ends
  if (body.message?.type !== 'end-of-call-report') {
    return NextResponse.json({ ok: true })
  }

  const report = body.message
  const customerName = report.call?.customer?.name || 'Customer'
  const customerPhone = report.call?.customer?.number || 'Unknown'
  const summary = report.summary || ''
  const transcript = report.transcript || ''

  console.log('[vapi-webhook] Call ended for:', customerName, customerPhone)

  const phoneDisplay = customerPhone.replace('+91', '')
  const callSummary = summary || transcript.split('\n').slice(0, 6).join('\n')

  // Bilingual SMS — English + Telugu
  const sms = [
    `MM Car Care — New Lead`,
    `Customer: ${customerName}`,
    `Phone: ${phoneDisplay}`,
    ``,
    callSummary,
    ``,
    `---`,
    `MM Car Care — కొత్త కస్టమర్`,
    `పేరు: ${customerName}`,
    `ఫోన్: ${phoneDisplay}`,
    `వెంటనే సంప్రదించండి`,
  ].join('\n')

  const notify = ['+919848377309', '+916304104489']
  await Promise.all(notify.map((to) => sendSMS(to, sms)))

  return NextResponse.json({ ok: true })
}

async function sendSMS(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER

  if (!accountSid || !authToken || !from) {
    console.warn('[vapi-webhook] Twilio SMS not configured')
    return
  }

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    }
  )

  const data = await res.json()
  console.log('[vapi-webhook] SMS to', to, '→', res.status, data?.sid)
}
