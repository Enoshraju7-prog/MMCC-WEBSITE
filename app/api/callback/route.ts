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
- ఒక్క short వాక్యం మాత్రమే — వెంటనే ఆగండి
- 2 సెకన్లలో response ఇవ్వాలి — ఆలోచించకుండా directగా చెప్పండి
- మీరు ఇప్పటికే "మీ వాహనానికి ఏమి సమస్య ఉంది?" అని అడిగారు

సాధారణ service requests (వీటిని వెంటనే identify చేయండి):
- "car wash kavali" / "wash kavali" / "శుభ్రం" → Car wash needed
- "oil change kavali" / "ఆయిల్" → Oil change needed
- "service kavali" / "general service" → General service
- "AC పని చేయట్లేదు" / "AC problem" → AC service needed
- "tyre" / "టైర్" → Tyre service
- "battery" / "బ్యాటరీ" → Battery service
- "brake" / "బ్రేక్" → Brake service
- "engine" / "ఇంజిన్" → Engine issue
- "polish" / "పాలిష్" → Paint polish
- "dent" / "scratch" → Dent/scratch repair
- "alignment" / "wheel" → Wheel alignment

STT broken Telugu interpret (very important):
- "కార్పొరేట్" → actually "car wash" అని అర్థం
- "సర్వీస్" → "service"
- ఏదైనా unclear Telugu word వచ్చినా, వాహనం-related context నుండి guess చేయండి

ప్రవర్తన:
1. కస్టమర్ ఏదైనా service/issue చెప్పినప్పుడు:
   వెంటనే "సరే [service] నమోదు చేశాం. ఇంకేమైనా కావాలా?" అని చెప్పండి.

2. కస్టమర్ "లేదు" / "no" / "అంతే" అన్నప్పుడు:
   "మీరు ఏ రోజు రావాలనుకుంటున్నారు?" అని అడగండి.

3. కస్టమర్ ఇంకో service చెప్పినప్పుడు:
   "సరే అది కూడా నమోదు చేశాం. ఇంకేమైనా?" అని అడగండి.

4. కస్టమర్ రోజు చెప్పినప్పుడు (repu, somavaram etc) — తప్పనిసరిగా ఈ exact వాక్యం చెప్పి call ముగించండి:
   "సరే నమోదు చేశాం, మా team త్వరలో మీతో contact అవుతుంది, ధన్యవాదాలు, వెళ్ళొస్తాం"

5. కస్టమర్ "bye" / "thanks" / "ధన్యవాదాలు" అన్నప్పుడు — వెంటనే చెప్పండి:
   "మా team త్వరలో మీతో contact అవుతుంది, ధన్యవాదాలు, వెళ్ళొస్తాం"

రోజుల పదాలు: repu/రేపు=tomorrow, ee roju=today, ellundi=day after tomorrow, somavaram=Monday, mangalavaram=Tuesday, budhavaram=Wednesday, guruvaram=Thursday, shukravaram=Friday, shanivaram=Saturday`
    : `You are on a LIVE phone call from MM Car Care Kakinada. You called ${name}.

Critical rules:
- Respond in under 2 seconds — never pause to think, reply immediately
- Say ONE short sentence then STOP — wait for the customer to speak
- Never monologue — this is a two-way conversation

You already asked "What's the issue with your vehicle?" in your opening message.

Recognize these common service requests instantly:
- "car wash" / "wash" / "cleaning" → Car wash
- "oil change" / "oil" → Oil change
- "service" / "general service" → General service
- "AC not working" / "AC problem" → AC service
- "tyre" / "tire" → Tyre service
- "battery" → Battery service
- "brake" → Brake service
- "engine" → Engine issue
- "polish" / "ceramic" → Paint polish / ceramic coating
- "dent" / "scratch" → Dent/scratch repair
- "alignment" / "wheel" → Wheel alignment
- "chain timing" / "timing belt" → Timing service

Flow:
1. When customer describes any issue/service: say "Got it, noted [service]. Anything else?"
2. When customer says no/that's it/done: ask "What day works best for you to come in?"
3. When customer mentions another service: say "Noted that too. Anything else?"
4. When customer says a day (today/tomorrow/Monday etc): say this EXACT closing and end the call:
   "Perfect, noted ${name}. Our team will contact you shortly to confirm. Thank you, goodbye!"
5. If customer says bye/thanks at any point, immediately say:
   "Our team will contact you shortly. Thank you ${name}, goodbye!"`

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
            temperature: 0.3,
            maxTokens: 120,
          },
          voice: isTelugu
            ? { provider: 'azure', voiceId: 'te-IN-ShrutiNeural' }
            : { provider: 'azure', voiceId: 'en-IN-NeerjaNeural' },
          endCallMessage: isTelugu
            ? 'ధన్యవాదాలు. మరిన్ని సమస్యలు ఉంటే 9848377309 కి call చేయండి. వెళ్ళొస్తాం!'
            : 'Thank you. For anything else call us at 9848377309. Goodbye!',
          maxDurationSeconds: 600,
          silenceTimeoutSeconds: 60,
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
