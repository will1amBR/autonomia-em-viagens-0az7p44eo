import React from 'react'
import { LogOut, CloudSun } from 'lucide-react'
import { useTrip } from '../context/TripContext'

export const QuickExitFloatingButton: React.FC = () => {
  const { triggerQuickExit } = useTrip()

  const handleQuickExit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Instantly trigger disguise screen
    triggerQuickExit()
    // Also redirect window location if needed or fallback
    try {
      window.location.replace('https://www.google.com')
    } catch {
      // ignore
    }
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] group">
      <button
        onClick={handleQuickExit}
        type="button"
        title="Saída Rápida de Emergência (Disfarce Imediato)"
        aria-label="Saída Rápida de Emergência"
        className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/90 hover:bg-red-700 text-slate-300 hover:text-white shadow-xl hover:shadow-red-900/40 border border-slate-700/80 hover:border-red-600 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none"
      >
        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5" />
      </button>
      <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none">
        Saída Rápida (1 clique)
      </div>
    </div>
  )
}

export default QuickExitFloatingButton
