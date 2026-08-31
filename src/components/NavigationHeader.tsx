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
  Globe,
  User,
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
    { label: 'Destinos', path: '/destinos', icon: Globe },
    { label: 'Emergência', path: '/emergency', icon: Phone },
    { label: 'Biblioteca', path: '/library', icon: BookOpen },
    { label: 'Perfil', path: '/perfil', icon: User },
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
  const [currencyBrl, setCurrencyBrl] = React.useState('100')
  const [selectedCurrency, setSelectedCurrency] = React.useState<'EUR' | 'USD' | 'GBP'>('EUR')

  if (!isQuickExitActive) return null

  const rates = {
    EUR: 6.22,
    USD: 5.75,
    GBP: 7.35,
  }

  const converted = (parseFloat(currencyBrl || '0') / rates[selectedCurrency]).toFixed(2)

  const handleExternalExit = () => {
    try {
      window.location.replace('https://www.google.com')
    } catch {
      window.location.href = 'https://www.google.com'
    }
  }

  return (
    <div className="fixed inset-0 z-[100000] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 select-none font-sans overflow-y-auto">
      <div className="max-w-lg w-full bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 text-center">
        {/* Weather section */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Clima & Câmbio Global</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <Sun className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">22°C</h2>
          <p className="text-xs text-slate-300 font-medium">
            Parcialmente Ensolarado • Índice UV 4 (Moderado)
          </p>
          <p className="text-[11px] text-slate-500">
            Umidade 58% • Vento ENE 14 km/h • Visibilidade 10 km
          </p>
        </div>

        {/* 4 day mini forecast */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Hoje</span>
            <span className="font-bold text-white text-sm">22° / 15°</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Amanhã</span>
            <span className="font-bold text-white text-sm">24° / 16°</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Quinta</span>
            <span className="font-bold text-white text-sm">19° / 14°</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-semibold">Sexta</span>
            <span className="font-bold text-white text-sm">23° / 15°</span>
          </div>
        </div>

        {/* Currency Converter */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Conversor de Moedas</span>
            <div className="flex gap-1">
              {(['EUR', 'USD', 'GBP'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    selectedCurrency === curr
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Reais (BRL)</label>
              <input
                type="number"
                value={currencyBrl}
                onChange={(e) => setCurrencyBrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                Equivalente ({selectedCurrency})
              </label>
              <div className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-400">
                {converted} {selectedCurrency}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500">Cotação comercial aproximada de referência.</p>
        </div>

        {/* Quick actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-800">
          <button
            type="button"
            onClick={handleExternalExit}
            className="text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            Abrir Google.com
          </button>
          <button
            type="button"
            onClick={restoreFromQuickExit}
            className="text-[11px] text-slate-500 hover:text-sky-400 transition-colors underline cursor-pointer"
          >
            Retomar sessão
          </button>
        </div>
      </div>
    </div>
  )
}
