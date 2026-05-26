import AceptacionClient from './AceptacionClient'

import { findSedeBySlug } from '@/lib/server/sedes'
import type { SedeInfo } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

type AceptacionPageProps = {
  searchParams?: {
    sede?: string
  }
}

export default async function AceptacionPage({ searchParams }: AceptacionPageProps) {
  const sedeSlug = searchParams?.sede || 'kennedy'
  let initialSede: SedeInfo | null = null
  let initialPageError: string | null = null

  try {
    const sede = await findSedeBySlug(sedeSlug)

    if (!sede) {
      initialPageError = `La sede "${sedeSlug}" no existe o esta inactiva.`
    } else if (!sede.terminosActivos) {
      initialPageError = 'No hay terminos y condiciones activos para esta sede. Contacta a recepcion.'
    } else {
      initialSede = {
        id: sede.id,
        slug: sede.slug,
        nombre: sede.nombre,
        ciudad: sede.ciudad,
        direccion: sede.direccion || undefined,
        terminosActivos: {
          id: sede.terminosActivos.id,
          numeroVersion: sede.terminosActivos.numeroVersion,
          contenidoHtml: sede.terminosActivos.contenidoHtml,
          contenidoHash: sede.terminosActivos.contenidoHash,
          publicadoAt: sede.terminosActivos.publicadoAt?.toISOString() || '',
        },
      }
    }
  } catch {
    initialPageError = 'No se pudo cargar la informacion de la sede. Por favor intenta de nuevo.'
  }

  return (
    <AceptacionClient
      initialPageError={initialPageError}
      initialSede={initialSede}
      sedeSlug={sedeSlug}
    />
  )
}
