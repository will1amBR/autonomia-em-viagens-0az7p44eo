import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Calendar,
  Compass,
  ArrowUpRight,
  PlusCircle,
  FileText,
  ListTodo,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { useTrip } from '../context/TripContext'

export const DashboardPage: React.FC = () => {
  const { currentTrip, performCheckin, user, isLoadingTrip } = useTrip()
  const [checkinNote, setCheckinNote] = useState('')
  const [isPerformingCheckin, setIsPerformingCheckin] = useState(false)

  if (isLoadingTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Carregando dados da sua viagem...</p>
      </div>
    )
  }

  // EMPTY STATE FOR LOGGED IN USERS WITH NO TRIP
  if (!currentTrip) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto py-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-sky-500/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center border border-sky-400/30">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <Badge className="bg-sky-500/30 text-sky-200 border-sky-400/40 text-xs px-3 py-1">
              Olá, {user.name || 'Viajante'}!
            </Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Você ainda não tem nenhuma viagem
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Cadastre sua cidade de origem, país de destino e conexões para ter acesso imediato ao
              diagnóstico de autonomia, contatos de emergência e rede de guardiões.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/trips/new">
              <Button
                size="lg"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-8 h-12 rounded-xl shadow-lg hover:shadow-sky-500/30 transition-all text-base"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Criar minha primeira viagem
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Planejamento & Rota</h3>
            <p className="text-xs text-slate-600">
              Cadastre sua cidade de origem, escalas e destino final com proteção de dados.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Índice de Autonomia</h3>
            <p className="text-xs text-slate-600">
              Quiz pedagógico para mensurar sua liberdade e suporte em situações imprevistas.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Guardiões & Check-in</h3>
            <p className="text-xs text-slate-600">
              Protocolo de ausência escalonado para avisar contatos de confiança caso não faça
              check-in.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const {
    title,
    originCity,
    destinationCity,
    destinationCountry,
    transitCountries,
    departureDate,
    returnDate,
    currentAbsenceStage,
    scoreResult,
    guardians = [],
    checklist = [],
    checkinHistory = [],
    destinationInfo,
  } = currentTrip

  const handleQuickCheckin = async () => {
    setIsPerformingCheckin(true)
    try {
      await performCheckin('ok', checkinNote || 'Check-in de rotina realizado pelo Dashboard.')
      setCheckinNote('')
    } finally {
      setIsPerformingCheckin(false)
    }
  }

  const completedChecklist = checklist.filter((i) => i.completed).length
  const totalChecklist = checklist.length
  const checklistPercent =
    totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0

  const confirmedGuardians = guardians.length

  const scoreTier = scoreResult?.tier || 'HIGH'
  const isHigh = scoreTier === 'HIGH'
  const isModerate = scoreTier === 'MODERATE'

  return (
    <div className="space-y-6">
      {/* Top Welcome / Trip Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/30 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 mr-1" /> Painel de Viagem Ativa
              </Badge>
              {transitCountries && (
                <Badge variant="outline" className="text-xs border-white/20 text-slate-300">
                  Escala: {transitCountries}
                </Badge>
              )}
              <span className="text-xs text-slate-400">ID: {currentTrip.id}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>{originCity || 'Sua cidade'}</span>
              <span className="text-sky-400">→</span>
              <span>
                {destinationCity}, {destinationCountry}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {departureDate} até {returnDate}
              </span>
              {transitCountries && (
                <>
                  <span>•</span>
                  <span className="text-sky-300 font-medium">Escala: {transitCountries}</span>
                </>
              )}
              <span>•</span>
              <span className="text-sky-300 font-medium">
                {title || 'Viagem Monitorada SafeTrip'}
              </span>
            </p>
          </div>

          {/* Quick Check-in CTA button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleQuickCheckin}
              disabled={isPerformingCheckin}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 h-11 rounded-xl shadow-lg shadow-emerald-950/40 text-xs sm:text-sm"
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {isPerformingCheckin ? 'Confirmando...' : 'Fazer Check-in (Estou Bem)'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Grid: Autonomy Score & Critical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Autonomy Score Overview Card */}
        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Índice de Autonomia em Viagem
                </CardTitle>
                <CardDescription className="text-xs">
                  Diagnóstico baseado no questionário de segurança e dinâmica.
                </CardDescription>
              </div>
              <Link to="/score-result">
                <Button variant="ghost" size="sm" className="text-xs text-sky-600">
                  Ver Relatório <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black text-2xl border ${
                  isHigh
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : isModerate
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                <span>{scoreResult?.overallScore || 0}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">pts</span>
              </div>
              <div className="space-y-1">
                <Badge
                  className={
                    isHigh
                      ? 'bg-emerald-100 text-emerald-800'
                      : isModerate
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }
                >
                  {isHigh
                    ? 'Autonomia Elevada'
                    : isModerate
                      ? 'Autonomia Moderada'
                      : 'Atenção Necessária'}
                </Badge>
                <p className="text-xs text-slate-600 leading-snug">
                  {scoreResult?.summaryText ||
                    'Complete a avaliação para ver seus pontos fortes e vulnerabilidades.'}
                </p>
              </div>
            </div>

            {/* Recommendations / Next steps */}
            <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 text-xs text-sky-900 space-y-1">
              <span className="font-bold block">Recomendação prioritária:</span>
              <p>
                Mantenha seu passaporte sempre com você e confirme sua rede de guardiões antes da
                data de embarque.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Protocol of Absence Status Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" /> Protocolo de Ausência
            </CardTitle>
            <CardDescription className="text-xs">
              Monitoramento preventivo com seus guardiões.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div
              className={`p-3.5 rounded-xl border ${
                currentAbsenceStage === 0
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs">
                {currentAbsenceStage === 0 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>
                  {currentAbsenceStage === 0
                    ? 'Status Seguro (Etapa 0)'
                    : `Protocolo Ativado (Etapa ${currentAbsenceStage})`}
                </span>
              </div>
              <p className="text-[11px] mt-1 text-slate-600">
                {currentAbsenceStage === 0
                  ? 'Último check-in recente. Nenhum alerta pendente.'
                  : 'Ausência de confirmação detectada. Procedimentos de verificação em andamento.'}
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Guardiões Cadastrados:</span>
                <span className="font-bold text-slate-800">{confirmedGuardians} contato(s)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Intervalo de Check-in:</span>
                <span className="font-bold text-slate-800">
                  A cada {currentTrip.checkinConfig?.expectedFrequency === 'twice_daily' ? '12h' : currentTrip.checkinConfig?.expectedFrequency === 'multiple_daily' ? '6h' : '24h'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Último Registro:</span>
                <span className="font-bold text-slate-800">
                  {checkinHistory[0]?.timestamp
                    ? new Date(checkinHistory[0].timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Nenhum'}
                </span>
              </div>
            </div>

            <Link to="/guardians" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Gerenciar Guardiões
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Checklist, Library, Emergency Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checklist Progress */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-sky-600" /> Checklist Pré-Viagem
              </CardTitle>
              <Link to="/checklist">
                <Button variant="ghost" size="sm" className="text-xs text-sky-600">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Progresso dos itens</span>
                <span className="font-bold text-slate-900">
                  {completedChecklist} de {totalChecklist} ({checklistPercent}%)
                </span>
              </div>
              <Progress value={checklistPercent} className="h-2" />
            </div>

            <div className="space-y-2 pt-2">
              {checklist.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="mt-0.5 rounded text-sky-600"
                  />
                  <span
                    className={`font-medium ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Library Quick Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Biblioteca de Segurança
            </CardTitle>
            <CardDescription className="text-xs">
              Guias de autonomia, passaportes e leis locais.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">
                Controle de Passaporte & Cópias
              </span>
              <p className="text-[11px] text-slate-600">
                Por que você nunca deve entregar seu passaporte a terceiros.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-bold text-slate-900 block">
                Leis de Entrada & Conexões Internacionais
              </span>
              <p className="text-[11px] text-slate-600">
                Cuidados com escalas e regras consulares no país de trânsito.
              </p>
            </div>
            <Link to="/library" className="block pt-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Acessar Biblioteca
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Destination & Transit Emergency Contacts */}
        <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-sky-50/30">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <MapPin className="w-4 h-4 text-sky-600" /> Contatos de Emergência & Trânsito
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Polícia ({destinationCountry}):</span>
              <span className="font-bold text-slate-900">
                {destinationInfo?.policeNumber || '112'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Emergência Geral:</span>
              <span className="font-bold text-slate-900">
                {destinationInfo?.generalEmergencyNumber || '112'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Plantão Consular BR:</span>
              <span className="font-bold text-sky-700">
                {destinationInfo?.consulateEmergency24h || '+39 333 306 0545'}
              </span>
            </div>

            {transitCountries && (
              <div className="p-2.5 rounded-xl bg-white border border-sky-200/80 space-y-1 mt-2">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wide block">
                  Escala / Conexão: {transitCountries}
                </span>
                <p className="text-[11px] text-slate-600">
                  {transitCountries.toLowerCase().includes('londres') ||
                  transitCountries.toLowerCase().includes('reino unido') ||
                  transitCountries.toLowerCase().includes('uk')
                    ? 'Plantão Consular Londres: +44 772 108 8431 • Emergência UK: 999'
                    : 'Tenha o telefone do consulado do país de escala salvo.'}
                </p>
              </div>
            )}

            <p className="text-[11px] text-slate-500 pt-1">
              Consulado: {destinationInfo?.consulateAddress || destinationCity} • Suporte 24h
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default DashboardPage
