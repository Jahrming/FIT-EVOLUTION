const axios = require('axios')

const apiUrl = process.env.API_URL || 'http://localhost:3001'

async function registerTestUser(index) {
  try {
    console.log(`\n--- Registrando Usuario de Prueba #${index} ---`)
    
    console.log('1. Obteniendo Sede...')
    const { data: sede } = await axios.get(`${apiUrl}/api/v1/sedes/kennedy`)
    console.log('Sede ID:', sede.id)

    console.log('2. Obteniendo Token...')
    const { data: tokenRes } = await axios.get(`${apiUrl}/api/v1/session-token`)
    console.log('Token:', tokenRes.sessionToken)

    console.log('3. Enviando Aceptacion...')
    const res = await axios.post(`${apiUrl}/api/v1/aceptaciones`, {
      sedeId: sede.id,
      terminosVersionId: sede.terminosActivos.id,
      sessionToken: tokenRes.sessionToken,
      formulario: {
        nombreCompleto: `Usuario Prueba ${index}`,
        tipoDocumento: 'CC',
        numeroDocumento: `1234567${index}`,
        fechaNacimiento: '1990-01-01',
        telefono: '3000000000',
        correoElectronico: 'jose2002rincon@gmail.com', // Enviamos a tu correo para que verifiques
        correoConfirmar: 'jose2002rincon@gmail.com',
      },
      firmaBase64:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6zwAAZAICIGbJ9AAAAABJRU5ErkJggg=='.repeat(
          5,
        ),
      aceptaTerminos: true,
      aceptaTratamientoDatos: true,
      declaraCondicionFisica: true,
      autorizaUsoImagen: false,
    })
    
    console.log(`✅ EXITO: Usuario #${index} creado en BD. Correo enviado: ${res.data.correoEnviado}`)
    console.log('ID Transacción:', res.data.transactionId)
  } catch (error) {
    console.error(`❌ FALLO en registro #${index}:`, error.response?.status, error.response?.data || error.message)
  }
}

async function run() {
  console.log('Iniciando prueba automática de 5 registros y correos...')
  for (let i = 1; i <= 5; i++) {
    await registerTestUser(i)
    // Esperamos 2 segundos entre registros para evitar rate limit
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  console.log('\nPrueba finalizada. Si todo salió exitoso, revisa tu correo y tu base de datos de Hostinger.')
}

run()
