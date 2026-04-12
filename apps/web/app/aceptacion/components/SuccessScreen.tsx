'use client'

interface Props {
  transactionId: string
  correoEnviado: boolean
  correo: string
  sedeName: string
}

export default function SuccessScreen({ transactionId, correoEnviado, correo, sedeName }: Props) {
  return (
    <div className="animate-slide-up flex flex-col items-center text-center gap-8 py-4">
      {/* Success icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 animate-ping" />
      </div>

      {/* Message */}
      <div>
        <h2 className="text-2xl font-black text-white">¡Registro exitoso!</h2>
        <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
          Tu aceptación en <strong className="text-brand-400">{sedeName}</strong> ha sido
          registrada correctamente.
        </p>
      </div>

      {/* Transaction ID */}
      <div className="w-full bg-dark-900 border border-dark-800 rounded-2xl p-5 text-left space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider">ID de transacción</p>
        <p className="text-sm font-mono text-brand-400 break-all">{transactionId}</p>
        <p className="text-xs text-gray-600">
          Guarda este código como referencia de tu aceptación.
        </p>
      </div>

      {/* Email status */}
      <div
        className={`w-full rounded-2xl p-5 border ${
          correoEnviado
            ? 'bg-brand-500/5 border-brand-500/20'
            : 'bg-amber-500/5 border-amber-500/20'
        }`}
      >
        {correoEnviado ? (
          <div className="flex items-start gap-3 text-left">
            <span className="text-xl">📧</span>
            <div>
              <p className="text-sm font-semibold text-brand-300">Correo enviado</p>
              <p className="text-xs text-gray-400 mt-1">
                Hemos enviado una copia de tu aceptación a{' '}
                <strong className="text-white">{correo}</strong>.
                Revisa también tu carpeta de spam si no lo encuentras.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 text-left">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-semibold text-amber-300">Correo pendiente</p>
              <p className="text-xs text-gray-400 mt-1">
                Tu registro está guardado. El correo a{' '}
                <strong className="text-white">{correo}</strong> será enviado en breve.
                Si no llega en 10 minutos, comunícate con recepción con tu ID de transacción.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* What's next */}
      <div className="w-full text-left bg-dark-900 border border-dark-800 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-semibold text-white">¿Qué sigue?</p>
        <div className="space-y-2">
          {[
            '🏋️ Puedes ingresar al gimnasio con tu documento de identidad.',
            '📄 Conserva el correo como evidencia de tu registro.',
            '🔄 Si los términos cambian, se te notificará para un nuevo registro.',
          ].map((text, i) => (
            <p key={i} className="text-xs text-gray-400 flex items-start gap-2">
              <span className="mt-0.5 shrink-0">{text.slice(0, 2)}</span>
              <span>{text.slice(3)}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-700">
        FIT EVOLUTION360 — Gracias por ser parte de nuestra comunidad 💪
      </p>
    </div>
  )
}
