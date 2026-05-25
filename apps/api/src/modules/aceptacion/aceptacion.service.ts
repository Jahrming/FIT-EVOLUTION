import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { createHash } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { PrismaService } from '../../prisma/prisma.service'
import { SessionTokenService } from '../session-token/session-token.service'
import { CreateAceptacionDto } from './dto/create-aceptacion.dto'
import { CorreoService } from '../correo/correo.service'

@Injectable()
export class AceptacionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionTokenService: SessionTokenService,
    private readonly correoService: CorreoService,
  ) {}

  async create(dto: CreateAceptacionDto, ip: string, userAgent: string) {
    const { sedeId, terminosVersionId, formulario, sessionToken } = dto
    const condicionMedicaEspecial = dto.condicionMedicaEspecial?.trim()

    const tokenValid = await this.sessionTokenService.validateAndConsume(sessionToken)
    if (!tokenValid) {
      throw new ConflictException('Esta sesion ya fue procesada o ha expirado.')
    }

    const sede = await this.prisma.sede.findFirst({
      where: { id: sedeId, activo: true },
    })
    if (!sede) throw new NotFoundException('Sede no encontrada.')

    const terminos = await this.prisma.terminosVersion.findFirst({
      where: { id: terminosVersionId, estado: 'ACTIVO' },
    })
    if (!terminos) {
      throw new BadRequestException('Version de terminos no valida o inactiva.')
    }

    if (formulario.correoElectronico !== formulario.correoConfirmar) {
      throw new BadRequestException('Los correos no coinciden.')
    }

    if (!dto.declaraCondicionFisica && !condicionMedicaEspecial) {
      throw new BadRequestException(
        'Debes informar la condicion medica especial si no declaras aptitud fisica.'
      )
    }

    const documentoHashAceptado = `sha256:${createHash('sha256').update(terminos.contenidoHtml).digest('hex')}`
    const transactionId = uuidv4()

    const aceptacion = await this.prisma.aceptacion.create({
      data: {
        transactionId,
        estado: 'COMPLETADO',
        sedeId,
        terminosVersionId,
        nombreCompleto: formulario.nombreCompleto,
        tipoDocumento: formulario.tipoDocumento as any,
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
        ipAddress: ip,
        userAgent,
        metadataExtra: dto.declaraCondicionFisica
          ? undefined
          : { condicionMedicaEspecial },
        documentoHashAceptado,
      },
    })

    await this.prisma.correoLog.createMany({
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

    const correoEnviado = await this.correoService.enviarCorreosAceptacion(aceptacion.id)

    return {
      transactionId,
      mensaje: correoEnviado
        ? 'Aceptacion registrada exitosamente. Recibiras una copia por correo.'
        : 'Aceptacion registrada exitosamente. El correo no pudo enviarse en este momento.',
      correoEnviado,
    }
  }
}
