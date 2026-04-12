import * as nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'
require('dotenv').config()

async function main() {
  console.log('Iniciando envío REAL de 2 correos por Gmail (bypassing DB)...')
  
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    console.error('\n❌ ERROR: No se puede probar el envío porque falta GMAIL_USER o GMAIL_APP_PASSWORD en el .env de la consola actual.')
    console.log('Si ya los pusiste en .env, intenta usar el formulario amarillo en el navegador, el backend automáticamente los leerá.')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
  
  const adminEmail = 'jose2002rincon@gmail.com'
  const userEmail = 'jose2003rincon@gmail.com'

  const i = 1
  const transactionId = uuidv4()
  const nombreCompleto = `Usuario Prueba Real`
  
  const htmlAdmin = `
    <div style="font-family: Arial; color: #333;">
      <h2 style="color: #EAB308;">Nuevo Registro (Prueba Real)</h2>
      <p>Usuario: <strong>${nombreCompleto}</strong></p>
      <p>Sede: FIT EVOLUTION360 - Sede Kennedy</p>
      <p>ID Transacción: ${transactionId}</p>
    </div>
  `
  const htmlUser = `
    <div style="font-family: Arial; color: #333;">
      <h2 style="color: #EAB308;">Bienvenido a FIT EVOLUTION360</h2>
      <p>Hola <strong>${nombreCompleto}</strong>,</p>
      <p>Tu aceptación ha sido registrada oficialmente en tu correo de Google.</p>
      <p>Tu ID: <code>${transactionId}</code></p>
    </div>
  `

  console.log(`\n--- Conectando a Gmail como ${user} ---`)
  
  try {
    // ADMIN REAL
    await transporter.sendMail({
      from: '"FIT EVOLUTION360 MVP" <no-reply@fitevolution360.com>',
      to: adminEmail,
      subject: `💪 Nuevo Registro Real: ${nombreCompleto}`,
      html: htmlAdmin,
    })
    console.log(`✅ [ADMIN] Correo real entregado con éxito a ${adminEmail} ! Revisa tu celular.`)

    // USER REAL
    await transporter.sendMail({
      from: '"FIT EVOLUTION360" <no-reply@fitevolution360.com>',
      to: userEmail,
      subject: `Términos Aceptados (Prueba Oficial)`,
      html: htmlUser,
    })
    console.log(`✅ [USER]  Correo real entregado con éxito a ${userEmail} ! Revisa tu celular.`)
    
  } catch (e: any) {
    console.error(`\n❌ Error enviando correo por Gmail:`, e.message)
    console.error(`Asegúrate de haber generado la 'Contraseña de Aplicación' de 16 dígitos correctamente sin espacios en tu .env.`)
  }

  console.log('\n🎉 Transmisión finalizada.')
}

main().catch(console.error)
