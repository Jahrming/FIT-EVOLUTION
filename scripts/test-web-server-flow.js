require('ts-node').register({
  transpileOnly: true,
  project: 'apps/web/tsconfig.json',
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
  },
})

require('tsconfig-paths').register({
  baseUrl: './apps/web',
  paths: {
    '@/*': ['./*'],
  },
})

const { createHash } = require('crypto')
const { PrismaClient } = require('@prisma/client')

const { crearAceptacion } = require('../apps/web/lib/server/aceptaciones')
const { findSedeBySlug } = require('../apps/web/lib/server/sedes')
const { generateSessionToken } = require('../apps/web/lib/server/session-token')

async function main() {
  process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    'mysql://root:root@127.0.0.1:3306/fitevolution360?connection_limit=5'

  const prisma = new PrismaClient()

  try {
    const sede = await findSedeBySlug('kennedy')
    console.log('SEDE', sede)

    const token = await generateSessionToken()
    console.log('TOKEN', token)

    const terminos = await prisma.terminosVersion.findFirst({
      where: { estado: 'ACTIVO' },
      orderBy: { numeroVersion: 'desc' },
    })

    if (!sede || !terminos) {
      throw new Error('No hay sede o terminos activos para la prueba')
    }

    const suffix = Date.now().toString().slice(-6)
    const numeroDocumento = `9900${suffix}`
    const correo = `prueba.web.${suffix}@example.com`

    const result = await crearAceptacion(
      {
        sedeId: sede.id,
        terminosVersionId: terminos.id,
        sessionToken: token.sessionToken,
        firmaBase64: '',
        aceptaTerminos: true,
        aceptaTratamientoDatos: true,
        declaraCondicionFisica: true,
        autorizaUsoImagen: false,
        formulario: {
          nombreCompleto: `Prueba Web ${suffix}`,
          tipoDocumento: 'CC',
          numeroDocumento,
          fechaNacimiento: '1995-05-10',
          telefono: `300123${suffix.slice(-4)}`,
          correoElectronico: correo,
          correoConfirmar: correo,
          contactoEmergenciaNombre: 'Contacto Prueba',
          contactoEmergenciaTelefono: `301456${suffix.slice(-4)}`,
        },
      },
      '127.0.0.1',
      'codex-test-web-flow',
    )

    const aceptacion = await prisma.aceptacion.findFirst({
      where: { numeroDocumento },
      include: { correosLog: true, sede: true },
      orderBy: { createdAt: 'desc' },
    })

    const terminosHash = `sha256:${createHash('sha256').update(terminos.contenidoHtml).digest('hex')}`

    console.log('RESULT', result)
    console.log(
      'ACEPTACION',
      aceptacion
        ? {
            id: aceptacion.id,
            transactionId: aceptacion.transactionId,
            sede: aceptacion.sede.slug,
            logs: aceptacion.correosLog.map((log) => ({
              tipo: log.tipo,
              estado: log.estado,
              destinatario: log.destinatario,
            })),
            documentoHashAceptado: aceptacion.documentoHashAceptado,
            expectedHash: terminosHash,
          }
        : null,
    )
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
