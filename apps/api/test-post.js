const axios = require('axios')

const apiUrl = process.env.API_URL || 'http://localhost:3001'

async function debug() {
  try {
    console.log('1. Obteniendo Sede...')
    const { data: sede } = await axios.get(`${apiUrl}/api/v1/sedes/kennedy`)
    console.log('Sede ID:', sede.id)

    console.log('\n2. Obteniendo Token...')
    const { data: tokenRes } = await axios.get(`${apiUrl}/api/v1/session-token`)
    console.log('Token:', tokenRes.sessionToken)

    console.log('\n3. Enviando Aceptacion...')
    const res = await axios.post(`${apiUrl}/api/v1/aceptaciones`, {
      sedeId: sede.id,
      terminosVersionId: sede.terminosActivos.id,
      sessionToken: tokenRes.sessionToken,
      formulario: {
        nombreCompleto: 'Test User',
        tipoDocumento: 'CC',
        numeroDocumento: '12345678',
        fechaNacimiento: '1990-01-01',
        telefono: '3000000000',
        correoElectronico: 'test@example.com',
        correoConfirmar: 'test@example.com',
      },
      firmaBase64:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6zwAAZAICIGbJ9AAAAABJRU5ErkJggg=='.repeat(
          5,
        ),
      aceptaTerminos: true,
      aceptaTratamientoDatos: true,
      declaraCondicionFisica: false,
      autorizaUsoImagen: false,
      condicionMedicaEspecial: 'Lesion de rodilla izquierda',
    })
    console.log('\nEXITOSO:', res.data)
  } catch (error) {
    console.error('\nFALLO BBDD/API:', error.response?.status, error.response?.data)
  }
}

debug()
