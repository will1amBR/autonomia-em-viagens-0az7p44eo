import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, CheckSquare, Users, ShieldAlert, Camera, Menu } from 'lucide-react'
import { useTrip } from '../context/TripContext'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const { currentTrip } = useTrip()

  const navItems = [
    {
      to: '/dashboard',
      label: 'Painel',
      icon: Compass,
    },
    {
      to: '/guardians',
      label: 'Guardiões',
      icon: Users,
    },
    {
      to: '/presence-logs',
      label: 'Presença & Fotos',
      icon: Camera,
    },
    {
      to: '/checklist',
      label: 'Checklist',
      icon: CheckSquare,
    },
    {
      to: '/emergency',
      label: 'SOS',
      icon: ShieldAlert,
      danger: true,
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.to)
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                item.danger
                  ? active
                    ? 'text-red-400 font-bold'
                    : 'text-red-500 hover:text-red-400'
                  : active
                    ? 'text-sky-400 font-bold bg-sky-950/40 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.danger ? 'text-red-500' : ''}`} />
                {item.danger && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
