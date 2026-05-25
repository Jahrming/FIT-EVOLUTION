import nodemailer from 'nodemailer'

import { prisma } from './prisma'

type AceptacionDetalle = Awaited<ReturnType<typeof getAceptacionDetalle>>

function createTransporter() {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

function getCondicionMedicaEspecial(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') return undefined
  const value = (metadata as Record<string, unknown>).condicionMedicaEspecial
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'No disponible'
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Bogota',
  }).format(date)
}

function formatBirthDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'long',
    timeZone: 'America/Bogota',
  }).format(date)
}

function yesNo(value: boolean) {
  return value ? 'Si' : 'No'
}

function tableRow(label: string, value: string) {
  return `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; width: 40%; color: #6b7280;">${label}</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${value}</td></tr>`
}

function consentItem(label: string, value: boolean) {
  return `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>${label}:</strong> ${yesNo(value)}</li>`
}

async function getAceptacionDetalle(aceptacionId: string) {
  return prisma.aceptacion.findUnique({
    where: { id: aceptacionId },
    include: { sede: true, terminosVersion: true },
  })
}

function generarPlantillaAdmin(aceptacion: NonNullable<AceptacionDetalle>) {
  const condicionMedicaEspecial = getCondicionMedicaEspecial(aceptacion.metadataExtra)
  const sedeNombre = aceptacion.sede.nombre.split(' - ')[1] || aceptacion.sede.nombre

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 4px solid #FFD700;">
        <h2 style="color: #FFD700; margin: 0; font-size: 24px;">FIT EVOLUTION360</h2>
        <p style="color: #a3a3a3; margin: 5px 0 0 0; font-size: 14px;">Nuevo Registro de Usuario</p>
      </div>
      <div style="padding: 30px;">
        <p style="font-size: 16px; margin-top: 0;">Se registro una nueva aceptacion de terminos y condiciones en la sede <strong>${aceptacion.sede.nombre}</strong>.</p>
        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 18px 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 8px 0; color: #854d0e; font-size: 13px; font-weight: bold; text-transform: uppercase;">Resumen del registro</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.8;">
            <strong>ID de transaccion:</strong> ${aceptacion.transactionId}<br />
            <strong>Fecha de registro:</strong> ${formatDate(aceptacion.createdAt)}<br />
            <strong>Sede:</strong> ${sedeNombre}<br />
            <strong>Version de terminos:</strong> ${aceptacion.terminosVersion.numeroVersion}
          </p>
        </div>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Datos Personales</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${tableRow('Nombre Completo', aceptacion.nombreCompleto)}
          ${tableRow('Documento', `${aceptacion.tipoDocumento} ${aceptacion.numeroDocumento}`)}
          ${tableRow('Fecha de Nacimiento', formatBirthDate(aceptacion.fechaNacimiento))}
          ${tableRow('Correo Electronico', aceptacion.correoElectronico)}
          ${tableRow('Telefono', aceptacion.telefono)}
        </table>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Contacto de Emergencia</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${tableRow('Nombre', aceptacion.contactoEmergenciaNombre || 'No informado')}
          ${tableRow('Telefono', aceptacion.contactoEmergenciaTelefono || 'No informado')}
        </table>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Consentimientos Otorgados</h3>
        <ul style="padding-left: 0; list-style: none; font-size: 14px; margin: 0;">
          ${consentItem('Aceptacion de terminos de ingreso', aceptacion.aceptaTerminos)}
          ${consentItem('Autorizacion de tratamiento de datos', aceptacion.aceptaTratamientoDatos)}
          ${consentItem('Declaracion de condicion fisica apta', aceptacion.declaraCondicionFisica)}
          ${condicionMedicaEspecial ? `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Condicion medica especial:</strong> ${condicionMedicaEspecial}</li>` : ''}
          ${consentItem('Autorizacion de uso de imagen', aceptacion.autorizaUsoImagen)}
        </ul>
      </div>
    </div>
  `
}

function generarPlantillaUsuario(aceptacion: NonNullable<AceptacionDetalle>) {
  const condicionMedicaEspecial = getCondicionMedicaEspecial(aceptacion.metadataExtra)
  const sedeNombre = aceptacion.sede.nombre.split(' - ')[1] || aceptacion.sede.nombre

  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #FFD700;">
        <h1 style="color: #FFD700; margin: 0; font-size: 28px;">FIT EVOLUTION360</h1>
        <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Sede ${sedeNombre}</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px;">Hola, ${aceptacion.nombreCompleto}</h2>
        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Tu registro y aceptacion de los terminos y condiciones se proceso exitosamente. Este correo resume tus datos y todo lo que aceptaste.</p>
        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #854d0e; font-size: 14px; font-weight: bold;">Tu ID de Transaccion</p>
          <code style="background: #fff; padding: 8px 12px; border-radius: 6px; font-size: 16px; color: #1a1a1a; display: inline-block; word-break: break-all;">${aceptacion.transactionId}</code>
        </div>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Resumen del Registro</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${tableRow('Nombre Completo', aceptacion.nombreCompleto)}
          ${tableRow('Documento', `${aceptacion.tipoDocumento} ${aceptacion.numeroDocumento}`)}
          ${tableRow('Correo Electronico', aceptacion.correoElectronico)}
          ${tableRow('Telefono', aceptacion.telefono)}
          ${tableRow('Sede', sedeNombre)}
          ${tableRow('Fecha de Registro', formatDate(aceptacion.createdAt))}
          ${tableRow('Version de Terminos', String(aceptacion.terminosVersion.numeroVersion))}
        </table>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Lo que Aceptaste</h3>
        <ul style="padding-left: 0; list-style: none; font-size: 14px; margin: 0;">
          ${consentItem('Aceptacion de terminos de ingreso', aceptacion.aceptaTerminos)}
          ${consentItem('Autorizacion de tratamiento de datos', aceptacion.aceptaTratamientoDatos)}
          ${consentItem('Declaracion de condicion fisica apta', aceptacion.declaraCondicionFisica)}
          ${condicionMedicaEspecial ? `<li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Condicion medica especial informada:</strong> ${condicionMedicaEspecial}</li>` : ''}
          ${consentItem('Autorizacion de uso de imagen', aceptacion.autorizaUsoImagen)}
        </ul>
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Contacto de Emergencia</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${tableRow('Nombre', aceptacion.contactoEmergenciaNombre || 'No informado')}
          ${tableRow('Telefono', aceptacion.contactoEmergenciaTelefono || 'No informado')}
        </table>
      </div>
    </div>
  `
}

