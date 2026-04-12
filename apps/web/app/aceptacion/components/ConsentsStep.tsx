'use client'

import { useState } from 'react'
import clsx from 'clsx'

export interface Consents {
  aceptaTerminos: boolean
  aceptaTratamientoDatos: boolean
  declaraCondicionFisica: boolean
  autorizaUsoImagen: boolean
}

interface Props {
  onNext: (consents: Consents) => void
  onBack: () => void
}

interface ConsentItem {
  key: keyof Consents
  label: string
  description: string
  required: boolean
  icon: string
}

/**
 * DEFINICIÓN DE CONSENTIMIENTOS
 * Esta lista rige las casillas de verificación en la UI.
 * Si 'required' es true, el usuario no puede avanzar sin marcarla.
 */
const CONSENT_ITEMS: ConsentItem[] = [
  {
    key: 'aceptaTerminos',
    label: 'Acepto los Términos y Condiciones',
    description:
      'Acepto expresamente los términos y condiciones de ingreso y participación en FIT EVOLUTION360, incluyendo el reglamento interno.',
    required: true,
    icon: '📄',
  },
  {
    key: 'aceptaTratamientoDatos',
    label: 'Autorizo el tratamiento de mis datos personales',
    description:
      'Autorizo a FIT EVOLUTION360 para recolectar, almacenar, usar y gestionar mis datos personales de acuerdo con la Ley 1581 de 2012 y su Política de Tratamiento de Datos.',
    required: true,
    icon: '🔒',
  },
  {
    key: 'declaraCondicionFisica',
    label: 'Declaro estar en condición física apta',
    description:
      'Declaro bajo mi responsabilidad que me encuentro en condiciones físicas y de salud aptas para la práctica de actividad física, sin contraindicaciones médicas. En caso contrario, informaré al personal del gimnasio.',
    required: true,
    icon: '💪',
  },
  {
    key: 'autorizaUsoImagen',
    label: 'Autorizo el uso de mi imagen',
    description:
      'Autorizo voluntariamente el uso de mi imagen en fotografías y videos tomados en las instalaciones del gimnasio para fines promocionales en redes sociales y material publicitario. Puedo revocar esta autorización en cualquier momento.',
    required: true,
    icon: '📸',
  },
]

/**
 * COMPONENTE: ConsentsStep
 * Responsabilidad: Mostrar y validar las autorizaciones legales.
 * Bloquea el botón "Continuar" hasta que todos los items con `required: true` sean aceptados.
 */
export default function ConsentsStep({ onNext, onBack }: Props) {
  const [consents, setConsents] = useState<Consents>({
    aceptaTerminos: false,
    aceptaTratamientoDatos: false,
    declaraCondicionFisica: false,
    autorizaUsoImagen: false,
  })

  const allRequired = CONSENT_ITEMS.filter((i) => i.required).every(
    (i) => consents[i.key]
  )

  const toggle = (key: keyof Consents) =>
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Consentimientos</h2>
        <p className="text-gray-400 text-sm mt-1">
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
              'w-full text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.99]',
              consents[item.key]
                ? 'bg-brand-500/10 border-brand-500/40'
                : 'bg-dark-900 border-dark-800 hover:border-dark-700'
            )}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox visual */}
              <div
                className={clsx(
                  'mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all',
                  consents[item.key]
                    ? 'bg-brand-500 border-brand-500'
                    : 'border-gray-600'
                )}
              >
                {consents[item.key] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white">
                    {item.icon} {item.label}
                  </span>
                  {item.required && <span className="text-red-400 text-xs">*</span>}
                  {!item.required && (
                    <span className="text-[10px] text-gray-500 bg-dark-800 px-1.5 py-0.5 rounded">
                      Opcional
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!allRequired && (
        <p className="text-xs text-red-400 text-center">
          Debes aceptar los consentimientos obligatorios para continuar.
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 border border-dark-700 text-gray-400 hover:text-white
                     hover:border-dark-600 rounded-xl text-sm font-medium transition-colors"
        >
          ← Atrás
        </button>
        <button
          type="button"
          onClick={() => allRequired && onNext(consents)}
          disabled={!allRequired}
          className="flex-grow py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-40
                     disabled:cursor-not-allowed text-dark-950 font-bold rounded-xl
                     transition-all active:scale-[0.98]"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
