import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('[callback] Request received')

  const { name, phone, language = 'en', vehicle, message } = await req.json()

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
  }

  // Normalise to E.164 format for India
  const digits = phone.replace(/\D/g, '')
  const formattedPhone = digits.startsWith('91') && digits.length === 12
    ? `+${digits}`
    : `+91${digits}`

  const isTelugu = language === 'te'

  // First message — greet and ask for the issue directly
  const firstMessage = isTelugu
    ? `నమస్కారం ${name} గారు! MM Car Care నుండి మాట్లాడుతున్నాను. మీ వాహనానికి ఏమి సమస్య ఉంది?`
    : `Hello ${name}, MM Car Care calling from Kakinada. What's the issue with your vehicle?`

  const systemPrompt = isTelugu
    ? `మీరు MM Car Care కాకినాడ నుండి ${name} గారికి live phone call చేశారు.

నియమాలు:
- ఒక్క వాక్యం మాత్లాడి ఆగండి — కస్టమర్ మాట్లాడనివ్వండి
- మీరు ఇప్పటికే "మీ వాహనానికి ఏమి సమస్య ఉంది?" అని అడిగారు

కస్టమర్ సమస్య చెప్పినప్పుడు:
"అర్థమైంది, [సమస్య] నమోదు చేశాం. ఇంకేమైనా చూడాలా?" అని చెప్పండి.

కస్టమర్ "లేదు" అన్నప్పుడు:
"మీకు ఏ రోజు రావడం సులభంగా ఉంటుంది?" అని అడగండి.

కస్టమర్ ఇంకో సమస్య చెప్పినప్పుడు:
"అర్థమైంది. ఇంకేమైనా?" అని అడగండి.

కస్టమర్ రోజు చెప్పినప్పుడు — తప్పకుండా ఈ వాక్యం పూర్తిగా చెప్పండి:
"సరే నమోదు చేశాం, మా team త్వరలో మీతో సంప్రదిస్తుంది, ధన్యవాదాలు వెళ్ళొస్తాం"

STT గమనికలు: "AC", "oil", "tyre", "battery", "engine", "service" వినిపిస్తే సరిగ్గానే వినిపించింది.
రోజుల పదాలు: repu/రేపు=tomorrow, ee roju=today, ellundi=day after tomorrow, somavaram=Monday, mangalavaram=Tuesday, budhavaram=Wednesday, guruvaram=Thursday, shukravaram=Friday, shanivaram=Saturday`
    : `You are on a LIVE phone call from MM Car Care Kakinada. You called ${name}.

Critical rules:
- Say ONE short sentence then STOP — wait for the customer to speak
- Never say two sentences in a row without the customer responding in between
- Do not monologue — this is a two-way conversation

You already asked "What's the issue with your vehicle?" in your opening message.

When customer describes their issue: Say "Got it." then pause — ask "Anything else you'd like us to check?"

When customer says no more issues: Ask "What day works best for you to bring the vehicle in?"

When customer says a day: Say "Perfect, we've noted that. Our team will contact you shortly to confirm. Thank you ${name}, goodbye!" — then end.

When customer says yes to more issues: Listen fully, then ask "Anything else?" — collect all issues, then ask for a preferred day.

If customer says goodbye or thanks at any point: Immediately say "Goodbye ${name}!" and stop.`

  if (!process.env.VAPI_PHONE_NUMBER_ID) {
    console.warn('[callback] VAPI_PHONE_NUMBER_ID not set — skipping call')
    return NextResponse.json({ success: true, method: 'pending_setup' })
  }

  try {
    const vapiRes = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
        customer: {
          number: formattedPhone,
          name,
        },
        assistant: {
          name: 'MM Car Care Agent',
          serverUrl: 'https://mmcarcarekakinada.co.in/api/vapi-webhook',
          responseDelaySeconds: 0,
          firstMessage,
          transcriber: isTelugu
            ? { provider: 'google', model: 'gemini-2.5-flash', language: 'Multilingual' }
            : { provider: 'deepgram', language: 'en-IN', model: 'nova-2' },
          model: {
            provider: 'anthropic',
            model: 'claude-haiku-4-5-20251001',
            messages: [{ role: 'system', content: systemPrompt }],
            temperature: 0.4,
            maxTokens: 80,
          },
          voice: isTelugu
            ? { provider: 'azure', voiceId: 'te-IN-ShrutiNeural' }
            : { provider: 'azure', voiceId: 'en-IN-NeerjaNeural' },
          endCallMessage: isTelugu
            ? 'ధన్యవాదాలు. మరిన్ని సమస్యలు ఉంటే 9848377309 కి call చేయండి. వెళ్ళొస్తాం!'
            : 'Thank you. For anything else call us at 9848377309. Goodbye!',
          maxDurationSeconds: 600,
          silenceTimeoutSeconds: 35,
          endCallPhrases: [
            'వెళ్ళొస్తాం',
            'goodbye',
            'goodbye!',
            'thank you, goodbye',
          ],
        },
      }),
    })

    const data = await vapiRes.json()
    console.log('[callback] Vapi status:', vapiRes.status, '| call id:', data?.id)

    if (!vapiRes.ok) {
      console.error('[callback] Vapi error:', JSON.stringify(data))
      return NextResponse.json({ error: 'Failed to initiate call' }, { status: 500 })
    }

    return NextResponse.json({ success: true, callId: data.id })
  } catch (err) {
    console.error('[callback] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
