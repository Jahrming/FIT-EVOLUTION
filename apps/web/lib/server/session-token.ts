import { randomUUID } from 'crypto'

import { prisma } from './prisma'

export async function generateSessionToken() {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.sesionToken.create({
    data: { token, sedeSlug: 'unknown', expiresAt },
  })

  return { sessionToken: token }
}

export async function validateAndConsumeSessionToken(token: string) {
  const record = await prisma.sesionToken.findUnique({
    where: { token },
  })

  if (!record || record.usado || record.expiresAt < new Date()) {
    return false
  }

  await prisma.sesionToken.update({
    where: { id: record.id },
    data: { usado: true, usadoAt: new Date() },
  })

  return true
}
