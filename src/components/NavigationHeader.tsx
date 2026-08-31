import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Menu,
  X,
  Compass,
  MapPin,
  ShieldAlert,
  Users,
  CheckSquare,
  FileText,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  Camera,
  Activity,
  PlusCircle,
  HelpCircle,
  Sun,
  Shield,
  EyeOff,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '../context/AuthContext'
import { useTrip } from '../context/TripContext'

export const QuickExitOverlay: React.FC = () => {
  const { isQuickExitActive, restoreFromQuickExit } = useTrip()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const { user } = useAuth()

  if (!isQuickExitActive) return null

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    const userPasscode = user?.emergency_passcode?.trim()
    const duressCode = user?.duressSecretCode?.trim()

    // 1. If traveler inputs their duress secret code, silently send duress alert with GPS and pretend to unlock
    if (duressCode && pin.trim() === duressCode) {
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
                trigger_method: 'secret_code',
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
                trigger_method: 'secret_code',
                device_info: navigator.userAgent.slice(0, 100),
                timestamp: new Date().toISOString(),
              }),
            }).catch(() => {})
          },
          { timeout: 3000 },
        )
      }
      restoreFromQuickExit()
      setPin('')
      setError(false)
      return
    }

    // 2. Strict PIN verification: requires traveler's configured passcode (no universal 1234 / 9999 backdoor)
    if (userPasscode && pin.trim() === userPasscode) {
      restoreFromQuickExit()
      setPin('')
      setError(false)
    } else if (!userPasscode) {
      // If user has not configured a passcode yet, inform them to set it in Profile
      setError(true)
    } else {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col justify-between p-6 font-sans">
      <div className="max-w-md mx-auto w-full space-y-6 pt-12">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Sun className="w-8 h-8 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Previsão do Tempo</h2>
              <p className="text-xs text-slate-500">Roma, Itália • Ensolarado 24°C</p>
            </div>
          </div>
          <Badge variant="outline">EUR/BRL 6.12</Badge>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Destaques da Cidade</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Museus e pontos turísticos com entrada gratuita no primeiro domingo do mês. Horários de
            funcionamento regulares de transportes públicos.
          </p>
        </div>
      </div>

      <div className="max-w-xs mx-auto w-full pb-6">
        <form onSubmit={handleUnlock} className="flex gap-2">
          <Input
            type="password"
            maxLength={4}
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="h-9 text-xs text-center font-mono tracking-widest bg-white"
          />
          <Button type="submit" size="sm" variant="outline" className="h-9 text-xs">
            Desbloquear
          </Button>
        </form>
        {error && <p className="text-[10px] text-red-500 text-center mt-1">PIN incorreto</p>}
      </div>
    </div>
  )
}

