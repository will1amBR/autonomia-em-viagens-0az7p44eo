import React from 'react'
import { LogOut, CloudSun } from 'lucide-react'
import { useTrip } from '../context/TripContext'

export const QuickExitFloatingButton: React.FC = () => {
  const { triggerQuickExit } = useTrip()

  const handleQuickExit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Instantly trigger disguise overlay screen (1-touch disguise)
    triggerQuickExit()
  }

  return (
    <aside
      aria-label="Saída Rápida"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] group"
    >
      <button
        onClick={handleQuickExit}
        type="button"
        title="Saída Rápida (Camuflagem Imediata)"
        aria-label="Saída Rápida (Camuflagem Imediata)"
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-rose-700 text-slate-200 hover:text-white shadow-2xl hover:shadow-rose-950/50 border border-slate-700/90 hover:border-rose-500 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none backdrop-blur font-semibold text-xs"
      >
        <CloudSun className="w-4 h-4 text-sky-400 group-hover:text-white transition-colors shrink-0" />
        <span className="font-bold tracking-tight">Saída Rápida</span>
      </button>
      <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-slate-900 text-slate-200 text-[11px] rounded-lg shadow-xl whitespace-nowrap border border-slate-700 pointer-events-none">
        1 toque: camufla para previsão do tempo e moedas
      </div>
    </aside>
  )
}

export default QuickExitFloatingButton
