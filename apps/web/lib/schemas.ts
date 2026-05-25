import { z } from 'zod'

// ============================================================
// Esquema de formulario de aceptación
// ============================================================

export const formularioSchema = z
  .object({
    nombreCompleto: z
      .string()
      .min(5, 'Mínimo 5 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/, 'Solo letras y espacios'),

    tipoDocumento: z.enum(['CC', 'CE', 'PA', 'TI'], {
      errorMap: () => ({ message: 'Selecciona un tipo de documento' }),
    }),

    numeroDocumento: z
      .string()
      .regex(/^\d{5,12}$/, 'Debe tener entre 5 y 12 dígitos numéricos'),

    fechaNacimiento: z
      .string()
      .min(1, 'La fecha de nacimiento es requerida')
      .refine((val) => {
        if (!val) return false
        const dob = new Date(val)
        const today = new Date()
        const age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        const adjustedAge =
          monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())
            ? age - 1
            : age
        return adjustedAge >= 16
      }, 'Debes tener al menos 16 años para registrarte'),

    telefono: z
      .string()
      .regex(/^\d{10}$/, 'Ingresa un número celular de 10 dígitos'),

    correoElectronico: z.string().email('Correo electrónico inválido').toLowerCase(),

    correoConfirmar: z.string().email('Correo electrónico inválido').toLowerCase(),

    contactoEmergenciaNombre: z.string().optional(),
    contactoEmergenciaTelefono: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{10}$/.test(val),
        'El teléfono de emergencia debe tener 10 dígitos'
      ),
  })
  .refine((data) => data.correoElectronico === data.correoConfirmar, {
    message: 'Los correos no coinciden',
    path: ['correoConfirmar'],
  })

export type FormularioValues = z.infer<typeof formularioSchema>

// ============================================================
// Tipos compartidos
// ============================================================

export interface SedeInfo {
  id: string
  slug: string
  nombre: string
  ciudad: string
  direccion?: string
  terminosActivos: {
    id: string
    numeroVersion: number
    contenidoHtml: string
    contenidoHash: string
    publicadoAt: string
  } | null
}

export interface AceptacionPayload {
  sedeId: string
  terminosVersionId: string
  formulario: FormularioValues
  firmaBase64: string
  sessionToken: string
  // Consentimientos adicionales (se pasan por separado del formulario)
  aceptaTerminos: boolean
  aceptaTratamientoDatos: boolean
  declaraCondicionFisica: boolean
  autorizaUsoImagen: boolean
  condicionMedicaEspecial?: string
}

export interface AceptacionResponse {
  transactionId: string
  mensaje: string
  correoEnviado: boolean
}
