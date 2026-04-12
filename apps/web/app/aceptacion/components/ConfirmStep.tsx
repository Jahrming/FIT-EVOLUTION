'use client'

import type { FormularioValues } from '@/lib/schemas'
import type { Consents } from './ConsentsStep'

interface Props {
  formulario: FormularioValues
  consents: Consents
  firmaBase64: string
  terminosVersion: number
  onConfirm: () => void
  onBack: () => void
  isLoading: boolean
}

const TIPO_LABEL: Record<string, string> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  PA: 'Pasaporte',
  TI: 'Tarjeta de Identidad',
}

export default function ConfirmStep({
  formulario,
  consents,
  firmaBase64,
  terminosVersion,
  onConfirm,
  onBack,
  isLoading,
}: Props) {
  const rows: { label: string; value: string }[] = [
    { label: 'Nombre completo', value: formulario.nombreCompleto },
    {
      label: 'Documento',
      value: `${TIPO_LABEL[formulario.tipoDocumento] ?? formulario.tipoDocumento} — ${formulario.numeroDocumento}`,
    },
    {
      label: 'Fecha de nacimiento',
      value: new Date(formulario.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    },
    { label: 'Celular', value: formulario.telefono },
    { label: 'Correo electrónico', value: formulario.correoElectronico },
    ...(formulario.contactoEmergenciaNombre
      ? [{ label: 'Contacto emergencia', value: `${formulario.contactoEmergenciaNombre} — ${formulario.contactoEmergenciaTelefono || ''}` }]
      : []),
    { label: 'Versión T&C aceptada', value: `v${terminosVersion}` },
  ]

  const consentRows = [
    { label: 'Acepta T&C', value: consents.aceptaTerminos },
    { label: 'Tratamiento de datos', value: consents.aceptaTratamientoDatos },
    { label: 'Condición física apta', value: consents.declaraCondicionFisica },
    { label: 'Uso de imagen', value: consents.autorizaUsoImagen },
  ]

  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Confirma tu registro</h2>
        <p className="text-gray-400 text-sm mt-1">
          Revisa tu información antes de enviar. Una copia llegará a tu correo.
        </p>
      </div>

      {/* Data summary */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 divide-y divide-dark-800">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3 px-4 py-3">
            <span className="text-xs text-gray-500 shrink-0">{row.label}</span>
            <span className="text-xs text-white text-right font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Consents summary */}
      <div className="bg-dark-900 rounded-xl border border-dark-800 divide-y divide-dark-800">
        {consentRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-gray-500">{row.label}</span>
            <span className={`text-xs font-bold ${row.value ? 'text-brand-400' : 'text-gray-600'}`}>
              {row.value ? '✓ Sí' : '✗ No'}
            </span>
          </div>
        ))}
      </div>

      {/* Signature preview */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Tu firma</p>
        <div className="bg-white rounded-xl p-3 border border-dark-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firmaBase64}
            alt="Tu firma digital"
            className="max-h-24 mx-auto object-contain"
          />
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
        <p className="text-xs text-amber-300/80 leading-relaxed">
          ⚠️ Al confirmar, tu aceptación quedará registrada de forma permanente junto con
          tus datos, IP, dispositivo y firma digital. Esta acción no puede deshacerse.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3.5 border border-dark-700 text-gray-400 hover:text-white
                     hover:border-dark-600 rounded-xl text-sm font-medium transition-colors
                     disabled:opacity-50"
        >
          ← Volver
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-grow py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-50
                     text-dark-950 font-bold rounded-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : (
            '✅ Confirmar y enviar'
          )}
        </button>
      </div>
    </div>
  )
}