export async function enviarCorreosAceptacion(aceptacionId: string) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPass) {
    return false
  }

  const transporter = createTransporter()
  const aceptacion = await getAceptacionDetalle(aceptacionId)

  if (!aceptacion) {
    throw new Error('Aceptacion no encontrada')
  }

  const logs = await prisma.correoLog.findMany({
    where: { aceptacionId, estado: 'PENDIENTE' },
  })

  let usuarioEnviado = false

  for (const log of logs) {
    const subject =
      log.tipo === 'ADMINISTRACION'
        ? `Nuevo Registro: ${aceptacion.tipoDocumento} ${aceptacion.numeroDocumento} - ${aceptacion.nombreCompleto}`
        : `Terminos Aceptados - ${aceptacion.sede.nombre}`

    const html =
      log.tipo === 'ADMINISTRACION'
        ? generarPlantillaAdmin(aceptacion)
        : generarPlantillaUsuario(aceptacion)

    try {
      const response = await transporter.sendMail({
        from: `"FIT EVOLUTION360" <${gmailUser}>`,
        to: log.destinatario,
        subject,
        html,
      })

      await prisma.correoLog.update({
        where: { id: log.id },
        data: {
          estado: 'ENVIADO',
          proveedorId: response.messageId,
          enviadoAt: new Date(),
          intentos: log.intentos + 1,
        },
      })

      if (log.tipo === 'USUARIO') {
        usuarioEnviado = true
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error enviando correo'
      await prisma.correoLog.update({
        where: { id: log.id },
        data: {
          estado: 'FALLIDO',
          ultimoError: message,
          ultimoIntentoAt: new Date(),
          intentos: log.intentos + 1,
        },
      })
    }
  }

  return usuarioEnviado
}
