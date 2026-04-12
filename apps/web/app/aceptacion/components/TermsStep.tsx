'use client'

import { useRef, useState, useEffect } from 'react'

interface Props {
  contenidoHtml: string
  numeroVersion: number
  onNext: () => void
  onBack: () => void
}

/**
 * COMPONENTE: TermsStep
 * Responsabilidad: Muestra la versión HTML de los T&C para su lectura.
 * Funcionalidad legal clave: Rastrea el evento 'scroll' del contenedor. 
 * El botón "Aceptar" se desbloquea ÚNICAMENTE cuando el usuario llega al final del documento, proveendo evidencia de lectura.
 */
export default function TermsStep({ contenidoHtml, numeroVersion, onNext, onBack }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      // True when the user has scrolled within 40px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 40) {
        setHasScrolled(true)
      }
    }

    el.addEventListener('scroll', handleScroll)
    // If content fits without scrolling, allow immediately
    if (el.scrollHeight <= el.clientHeight + 40) setHasScrolled(true)

    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="animate-slide-up space-y-5 flex flex-col h-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Términos y Condiciones</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                           bg-brand-500/10 text-brand-400 border border-brand-500/20">
            Versión {numeroVersion}
          </span>
          <span className="text-xs text-gray-500">
            Lee el documento completo para continuar
          </span>
        </div>
      </div>

      {/* Terms content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-dark-900 border border-dark-800 rounded-xl p-5
                   max-h-[55vh] min-h-[300px] scroll-smooth"
      >
        <div
          className="terms-content"
          dangerouslySetInnerHTML={{ __html: contenidoHtml }}
        />
        <div className="h-8" /> {/* bottom padding for scroll indicator */}
      </div>

      {/* Scroll hint */}
      {!hasScrolled && (
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 animate-bounce">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Desplázate hasta el final para continuar
        </div>
      )}

      {/* Read confirmation */}
      {hasScrolled && (
        <div className="flex items-start gap-3 bg-brand-500/5 border border-brand-500/20 rounded-xl p-4 animate-fade-in">
          <svg className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-300">
            Has leído el documento completo. Puedes continuar con la aceptación.
          </p>
        </div>
      )}

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
          onClick={onNext}
          disabled={!hasScrolled}
          className="flex-grow py-3.5 bg-brand-500 hover:bg-brand-400 disabled:opacity-40
                     disabled:cursor-not-allowed text-dark-950 font-bold rounded-xl
                     transition-all active:scale-[0.98]"
        >
          Aceptar y continuar →
        </button>
      </div>
    </div>
  )
}
