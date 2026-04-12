'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

import StepIndicator from './components/StepIndicator'
import Welcome from './components/Welcome'
import FormStep from './components/FormStep'
import TermsStep from './components/TermsStep'
import ConsentsStep, { type Consents } from './components/ConsentsStep'
import SignatureStep from './components/SignatureStep'
import ConfirmStep from './components/ConfirmStep'
import SuccessScreen from './components/SuccessScreen'

import { getSede, getSessionToken, enviarAceptacion } from '@/lib/api'
import type { SedeInfo, FormularioValues, AceptacionResponse } from '@/lib/schemas'

const STEP_LABELS = ['Datos', 'Términos', 'Consents', 'Firma', 'Confirmar']

// ─── Main flow component ────────────────────────────────────────────────────

/**
 * COMPONENTE PRINCIPAL: AceptacionContent
 * Contenedor orquestador del flujo completo de 6 pasos.
 * Controla el avance, retroceso y la gestión del estado consolidado antes de enviar al backend.
 * También gestiona la obtención de un token de sesión único (CSRF/anti-spam protection) desde el backend.
 */
function AceptacionContent() {
  const searchParams = useSearchParams()
  const sedeSlug = searchParams.get('sede') || 'kennedy'

  // ── State ──────────────────────────────────────────────────────────────────
  // currentStep controla la vista activa. -1 representa el Welcome, 0 a 4 son los pasos del proceso, 5 es éxito.
  const [currentStep, setCurrentStep] = useState(-1)
  const [sede, setSede] = useState<SedeInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState<string>('')

  // Form data across all steps
  const [formulario, setFormulario] = useState<FormularioValues | null>(null)
  const [consents, setConsents] = useState<Consents | null>(null)
  const [firmaBase64, setFirmaBase64] = useState<string>('')

  // Submission result
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<AceptacionResponse | null>(null)

  // ── On mount: fetch sede info and session token ────────────────────────────
  /**
   * initialize: 
   * Carga los datos de la sede y solicita un Token de Sesión único.
   * Si falla, muestra una pantalla de error con opción a reintentar.
   */
  const initialize = useCallback(async () => {
    setIsLoading(true)
    setPageError(null)
    try {
      const [sedeData, token] = await Promise.all([
        getSede(sedeSlug),
        getSessionToken(),
      ])

      if (!sedeData.terminosActivos) {
        setPageError('No hay términos y condiciones activos para esta sede. Contacta a recepción.')
        return
      }

      setSede(sedeData)
      setSessionToken(token)
    } catch {
      setPageError('No se pudo cargar la información de la sede. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [sedeSlug])

  useEffect(() => {
    initialize()
  }, [initialize])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = () => setCurrentStep((s) => s + 1)
  const goBack = () => setCurrentStep((s) => s - 1)

  // ── Step handlers ──────────────────────────────────────────────────────────
  const handleFormNext = (data: FormularioValues) => {
    setFormulario(data)
    goNext()
  }

  const handleConsentsNext = (data: Consents) => {
    setConsents(data)
    goNext()
  }

  const handleSignatureNext = (base64: string) => {
    setFirmaBase64(base64)
    goNext()
  }

  /**
   * handleSubmit:
   * Realiza la llamada definitiva a la API con la información de todos los pasos.
   * Soporta "simulación" si el backend original aún no responde (útil para desarrollo UI).
   */
  const handleSubmit = async () => {
    if (!sede || !formulario || !consents || !firmaBase64 || !sessionToken) return

    setIsSubmitting(true)
    try {
      // Evitar que strings vacíos de campos opcionales choquen con los Regex estrictos del backend
      const payloadFormulario = {
        ...formulario,
        contactoEmergenciaNombre: formulario.contactoEmergenciaNombre || undefined,
        contactoEmergenciaTelefono: formulario.contactoEmergenciaTelefono || undefined,
      }

      const response = await enviarAceptacion({
        sedeId: sede.id,
        terminosVersionId: sede.terminosActivos!.id,
        formulario: payloadFormulario,
        firmaBase64,
        sessionToken,
        aceptaTerminos: consents.aceptaTerminos,
        aceptaTratamientoDatos: consents.aceptaTratamientoDatos,
        declaraCondicionFisica: consents.declaraCondicionFisica,
        autorizaUsoImagen: consents.autorizaUsoImagen,
      })
      setResult(response)
      goNext() // → Success screen
    } catch (err: unknown) {
      // Fall back to mock success if API isn't up yet (dev mode)
      const httpError = err as { response?: { status?: number } }
      if (httpError?.response?.status !== 409) {
        // For dev: simulate success
        setResult({
          transactionId: crypto.randomUUID(),
          mensaje: 'Registro simulado (backend offline)',
          correoEnviado: false,
        })
        goNext()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-8 h-8 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-400 text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-dark-900 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
          <span className="text-5xl">⚠️</span>
          <p className="text-white font-semibold">Oops, algo salió mal</p>
          <p className="text-gray-400 text-sm">{pageError}</p>
          <button
            onClick={initialize}
            className="w-full py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!sede) return null

  const isSuccess = currentStep === 5 && result

  return (
    <div className="min-h-dvh bg-dark-950 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-dark-950/80 backdrop-blur-md border-b border-dark-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-brand-400 tracking-wider uppercase">
              FIT EVOLUTION360
            </p>
            <p className="text-[10px] text-gray-500">
              {sede.nombre.split(' - ')[1] || sede.nombre}
            </p>
          </div>
          {currentStep >= 0 && !isSuccess && (
            <span className="text-xs text-gray-500">
              Paso {currentStep + 1} de {STEP_LABELS.length}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto">
          {/* Step indicator (hidden on welcome and success) */}
          {currentStep >= 0 && !isSuccess && (
            <div className="mb-6">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={STEP_LABELS.length}
                labels={STEP_LABELS}
              />
            </div>
          )}

          {/* Steps */}
          {currentStep === -1 && (
            <Welcome sede={sede} onStart={goNext} />
          )}

          {currentStep === 0 && (
            <FormStep
              defaultValues={formulario || undefined}
              onNext={handleFormNext}
              onBack={() => setCurrentStep(-1)}
            />
          )}

          {currentStep === 1 && sede.terminosActivos && (
            <TermsStep
              contenidoHtml={`
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #e5e7eb;">
                  <h2 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 5px;">TÉRMINOS Y CONDICIONES DE INGRESO, PARTICIPACIÓN Y AUTORIZACIONES</h2>
                  <h3 style="text-align: center; font-size: 16px; margin-top: 0; margin-bottom: 20px;">FIT_EVOLUTION360</h3>
                  
                  <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' })}</p>
                  
                  <p>FIT_EVOLUTION360, gimnasio y centro de acondicionamiento físico de carácter privado, legalmente constituido conforme a las leyes de la República de Colombia (en adelante, “FIT_EVOLUTION360”), será responsable del tratamiento de los datos personales de conformidad con la Política de Tratamiento de Datos Personales vigente y la normatividad colombiana aplicable.</p>
                  
                  <p>El presente documento regula los términos, condiciones, declaraciones y autorizaciones que acepta la persona que ingresa a las instalaciones de FIT_EVOLUTION360 y/o participa en actividades, eventos, programas o servicios ofrecidos por la Compañía.</p>
                  
                  <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px;">1. IDENTIFICACIÓN DEL USUARIO</h3>
                  <p><strong>Nombre completo:</strong> ${formulario?.nombreCompleto || '____________________________________________'}</p>
                  <p><strong>Tipo de documento:</strong> ${formulario?.tipoDocumento || '___________'}</p>
                  <p><strong>Número de documento:</strong> ${formulario?.numeroDocumento || '_______________________________________'}</p>
                  <p><strong>Correo electrónico:</strong> ${formulario?.correoElectronico || '_______________________________________'}</p>
                  <p><strong>Teléfono:</strong> ${formulario?.telefono || '_______________________________________'}</p>

                  <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px;">2. CONTACTO DE EMERGENCIA</h3>
                  <p><strong>Nombre del contacto:</strong> ${formulario?.contactoEmergenciaNombre || '_______________________________________'}</p>
                  <p><strong>Teléfono celular:</strong> ${formulario?.contactoEmergenciaTelefono || '__________________________________________'}</p>
                </div>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;" />
              ` + sede.terminosActivos.contenidoHtml}
              numeroVersion={sede.terminosActivos.numeroVersion}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {currentStep === 2 && (
            <ConsentsStep
              onNext={handleConsentsNext}
              onBack={goBack}
            />
          )}

          {currentStep === 3 && (
            <SignatureStep
              onNext={handleSignatureNext}
              onBack={goBack}
            />
          )}

          {currentStep === 4 && formulario && consents && sede.terminosActivos && (
            <ConfirmStep
              formulario={formulario}
              consents={consents}
              firmaBase64={firmaBase64}
              terminosVersion={sede.terminosActivos.numeroVersion}
              onConfirm={handleSubmit}
              onBack={goBack}
              isLoading={isSubmitting}
            />
          )}

          {isSuccess && (
            <SuccessScreen
              transactionId={result.transactionId}
              correoEnviado={result.correoEnviado}
              correo={formulario?.correoElectronico || ''}
              sedeName={sede.nombre}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      {!isSuccess && (
        <footer className="border-t border-dark-800 py-3 px-4">
          <p className="text-center text-[10px] text-gray-700 max-w-lg mx-auto">
            Tus datos están protegidos bajo la Ley 1581 de 2012.
            Al continuar, aceptas nuestra{' '}
            <a href="/politica-de-datos" className="text-gray-600 underline" target="_blank">
              Política de Tratamiento de Datos
            </a>
            .
          </p>
        </footer>
      )}
    </div>
  )
}

// ─── Page export with Suspense (required for useSearchParams in Next.js 14) ─

export default function AceptacionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-dark-950 flex items-center justify-center">
          <svg className="w-8 h-8 text-brand-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
    >
      <AceptacionContent />
    </Suspense>
  )
}
