import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Compass,
  CheckSquare,
  Users,
  BellRing,
  AlertTriangle,
  Plane,
  Calendar,
  MapPin,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  BookOpen,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { useTrip } from '../context/TripContext'

export const DashboardPage: React.FC = () => {
  const { currentTrip, performCheckin } = useTrip()
  const {
    title,
    destinationCity,
    destinationCountry,
    departureDate,
    returnDate,
    scoreResult,
    checklist,
    guardians,
    checkinConfig,
    checkinHistory,
  } = currentTrip

  const completedCount = checklist.filter((item) => item.completed).length
  const totalChecklist = checklist.length
  const pendingCount = totalChecklist - completedCount

  const lastCheckin = checkinHistory[0]

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl space-y-6">
      {/* Top Banner Card: Trip Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs px-2.5 py-0.5">
                Minha Viagem Ativa
              </Badge>
              <span className="text-xs text-slate-400">ID: {currentTrip.id}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>São Paulo</span>
              <span className="text-sky-400">→</span>
              <span>
                {destinationCity} ({destinationCountry})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {departureDate} até {returnDate}
              </span>
              <span>•</span>
              <span className="text-slate-400">{title}</span>
            </p>
          </div>

          {/* Quick Check-in CTA button */}
          <div className="flex items-center gap-2">
            <Link to="/checkin">
              <Button className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-extrabold text-xs sm:text-sm px-5 h-10 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20">
                <BellRing className="w-4 h-4" />
                <span>Fazer Check-in</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 5 Core Metric Cards on Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {/* Metric 1: Score */}
          <Link
            to="/assessment"
            className="p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold block">
              Autonomia
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{scoreResult.overallScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <span
              className={`text-[10px] font-bold ${scoreResult.tier === 'HIGH' ? 'text-emerald-400' : scoreResult.tier === 'MODERATE' ? 'text-amber-400' : 'text-rose-400'}`}
            >
              Nível{' '}
              {scoreResult.tier === 'HIGH'
                ? 'Alto'
                : scoreResult.tier === 'MODERATE'
                  ? 'Moderado'
                  : 'Baixo'}
            </span>
          </Link>

          {/* Metric 2: Preparation Checklist */}
          <Link
            to="/checklist"
            className="p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block">
              Preparação
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{completedCount}</span>
              <span className="text-xs text-slate-400">/{totalChecklist}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              {Math.round((completedCount / totalChecklist) * 100)}% concluído
            </span>
          </Link>

          {/* Metric 3: Guardians */}
          <Link
            to="/guardians"
            className="p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold block">
              Guardians
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{guardians.length}</span>
              <span className="text-xs text-slate-400">contatos</span>
            </div>
            <span className="text-[10px] text-indigo-300 font-medium">Rede de apoio ativa</span>
          </Link>

          {/* Metric 4: Next Check-in */}
          <Link
            to="/checkin"
            className="p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
              Próx. Check-in
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">{checkinConfig.preferredTime}</span>
            </div>
            <span className="text-[10px] text-amber-300 font-medium">Diário programado</span>
          </Link>

          {/* Metric 5: Pending items */}
          <Link
            to="/checklist"
            className="p-3.5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/10 space-y-1 col-span-2 sm:col-span-1"
          >
            <span className="text-[11px] uppercase tracking-wider text-rose-300 font-bold block">
              Pendências
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{pendingCount}</span>
              <span className="text-xs text-slate-400">itens</span>
            </div>
            <span className="text-[10px] text-rose-300 font-bold">Resolver antes</span>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Actionable Checklist & Score Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          {/* Priority Checklist Items */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-600" /> Pendências Críticas de Autonomia
                </CardTitle>
                <CardDescription className="text-xs">
                  Itens essenciais para garantir que você não dependa de terceiros para voltar
                </CardDescription>
              </div>
              <Link to="/checklist">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-sky-600 hover:text-sky-800"
                >
                  Ver todos ({totalChecklist}) →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5">
              {checklist
                .filter((item) => !item.completed)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                      <p className="text-[11px] text-slate-600">{item.whyItMatters}</p>
                    </div>
                    <Link to="/checklist">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px] border-slate-300 font-semibold"
                      >
                        Resolver
                      </Button>
                    </Link>
                  </div>
                ))}

              {pendingCount === 0 && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-emerald-900">
                    Parabéns! Todos os itens do plano foram concluídos.
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Sua autonomia de viagem está plenamente estruturada.
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Link to="/checklist">
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5">
                    <span>Resolver pendências no Plano de Segurança</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Independence Breakdown */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Diagnóstico Rápido de Autonomia
              </CardTitle>
              <CardDescription className="text-xs">
                Baseado em suas respostas de passagens, controle documental e recursos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Retorno</span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.return}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.return} className="h-1.5" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Financeiro</span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.finances}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.finances} className="h-1.5" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Documentação
                  </span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.documentation}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.documentation} className="h-1.5" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Comunicação
                  </span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.communication}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.communication} className="h-1.5" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Hospedagem & Saída
                  </span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.housing}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.housing} className="h-1.5" />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Rede Proteção
                  </span>
                  <div className="flex justify-between text-xs font-bold">
                    <span>{scoreResult.breakdown.protectionNetwork}%</span>
                  </div>
                  <Progress value={scoreResult.breakdown.protectionNetwork} className="h-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Guardians, Destination & Quick Emergency */}
        <div className="lg:col-span-4 space-y-6">
          {/* Guardians Widget */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" /> Meus Guardians
              </CardTitle>
              <Link to="/guardians">
                <Button variant="ghost" size="sm" className="text-xs text-sky-600 h-7 px-2">
                  Gerenciar →
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2.5">
              {guardians.map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{g.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {g.relationship} • {g.phone}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {g.accessType === 'emergency'
                      ? 'Emergência'
                      : g.accessType === 'security'
                        ? 'Segurança'
                        : 'Básico'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Destination Safety Quick Card */}
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-sky-50/30">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <MapPin className="w-4 h-4 text-sky-600" /> Contatos em {destinationCountry}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Polícia Geral:</span>
                <span className="font-bold text-slate-900">
                  {currentTrip.destinationInfo.policeNumber}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Emergência Médica:</span>
                <span className="font-bold text-slate-900">
                  {currentTrip.destinationInfo.medicalEmergencyNumber}
                </span>
              </div>
              <div className="py-1 space-y-1">
                <span className="text-slate-500 font-medium block">Plantão Consular 24h:</span>
                <span className="font-bold text-sky-700 block">
                  {currentTrip.destinationInfo.consulateEmergency24h}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick SOS Card */}
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Precisa de Saída Rápida ou Ajuda?</span>
            </div>
            <p className="text-[11px] text-red-700 leading-relaxed">
              O Modo de Emergência aciona seus contatos com 1 clique e mostra locais seguros
              próximos.
            </p>
            <Link to="/emergency" className="block pt-1">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 rounded-lg shadow-sm">
                Abrir Modo de Emergência
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
