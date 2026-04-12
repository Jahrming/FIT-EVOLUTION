'use client'

import type { SedeInfo } from '@/lib/schemas'

interface Props {
  sede: SedeInfo
  onStart: () => void
}

export default function Welcome({ sede, onStart }: Props) {
  return (
    <div className="animate-slide-up flex flex-col items-center text-center gap-8">
      {/* Logo / Brand */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            FIT <span className="text-brand-400">EVOLUTION</span>360
          </h1>
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mt-1">
            {sede.nombre.split(' - ')[1] || sede.nombre}
          </p>
        </div>
      </div>

      {/* Welcome card */}
      <div className="w-full bg-dark-900 border border-dark-800 rounded-2xl p-6 text-left space-y-4">
        <h2 className="text-lg font-bold text-white">
          👋 Bienvenido a nuestro proceso de registro digital
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Para garantizar tu seguridad y la de nuestra comunidad, necesitamos que completes
          el registro de aceptación de términos y condiciones de ingreso.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Este proceso toma aproximadamente <strong className="text-white">3–5 minutos</strong>.
          Al finalizar, recibirás una copia por correo electrónico.
        </p>

        {/* Steps preview */}
        <div className="pt-2 space-y-3">
          {[
            { icon: '📋', label: 'Tus datos personales' },
            { icon: '📄', label: 'Lectura de términos' },
            { icon: '✅', label: 'Consentimientos' },
            { icon: '✍️', label: 'Firma digital' },
            { icon: '📧', label: 'Copia a tu correo' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legal note */}
      <p className="text-xs text-gray-600 max-w-xs">
        Tus datos serán tratados de acuerdo con la Ley 1581 de 2012 sobre protección
        de datos personales.
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full py-4 bg-brand-500 hover:bg-brand-400 active:bg-brand-600
                   text-dark-950 font-bold rounded-xl transition-all shadow-lg                   transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/25
                   active:scale-[0.98]"
      >
        Comenzar registro →
      </button>
    </div>
  )
}
