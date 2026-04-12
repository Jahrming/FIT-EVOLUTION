const axios = require('axios');

async function debug() {
  try {
    console.log('1. Obteniendo Sede...');
    const { data: sede } = await axios.get('http://localhost:3001/api/v1/sedes/kennedy');
    console.log('Sede ID:', sede.id);
    
    console.log('\n2. Obteniendo Token...');
    const { data: tokenRes } = await axios.get('http://localhost:3001/api/v1/session-token');
    console.log('Token:', tokenRes.sessionToken);

    console.log('\n3. Enviando Aceptacion...');
    const res = await axios.post('http://localhost:3001/api/v1/aceptaciones', {
      sedeId: sede.id,
      terminosVersionId: sede.terminosActivos.id,
      sessionToken: tokenRes.sessionToken,
      formulario: {
        nombreCompleto: 'Test User',
        tipoDocumento: 'CC',
        numeroDocumento: '12345678',
        fechaNacimiento: '1990-01-01',
        telefono: '3000000000',
        correoElectronico: 'jherrera23@udi.edu.co',
        correoConfirmar: 'jherrera23@udi.edu.co',
      },
      firmaBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP6zwAAZAICIGbJ9AAAAABJRU5ErkJggg=='.repeat(5),
      aceptaTerminos: true,
      aceptaTratamientoDatos: true,
      declaraCondicionFisica: true,
      autorizaUsoImagen: false,
    });
    console.log('\n✅ EXITOSO:', res.data);
  } catch (error) {
    console.error('\n❌ FALLO BBDD/API:', error.response?.status, error.response?.data);
  }
}
debug();
