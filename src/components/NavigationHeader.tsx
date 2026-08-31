import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Compass,
  CheckSquare,
  Users,
  ShieldAlert,
  Menu,
  X,
  Phone,
  BookOpen,
  LogOut,
  ChevronRight,
  Shield,
  EyeOff,
  CloudRain,
  Sun,
  PlusCircle,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useTrip } from '../context/TripContext'
import { useAuth } from '../context/AuthContext'

export const NavigationHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { currentTrip, isQuickExitActive, triggerQuickExit, restoreFromQuickExit } = useTrip()
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Painel', path: '/dashboard', icon: Compass },
    { label: 'Avaliação', path: '/assessment', icon: Shield },
    { label: 'Checklist', path: '/checklist', icon: CheckSquare },
    { label: 'Guardiões', path: '/guardians', icon: Users },
    { label: 'Emergência', path: '/emergency', icon: Phone },
    { label: 'Biblioteca', path: '/library', icon: BookOpen },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base text-slate-900 tracking-tight">SafeTrip</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 uppercase">
                  Autonomia
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block leading-none">
                Segurança Internacional
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    active
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User menu & Actions */}
          <div className="flex items-center gap-2">
            <Link to="/trips/new" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold border-sky-200 text-sky-700 hover:bg-sky-50"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1" />
                Nova Viagem
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="text-xs text-slate-500 hover:text-slate-900 h-8 px-2"
              title="Encerrar sessão"
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1 text-slate-400" />
              <span className="hidden sm:inline">Sair</span>
            </Button>

            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-8 w-8 p-0"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
            <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Olá, {user?.name || user?.email || 'Viajante'}
              </span>
              <Link to="/trips/new" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="h-7 text-[11px] bg-sky-600 text-white font-semibold">
                  + Nova Viagem
                </Button>
              </Link>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                    active ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
              )
            })}
          </div>
        )}
      </header>
    </>
  )
}

export const QuickExitOverlay: React.FC = () => {
  const { isQuickExitActive, restoreFromQuickExit } = useTrip()

  if (!isQuickExitActive) return null

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 space-y-6 select-none font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-6 border border-slate-700 shadow-2xl space-y-5 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
            <CloudRain className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Previsão do Tempo Global
          </span>
          <h2 className="text-3xl font-black text-white">21°C • Ensolarado</h2>
          <p className="text-xs text-slate-400">São Paulo, Brasil • Umidade 62% • Vento 12 km/h</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700 text-xs">
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[10px] text-slate-400 block">Amanhã</span>
            <span className="font-bold text-white">23°C</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[10px] text-slate-400 block">Quinta</span>
            <span className="font-bold text-white">19°C</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60">
            <span className="text-[10px] text-slate-400 block">Sexta</span>
            <span className="font-bold text-white">24°C</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center gap-2">
          <button
            onClick={restoreFromQuickExit}
            className="text-[11px] text-slate-500 hover:text-slate-300 underline transition-colors cursor-pointer"
          >
            Retomar sessão protegida
          </button>
        </div>
      </div>
    </div>
  )
}
