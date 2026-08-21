import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Shield,
  LifeBuoy,
  BookOpen,
  CheckSquare,
  Users,
  Compass,
  FileCheck,
  AlertTriangle,
  Menu,
  X,
  Lock,
  EyeOff,
  LogOut,
  ExternalLink,
  ShieldAlert,
  User,
  Search,
  RotateCcw,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useTrip } from '../context/TripContext'
import { useAuth } from '../context/AuthContext'

export const QuickExitOverlay: React.FC = () => {
  const { isQuickExitActive, restoreFromQuickExit } = useTrip()

  if (!isQuickExitActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-800 flex flex-col p-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Fake Search Engine Look */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-blue-600">G</span>
            <span className="text-2xl font-bold tracking-tight text-red-500">o</span>
            <span className="text-2xl font-bold tracking-tight text-amber-500">o</span>
            <span className="text-2xl font-bold tracking-tight text-blue-600">g</span>
            <span className="text-2xl font-bold tracking-tight text-green-600">l</span>
            <span className="text-2xl font-bold tracking-tight text-red-500">e</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={restoreFromQuickExit}
            className="text-[11px] text-slate-400 hover:text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Restaurar app</span>
          </Button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            defaultValue="receitas de culinária simples para o almoço"
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-full shadow-sm outline-none"
            readOnly
          />
        </div>

        <div className="space-y-4 text-xs text-slate-600">
          <div className="space-y-1">
            <span className="text-blue-700 text-sm font-medium hover:underline cursor-pointer block">
              15 Receitas Rápidas de Almoço para o Dia a Dia - TudoGostoso
            </span>
            <p className="text-slate-500">
              Confira receitas práticas e fáceis prontas em menos de 20 minutos com ingredientes que
              você já tem em casa...
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-blue-700 text-sm font-medium hover:underline cursor-pointer block">
              Almoço de Domingo: 20 ideias de pratos saborosos e fáceis
            </span>
            <p className="text-slate-500">
              Dicas de massas, assados e saladas completas para reunir a família com praticidade...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const NavigationHeader: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { triggerQuickExit, isQuickExitActive } = useTrip()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (isQuickExitActive) {
    return null
  }

  const navItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: Compass },
    { label: 'Autonomia (Quiz)', path: '/assessment', icon: FileCheck },
    { label: 'Guardians', path: '/guardians', icon: Users },
    { label: 'Check-in', path: '/checkin', icon: LifeBuoy },
    { label: 'Checklist', path: '/checklist', icon: CheckSquare },
    { label: 'Biblioteca', path: '/security-library', icon: BookOpen },
  ]

  const isEmergencyPage = location.pathname === '/emergency'

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Quick Exit Bar Top (Discreet Safety Feature) */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-300">
            Ambiente Seguro • Dados Privados
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerQuickExit}
            className="h-6 px-2 text-[11px] text-amber-300 hover:text-amber-200 hover:bg-slate-800 flex items-center gap-1 font-semibold"
            title="Disfarce rápido da tela imediatamente"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Saída Rápida (Quick Exit)</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                SafeTrip
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-semibold bg-sky-100 text-sky-800"
              >
                Autonomia
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:inline">
              Autonomia Não É Desconfiança
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-9 text-xs font-medium gap-1.5 ${
                    isActive ? 'font-semibold text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Emergency Button */}
          <Link to="/emergency">
            <Button
              variant={isEmergencyPage ? 'default' : 'destructive'}
              size="sm"
              className={`h-9 font-bold px-3 text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                isEmergencyPage
                  ? 'bg-red-700 text-white animate-pulse'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Modo Emergência</span>
              <span className="sm:hidden">Emergência</span>
            </Button>
          </Link>

          {/* User Auth Info / Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200">
              {isAdmin && (
                <Link to="/admin/dashboard" title="Painel Admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-2.5 text-xs font-bold text-amber-800 bg-amber-50 border-amber-300 hover:bg-amber-100 gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden xl:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout()
                  navigate('/entrar')
                }}
                className="h-9 px-2 text-xs text-slate-500 hover:text-red-600 gap-1"
                title="Sair"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <Link to="/entrar" className="pl-1">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs font-bold text-sky-700 border-sky-300 hover:bg-sky-50"
              >
                Entrar
              </Button>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menu de navegação"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-border/80 bg-background/98 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <div
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            )
          })}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>Painel de Administração</span>
                    </div>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                    navigate('/entrar')
                  }}
                  className="w-full text-xs text-red-600 border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <span>Encerrar Sessão ({user?.email})</span>
                </Button>
              </>
            ) : (
              <Link to="/entrar" onClick={() => setMobileOpen(false)} className="block">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold">
                  Entrar no SafeTrip
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
