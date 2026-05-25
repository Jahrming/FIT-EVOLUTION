import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

import { crearAceptacion, PublicApiError } from '@/lib/server/aceptaciones'
import { rateLimit } from '@/lib/server/rate-limit'
import { createAceptacionSchema } from '@/lib/server/schemas'

export const runtime = 'nodejs'

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  const realIp = request.headers.get('x-real-ip')
  return realIp || 'unknown'
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const userAgent = request.headers.get('user-agent') || ''
  const limitResult = rateLimit(`aceptaciones:${ip}`, 5, 60_000)

  if (!limitResult.allowed) {
    return NextResponse.json(
      { message: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((limitResult.retryAfterMs || 0) / 1000)),
        },
      },
    )
  }

  try {
    const body = await request.json()
    const payload = createAceptacionSchema.parse(body)
    const result = await crearAceptacion(payload, ip, userAgent)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof PublicApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Payload invalido.', detail: error.message },
        { status: 400 },
      )
    }

    const message = error instanceof Error ? error.message : 'Error interno del servidor.'
    return NextResponse.json({ message }, { status: 500 })
  }
}
