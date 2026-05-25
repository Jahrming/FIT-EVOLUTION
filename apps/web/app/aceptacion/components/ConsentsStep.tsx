'use client'

import { useState } from 'react'
import clsx from 'clsx'

export interface Consents {
  aceptaTerminos: boolean
  aceptaTratamientoDatos: boolean
  declaraCondicionFisica: boolean
  autorizaUsoImagen: boolean
  condicionMedicaEspecial: string
}

interface Props {
  defaultValues?: Consents
  onNext: (consents: Consents) => void
  onBack: () => void
}

interface ConsentItem {
  key: 'aceptaTerminos' | 'aceptaTratamientoDatos' | 'declaraCondicionFisica' | 'autorizaUsoImagen'
  label: string
  description: string
  required: boolean
  icon: string
}

const CONSENT_ITEMS: ConsentItem[] = [
  {
    key: 'aceptaTerminos',
    label: 'Acepto los Terminos y Condiciones',
    description:
      'Acepto expresamente los terminos y condiciones de ingreso y participacion en FIT EVOLUTION360, incluyendo el reglamento interno.',
    required: true,
    icon: '📄',
  },
  {
    key: 'aceptaTratamientoDatos',
    label: 'Autorizo el tratamiento de mis datos personales',
    description:
      'Autorizo a FIT EVOLUTION360 para recolectar, almacenar, usar y gestionar mis datos personales de acuerdo con la Ley 1581 de 2012 y su Politica de Tratamiento de Datos.',
    required: true,
    icon: '🔒',
  },
  {
    key: 'declaraCondicionFisica',
    label: 'Declaro estar en condicion fisica apta',
    description:
      'Declaro bajo mi responsabilidad que me encuentro en condiciones fisicas y de salud aptas para la practica de actividad fisica, sin contraindicaciones medicas. En caso contrario, informare al personal del gimnasio.',
    required: false,
    icon: '💪',
  },
  {
    key: 'autorizaUsoImagen',
    label: 'Autorizo el uso de mi imagen',
    description:
      'Autorizo voluntariamente el uso de mi imagen en fotografias y videos tomados en las instalaciones del gimnasio para fines promocionales en redes sociales y material publicitario. Puedo revocar esta autorizacion en cualquier momento.',
    required: false,
    icon: '📸',
  },
]

