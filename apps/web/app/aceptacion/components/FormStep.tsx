'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formularioSchema, type FormularioValues } from '@/lib/schemas'
import clsx from 'clsx'

interface Props {
  defaultValues?: Partial<FormularioValues>
  onNext: (data: FormularioValues) => void
  onBack: () => void
}

const TIPO_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
] as const

/**
 * COMPONENTE: FormStep
 * Responsabilidad: Recopilar los datos básicos del usuario con validación estricta Zod antes de crear la transacción.
 * Responsividad: Utiliza 'grid-cols-1 sm:grid-cols-2' para acoplarse mejor a pantallas de tamaños pequeños, y 'flex-col sm:flex-row' en los botones.
 */
export default function FormStep({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormularioValues>({
    resolver: zodResolver(formularioSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Tus datos personales</h2>
        <p className="text-gray-400 text-sm mt-1">
          Todos los campos con <span className="text-red-400">*</span> son obligatorios.
        </p>
      </div>

      {/* Nombre completo */}
      <div>
        <label className="form-label">
          Nombre completo <span className="text-red-400">*</span>
        </label>
        <input
          {...register('nombreCompleto')}
          type="text"
          placeholder="Ej. Juan Carlos Pérez López"
          autoComplete="name"
          className={clsx('form-input', errors.nombreCompleto && 'form-input-error')}
        />
        {errors.nombreCompleto && (
          <p className="form-error">{errors.nombreCompleto.message}</p>
        )}
      </div>

      {/* 
        Fila de Tipo y Número de documento 
        Se ajusta de 1 columna en móvil a 5 columnas en pantallas superiores (sm:grid-cols-5)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div className="sm:col-span-2">
          <label className="form-label">
            Tipo <span className="text-red-400">*</span>
          </label>
          <select
            {...register('tipoDocumento')}
            className={clsx('form-input', errors.tipoDocumento && 'form-input-error')}
          >
            <option value="">Tipo</option>
            {TIPO_DOCUMENTO.map((t) => (
              <option key={t.value} value={t.value}>
                {t.value}
              </option>
            ))}
          </select>
          {errors.tipoDocumento && (
            <p className="form-error">{errors.tipoDocumento.message}</p>
          )}
        </div>
        <div className="sm:col-span-3">
          <label className="form-label">
            Número <span className="text-red-400">*</span>
          </label>
          <input
            {...register('numeroDocumento')}
            type="tel"
            inputMode="numeric"
            placeholder="1020304050"
            autoComplete="off"
            className={clsx('form-input', errors.numeroDocumento && 'form-input-error')}
          />
          {errors.numeroDocumento && (
            <p className="form-error">{errors.numeroDocumento.message}</p>
          )}
        </div>
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label className="form-label">
          Fecha de nacimiento <span className="text-red-400">*</span>
        </label>
        <input
          {...register('fechaNacimiento')}
          type="date"
          max={new Date(Date.now() - 16 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          className={clsx('form-input', errors.fechaNacimiento && 'form-input-error')}
        />
        {errors.fechaNacimiento && (
          <p className="form-error">{errors.fechaNacimiento.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="form-label">
          Celular <span className="text-red-400">*</span>
        </label>
        <input
          {...register('telefono')}
          type="tel"
          inputMode="numeric"
          placeholder="3001234567"
          maxLength={10}
          autoComplete="tel"
          className={clsx('form-input', errors.telefono && 'form-input-error')}
        />
        {errors.telefono && (
          <p className="form-error">{errors.telefono.message}</p>
        )}
      </div>

      {/* Correo */}
      <div>
        <label className="form-label">
          Correo electrónico <span className="text-red-400">*</span>
        </label>
        <input
          {...register('correoElectronico')}
          type="email"
          inputMode="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          className={clsx('form-input', errors.correoElectronico && 'form-input-error')}
        />
        {errors.correoElectronico && (
          <p className="form-error">{errors.correoElectronico.message}</p>
        )}
      </div>

      {/* Confirmar correo */}
      <div>
        <label className="form-label">
          Confirmar correo <span className="text-red-400">*</span>
        </label>
        <input
          {...register('correoConfirmar')}
          type="email"
          inputMode="email"
          placeholder="Repite tu correo"
          autoComplete="off"
          onPaste={(e) => e.preventDefault()}
          className={clsx('form-input', errors.correoConfirmar && 'form-input-error')}
        />
        {errors.correoConfirmar && (
          <p className="form-error">{errors.correoConfirmar.message}</p>
        )}
      </div>

      {/* Contacto de emergencia */}
      <div className="pt-2 border-t border-dark-800">
        <p className="text-xs text-gray-500 mb-4">
          Contacto de emergencia <span className="text-gray-600">(opcional pero recomendado)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="form-label">Nombre</label>
            <input
              {...register('contactoEmergenciaNombre')}
              type="text"
              placeholder="Nombre completo"
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label">Celular</label>
            <input
              {...register('contactoEmergenciaTelefono')}
              type="tel"
              inputMode="numeric"
              placeholder="3001234567"
              maxLength={10}
              className={clsx('form-input', errors.contactoEmergenciaTelefono && 'form-input-error')}
            />
            {errors.contactoEmergenciaTelefono && (
              <p className="form-error">{errors.contactoEmergenciaTelefono.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 
        Botones de navegación 
        Se amoldan al ancho disponible con flex
      */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 border border-dark-700 text-gray-400 hover:text-white
                     hover:border-dark-600 rounded-xl text-sm font-medium transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-2 flex-grow py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50
                     text-dark-950 font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          Continuar →
        </button>
      </div>
    </form>
  )
}
