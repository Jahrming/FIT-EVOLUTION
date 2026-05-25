import { z } from 'zod'

import { formularioSchema } from '@/lib/schemas'

export const createAceptacionSchema = z.object({
  sedeId: z.string().min(1),
  terminosVersionId: z.string().min(1),
  formulario: formularioSchema,
  firmaBase64: z.string().optional().default(''),
  sessionToken: z.string().min(1),
  aceptaTerminos: z.boolean(),
  aceptaTratamientoDatos: z.boolean(),
  declaraCondicionFisica: z.boolean(),
  autorizaUsoImagen: z.boolean(),
  condicionMedicaEspecial: z.string().max(500).optional(),
})

export type CreateAceptacionInput = z.infer<typeof createAceptacionSchema>
