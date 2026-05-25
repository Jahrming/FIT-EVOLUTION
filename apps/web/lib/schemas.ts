import { z } from 'zod'

export const formularioSchema = z
  .object({
    nombreCompleto: z
      .string()
      .min(5, 'Minimo 5 caracteres')
      .max(100, 'Maximo 100 caracteres')
      .regex(/^[\p{L}\s]+$/u, 'Solo letras y espacios'),

    tipoDocumento: z.enum(['CC', 'CE', 'PA', 'TI'], {
      errorMap: () => ({ message: 'Selecciona un tipo de documento' }),
    }),

    numeroDocumento: z
      .string()
      .regex(/^\d{5,12}$/, 'Debe tener entre 5 y 12 digitos numericos'),

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

        return adjustedAge >= 13
      }, 'Debes tener al menos 13 anos para registrarte'),

    telefono: z
      .string()
      .regex(/^\d{10}$/, 'Ingresa un numero celular de 10 digitos'),

    correoElectronico: z.string().email('Correo electronico invalido').toLowerCase(),

    correoConfirmar: z.string().email('Correo electronico invalido').toLowerCase(),

    contactoEmergenciaNombre: z.string().optional(),
    contactoEmergenciaTelefono: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{10}$/.test(val),
        'El telefono de emergencia debe tener 10 digitos',
      ),
  })
  .refine((data) => data.correoElectronico === data.correoConfirmar, {
    message: 'Los correos no coinciden',
    path: ['correoConfirmar'],
  })

export type FormularioValues = z.infer<typeof formularioSchema>

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
