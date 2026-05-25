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
  CC: 'Cedula de Ciudadania',
  CE: 'Cedula de Extranjeria',
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
    { label: 'Correo electronico', value: formulario.correoElectronico },
    ...(formulario.contactoEmergenciaNombre
      ? [
          {
            label: 'Contacto emergencia',
            value: `${formulario.contactoEmergenciaNombre} — ${formulario.contactoEmergenciaTelefono || ''}`,
          },
        ]
      : []),
    { label: 'Version T&C aceptada', value: `v${terminosVersion}` },
  ]

  const consentRows = [
    { label: 'Acepta T&C', value: consents.aceptaTerminos, text: consents.aceptaTerminos ? '✓ Si' : '✗ No' },
    {
      label: 'Tratamiento de datos',
      value: consents.aceptaTratamientoDatos,
      text: consents.aceptaTratamientoDatos ? '✓ Si' : '✗ No',
    },
    {
      label: 'Condicion fisica apta',
      value: consents.declaraCondicionFisica,
      text: consents.declaraCondicionFisica ? '✓ Si' : '✗ No',
    },
    {
      label: 'Uso de imagen',
      value: consents.autorizaUsoImagen,
      text: consents.autorizaUsoImagen ? '✓ Si' : '✗ No',
    },
  ]

  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Confirma tu registro</h2>
        <p className="mt-1 text-sm text-gray-400">
          Revisa tu informacion antes de enviar. Una copia llegara a tu correo.
        </p>
      </div>

      <div className="divide-y divide-dark-800 rounded-xl border border-dark-800 bg-dark-900">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3 px-4 py-3">
            <span className="shrink-0 text-xs text-gray-500">{row.label}</span>
            <span className="text-right text-xs font-medium text-white">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="divide-y divide-dark-800 rounded-xl border border-dark-800 bg-dark-900">
        {consentRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-gray-500">{row.label}</span>
            <span className={`text-xs font-bold ${row.value ? 'text-brand-400' : 'text-gray-600'}`}>
              {row.text}
            </span>
          </div>
        ))}
        {!consents.declaraCondicionFisica && consents.condicionMedicaEspecial && (
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">Condicion medica especial</p>
            <p className="mt-1 text-xs font-medium text-white">
              {consents.condicionMedicaEspecial}
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs text-gray-500">Tu firma</p>
        <div className="rounded-xl border border-dark-700 bg-white p-3">
          {firmaBase64 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firmaBase64}
              alt="Tu firma digital"
              className="mx-auto max-h-24 object-contain"
            />
          ) : (
            <p className="text-center text-xs text-gray-500">
              No se registro firma en este envio.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-xs leading-relaxed text-amber-300/80">
          ⚠️ Al confirmar, tu aceptacion quedara registrada de forma permanente junto con
          tus datos, IP, dispositivo y firma digital. Esta accion no puede deshacerse.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-dark-700 py-3.5 text-sm font-medium text-gray-400 transition-colors hover:border-dark-600 hover:text-white disabled:opacity-50"
        >
          ← Volver
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 font-bold text-dark-950 disabled:opacity-50 hover:bg-brand-400"
        >
          {isLoading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