export default function ConsentsStep({ defaultValues, onNext, onBack }: Props) {
  const [consents, setConsents] = useState<Consents>({
    aceptaTerminos: defaultValues?.aceptaTerminos ?? false,
    aceptaTratamientoDatos: defaultValues?.aceptaTratamientoDatos ?? false,
    declaraCondicionFisica: defaultValues?.declaraCondicionFisica ?? false,
    autorizaUsoImagen: defaultValues?.autorizaUsoImagen ?? false,
    condicionMedicaEspecial: defaultValues?.condicionMedicaEspecial ?? '',
  })
  const [showPopup, setShowPopup] = useState(false)
  const [showMedicalError, setShowMedicalError] = useState(false)

  const allRequired = CONSENT_ITEMS.filter((item) => item.required).every(
    (item) => consents[item.key]
  )
  const trimmedMedicalCondition = consents.condicionMedicaEspecial.trim()
  const medicalConditionRequired = !consents.declaraCondicionFisica
  const hasValidMedicalCondition =
    consents.declaraCondicionFisica || trimmedMedicalCondition.length >= 3

  const toggle = (key: ConsentItem['key']) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))

    if (key === 'declaraCondicionFisica') {
      setShowMedicalError(false)
    }
  }

  const handleContinueClick = () => {
    if (!allRequired) return

    if (!hasValidMedicalCondition) {
      setShowMedicalError(true)
      return
    }

    setShowMedicalError(false)
    setShowPopup(true)
  }

  const handleConfirmContinue = () => {
    onNext({
      ...consents,
      condicionMedicaEspecial: consents.declaraCondicionFisica
        ? ''
        : trimmedMedicalCondition,
    })
    setShowPopup(false)
  }

  return (
    <>
      <div className="animate-slide-up space-y-5">
        <div>
          <h2 className="text-xl font-bold text-white">Consentimientos</h2>
          <p className="mt-1 text-sm text-gray-400">
            Lee y marca cada consentimiento. Los marcados con{' '}
            <span className="text-red-400">*</span> son obligatorios.
          </p>
        </div>

        <div className="space-y-3">
          {CONSENT_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              className={clsx(
                'w-full rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99]',
                consents[item.key]
                  ? 'border-brand-500/40 bg-brand-500/10'
                  : 'border-dark-800 bg-dark-900 hover:border-dark-700'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
                    consents[item.key]
                      ? 'border-brand-500 bg-brand-500'
                      : 'border-gray-600'
                  )}
                >
                  {consents[item.key] && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {item.icon} {item.label}
                    </span>
                    {item.required ? (
                      <span className="text-xs text-red-400">*</span>
                    ) : (
                      <span className="rounded bg-dark-800 px-1.5 py-0.5 text-[10px] text-gray-500">
                        Opcional
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {medicalConditionRequired && (
          <div className="space-y-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <label
              htmlFor="condicionMedicaEspecial"
              className="block text-sm font-semibold text-white"
            >
              Describe tu condicion medica especial{' '}
              <span className="text-red-400">*</span>
            </label>
            <textarea
              id="condicionMedicaEspecial"
              value={consents.condicionMedicaEspecial}
              onChange={(event) => {
                const value = event.target.value
                setConsents((prev) => ({ ...prev, condicionMedicaEspecial: value }))
                if (value.trim().length >= 3) {
                  setShowMedicalError(false)
                }
              }}
              rows={4}
              placeholder="Ejemplo: lesion de rodilla, hipertension, restriccion medica, embarazo, etc."
              className="w-full rounded-xl border border-dark-700 bg-dark-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-gray-500 focus:border-brand-500"
            />
            <p className="text-xs text-gray-400">
              Este campo es obligatorio solo si no declaras estar en condicion fisica apta.
            </p>
            {showMedicalError && (
              <p className="text-xs text-red-400">
                Debes describir la condicion medica especial para continuar.
              </p>
            )}
          </div>
        )}

        {!allRequired && (
          <p className="text-center text-xs text-red-400">
            Debes aceptar los consentimientos obligatorios para continuar.
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-dark-700 py-3.5 text-sm font-medium text-gray-400 transition-colors hover:border-dark-600 hover:text-white"
          >
            ← Atras
          </button>
          <button
            type="button"
            onClick={handleContinueClick}
            disabled={!allRequired}
            className="flex-grow rounded-xl bg-brand-500 py-3.5 font-bold text-dark-950 transition-all hover:bg-brand-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar →
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-dark-700 bg-dark-900 p-6 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Confirma esta informacion</h3>
              <p className="text-sm text-gray-400">
                Revisa los consentimientos antes de continuar a la firma.
              </p>
            </div>

            <div className="mt-5 space-y-3 rounded-xl border border-dark-800 bg-dark-950 p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Terminos y condiciones</span>
                <span className={consents.aceptaTerminos ? 'font-semibold text-brand-400' : 'text-gray-500'}>
                  {consents.aceptaTerminos ? 'Si' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Tratamiento de datos</span>
                <span className={consents.aceptaTratamientoDatos ? 'font-semibold text-brand-400' : 'text-gray-500'}>
                  {consents.aceptaTratamientoDatos ? 'Si' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Condicion fisica apta</span>
                <span className={consents.declaraCondicionFisica ? 'font-semibold text-brand-400' : 'font-semibold text-amber-300'}>
                  {consents.declaraCondicionFisica ? 'Si' : 'No'}
                </span>
              </div>
              {!consents.declaraCondicionFisica && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                    Condicion medica especial
                  </p>
                  <p className="mt-1 text-sm text-white">{trimmedMedicalCondition}</p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-gray-400">Uso de imagen</span>
                <span className={consents.autorizaUsoImagen ? 'font-semibold text-brand-400' : 'text-gray-500'}>
                  {consents.autorizaUsoImagen ? 'Autorizado' : 'No autorizado'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="flex-1 rounded-xl border border-dark-700 py-3 text-sm font-medium text-gray-300 transition-colors hover:border-dark-600 hover:text-white"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={handleConfirmContinue}
                className="flex-1 rounded-xl bg-brand-500 py-3 text-sm font-bold text-dark-950 transition-colors hover:bg-brand-400"
              >
                Confirmar y continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
