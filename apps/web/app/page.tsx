import { redirect } from 'next/navigation'

export default function HomePage() {
  // Por ahora redirige al formulario de aceptación de sede Kennedy
  // En Fase 9 esto será la web institucional
  redirect('/aceptacion?sede=kennedy')
}
