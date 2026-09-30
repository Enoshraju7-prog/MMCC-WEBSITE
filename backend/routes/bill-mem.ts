import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const KEYS = {
  services: 'mm_bill_mem:services',
  parts:    'mm_bill_mem:parts',
  misc:     'mm_bill_mem:misc',
} as const

type MemKind = keyof typeof KEYS
const MAX_MEM = 40

function getRedis() {
  const url   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

async function readAll(redis: Redis) {
  const [services, parts, misc] = await Promise.all([
    redis.get<string[]>(KEYS.services),
    redis.get<string[]>(KEYS.parts),
    redis.get<string[]>(KEYS.misc),
  ])
  return {
    services: services ?? [],
    parts:    parts    ?? [],
    misc:     misc     ?? [],
  }
}

export async function GET() {
  const redis = getRedis()
  if (!redis) return NextResponse.json({ services:[], parts:[], misc:[], _warn:'KV not configured' })
  try {
    const data = await readAll(redis)
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error:'Read failed' }, { status:500 })
  }
}

export async function POST(req: NextRequest) {
  const redis = getRedis()
  if (!redis) return NextResponse.json({ error:'KV not configured' }, { status:500 })

  try {
    const { action, kind, value } = await req.json() as {
      action: 'add' | 'remove' | 'clear'
      kind:   MemKind
      value?: string
    }
    if (!KEYS[kind]) return NextResponse.json({ error:'Bad kind' }, { status:400 })
    const key = KEYS[kind]

    if (action === 'clear') {
      await redis.del(key)
      return NextResponse.json({ ok:true, list:[] })
    }

    const current = (await redis.get<string[]>(key)) ?? []
    const val = (value ?? '').trim()
    if (!val) return NextResponse.json({ ok:true, list:current })

    let next: string[]
    if (action === 'add') {
      next = [val, ...current.filter(x => x.toLowerCase() !== val.toLowerCase())].slice(0, MAX_MEM)
    } else if (action === 'remove') {
      next = current.filter(x => x !== val)
    } else {
      return NextResponse.json({ error:'Bad action' }, { status:400 })
    }

    await redis.set(key, next)
    return NextResponse.json({ ok:true, list:next })
  } catch (e) {
    return NextResponse.json({ error:'Write failed' }, { status:500 })
  }
}
