import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class SessionTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(): Promise<{ sessionToken: string }> {
    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    await this.prisma.sesionToken.create({
      data: { token, sedeSlug: 'unknown', expiresAt },
    })

    return { sessionToken: token }
  }

  async validateAndConsume(token: string): Promise<boolean> {
    const record = await this.prisma.sesionToken.findUnique({
      where: { token },
    })

    if (!record || record.usado || record.expiresAt < new Date()) {
      return false
    }

    await this.prisma.sesionToken.update({
      where: { id: record.id },
      data: { usado: true, usadoAt: new Date() },
    })

    return true
  }
}
