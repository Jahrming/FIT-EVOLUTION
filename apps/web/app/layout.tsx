import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'FIT EVOLUTION360',
    template: '%s | FIT EVOLUTION360',
  },
  description: 'Plataforma digital de FIT EVOLUTION360 — Aceptación de términos y condiciones.',
  keywords: ['gimnasio', 'fitness', 'Kennedy', 'Bogotá', 'FIT EVOLUTION360'],
  robots: 'noindex, nofollow', // cambiar a index,follow cuando sea pública
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // previene zoom accidental en formularios móviles
  themeColor: '#030712',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-dark-950 antialiased">
        {children}
      </body>
    </html>
  )
}
