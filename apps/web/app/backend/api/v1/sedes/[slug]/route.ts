import { NextResponse } from 'next/server'

import { findSedeBySlug } from '@/lib/server/sedes'

export const runtime = 'nodejs'

type Params = {
  params: {
    slug: string
  }
}

export async function GET(_request: Request, { params }: Params) {
  const sede = await findSedeBySlug(params.slug)

  if (!sede) {
    return NextResponse.json(
      { message: `Sede "${params.slug}" no encontrada o inactiva.` },
      { status: 404 },
    )
  }

  return NextResponse.json(sede)
}
