import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavigationHeader, QuickExitOverlay } from './NavigationHeader'
import { QuickExitFloatingButton } from './QuickExitFloatingButton'
import { BottomNav } from './BottomNav'

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900 pb-16 md:pb-0">
      <QuickExitOverlay />
      <NavigationHeader />
      <main className="flex-1">{children || <Outlet />}</main>
      <BottomNav />
      <QuickExitFloatingButton />
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl space-y-2">
          <p className="font-semibold text-slate-700">
            SafeTrip Autonomia • Diagnóstico Preventivo e Rede de Confiança
          </p>
          <p>
            Plataforma projetada para garantir liberdade de escolha e segurança consular a viajantes
            brasileiros.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            Privacidade absoluta. Seus dados não são compartilhados com acompanhantes ou anfitriões.
          </div>
        </div>
      </footer>
    </div>
  )
}
export default Layout
