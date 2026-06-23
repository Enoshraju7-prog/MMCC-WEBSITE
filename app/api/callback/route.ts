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
    ? `మీరు MM Car Care కాకినాడ workshop నుండి live phone call లో ఉన్నారు. మీరు ${name} గారికి call చేశారు.

ముఖ్యమైన నియమాలు:
- ఒక్కసారి ఒక్క sentence మాత్రమే చెప్పండి — తర్వాత ఆగండి, కస్టమర్ మాట్లాడనివ్వండి
- కస్టమర్ మాట్లాడే వరకు మీరు మళ్ళీ మాట్లాడకండి
- అన్ని steps ఒకేసారి చదవకండి

మీరు ఇప్పటికే "మీ వాహనానికి ఏమి సమస్య ఉంది?" అని అడిగారు.

కస్టమర్ సమస్య చెప్పినప్పుడు: "అర్థమైంది." అని చెప్పి ఆగండి, తర్వాత "ఇంకేమైనా చూడాలా?" అని అడగండి.

కస్టమర్ "లేదు" అన్నప్పుడు: "మీకు ఏ రోజు రావడం సులభంగా ఉంటుంది?" అని అడగండి.

కస్టమర్ రోజు చెప్పినప్పుడు: "సరే, నమోదు చేశాం. మా team confirm చేస్తుంది. ధన్యవాదాలు, వెళ్ళొస్తాం!" అని చెప్పి call ముగించండి.

కస్టమర్ "అవును ఇంకా ఉంది" అన్నప్పుడు: వినండి, తర్వాత "ఇంకేమైనా?" అని అడగండి, అన్నీ అయిన తర్వాత రోజు అడగండి.

ముఖ్యం: కస్టమర్ "bye" అని మీరు రోజు అడగకముందే అంటే — "ఒక్క నిమిషం, మీకు ఏ రోజు రావడం సులభంగా ఉంటుంది?" అని అడగండి. రోజు తెలుసుకున్న తర్వాతే call ముగించండి.

తెలుగు రోజుల పదాలు (STT వీటిని వేరేగా transcribe చేయవచ్చు — అర్థం తెలుసుకోండి):
- repu / రేపు = tomorrow
- ee roju / ఈ రోజు = today
- ellundi / ఎల్లుండి = day after tomorrow
- somavaram = Monday, mangalavaram = Tuesday, budhavaram = Wednesday
- guruvaram = Thursday, shukravaram = Friday, shanivaram = Saturday`
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
        serverUrl: 'https://mmcarcarekakinada.co.in/api/vapi-webhook',
        assistant: {
          name: 'MM Car Care Agent',
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
          silenceTimeoutSeconds: 25,
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
