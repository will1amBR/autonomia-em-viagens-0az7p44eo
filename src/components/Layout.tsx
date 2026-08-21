import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavigationHeader, QuickExitOverlay } from './NavigationHeader'

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      <QuickExitOverlay />
      <NavigationHeader />
      <main className="flex-1">{children || <Outlet />}</main>
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl space-y-2">
          <p className="font-semibold text-slate-700">
            SafeTrip • Autonomia e Segurança em Viagens Internacionais
          </p>
          <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            Aviso de Responsabilidade: A plataforma é uma camada de preparação, prevenção e apoio à
            autonomia do viajante. Não substitui autoridades policiais, serviços médicos, seguros de
            viagem ou assistência consular oficial.
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            Filosofia: "Autonomia não é desconfiança. Ter escolhas garante sua liberdade."
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
