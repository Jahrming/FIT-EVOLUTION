import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class SedesService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySlug(slug: string) {
    return this.prisma.sede.findFirst({
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
    }).then((sede) => {
      if (!sede) return null
      return {
        ...sede,
        terminosActivos: sede.terminosVersiones[0] ?? null,
        terminosVersiones: undefined,
      }
    })
  }
}
