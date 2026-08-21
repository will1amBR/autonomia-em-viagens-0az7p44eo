import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  User,
  ShieldAlert,
  ArrowRight,
  Compass,
  Settings,
  Lock,
  Sparkles,
  Plane,
  HeartHandshake,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'

export const EntryGatewayPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200">
          <Shield className="w-3.5 h-3.5 text-sky-600" />
          <span>Portal de Acesso Seguro</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Como deseja acessar a plataforma?
        </h1>
        <p className="text-sm text-slate-600">
          Escolha o perfil adequado para gerenciar seu plano de viagem ou administrar conteúdos e
          estatísticas institucionais.
        </p>
      </div>

      {/* User Session Banner (if already logged in) */}
      {isAuthenticated && user && (
        <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center">
              {user.name[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-slate-100">
                Conectado como <span className="text-sky-300">{user.name}</span> ({user.email})
              </p>
              <p className="text-slate-400">
                Perfil: {user.role === 'admin' ? 'Administrador da Plataforma' : 'Viajante'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
              <Button
                size="sm"
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
              >
                Acessar meu Painel
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={logout}
              className="text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Sair
            </Button>
          </div>
        </div>
      )}

      {/* The Two Distinct Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Portal 1: Traveler Area */}
        <Card className="border-2 border-sky-200 hover:border-sky-500 bg-gradient-to-b from-sky-50/50 to-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-3xl overflow-hidden group">
          <div>
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 p-6 text-white space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-white shadow-inner mb-2 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <Badge className="bg-white text-sky-900 font-bold text-[10px] px-2.5">
                VIAJANTES & USUÁRIOS
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">Área do Cliente</h2>
              <p className="text-xs text-sky-100 leading-relaxed">
                Acesso completo ao plano de viagem, Quiz de Autonomia, Guardians e checklist de
                saída.
              </p>
            </div>

            <CardContent className="p-6 space-y-4 text-xs text-slate-600">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                  <span>Avalie sua autonomia em 7 pilares antes de embarcar</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                  <span>Cadastre contatos de segurança (Guardians) com notificações</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                  <span>Acesso a números consulares de emergência e check-ins diários</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></span>
                  <span>Quick Exit ativado com 1 clique para discrição</span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-6 pt-0 space-y-2.5">
            <Link to="/entrar/cliente" className="block w-full">
              <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-600/20 text-sm">
                <span>Entrar como Viajante</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <div className="text-center">
              <Link
                to="/cadastro"
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold underline underline-offset-2"
              >
                Ainda não tem conta? Crie gratuitamente
              </Link>
            </div>
          </div>
        </Card>

        {/* Portal 2: Admin Area */}
        <Card className="border-2 border-slate-300 hover:border-slate-800 bg-gradient-to-b from-slate-50 to-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-3xl overflow-hidden group">
          <div>
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-white shadow-inner mb-2 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 text-amber-400" />
              </div>
              <Badge className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5">
                GESTÃO & CONTEÚDO
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight">Área Administrativa</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Painel de controle institucional para gerenciar métricas, destinos consulares e
                protocolos.
              </p>
            </div>

            <CardContent className="p-6 space-y-4 text-xs text-slate-600">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                  <span>Dashboard de métricas globais (usuários, viagens, scores médios)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                  <span>CRUD completo de destinos e contatos consulares/hospitais</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                  <span>Editor de artigos e orientações da Biblioteca de Segurança</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></span>
                  <span>Gestão de permissões de administradores</span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-6 pt-0 space-y-2.5">
            <Link to="/admin/login" className="block w-full">
              <Button
                variant="outline"
                className="w-full border-slate-800 text-slate-900 hover:bg-slate-900 hover:text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Acessar Painel Administrativo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                Acesso restrito a usuários com permissão{' '}
                <code className="text-slate-600">role: admin</code>
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Assurance Footer */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
        <HeartHandshake className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <p>
          <strong className="text-slate-800">Privacidade Absoluta:</strong> Seus dados de viagem e
          respostas da avaliação são criptografados e acessíveis exclusivamente por você e pelos
          Guardians autorizados.
        </p>
      </div>
    </div>
  )
}
