import { prisma } from './prisma'

export async function findSedeBySlug(slug: string) {
  const sede = await prisma.sede.findFirst({
    where: { slug, activo: true, deletedAt: null },
    select: {
      id: true,
      slug: true,
      nombre: true,
      ciudad: true,
      direccion: true,
      terminosVersiones: {
        where: { estado: 'ACTIVO' },
        orderBy: { numeroVersion: 'desc' },
        take: 1,
        select: {
          id: true,
          numeroVersion: true,
          contenidoHtml: true,
          contenidoHash: true,
          publicadoAt: true,
        },
      },
    },
  })

  if (!sede) return null

  return {
    ...sede,
    terminosActivos: sede.terminosVersiones[0] ?? null,
  }
}