export const NavigationHeader: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user: authUser, logout, isAdmin, isPolice } = useAuth()
  const { currentTrip, trips } = useTrip()

  const handleLogout = () => {
    setIsDrawerOpen(false)
    logout()
    navigate('/')
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Painel Principal',
      desc: 'Status geral, score e alertas da viagem',
      icon: Compass,
      authRequired: true,
    },
    {
      to: '/trips/new',
      label: 'Nova Viagem',
      desc: 'Cadastrar rota, anfitrião e hospedagem',
      icon: PlusCircle,
      authRequired: true,
      highlight: true,
    },
    {
      to: '/presence-logs',
      label: 'Histórico & Confirmação',
      desc: 'Logs de presença, fotos/vídeos e sinal de segurança',
      icon: Camera,
      authRequired: true,
      badge: 'Novo',
    },
    {
      to: '/guardians',
      label: 'Rede de Guardiões',
      desc: 'Contatos de confiança e envio rápido com GPS',
      icon: Users,
      authRequired: true,
    },
    {
      to: '/checkin',
      label: 'Check-in & Rotina',
      desc: 'Confirmar que está bem e monitorar ausência',
      icon: Activity,
      authRequired: true,
    },
    {
      to: '/checklist',
      label: 'Checklist de Autonomia',
      desc: 'Passos essenciais antes do embarque',
      icon: CheckSquare,
      authRequired: true,
    },
    {
      to: '/destinos',
      label: 'Guia de Destinos & Consulados',
      desc: '14 países com dados verificados de emergência',
      icon: MapPin,
      authRequired: false,
    },
    {
      to: '/library',
      label: 'Biblioteca de Respostas',
      desc: '11 cenários de autonomia e direitos',
      icon: FileText,
      authRequired: false,
    },
    {
      to: '/score-result',
      label: 'Diagnóstico de Autonomia',
      desc: 'Avaliação detalhada dos seus fatores de risco',
      icon: Sparkles,
      authRequired: true,
    },
    {
      to: '/perfil',
      label: 'Meu Perfil & Segurança',
      desc: 'Preferência de sinal discreto e privacidade',
      icon: User,
      authRequired: true,
    },
  ]

  if (isPolice || isAdmin) {
    navItems.push({
      to: '/police/dashboard',
      label: 'Canal Policial & Consular',
      desc: 'Sinais de coação, última localização e logs autorizados',
      icon: ShieldAlert,
      authRequired: true,
      badge: isPolice ? 'Polícia' : 'Oficial',
    })
  }

  if (isAdmin) {
    navItems.push({
      to: '/admin',
      label: 'Painel Administrativo',
      desc: 'Total de viajantes, rotas ativas e dados de anfitriões',
      icon: ShieldAlert,
      authRequired: true,
      badge: 'Admin',
    })
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Left: Sandwich Menu Button (Mobile & Desktop Clean Access) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Abrir menu de navegação"
              className="p-2.5 rounded-xl bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <Menu className="w-5 h-5 text-sky-400" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-slate-300">
                Menu
              </span>
            </button>

            {/* Brand / Logo */}
            <Link to={authUser ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-tight leading-tight flex items-center gap-1.5">
                  SafeTrip
                  <span className="text-sky-400 font-semibold text-xs hidden xs:inline">
                    • Autonomia
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:block">
                  Autonomia não é desconfiança
                </span>
              </div>
            </Link>
          </div>

          {/* Center/Right: Quick Action Badges and Emergency / Exit actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Emergency Button always visible */}
            <Link to="/emergency">
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white font-bold h-9 px-3.5 rounded-xl shadow-md shadow-red-950/30 text-xs flex items-center gap-1.5 border border-red-500/40 animate-pulse"
              >
                <ShieldAlert className="w-4 h-4" />
                <span className="hidden xs:inline">Emergência SOS</span>
                <span className="xs:hidden">SOS</span>
              </Button>
            </Link>

            {/* If Logged in: Profile Shortcut or Login */}
            {authUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/perfil"
                  className="hidden md:flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center text-xs font-bold">
                    {authUser.name ? authUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-slate-300 font-medium max-w-[100px] truncate">
                    {authUser.name?.split(' ')[0] || 'Viajante'}
                  </span>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 text-xs font-bold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800"
                >
                  Entrar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Backdrop for Slide-over Drawer */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Slide-over Side Panel (Menu Sanduíche Drawer) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[88vw] max-w-sm bg-slate-950 border-r border-slate-800 text-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-none">Menu de Autonomia</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Navegação simples e protegida</p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Fechar menu"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card if logged in */}
        {authUser && (
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {authUser.name ? authUser.name.charAt(0).toUpperCase() : 'V'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">
                    {authUser.name || 'Viajante'}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{authUser.email}</p>
                </div>
              </div>
              <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/30 text-[10px]">
                {authUser.role === 'admin' ? 'Admin' : 'Protegido'}
              </Badge>
            </div>

            {currentTrip && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold truncate max-w-[170px]">
                    {currentTrip.destinationCity}, {currentTrip.destinationCountry}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Ativa</span>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          <p className="px-3 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Navegação Principal
          </p>

          {navItems.map((item) => {
            if (item.authRequired && !authUser) return null
            const active = isActive(item.to)
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsDrawerOpen(false)}
                className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                  active
                    ? 'bg-sky-600/20 border border-sky-500/50 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                        : item.highlight
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="text-[9px] px-1.5 py-0 bg-sky-500/20 text-sky-300 border-sky-400/30"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            )
          })}

          <div className="pt-3 pb-1 border-t border-slate-800/80">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Ações Críticas
            </p>
          </div>

          <Link
            to="/emergency"
            onClick={() => setIsDrawerOpen(false)}
            className="flex items-center justify-between p-3 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 hover:bg-red-900/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Área de Emergência SOS</span>
                <span className="text-[10px] text-red-300">Telefones 24h e consulados</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 space-y-2">
          {authUser ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full h-10 border-slate-700 bg-slate-900 text-slate-300 hover:bg-red-950 hover:text-red-200 hover:border-red-800 text-xs font-semibold rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" /> Encerrar Sessão
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setIsDrawerOpen(false)}>
                <Button
                  size="sm"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold h-9 rounded-xl"
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsDrawerOpen(false)}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold h-9 rounded-xl"
                >
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
          <p className="text-center text-[10px] text-slate-500 pt-1">
            SafeTrip • Filosofia: Autonomia não é desconfiança
          </p>
        </div>
      </aside>
    </>
  )
}

export default NavigationHeader
