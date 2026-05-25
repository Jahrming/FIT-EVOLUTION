import { NextResponse } from 'next/server'

import { generateSessionToken } from '@/lib/server/session-token'

export const runtime = 'nodejs'

export async function GET() {
  const token = await generateSessionToken()
  return NextResponse.json(token)
}
