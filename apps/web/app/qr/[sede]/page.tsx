'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'

// SSR-safe import for QR
const QRCodeSVG = dynamic(
  () => import('qrcode.react').then((m) => m.QRCodeSVG),
  { ssr: false }
)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.fitevolution360.com'

const SEDES: Record<string, { nombre: string; ciudad: string; color: string }> = {
  kennedy: { nombre: 'Sede Kennedy', ciudad: 'Bogotá', color: '#22c55e' },
  bosa: { nombre: 'Sede Bosa', ciudad: 'Bogotá', color: '#3b82f6' },
  soacha: { nombre: 'Sede Soacha', ciudad: 'Cundinamarca', color: '#f59e0b' },
}

function QRContent() {
  const params = useParams()
  const sedeSlug = (params?.sede as string) || 'kennedy'
  const sedeInfo = SEDES[sedeSlug] ?? { nombre: `Sede ${sedeSlug}`, ciudad: '', color: '#22c55e' }

  const qrUrl = `${APP_URL}/aceptacion?sede=${sedeSlug}`

  const handlePrint = () => window.print()

  return (
    <div className="min-h-dvh bg-dark-950 flex flex-col items-center justify-center p-6 gap-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-black text-white">
          FIT <span className="text-brand-400">EVOLUTION</span>360
        </h1>
        <p className="text-brand-400 font-semibold text-sm mt-1">{sedeInfo.nombre}</p>
        {sedeInfo.ciudad && <p className="text-gray-500 text-xs">{sedeInfo.ciudad}</p>}
      </div>

      {/* QR Card */}
      <div
        id="qr-print-area"
        className="bg-white rounded-3xl p-8 flex flex-col items-center gap-5 shadow-2xl shadow-brand-500/10 print:shadow-none"
        style={{ maxWidth: 320 }}
      >
        <QRCodeSVG
          value={qrUrl}
          size={240}
          fgColor="#030712"
          bgColor="#ffffff"
          level="H"
          includeMargin={false}
        />
        <div className="text-center">
          <p className="text-dark-900 font-black text-base">FIT EVOLUTION360</p>
          <p className="text-gray-600 text-sm font-semibold">{sedeInfo.nombre}</p>
          <p className="text-gray-400 text-xs mt-1">
            Escanea para registrar tu aceptación de términos
          </p>
        </div>
      </div>

      {/* URL */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl px-4 py-3 text-center max-w-sm w-full">
        <p className="text-xs text-gray-500 mb-1">URL del QR</p>
        <p className="text-xs font-mono text-brand-400 break-all">{qrUrl}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={handlePrint}
          className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white font-bold
                     rounded-xl text-sm transition-all active:scale-[0.98]"
        >
          🖨️ Imprimir
        </button>
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 border border-dark-700 text-gray-400 hover:text-white
                     hover:border-dark-600 rounded-xl text-sm font-medium text-center
                     transition-colors"
        >
          🔗 Probar
        </a>
      </div>

      {/* Other sedes */}
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-2">QR para otras sedes:</p>
        <div className="flex gap-2">
          {Object.keys(SEDES).map((slug) => (
            <a
              key={slug}
              href={`/qr/${slug}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                slug === sedeSlug
                  ? 'bg-brand-500 text-white'
                  : 'bg-dark-900 text-gray-500 hover:text-white border border-dark-800'
              }`}
            >
              {slug.charAt(0).toUpperCase() + slug.slice(1)}
            </a>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          #qr-print-area { border-radius: 0 !important; box-shadow: none !important; }
          button, a, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default function QRPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-dark-950" />}>
      <QRContent />
    </Suspense>
  )
}
