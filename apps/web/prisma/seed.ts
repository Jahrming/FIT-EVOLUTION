import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seed inicial de web app...')

  await prisma.rol.upsert({
    where: { nombre: 'RECEPCIONISTA' },
    update: { descripcion: 'Personal de recepcion de la sede' },
    create: { nombre: 'RECEPCIONISTA', descripcion: 'Personal de recepcion de la sede' },
  })

  const sedeKennedy = await prisma.sede.upsert({
    where: { slug: 'kennedy' },
    update: {
      nombre: 'FIT EVOLUTION360 - Sede Kennedy',
      ciudad: 'Bucaramanga',
      direccion: 'Calle 18N # 10-74 Barrio Kennedy',
      telefono: '601-1234567',
      correoAdmin: 'nortefitevolution360@gmail.com',
      activo: true,
    },
    create: {
      slug: 'kennedy',
      nombre: 'FIT EVOLUTION360 - Sede Kennedy',
      ciudad: 'Bucaramanga',
      direccion: 'Calle 18N # 10-74 Barrio Kennedy',
      telefono: '601-1234567',
      correoAdmin: 'nortefitevolution360@gmail.com',
      activo: true,
    },
  })

  const existingTerminos = await prisma.terminosVersion.findFirst({
    where: { sedeId: sedeKennedy.id, estado: 'ACTIVO', numeroVersion: 6 },
  })

  if (!existingTerminos) {
    await prisma.terminosVersion.create({
      data: {
        sedeId: sedeKennedy.id,
        numeroVersion: 6,
        titulo: 'Terminos y Condiciones Generales 2026 V6',
        estado: 'ACTIVO',
        contenidoHtml: `
        <h3>3. DECLARACIONES DEL USUARIO</h3>
        <p>Por medio del presente documento, manifiesto que he sido informado de manera clara, suficiente y oportuna sobre los procedimientos, alcances y finalidades del tratamiento de mis datos personales, y expreso libremente mi deseo de participar en las actividades, eventos y/o servicios ofrecidos por FIT_EVOLUTION360, incluyendo, sin limitarse a, entrenamientos, actividades fisicas, recreativas y deportivas.</p>
        <p>Declaro y certifico que:</p>
        <ul>
            <li>Mi estado de salud es adecuado para la practica de actividad fisica y deportiva.</li>
            <li>No padezco enfermedades cardiovasculares, respiratorias, presion arterial no controlada, ni ninguna otra patologia que represente un riesgo para mi salud durante la realizacion de las actividades.</li>
            <li>No presento lesiones musculares, articulares u oseas, ni condiciones medicas que puedan agravarse con el ejercicio fisico.</li>
            <li>No presento sintomas de enfermedades infectocontagiosas ni ninguna otra circunstancia que impida mi participacion segura en las actividades.</li>
            <li>Reconozco que la actividad fisica implica riesgos inherentes, incluyendo, entre otros, lesiones musculares o articulares, deshidratacion, fatiga extrema, paro cardiaco, paro respiratorio, infarto o incluso la muerte.</li>
        </ul>

        <h3>4. ASUNCION DE RESPONSABILIDAD, EXONERACION Y LIBERACION TOTAL</h3>
        <p>Asumo de manera voluntaria, consciente y expresa todos los riesgos derivados de mi ingreso, permanencia y participacion en las actividades realizadas dentro o fuera de las instalaciones de FIT_EVOLUTION360.</p>
        <p>Declaro que toda actividad fisica la realizo bajo mi exclusiva responsabilidad, incluyendo el uso de maquinas, pesas, equipos cardiovasculares, clases grupales, entrenamientos personalizados o libres.</p>

        <h3>5. COMPROMISOS Y OBLIGACIONES DEL USUARIO</h3>
        <p>Me comprometo de manera expresa a utilizar las instalaciones y equipos de forma correcta, responsable y conforme a las instrucciones recibidas.</p>

        <h3>6. AUTORIZACION EN CASO DE EMERGENCIA</h3>
        <p>En caso de sufrir cualquier accidente, eventualidad o enfermedad durante mi participacion, autorizo a FIT_EVOLUTION360 para contactar a la persona de emergencia indicada previamente en la seccion de mis datos personales.</p>

        <h3>7. AUTORIZACION PARA EL TRATAMIENTO DE DATOS PERSONALES</h3>
        <p>Autorizo de manera previa, expresa e informada a FIT_EVOLUTION360 para recolectar, almacenar, usar, circular, suprimir, transferir y transmitir mis datos personales conforme a la Ley 1581 de 2012 y demas normas aplicables.</p>

        <h3>8. AUTORIZACION DE USO DE IMAGEN</h3>
        <p>Autorizo de manera expresa e irrevocable a FIT_EVOLUTION360 para la fijacion, captura y uso de mi imagen con fines comerciales, publicitarios, institucionales y promocionales.</p>

        <h3>9. MARCO LEGAL Y LEY APLICABLE</h3>
        <p>El presente documento se rige por las leyes de la Republica de Colombia.</p>

        <h3>10. ACEPTACION</h3>
        <p>Declaro que he leido, entendido y aceptado integramente los terminos y condiciones del presente documento.</p>
      `,
        contenidoHash: 'sha256:abcd1234efgh5678-v6',
        publicadoAt: new Date(),
        notas: 'Version V6 restaurando todos los terminos legales y numeracion',
      },
    })

    await prisma.terminosVersion.updateMany({
      where: { sedeId: sedeKennedy.id, numeroVersion: { lt: 6 } },
      data: { estado: 'ARCHIVADO' },
    })
  }

  console.log('Seed completado.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
