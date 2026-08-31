import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Compass, CheckSquare, ShieldCheck, Users, Phone, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Only render on authenticated routes or when logged in
  if (!isAuthenticated) return null

  const navItems = [
    { label: 'Painel', path: '/dashboard', icon: Compass },
    { label: 'Plano', path: '/checklist', icon: CheckSquare },
    { label: 'Check-in', path: '/checkin', icon: ShieldCheck },
    { label: 'Guardiões', path: '/guardians', icon: Users },
    { label: 'Emergência', path: '/emergency', icon: Phone },
    { label: 'Perfil', path: '/perfil', icon: User },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      aria-label="Navegação Principal Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-1.5 px-2 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors ${
                active ? 'text-sky-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  active ? 'bg-sky-50 text-sky-700' : 'text-slate-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-sky-700' : 'text-slate-600'}`} />
              </div>
              <span className="text-[10px] leading-tight mt-0.5">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
export default BottomNav
