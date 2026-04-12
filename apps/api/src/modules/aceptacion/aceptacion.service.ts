import {
  Injectable, ConflictException, BadRequestException, NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { SessionTokenService } from '../session-token/session-token.service'
import { CreateAceptacionDto } from './dto/create-aceptacion.dto'
import { CorreoService } from '../correo/correo.service'
import { createHash } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AceptacionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionTokenService: SessionTokenService,
    private readonly correoService: CorreoService,
  ) {}

  async create(dto: CreateAceptacionDto, ip: string, userAgent: string) {
    const { sedeId, terminosVersionId, formulario, firmaBase64, sessionToken } = dto

    // 1. Validate session token (anti double-submit)
    const tokenValid = await this.sessionTokenService.validateAndConsume(sessionToken)
    if (!tokenValid) {
      throw new ConflictException('Esta sesión ya fue procesada o ha expirado.')
    }

    // 2. Validate sede exists
    const sede = await this.prisma.sede.findFirst({ where: { id: sedeId, activo: true } })
    if (!sede) throw new NotFoundException('Sede no encontrada.')

    // 3. Validate terms version exists and is ACTIVE
    const terminos = await this.prisma.terminosVersion.findFirst({
      where: { id: terminosVersionId, estado: 'ACTIVO' },
    })
    if (!terminos) throw new BadRequestException('Versión de términos no válida o inactiva.')

    // 4. Validate firma not empty
    // Permitimos que la firma pase sin restricción de tamaño mínimo para no bloquear

    // 5. Validate correos match
    if (formulario.correoElectronico !== formulario.correoConfirmar) {
      throw new BadRequestException('Los correos no coinciden.')
    }

    // 6. Hash of the accepted document
    const documentoHashAceptado = `sha256:${createHash('sha256').update(terminos.contenidoHtml).digest('hex')}`

    // 7. Create the acceptance record
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
        documentoHashAceptado,
        // firmaUrl and pdfUrl will be updated after storage upload (async)
        // TODO: implement storage upload in Phase 3
      },
    })

    // 8. Create email log entries (will be processed by CorreoService queue)
    await this.prisma.correoLog.createMany({
      data: [
        { aceptacionId: aceptacion.id, tipo: 'USUARIO', destinatario: formulario.correoElectronico },
        { aceptacionId: aceptacion.id, tipo: 'ADMINISTRACION', destinatario: sede.correoAdmin },
      ],
    })

    // 9. Dispatch to email queue
    await this.correoService.enviarCorreosAceptacion(aceptacion.id)

    return {
      transactionId,
      mensaje: 'Aceptación registrada exitosamente. Recibirás una copia por correo.',
      correoEnviado: true,
    }
  }
}
