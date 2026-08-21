import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Shield,
  Compass,
  CheckSquare,
  Users,
  BellRing,
  AlertTriangle,
  BookOpen,
  FileText,
  Eye,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useTrip } from '../context/TripContext'

export const NavigationHeader: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentTrip, triggerQuickExit, isQuickExitActive } = useTrip()

  if (isQuickExitActive) {
    return null
  }

  const isEmergencyPage = location.pathname === '/emergency'

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Compass },
    { to: '/assessment', label: 'Avaliação & Score', icon: Shield },
    { to: '/checklist', label: 'Plano de Segurança', icon: CheckSquare },
    { to: '/guardians', label: 'Guardians', icon: Users },
    { to: '/checkin', label: 'Check-in', icon: BellRing },
    { to: '/library', label: 'Biblioteca', icon: BookOpen },
    { to: '/plan-spec', label: 'PLAN Mode (A-Q)', icon: FileText, highlight: true },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top Banner with philosophy & Quick Exit */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">Autonomia não é desconfiança:</span>
          <span className="hidden sm:inline text-slate-300">
            Você pode confiar em alguém e ainda garantir seus próprios recursos e saída
            independente.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick Exit Disguise Button */}
          <Button
            variant="destructive"
            size="sm"
            onClick={triggerQuickExit}
            className="h-6 px-2 text-[11px] bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1 shadow-sm transition-all"
            title="Disfarça instantaneamente a tela como previsão do tempo e notícias de viagem neutras"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden xs:inline">Saída Rápida</span> (Disfarce)
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Autonomia
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
              >
                SafeTrip
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block leading-none">
              Segurança e Autonomia em Viagens
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : item.highlight
                      ? 'text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-500'}`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Emergency Action */}
        <div className="flex items-center gap-2">
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
              <span>SOS Emergência</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/90 px-2 py-1 flex items-center justify-between overflow-x-auto text-xs scrollbar-none">
        {navLinks.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded text-[11px] whitespace-nowrap font-medium ${
                isActive
                  ? 'text-sky-700 font-bold bg-sky-100/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}

export const QuickExitOverlay: React.FC = () => {
  const { isQuickExitActive, restoreFromQuickExit } = useTrip()

  if (!isQuickExitActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-800 flex flex-col font-sans overflow-y-auto">
      {/* Neutral disguised weather & travel blog banner */}
      <div className="border-b bg-white px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
            ☀️
          </div>
          <span className="font-semibold text-sm text-slate-700">
            Mundo Clima & Dicas de Turismo Internacional
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={restoreFromQuickExit}
            className="text-xs text-slate-500 hover:text-slate-800 border-slate-300"
          >
            Retomar visualização do app
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Previsão do Tempo na Europa e América do Norte
              </h2>
              <p className="text-xs text-slate-500">
                Atualizado há 12 minutos via estações meteorológicas globais
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-light text-slate-700">21°C</span>
              <p className="text-xs text-slate-500">Céu limpo em Roma / Paris</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t text-center">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-600">Segunda</span>
              <span className="text-base font-bold text-slate-800">22°C / 14°C</span>
              <span className="text-[11px] text-slate-500">Ensolarado</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-600">Terça</span>
              <span className="text-base font-bold text-slate-800">20°C / 13°C</span>
              <span className="text-[11px] text-slate-500">Parcialmente nublado</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-600">Quarta</span>
              <span className="text-base font-bold text-slate-800">19°C / 12°C</span>
              <span className="text-[11px] text-slate-500">Poucas nuvens</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="block text-xs font-semibold text-slate-600">Quinta</span>
              <span className="text-base font-bold text-slate-800">23°C / 15°C</span>
              <span className="text-[11px] text-slate-500">Tempo aberto</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-semibold text-slate-800 text-sm">
            Artigo: 10 Museus e Parques Gratuitos em Capitais Europeias
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Planejar uma caminhada por centros históricos permite explorar arquitetura, gastronomia
            típica e praças monumentais sem gastar com transportes caros. Confira nosso guia de
            roteiros a pé e horários de visitação de catedrais e jardins públicos.
          </p>
          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <span>Categoria: Guias Culturais</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={restoreFromQuickExit}
              className="text-xs text-sky-600 hover:text-sky-800"
            >
              Voltar ao SafeTrip
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
