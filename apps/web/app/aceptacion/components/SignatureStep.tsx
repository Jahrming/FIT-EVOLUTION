'use client'

import { useRef, useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'

interface Props {
  onNext: (firmaBase64: string) => void
  onBack: () => void
}

/**
 * COMPONENTE: SignatureStep
 * Responsabilidad: Capturar la firma manuscrita del usuario.
 * Utiliza 'react-signature-canvas' montado condicionalmente solo en cliente (useEffect) 
 * para evitar crashes de SSR con la API de Canvas.
 * Soporta eventos táctiles (dedo) o cursor (mouse).
 */
export default function SignatureStep({ onNext, onBack }: Props) {
  const sigRef = useRef<SignatureCanvas | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clear = () => {
    sigRef.current?.clear()
    setIsEmpty(true)
    setError(null)
  }

  const handleBegin = () => {
    setIsEmpty(false)
    setError(null)
  }

  const handleContinue = () => {
    // Si la firma está vacía, no bloqueamos al usuario. Simplemente enviamos un string vacío.
    if (!sigRef.current || sigRef.current.isEmpty()) {
      onNext('')
      return
    }

    // toDataURL is safe here because we ensured it's not empty and initialized
    const dataUrl = sigRef.current.toDataURL('image/png')
    onNext(dataUrl)
  }

  return (
    <div className="animate-slide-up space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Firma digital</h2>
        <p className="text-gray-400 text-sm mt-1">
          Dibuja tu firma en el recuadro a continuación usando tu dedo o cursor.
        </p>
      </div>

      {/* Instruction */}
      <div className="flex items-center gap-2 bg-dark-900 rounded-xl p-3 border border-dark-800">
        <span className="text-xl">✍️</span>
        <p className="text-xs text-gray-400">
          Tu firma es evidencia de tu aceptación. Debe ser similar a la que usas habitualmente.
        </p>
      </div>

      {/* Canvas area */}
      <div className="relative">
        {!mounted ? (
          <div className="h-[180px] w-full bg-dark-800 rounded-xl animate-pulse" />
        ) : (
          <div
            className={`signature-canvas-wrapper rounded-xl overflow-hidden border-2 transition-colors ${
              error ? 'border-red-500' : isEmpty ? 'border-dashed border-dark-700' : 'border-brand-500/50'
            } bg-white`}
          >
            <SignatureCanvas
              ref={sigRef}
              onBegin={handleBegin}
              penColor="#000000"
              backgroundColor="rgba(255,255,255,1)"
              canvasProps={{
                className: 'w-full',
                style: { height: '180px', width: '100%', touchAction: 'none' },
              }}
            />
          </div>
        )}

        {/* Placeholder text when empty */}
        {isEmpty && mounted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-gray-300 text-sm font-medium opacity-60">
              Firma aquí ↓
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}

      {/* Clear button */}
      <button
        type="button"
        onClick={clear}
        disabled={!mounted}
        className="w-full py-2.5 text-gray-500 hover:text-gray-300 text-sm disabled:opacity-50
                   border border-dark-800 rounded-xl transition-colors hover:border-dark-700"
      >
        🗑️ Limpiar firma
      </button>

      {/* Legal note */}
      <p className="text-[11px] text-gray-600 text-center leading-relaxed">
        Al firmar aceptas los términos y condiciones leídos anteriormente.
        Esta firma quedará registrada junto con la fecha, hora e IP de tu dispositivo
        como evidencia de tu consentimiento.
      </p>

      {/* Buttons */}
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
          onClick={handleContinue}
          className="flex-grow py-3.5 bg-brand-500 hover:bg-brand-400
                     text-dark-950 font-bold rounded-xl transition-all active:scale-[0.98]"
        >
          Continuar →
        </button>
      </div>
    </div>
  )
}
