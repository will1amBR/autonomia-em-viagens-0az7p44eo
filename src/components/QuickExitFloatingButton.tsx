import React, { useRef, useState } from 'react'
import { CloudSun } from 'lucide-react'
import { useTrip } from '../context/TripContext'
import pb from '@/lib/pocketbase/client'

export const QuickExitFloatingButton: React.FC = () => {
  const { triggerQuickExit } = useTrip()
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<any>(null)
  const holdTimerRef = useRef<any>(null)

  const triggerSilentSOS = () => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetch('/api/duress-silent-alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: pb.authStore.token,
            },
            body: JSON.stringify({
              trigger_method: 'button_hold',
              location_lat: pos.coords.latitude,
              location_lng: pos.coords.longitude,
              device_info: navigator.userAgent.slice(0, 100),
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {})
        },
        () => {
          fetch('/api/duress-silent-alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: pb.authStore.token,
            },
            body: JSON.stringify({
              trigger_method: 'button_hold',
              device_info: navigator.userAgent.slice(0, 100),
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {})
        },
        { timeout: 3000 },
      )
    }
  }

  const handlePointerDown = () => {
    // Start 3-second hold timer for discrete duress alert
    holdTimerRef.current = setTimeout(() => {
      triggerSilentSOS()
    }, 3000)
  }

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)

    // Check if user tapped 4 times rapidly (discrete mobile signal)
    if (tapCountRef.current >= 4) {
      triggerSilentSOS()
      tapCountRef.current = 0
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0
      }, 1000)
    }

    // Single touch still triggers instant weather disguise overlay
    triggerQuickExit()
  }

  return (
    <aside
      aria-label="Saída Rápida"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[9999] group select-none"
    >
      <button
        onClick={handleClick}
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
        type="button"
        title="Saída Rápida (Camuflagem Imediata)"
        aria-label="Saída Rápida (Camuflagem Imediata)"
        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-slate-900 hover:bg-rose-700 text-slate-200 hover:text-white shadow-2xl hover:shadow-rose-950/50 border border-slate-700/90 hover:border-rose-500 transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none backdrop-blur font-semibold text-xs"
      >
        <CloudSun className="w-4 h-4 text-sky-400 group-hover:text-white transition-colors shrink-0" />
        <span className="font-bold tracking-tight">Saída Rápida</span>
      </button>
      <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-slate-900 text-slate-200 text-[11px] rounded-lg shadow-xl whitespace-nowrap border border-slate-700 pointer-events-none">
        1 toque: camufla • Segure 3s ou 4 toques: SOS silencioso
      </div>
    </aside>
  )
}

export default QuickExitFloatingButton
