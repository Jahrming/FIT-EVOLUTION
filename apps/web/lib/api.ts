import axios from 'axios'
import type { AceptacionPayload, AceptacionResponse, SedeInfo } from './schemas'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

// ---- Sede ----------------------------------------------------------------

export async function getSede(slug: string): Promise<SedeInfo> {
  const { data } = await apiClient.get<SedeInfo>(`/api/v1/sedes/${slug}`)
  return data
}

// ---- Session Token -------------------------------------------------------

export async function getSessionToken(): Promise<string> {
  const { data } = await apiClient.get<{ sessionToken: string }>(
    '/api/v1/session-token'
  )
  return data.sessionToken
}

// ---- Aceptaciones --------------------------------------------------------

export async function enviarAceptacion(
  payload: AceptacionPayload
): Promise<AceptacionResponse> {
  const { data } = await apiClient.post<AceptacionResponse>(
    '/api/v1/aceptaciones',
    payload
  )
  return data
}

// ---- Helpers -------------------------------------------------------------

/** Mock para desarrollo cuando el backend no está levantado */
export async function getMockSede(slug: string): Promise<SedeInfo> {
  await new Promise((r) => setTimeout(r, 400)) // simula latencia
  return {
    id: 'mock-sede-kennedy',
    slug,
    nombre: `FIT EVOLUTION360 - Sede ${slug.charAt(0).toUpperCase() + slug.slice(1)}`,
    ciudad: 'Bogotá',
    direccion: 'Carrera 78b # 38-35 Sur, Kennedy, Bogotá',
    terminosActivos: {
      id: 'mock-terminos-v1',
      numeroVersion: 1,
      contenidoHtml: `
        <h2>TÉRMINOS Y CONDICIONES DE INGRESO Y PARTICIPACIÓN</h2>
        <h3>FIT EVOLUTION360 — Sede Kennedy</h3>
        <p>El presente documento establece los términos y condiciones que rigen el ingreso, permanencia
        y participación de los usuarios en las instalaciones y servicios de FIT EVOLUTION360, de
        conformidad con la normativa colombiana vigente.</p>

        <h2>1. AUTORIZACIÓN PARA EL TRATAMIENTO DE DATOS PERSONALES</h2>
        <p>De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, el usuario autoriza a
        FIT EVOLUTION360 para recolectar, almacenar, usar y transferir sus datos personales con las
        siguientes finalidades: (a) gestión de membresías, (b) prestación de servicios, (c) envío de
        comunicaciones relacionadas con el servicio, y (d) cumplimiento de obligaciones legales.</p>
        <p>El titular de los datos podrá ejercer sus derechos de Acceso, Rectificación, Cancelación
        y Oposición (ARCO) escribiendo al correo: datos@fitevolution360.com.</p>

        <h2>2. CONSENTIMIENTO INFORMADO PARA LA PRÁCTICA DE ACTIVIDAD FÍSICA</h2>
        <p>El usuario declara bajo su propia responsabilidad que:</p>
        <ul>
          <li>Se encuentra en condiciones físicas y de salud aptas para la práctica de actividad física.</li>
          <li>No tiene contraindicaciones médicas que le impidan el uso del gimnasio.</li>
          <li>En caso de tener alguna condición médica especial, informará al personal del gimnasio antes de iniciar cualquier actividad.</li>
          <li>Ha consultado con un médico si tiene dudas sobre su capacidad para hacer ejercicio.</li>
        </ul>
        <p>FIT EVOLUTION360 no será responsable por lesiones, accidentes o condiciones de salud derivados
        del incumplimiento de esta declaración por parte del usuario.</p>

        <h2>3. REGLAMENTO INTERNO</h2>
        <p>El usuario se compromete a cumplir el reglamento interno de FIT EVOLUTION360, que incluye:</p>
        <ul>
          <li>Usar ropa y calzado deportivo apropiados.</li>
          <li>Limpiar los equipos después de usarlos.</li>
          <li>No ingresar alimentos ni bebidas alcohólicas a las instalaciones.</li>
          <li>Respetar a los demás usuarios y al personal del gimnasio.</li>
          <li>No realizar grabaciones de video o fotografías de otras personas sin su consentimiento.</li>
          <li>Registrar su ingreso en recepción en cada visita.</li>
          <li>Acatar las instrucciones del personal de entrenamiento y seguridad.</li>
        </ul>

        <h2>4. AUTORIZACIÓN PARA USO DE IMAGEN</h2>
        <p>El usuario podrá autorizar de manera opcional que FIT EVOLUTION360 use su imagen en
        fotografías y videos tomados en las instalaciones con fines promocionales en redes sociales y
        material publicitario. Esta autorización es completamente voluntaria y no afecta el acceso al
        servicio. Puede revocarse en cualquier momento escribiendo al correo indicado.</p>

        <h2>5. RESPONSABILIDAD Y LIMITACIONES</h2>
        <p>FIT EVOLUTION360 no se hace responsable por objetos personales perdidos, hurtados o dañados
        dentro de las instalaciones. Se recomienda no traer objetos de valor al gimnasio.</p>
        <p>El gimnasio se reserva el derecho de suspender o cancelar membresías por incumplimiento del
        presente reglamento, sin perjuicio de las acciones legales a que haya lugar.</p>

        <h2>6. VIGENCIA Y ACEPTACIÓN</h2>
        <p>Estos términos son válidos desde la fecha de aceptación y permanecerán vigentes durante
        toda la relación contractual con FIT EVOLUTION360. Cualquier modificación será informada con
        al menos 15 días de anticipación y requerirá nueva aceptación del usuario.</p>
        <p>Al aceptar y firmar este documento, el usuario manifiesta haber leído, comprendido y aceptado
        libremente todos los términos aquí establecidos.</p>
      `,
      contenidoHash: 'sha256:mock_hash_v1_2026',
      publicadoAt: new Date().toISOString(),
    },
  }
}

export async function getMockSessionToken(): Promise<string> {
  return crypto.randomUUID()
}
