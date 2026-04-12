import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CorreoService {
  private transporter: nodemailer.Transporter;
  private isReady = false;
  private readonly logger = new Logger(CorreoService.name);

  constructor(private prisma: PrismaService) {
    this.initGmail();
  }

  private async initGmail() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      this.logger.warn('⚠️ GMAIL_USER o GMAIL_APP_PASSWORD no están configurados en el .env');
      this.logger.warn('⚠️ Los correos fallarán hasta que se configure la cuenta real de Gmail.');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    this.isReady = true;
    this.logger.log(`✅ CorreoService Inicializado. (Enrutando a cuenta real de Gmail)`);
  }

  async enviarCorreosAceptacion(aceptacionId: string) {
    try {
      // Esperar iterativamente a que la conexión Ethereal se haya establecido
      let intentosInit = 0;
      while (!this.isReady && intentosInit < 10) {
        await new Promise((r) => setTimeout(r, 500));
        intentosInit++;
      }

      const aceptacion = await this.prisma.aceptacion.findUnique({
        where: { id: aceptacionId },
        include: { sede: true, terminosVersion: true },
      });

      if (!aceptacion) throw new Error('Aceptación no encontrada');

      const logs = await this.prisma.correoLog.findMany({
        where: { aceptacionId, estado: 'PENDIENTE' },
      });

      for (const log of logs) {
        await this.procesarEnvio(log, aceptacion);
      }
    } catch (error) {
      this.logger.error(`Error procesando correos para aceptación ${aceptacionId}:`, error);
    }
  }

  private async procesarEnvio(log: any, aceptacion: any) {
    const from = '"FIT EVOLUTION360 MVP" <no-reply@fitevolution360.com>';
    let subject = '';
    let html = '';

    if (log.tipo === 'ADMINISTRACION') {
      subject = `💪 Nuevo Registro: ${aceptacion.nombreCompleto}`;
      html = this.generarPlantillaAdmin(aceptacion);
    } else if (log.tipo === 'USUARIO') {
      subject = `Términos Aceptados - ${aceptacion.sede.nombre}`;
      html = this.generarPlantillaUsuario(aceptacion);
    }

    try {
      const response = await this.transporter.sendMail({
        from,
        to: log.destinatario,
        subject,
        html,
      });

      await this.prisma.correoLog.update({
        where: { id: log.id },
        data: {
          estado: 'ENVIADO',
          proveedorId: response.messageId,
          enviadoAt: new Date(),
          intentos: log.intentos + 1,
        },
      });

      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      this.logger.log(`📬 CORREO REAL ENVIADO EXITOSAMENTE POR GMAIL`);
      this.logger.log(`Destino: ${log.destinatario} [${log.tipo}]`);
      this.logger.log(`Asunto:  ${subject}`);
      this.logger.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    } catch (error: any) {
      this.logger.error(`Fallo envío a ${log.destinatario}: ${error.message}`);
      await this.prisma.correoLog.update({
        where: { id: log.id },
        data: {
          estado: 'FALLIDO',
          ultimoError: error.message,
          ultimoIntentoAt: new Date(),
          intentos: log.intentos + 1,
        },
      });
    }
  }

  private generarPlantillaAdmin(aceptacion: any): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1a1a1a; padding: 20px; text-align: center; border-bottom: 4px solid #FFD700;">
          <h2 style="color: #FFD700; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px;">FIT EVOLUTION360</h2>
          <p style="color: #a3a3a3; margin: 5px 0 0 0; font-size: 14px;">Nuevo Registro de Usuario</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; margin-top: 0;">Se ha registrado una nueva aceptación de términos y condiciones en la sede <strong>${aceptacion.sede.nombre}</strong>.</p>
          
          <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Datos Personales</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; width: 40%; color: #6b7280;">Nombre Completo</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.nombreCompleto}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Documento</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.tipoDocumento} ${aceptacion.numeroDocumento}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Correo Electrónico</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.correoElectronico}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Teléfono</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.telefono}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Fecha de Nacimiento</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${new Date(aceptacion.fechaNacimiento).toLocaleDateString('es-CO')}</td></tr>
          </table>

          <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Contacto de Emergencia</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; width: 40%; color: #6b7280;">Nombre</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.contactoEmergenciaNombre || 'No especificado'}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Teléfono</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${aceptacion.contactoEmergenciaTelefono || 'No especificado'}</td></tr>
          </table>

          <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Consentimientos Otorgados</h3>
          <ul style="padding-left: 0; list-style: none; font-size: 14px; margin: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${aceptacion.aceptaTerminos ? '✅ ' : '❌ '} <strong>Términos de Ingreso:</strong> Aceptado</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${aceptacion.aceptaTratamientoDatos ? '✅ ' : '❌ '} <strong>Tratamiento de Datos:</strong> Aceptado (Ley 1581)</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${aceptacion.declaraCondicionFisica ? '✅ ' : '❌ '} <strong>Aptitud Física:</strong> Declarado Apto</li>
            <li style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${aceptacion.autorizaUsoImagen ? '✅ ' : '❌ '} <strong>Uso de Imagen:</strong> ${aceptacion.autorizaUsoImagen ? 'Autorizado' : 'No Autorizado'}</li>
          </ul>

          <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px;">Trazabilidad Legal</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; background-color: #f9fafb; border-radius: 6px; padding: 15px; display: block;">
            <tr><td style="padding: 6px 0; width: 40%; color: #6b7280;">Versión de Términos</td><td style="padding: 6px 0; font-family: monospace; color: #111827;">V${aceptacion.terminosVersion.numeroVersion}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Fecha de Firma</td><td style="padding: 6px 0; font-family: monospace; color: #111827;">${new Date(aceptacion.createdAt).toLocaleString('es-CO')}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">ID de Transacción</td><td style="padding: 6px 0; font-family: monospace; color: #111827; word-break: break-all;">${aceptacion.transactionId}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">IP del Dispositivo</td><td style="padding: 6px 0; font-family: monospace; color: #111827;">${aceptacion.ipAddress}</td></tr>
          </table>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Sistema de Registro Automático - FIT EVOLUTION360</p>
        </div>
      </div>
    `;
  }

  private generarPlantillaUsuario(aceptacion: any): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #1a1a1a; padding: 30px 20px; text-align: center; border-bottom: 4px solid #FFD700;">
          <h1 style="color: #FFD700; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">FIT EVOLUTION360</h1>
          <p style="color: #fff; margin: 10px 0 0 0; font-size: 16px;">Sede ${aceptacion.sede.nombre.split(' - ')[1] || aceptacion.sede.nombre}</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0; font-size: 22px;">¡Hola, ${aceptacion.nombreCompleto}! 👋</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">Tu registro y aceptación de los términos y condiciones se ha procesado exitosamente. Te damos la bienvenida oficial a nuestra comunidad.</p>
          
          <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #854d0e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Tu ID de Transacción (Evidencia Legal)</p>
            <code style="background: #fff; padding: 8px 12px; border-radius: 6px; font-size: 16px; color: #1a1a1a; border: 1px dashed #fde047; display: inline-block; word-break: break-all;">${aceptacion.transactionId}</code>
          </div>
          
          <h3 style="color: #1a1a1a; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; margin-top: 30px; font-size: 18px;">Resumen de tu Aceptación</h3>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">A continuación, detallamos los consentimientos que has otorgado legalmente el <strong>${new Date(aceptacion.createdAt).toLocaleDateString('es-CO')}</strong>:</p>
          
          <ul style="padding-left: 0; list-style: none; font-size: 15px; margin: 0;">
            <li style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start;">
              <span style="margin-right: 10px; font-size: 18px;">${aceptacion.aceptaTerminos ? '✅' : '❌'}</span>
              <div>
                <strong style="display: block; color: #111827;">Términos y Condiciones (Versión ${aceptacion.terminosVersion.numeroVersion})</strong>
                <span style="font-size: 13px; color: #6b7280;">Aceptaste las normas de ingreso, permanencia y liberación de responsabilidad.</span>
              </div>
            </li>
            <li style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start;">
              <span style="margin-right: 10px; font-size: 18px;">${aceptacion.aceptaTratamientoDatos ? '✅' : '❌'}</span>
              <div>
                <strong style="display: block; color: #111827;">Tratamiento de Datos Personales</strong>
                <span style="font-size: 13px; color: #6b7280;">Autorizaste el manejo de tus datos según la Ley 1581 de 2012.</span>
              </div>
            </li>
            <li style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start;">
              <span style="margin-right: 10px; font-size: 18px;">${aceptacion.declaraCondicionFisica ? '✅' : '❌'}</span>
              <div>
                <strong style="display: block; color: #111827;">Declaración de Aptitud Física</strong>
                <span style="font-size: 13px; color: #6b7280;">Declaraste estar en condiciones óptimas de salud para hacer ejercicio.</span>
              </div>
            </li>
            <li style="padding: 12px 0; display: flex; align-items: flex-start;">
              <span style="margin-right: 10px; font-size: 18px;">${aceptacion.autorizaUsoImagen ? '✅' : '❌'}</span>
              <div>
                <strong style="display: block; color: #111827;">Uso de Imagen en Sede</strong>
                <span style="font-size: 13px; color: #6b7280;">${aceptacion.autorizaUsoImagen ? 'Autorizaste' : 'No autorizaste'} el uso de tu imagen para fines publicitarios del gimnasio.</span>
              </div>
            </li>
          </ul>

          <div style="margin-top: 40px; text-align: center;">
            <p style="font-size: 15px; color: #4b5563; font-weight: bold;">Por favor guarda este correo electrónico como comprobante.</p>
            <p style="font-size: 15px; color: #4b5563;">Ya puedes acercarte a la recepción con tu documento de identidad (<strong>${aceptacion.tipoDocumento} ${aceptacion.numeroDocumento}</strong>) para comenzar a entrenar.</p>
          </div>
        </div>
        
        <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">Este es un mensaje automático generado por la plataforma legal de FIT EVOLUTION360. Por favor no respondas a este correo.</p>
        </div>
      </div>
    `;
  }
}
