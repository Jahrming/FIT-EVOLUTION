import { TipoDocumento } from '@prisma/client'
import { createHash, randomUUID } from 'crypto'

import type { CreateAceptacionInput } from './schemas'
import { prisma } from './prisma'
import { enviarCorreosAceptacion } from './correo'
import { validateAndConsumeSessionToken } from './session-token'

export class PublicApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function crearAceptacion(
  dto: CreateAceptacionInput,
  ipAddress: string,
  userAgent: string,
) {
  const { sedeId, terminosVersionId, formulario, sessionToken } = dto
  const condicionMedicaEspecial = dto.condicionMedicaEspecial?.trim()

  const tokenValid = await validateAndConsumeSessionToken(sessionToken)
  if (!tokenValid) {
    throw new PublicApiError(409, 'Esta sesion ya fue procesada o ha expirado.')
  }

  const sede = await prisma.sede.findFirst({
    where: { id: sedeId, activo: true },
  })
  if (!sede) {
    throw new PublicApiError(404, 'Sede no encontrada.')
  }

  const terminos = await prisma.terminosVersion.findFirst({
    where: { id: terminosVersionId, estado: 'ACTIVO' },
  })
  if (!terminos) {
    throw new PublicApiError(400, 'Version de terminos no valida o inactiva.')
  }

  if (formulario.correoElectronico !== formulario.correoConfirmar) {
    throw new PublicApiError(400, 'Los correos no coinciden.')
  }

  if (!dto.declaraCondicionFisica && !condicionMedicaEspecial) {
    throw new PublicApiError(
      400,
      'Debes informar la condicion medica especial si no declaras aptitud fisica.',
    )
  }

  const documentoHashAceptado = `sha256:${createHash('sha256').update(terminos.contenidoHtml).digest('hex')}`
  const transactionId = randomUUID()

  const aceptacion = await prisma.aceptacion.create({
    data: {
      transactionId,
      estado: 'COMPLETADO',
      sedeId,
      terminosVersionId,
      nombreCompleto: formulario.nombreCompleto,
      tipoDocumento: formulario.tipoDocumento as TipoDocumento,
      numeroDocumento: formulario.numeroDocumento,
      fechaNacimiento: new Date(formulario.fechaNacimiento),
      telefono: formulario.telefono,
      correoElectronico: formulario.correoElectronico.toLowerCase(),
      aceptaTerminos: dto.aceptaTerminos,
      aceptaTratamientoDatos: dto.aceptaTratamientoDatos,
      declaraCondicionFisica: dto.declaraCondicionFisica,
      autorizaUsoImagen: dto.autorizaUsoImagen,
      contactoEmergenciaNombre: formulario.contactoEmergenciaNombre,
      contactoEmergenciaTelefono: formulario.contactoEmergenciaTelefono,
      ipAddress,
      userAgent,
      metadataExtra: dto.declaraCondicionFisica
        ? undefined
        : { condicionMedicaEspecial },
      documentoHashAceptado,
    },
  })

  await prisma.correoLog.createMany({
    data: [
      {
        aceptacionId: aceptacion.id,
        tipo: 'USUARIO',
        destinatario: formulario.correoElectronico,
      },
      {
        aceptacionId: aceptacion.id,
        tipo: 'ADMINISTRACION',
        destinatario: sede.correoAdmin,
      },
    ],
  })

  const correoEnviado = await enviarCorreosAceptacion(aceptacion.id)

  return {
    transactionId,
    mensaje: correoEnviado
      ? 'Aceptacion registrada exitosamente. Recibiras una copia por correo.'
      : 'Aceptacion registrada exitosamente. El correo no pudo enviarse en este momento.',
    correoEnviado,
  }
}
