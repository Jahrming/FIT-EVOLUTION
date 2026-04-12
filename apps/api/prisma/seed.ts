import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Ejecutando seed de datos iniciales...')

  // 1. Roles (para cuando se implemente admin panel)
  const roleRecep = await prisma.rol.upsert({
    where: { nombre: 'RECEPCIONISTA' },
    update: {},
    create: { nombre: 'RECEPCIONISTA', descripcion: 'Personal de recepción de la sede' },
  })
  console.log(`✓ Rol creado: ${roleRecep.nombre}`)

  // 2. Sede Kennedy
  // 2. Sede Kennedy (Bucaramanga)
  const sedeKennedy = await prisma.sede.upsert({
    where: { slug: 'kennedy' },
    update: {},
    create: {
      slug: 'kennedy',
      nombre: 'FIT EVOLUTION360 - Sede Kennedy',
      ciudad: 'Bucaramanga',
      direccion: 'Calle 18N # 10-74 Barrio Kennedy',
      telefono: '601-1234567',
      correoAdmin: 'jose2002rincon@gmail.com',
      activo: true,
    },
  })
  console.log(`✓ Sede creada o verificada: ${sedeKennedy.nombre}`)

  // 3. Crear versión de términos para la Sede Kennedy (si no hay)
  const existingTerminos = await prisma.terminosVersion.findFirst({
    where: { sedeId: sedeKennedy.id, estado: 'ACTIVO', numeroVersion: 6 }
  })

  if (!existingTerminos) {
    const terminos = await prisma.terminosVersion.create({
      data: {
        sedeId: sedeKennedy.id,
        numeroVersion: 6,
        titulo: 'Términos y Condiciones Generales 2026 V6',
        estado: 'ACTIVO',
        contenidoHtml: `
        <h3>3. DECLARACIONES DEL USUARIO</h3>
        <p>Por medio del presente documento, manifiesto que he sido informado de manera clara, suficiente y oportuna sobre los procedimientos, alcances y finalidades del tratamiento de mis datos personales, y expreso libremente mi deseo de participar en las actividades, eventos y/o servicios ofrecidos por FIT_EVOLUTION360, incluyendo, sin limitarse a, entrenamientos, actividades físicas, recreativas y deportivas.</p>
        <p>Declaro y certifico que:</p>
        <ul>
            <li>Mi estado de salud es adecuado para la práctica de actividad física y deportiva.</li>
            <li>No padezco enfermedades cardiovasculares, respiratorias, presión arterial no controlada, ni ninguna otra patología que represente un riesgo para mi salud durante la realización de las actividades.</li>
            <li>No presento lesiones musculares, articulares u óseas, ni condiciones médicas que puedan agravarse con el ejercicio físico.</li>
            <li>No presento síntomas de enfermedades infectocontagiosas ni ninguna otra circunstancia que impida mi participación segura en las actividades.</li>
            <li>Reconozco que la actividad física implica riesgos inherentes, incluyendo, entre otros, lesiones musculares o articulares, deshidratación, fatiga extrema, paro cardíaco, paro respiratorio, infarto o incluso la muerte.</li>
        </ul>

        <h3>4. ASUNCIÓN DE RESPONSABILIDAD, EXONERACIÓN Y LIBERACIÓN TOTAL</h3>
        <p>Asumo de manera voluntaria, consciente y expresa todos los riesgos derivados de mi ingreso, permanencia y participación en las actividades realizadas dentro o fuera de las instalaciones de FIT_EVOLUTION360.</p>
        <p>Declaro que toda actividad física la realizo bajo mi exclusiva responsabilidad, incluyendo el uso de máquinas, pesas, equipos cardiovasculares, clases grupales, entrenamientos personalizados o libres.</p>
        <p>En consecuencia, libero, exonero y mantengo indemne a FIT_EVOLUTION360, a sus propietarios, administradores, entrenadores, instructores, contratistas, empleados y aliados, de cualquier tipo de responsabilidad civil, penal, contractual o extracontractual, por lesiones físicas, psicológicas, enfermedades, incapacidades, daños, pérdidas, secuelas permanentes o muerte, que puedan derivarse de:</p>
        <ul>
            <li>Uso inadecuado de equipos o instalaciones.</li>
            <li>Ejecución incorrecta de ejercicios.</li>
            <li>Sobreentrenamiento, fatiga, deshidratación o imprudencia.</li>
            <li>Omisión de información médica relevante por parte del usuario.</li>
            <li>Accidentes fortuitos o hechos imprevisibles.</li>
        </ul>
        <p>Renuncio expresamente a presentar reclamaciones, demandas, denuncias o solicitudes de indemnización contra FIT_EVOLUTION360, aun cuando los hechos se presenten por negligencia simple, errores de supervisión o fallas operativas.</p>

        <h3>5. COMPROMISOS Y OBLIGACIONES DEL USUARIO</h3>
        <p>Me comprometo de manera expresa a:</p>
        <ul>
            <li>Utilizar las instalaciones y equipos de forma correcta, responsable y conforme a las instrucciones recibidas.</li>
            <li>No exceder mis límites físicos ni entrenar bajo efectos de alcohol, drogas o medicamentos que alteren mis capacidades.</li>
            <li>Informar de manera veraz y oportuna cualquier condición médica preexistente.</li>
            <li>Acatar el reglamento interno, normas de seguridad y protocolos establecidos por FIT_EVOLUTION360.</li>
        </ul>
        <p>Reconozco que cualquier incumplimiento de estas obligaciones exonera completamente a FIT_EVOLUTION360 de toda responsabilidad.</p>

        <h3>6. AUTORIZACIÓN EN CASO DE EMERGENCIA</h3>
        <p>En caso de sufrir cualquier accidente, eventualidad o enfermedad durante mi participación, autorizo a FIT_EVOLUTION360 para contactar a la persona de emergencia indicada previamente en la sección de mis datos personales.</p>

        <h3>7. AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</h3>
        <p>Autorizo de manera previa, expresa e informada a FIT_EVOLUTION360 y a sus filiales, matrices, subordinadas y terceros con quienes tenga vínculos comerciales, para recolectar, almacenar, usar, circular, suprimir, transferir y transmitir mis datos personales, incluidos datos públicos, privados, semiprivados y sensibles, conforme a la Ley 1581 de 2012, el Decreto 1377 de 2013 y demás normas aplicables.</p>
        <p>Las finalidades del tratamiento incluyen, entre otras:</p>
        <ul>
            <li>Gestión administrativa y operativa de los servicios.</li>
            <li>Actualización de audiencias y campañas en plataformas digitales (META: Facebook e Instagram).</li>
            <li>Segmentación, optimización y análisis de campañas publicitarias.</li>
            <li>Seguimiento del tráfico de cuentas y análisis de intereses.</li>
            <li>Envío de información comercial, promociones, ofertas e invitaciones.</li>
        </ul>
        <p>Reconozco que mis datos podrán ser tratados mediante herramientas tecnológicas, software y bases de datos ubicadas dentro o fuera del territorio colombiano.</p>
        <p>Conozco y acepto que puedo ejercer en cualquier momento mis derechos a conocer, actualizar, rectificar, suprimir mis datos o revocar la autorización, mediante los canales establecidos en la Política de Tratamiento de Datos Personales disponible en www.FuturaPaginaWebGym.com.</p>

        <h3>8. AUTORIZACIÓN DE USO DE IMAGEN</h3>
        <p>Autorizo de manera expresa e irrevocable a FIT_EVOLUTION360 para la fijación, captura y uso de mi imagen mediante fotografía, video, dibujo u otros medios análogos, así como su reproducción, comunicación pública, distribución, adaptación o transformación, en cualquier formato, medio o soporte.</p>
        <p>El uso de mi imagen podrá tener fines comerciales, publicitarios, institucionales y promocionales relacionados con los servicios, productos, eventos y actividades de FIT_EVOLUTION360, sin que ello genere derecho a compensación económica alguna.</p>
        <p>Declaro que el uso de mi imagen, conforme a esta autorización, no vulnera mis derechos fundamentales, en especial el derecho a la imagen y al buen nombre.</p>

        <h3>9. MARCO LEGAL Y LEY APLICABLE</h3>
        <p>El presente documento se rige en su totalidad por las leyes de la República de Colombia. Cualquier controversia derivada de su interpretación o ejecución será sometida a la jurisdicción ordinaria colombiana.</p>

        <h3>10. ACEPTACIÓN</h3>
        <p>Declaro que he leído, entendido y aceptado íntegramente los términos y condiciones del presente documento, actuando de manera libre, voluntaria y sin ningún tipo de presión, lo cual será ratificado mediante mi firma digital y/o aceptación electrónica en esta plataforma.</p>
      `,
        contenidoHash: 'sha256:abcd1234efgh5678-v6',
        publicadoAt: new Date(),
        notas: 'Versión V6 restaurando todos los términos legales y numeración',
      },
    })
    
    // Desactivar la versión anterior
    await prisma.terminosVersion.updateMany({
      where: { sedeId: sedeKennedy.id, numeroVersion: { lt: 6 } },
      data: { estado: 'ARCHIVADO' }
    })
    
    console.log(`✓ Creada versión de términos 6 para ${sedeKennedy.nombre}`)
  } else {
    console.log(`✓ La sede ${sedeKennedy.nombre} ya tiene términos activos (v6)`)
  }

  console.log('✅ Seed completado.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
