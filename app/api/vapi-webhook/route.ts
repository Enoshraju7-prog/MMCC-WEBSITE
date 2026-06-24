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
  const language = report.call?.assistant?.firstMessage?.includes('నమస్కారం') ? 'Telugu' : 'English'

  await Promise.all([
    sendLeadEmail({ name: customerName, phone: phoneDisplay, summary: callSummary, language }),
    logToSheet({ name: customerName, phone: phoneDisplay, language, summary: callSummary }),
  ])

  return NextResponse.json({ ok: true })
}

async function logToSheet(data: { name: string; phone: string; language: string; summary: string }) {
  const url = process.env.GOOGLE_SHEET_URL
  if (!url) return
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  } catch (err) {
    console.error('[vapi-webhook] Sheet log error:', err)
  }
}

async function sendLeadEmail(lead: { name: string; phone: string; summary: string; language: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAILS
  const from = process.env.RESEND_FROM_EMAIL || 'MM Car Care <onboarding@resend.dev>'

  if (!apiKey || !to) {
    console.warn('[vapi-webhook] Resend email not configured')
    return
  }

  const recipients = to.split(',').map((e) => e.trim()).filter(Boolean)

  const subject = `New Lead — ${lead.name} (${lead.phone})`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #fff; color: #111;">
      <div style="border-left: 4px solid #C9A96E; padding: 8px 0 8px 16px; margin-bottom: 24px;">
        <div style="font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase; color: #C9A96E; font-weight: 700;">MM Car Care</div>
        <h1 style="margin: 4px 0 0; font-size: 22px; font-weight: 700;">New Lead from AI Call</h1>
      </div>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${lead.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-weight: 600;"><a href="tel:+91${lead.phone}" style="color: #C9A96E; text-decoration: none;">+91 ${lead.phone}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Language</td><td style="padding: 8px 0;">${lead.language}</td></tr>
      </table>
      <div style="background: #f7f7f7; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px;">Call Summary</div>
        <div style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(lead.summary)}</div>
      </div>
      <a href="tel:+91${lead.phone}" style="display: inline-block; background: #C9A96E; color: #0a0a0a; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;">Call ${lead.name} Now</a>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: recipients, subject, html }),
  })

  const data = await res.json()
  console.log('[vapi-webhook] Email →', res.status, data?.id || data?.message)
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
