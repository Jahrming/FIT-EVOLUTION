'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
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

const STEP_LABELS = ['Datos', 'Terminos', 'Consents', 'Firma', 'Confirmar']

function AceptacionContent() {
  const searchParams = useSearchParams()
  const sedeSlug = searchParams.get('sede') || 'kennedy'

  const [currentStep, setCurrentStep] = useState(-1)
  const [sede, setSede] = useState<SedeInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)
  const [sessionToken, setSessionToken] = useState('')

  const [formulario, setFormulario] = useState<FormularioValues | null>(null)
  const [consents, setConsents] = useState<Consents | null>(null)
  const [firmaBase64, setFirmaBase64] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<AceptacionResponse | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const initialize = useCallback(async () => {
    setIsLoading(true)
    setPageError(null)
    setSede(null)
    setSessionToken('')

    try {
      const sedeData = await getSede(sedeSlug)

      if (!sedeData.terminosActivos) {
        setPageError('No hay terminos y condiciones activos para esta sede. Contacta a recepcion.')
        return
      }

      setSede(sedeData)
      void getSessionToken()
        .then((token) => setSessionToken(token))
        .catch(() => undefined)
    } catch {
      setPageError('No se pudo cargar la informacion de la sede. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [sedeSlug])

  useEffect(() => {
    initialize()
  }, [initialize])

  const goNext = () => setCurrentStep((step) => step + 1)
  const goBack = () => setCurrentStep((step) => step - 1)

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

  const handleSubmit = async () => {
    if (!sede || !formulario || !consents || !firmaBase64) return

    setIsSubmitting(true)
    setSubmitError(null)
    let activeSessionToken = sessionToken

    if (!activeSessionToken) {
      try {
        activeSessionToken = await getSessionToken()
        setSessionToken(activeSessionToken)
      } catch {
        setPageError('No se pudo iniciar la sesion del formulario. Recarga la pagina e intenta de nuevo.')
        setIsSubmitting(false)
        return
      }
    }

    try {
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
        sessionToken: activeSessionToken,
        aceptaTerminos: consents.aceptaTerminos,
        aceptaTratamientoDatos: consents.aceptaTratamientoDatos,
        declaraCondicionFisica: consents.declaraCondicionFisica,
        autorizaUsoImagen: consents.autorizaUsoImagen,
        condicionMedicaEspecial: consents.condicionMedicaEspecial || undefined,
      })

      setResult(response)
      goNext()
    } catch (err: unknown) {
      const httpError = err as {
        response?: { data?: { message?: string | string[] } }
      }
      const backendMessage = httpError?.response?.data?.message
      const parsedMessage = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : backendMessage

      setSubmitError(
        parsedMessage ||
          'No se pudo completar el registro. Revisa la conexion con la API e intenta de nuevo.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-8 w-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (pageError) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/20 bg-dark-900 p-8 text-center space-y-4">
          <span className="text-5xl">⚠️</span>
          <p className="font-semibold text-white">Oops, algo salio mal</p>
          <p className="text-sm text-gray-400">{pageError}</p>
          <button
            onClick={initialize}
            className="w-full rounded-xl bg-dark-800 py-3 text-sm text-white transition-colors hover:bg-dark-700"
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
      <header className="sticky top-0 z-10 border-b border-dark-800 bg-dark-950/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-brand-400">
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

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg">
          {currentStep >= 0 && !isSuccess && (
            <div className="mb-6">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={STEP_LABELS.length}
                labels={STEP_LABELS}
              />
            </div>
          )}

          {currentStep === -1 && <Welcome sede={sede} onStart={goNext} />}

          {currentStep === 0 && (
            <FormStep
              defaultValues={formulario || undefined}
              onNext={handleFormNext}
              onBack={() => setCurrentStep(-1)}
            />
          )}

          {currentStep === 1 && sede.terminosActivos && (
            <TermsStep
              contenidoHtml={
                `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #e5e7eb;">
                  <h2 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 5px;">TERMINOS Y CONDICIONES DE INGRESO, PARTICIPACION Y AUTORIZACIONES</h2>
                  <h3 style="text-align: center; font-size: 16px; margin-top: 0; margin-bottom: 20px;">FIT_EVOLUTION360</h3>
                  <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' })}</p>
                  <p>FIT_EVOLUTION360, gimnasio y centro de acondicionamiento fisico de caracter privado, legalmente constituido conforme a las leyes de la Republica de Colombia, sera responsable del tratamiento de los datos personales de conformidad con la Politica de Tratamiento de Datos Personales vigente y la normatividad colombiana aplicable.</p>
                  <p>El presente documento regula los terminos, condiciones, declaraciones y autorizaciones que acepta la persona que ingresa a las instalaciones de FIT_EVOLUTION360 y/o participa en actividades, eventos, programas o servicios ofrecidos por la compania.</p>
                  <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px;">1. IDENTIFICACION DEL USUARIO</h3>
                  <p><strong>Nombre completo:</strong> ${formulario?.nombreCompleto || '____________________________________________'}</p>
                  <p><strong>Tipo de documento:</strong> ${formulario?.tipoDocumento || '___________'}</p>
                  <p><strong>Numero de documento:</strong> ${formulario?.numeroDocumento || '_______________________________________'}</p>
                  <p><strong>Correo electronico:</strong> ${formulario?.correoElectronico || '_______________________________________'}</p>
                  <p><strong>Telefono:</strong> ${formulario?.telefono || '_______________________________________'}</p>
                  <h3 style="font-size: 16px; font-weight: bold; margin-top: 20px;">2. CONTACTO DE EMERGENCIA</h3>
                  <p><strong>Nombre del contacto:</strong> ${formulario?.contactoEmergenciaNombre || '_______________________________________'}</p>
                  <p><strong>Telefono celular:</strong> ${formulario?.contactoEmergenciaTelefono || '__________________________________________'}</p>
                </div>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 20px 0;" />
              ` + sede.terminosActivos.contenidoHtml
              }
              numeroVersion={sede.terminosActivos.numeroVersion}
              onNext={goNext}
              onBack={goBack}
            />
          )}

          {currentStep === 2 && (
            <ConsentsStep
              defaultValues={consents || undefined}
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
            <div className="space-y-4">
              {submitError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                  <p className="text-sm font-semibold text-red-300">
                    No se pudo enviar el registro
                  </p>
                  <p className="mt-1 text-xs text-red-200/80">{submitError}</p>
                </div>
              )}
              <ConfirmStep
                formulario={formulario}
                consents={consents}
                firmaBase64={firmaBase64}
                terminosVersion={sede.terminosActivos.numeroVersion}
                onConfirm={handleSubmit}
                onBack={goBack}
                isLoading={isSubmitting}
              />
            </div>
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

      {!isSuccess && (
        <footer className="border-t border-dark-800 px-4 py-3">
          <p className="mx-auto max-w-lg text-center text-[10px] text-gray-700">
            Tus datos estan protegidos bajo la Ley 1581 de 2012. Al continuar, aceptas nuestra{' '}
            <a href="/politica-de-datos" className="text-gray-600 underline" target="_blank">
              Politica de Tratamiento de Datos
            </a>
            .
          </p>
        </footer>
      )}
    </div>
  )
}

export default function AceptacionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-dark-950 flex items-center justify-center">
          <svg className="h-8 w-8 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
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
