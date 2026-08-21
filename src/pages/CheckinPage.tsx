import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BellRing,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Shield,
  Volume2,
  Camera,
  Mic,
  Video,
  Send,
  AlertTriangle,
  History,
  Info,
  Mail,
  Settings2,
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  Users,
  Check,
  X,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Switch } from '../components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { useTrip } from '../context/TripContext'
import { CheckinStatus, CheckinFrequency } from '../types/trip'

export const CheckinPage: React.FC = () => {
  const { currentTrip, performCheckin, updateCheckinConfig, simulateAbsenceStage } = useTrip()
  const {
    checkinConfig,
    checkinHistory,
    absenceNotifications,
    currentAbsenceStage = 0,
    lastCheckinAt,
    destinationCity,
    destinationCountry,
    guardians,
  } = currentTrip

  const [selectedStatus, setSelectedStatus] = useState<CheckinStatus>('ok')
  const [customNote, setCustomNote] = useState<string>('')
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false)
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)

  // Config local form state
  const [frequency, setFrequency] = useState<CheckinFrequency>(
    checkinConfig.frequency || 'every_12h',
  )
  const [startTime, setStartTime] = useState<string>(checkinConfig.startTime || '08:00')
  const [preferredTime, setPreferredTime] = useState<string>(checkinConfig.preferredTime || '21:00')
  const [notifyGuardians, setNotifyGuardians] = useState<boolean>(
    checkinConfig.notifyGuardiansOnAbsence ?? true,
  )
  const [isActive, setIsActive] = useState<boolean>(checkinConfig.active ?? true)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateCheckinConfig({
      frequency,
      startTime,
      preferredTime,
      notifyGuardiansOnAbsence: notifyGuardians,
      active: isActive,
    })
    setIsConfigOpen(false)
  }

  const handleSendCheckin = (status: CheckinStatus) => {
    performCheckin(
      status,
      customNote ||
        (status === 'ok'
          ? 'Estou bem! Tudo sob controle no destino.'
          : status === 'cannot_speak'
            ? 'Não consigo falar no momento. Check-in discreto enviado aos Guardians.'
            : 'Check-in com ressalvas.'),
    )
    setJustSubmitted(true)
    setCustomNote('')
    setTimeout(() => setJustSubmitted(false), 5000)
  }

  const handleRunSimulation = async (stage: 1 | 2 | 3 | 4) => {
    setIsSimulating(true)
    await simulateAbsenceStage(stage)
    setTimeout(() => setIsSimulating(false), 800)
  }

  const getFrequencyLabel = (freq: CheckinFrequency) => {
    switch (freq) {
      case 'every_4h':
        return 'A cada 4 horas'
      case 'every_6h':
        return 'A cada 6 horas'
      case 'every_8h':
        return 'A cada 8 horas'
      case 'every_12h':
        return 'A cada 12 horas'
      case 'every_24h':
      case 'daily_once':
        return 'A cada 24 horas (1x ao dia)'
      case 'daily_twice':
        return '2x ao dia'
      default:
        return 'A cada 12 horas'
    }
  }

  const getStageBadge = (stage: number) => {
    switch (stage) {
      case 0:
        return (
          <Badge className="bg-emerald-600 text-white font-bold text-xs">Normal / Em dia</Badge>
        )
      case 1:
        return (
          <Badge className="bg-sky-600 text-white font-bold text-xs animate-pulse">
            Etapa 1: Aviso Viajante (+30min)
          </Badge>
        )
      case 2:
        return (
          <Badge className="bg-amber-600 text-white font-bold text-xs animate-pulse">
            Etapa 2: Lembrete Reforçado (+1h)
          </Badge>
        )
      case 3:
        return (
          <Badge className="bg-orange-600 text-white font-bold text-xs animate-pulse">
            Etapa 3: Alerta Preventivo Guardians (+3h)
          </Badge>
        )
      case 4:
        return (
          <Badge className="bg-red-600 text-white font-bold text-xs animate-pulse">
            Etapa 4: Alerta Geral de Ausência (+6h)
          </Badge>
        )
      default:
        return <Badge className="bg-slate-600 text-white font-bold text-xs">Normal</Badge>
    }
  }

  const notifsList = absenceNotifications || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1 text-center sm:text-left">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
          >
            Protocolo de Ausência com Notificações Reais
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Check-in & Segurança Periódica
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Confirme seu bem-estar na frequência escolhida. Se não responder, o sistema notifica
            você e seus Guardians por e-mail em 4 etapas progressivas.
          </p>
        </div>

        {/* Configuration Trigger Dialog */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-300 hover:border-sky-400 text-slate-800 font-bold text-xs h-10 px-4 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Settings2 className="w-4 h-4 text-sky-600" />
              <span>Configurar Frequência & Alertas</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                Configuração do Check-in Periódico
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Ajuste os intervalos, horários e autorização de notificação por e-mail aos seus
                Guardians.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveConfig} className="space-y-4 pt-2 text-xs">
              {/* Frequency */}
              <div className="space-y-1.5">
                <Label htmlFor="freqSelect" className="font-semibold text-slate-900">
                  Frequência de Check-in
                </Label>
                <Select
                  value={frequency}
                  onValueChange={(v) => setFrequency(v as CheckinFrequency)}
                >
                  <SelectTrigger id="freqSelect" className="h-9 text-xs">
                    <SelectValue placeholder="Selecione a frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="every_4h">A cada 4 horas</SelectItem>
                    <SelectItem value="every_6h">A cada 6 horas</SelectItem>
                    <SelectItem value="every_8h">A cada 8 horas</SelectItem>
                    <SelectItem value="every_12h">A cada 12 horas (Padrão)</SelectItem>
                    <SelectItem value="every_24h">A cada 24 horas</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-[11px] text-slate-500 block">
                  Com que frequência você deseja enviar o "Estou bem".
                </span>
              </div>

              {/* Start Time & Preferred Evening Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="startTime" className="font-semibold text-slate-900">
                    Horário de Início
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prefTime" className="font-semibold text-slate-900">
                    Horário Principal (Noite)
                  </Label>
                  <Input
                    id="prefTime"
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Toggle: Notify Guardians on absence */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="toggleGuardians"
                    className="font-bold text-slate-900 cursor-pointer block"
                  >
                    Notificar Guardians por e-mail em caso de ausência
                  </Label>
                  <p className="text-[11px] text-slate-500">
                    Caso você não responda nas etapas 3 (3h) e 4 (6h), seus Guardians receberão
                    e-mail com instruções.
                  </p>
                </div>
                <Switch
                  id="toggleGuardians"
                  checked={notifyGuardians}
                  onCheckedChange={setNotifyGuardians}
                />
              </div>

              {/* Toggle: Check-in Active */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="toggleActive"
                    className="font-bold text-slate-900 cursor-pointer block"
                  >
                    Monitoramento ativo durante esta viagem
                  </Label>
                  <p className="text-[11px] text-slate-500">
                    O cron do backend verifica pendências a cada 5 minutos.
                  </p>
                </div>
                <Switch id="toggleActive" checked={isActive} onCheckedChange={setIsActive} />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsConfigOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Salvar Configuração
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Live Protocol Status Banner */}
      <Card
        className={`border shadow-sm ${
          currentAbsenceStage === 0
            ? 'bg-emerald-50/50 border-emerald-200'
            : currentAbsenceStage <= 2
              ? 'bg-amber-50/70 border-amber-300'
              : 'bg-red-50/70 border-red-300'
        }`}
      >
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                currentAbsenceStage === 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {currentAbsenceStage === 0 ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Status do Protocolo de Ausência:</span>
                {getStageBadge(currentAbsenceStage)}
              </div>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Frequência: <strong>{getFrequencyLabel(checkinConfig.frequency)}</strong> | Início:{' '}
                <strong>{checkinConfig.startTime || '08:00'}</strong> | Alertas a Guardians:{' '}
                <strong>{checkinConfig.notifyGuardiansOnAbsence ? 'Ativado' : 'Desativado'}</strong>
                {lastCheckinAt &&
                  ` | Último check-in: ${new Date(lastCheckinAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>
          </div>

          {currentAbsenceStage > 0 && (
            <Button
              size="sm"
              onClick={() =>
                performCheckin('ok', 'Protocolo de ausência cancelado pelo próprio viajante.')
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Normalizar / Cancelar Protocolo</span>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Main Check-in Action Screen: "Você está bem?" */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/40 text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Horário Programado: {checkinConfig.preferredTime} (
            {destinationCity})
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">"Você está bem?"</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Selecione uma das opções abaixo para registrar seu estado atual e manter seus Guardians
            tranquilos:
          </p>
        </div>

        {justSubmitted && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Check-in registrado com sucesso! Protocolo zerado e rede de Guardians atualizada.
            </span>
          </div>
        )}

        {/* 4 Main Response Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-2">
          {/* Button 1: ESTOU BEM */}
          <Button
            onClick={() => handleSendCheckin('ok')}
            className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-6 h-6" />
            <div className="text-left">
              <span className="block">ESTOU BEM</span>
              <span className="text-[11px] font-normal text-emerald-100 block">
                Tudo tranquilo e seguro
              </span>
            </div>
          </Button>

          {/* Button 2: NÃO CONSIGO FALAR */}
          <Button
            onClick={() => handleSendCheckin('cannot_speak')}
            className="h-16 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Volume2 className="w-6 h-6" />
            <div className="text-left">
              <span className="block">NÃO CONSIGO FALAR</span>
              <span className="text-[11px] font-normal text-amber-100 block">
                Alerta discreto aos Guardians
              </span>
            </div>
          </Button>

          {/* Button 3: PRECISO DE AJUDA */}
          <Link to="/emergency" className="block">
            <Button className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 transition-transform active:scale-95">
              <AlertTriangle className="w-6 h-6" />
              <div className="text-left">
                <span className="block">PRECISO DE AJUDA</span>
                <span className="text-[11px] font-normal text-red-100 block">
                  Abrir Modo de Emergência
                </span>
              </div>
            </Button>
          </Link>

          {/* Button 4: PAUSAR / ADIAR 1H */}
          <Button
            variant="outline"
            onClick={() => handleSendCheckin('cancelled')}
            className="h-16 border-white/20 text-white hover:bg-white/10 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2"
          >
            <span>Pausar / Adiar 1h</span>
          </Button>
        </div>

        {/* Optional Custom Note */}
        <div className="max-w-md mx-auto pt-2 space-y-2">
          <Input
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Mensagem rápida opcional (ex: 'Cheguei ao hotel após o jantar')"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-xs h-9"
          />
        </div>
      </div>

      {/* Protocol of Absence (4 Etapas com notificações reais) */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/50">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                <Clock className="w-4 h-4 text-amber-600" /> Protocolo de Ausência em 4 Etapas
                (Notificações Reais)
              </CardTitle>
              <CardDescription className="text-xs">
                Quando um check-in programado não recebe resposta após 30 minutos de tolerância:
              </CardDescription>
            </div>
            {/* Simulation test buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-500 font-semibold">Testar etapas:</span>
              <Button
                variant="outline"
                size="sm"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(1)}
                className="h-6 text-[10px] px-2 border-slate-300"
              >
                Etapa 1
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(2)}
                className="h-6 text-[10px] px-2 border-slate-300"
              >
                Etapa 2
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(3)}
                className="h-6 text-[10px] px-2 border-slate-300 text-amber-700"
              >
                Etapa 3
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isSimulating}
                onClick={() => handleRunSimulation(4)}
                className="h-6 text-[10px] px-2 border-slate-300 text-red-700"
              >
                Etapa 4
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Stage 1 */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                currentAbsenceStage === 1
                  ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 block text-xs">Etapa 1: +30 min</span>
                <Badge className="bg-sky-100 text-sky-800 text-[9px] font-semibold">
                  Para você
                </Badge>
              </div>
              <p className="text-slate-700 font-medium text-[11px]">
                "Você não respondeu ao seu check-in. Está tudo bem?"
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                E-mail direto com botão rápido para você confirmar e zerar o protocolo.
              </p>
            </div>

            {/* Stage 2 */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                currentAbsenceStage === 2
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 block text-xs">Etapa 2: +1h</span>
                <Badge className="bg-amber-100 text-amber-800 text-[9px] font-semibold">
                  Para você
                </Badge>
              </div>
              <p className="text-slate-700 font-medium text-[11px]">
                "Segunda tentativa de contato. Se estiver bem, por favor confirme."
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                Tom mais urgente avisando que a próxima etapa acionará seus Guardians.
              </p>
            </div>

            {/* Stage 3 */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                currentAbsenceStage === 3
                  ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-900 block text-xs">Etapa 3: +3h</span>
                <Badge className="bg-orange-100 text-orange-800 text-[9px] font-semibold">
                  Guardians
                </Badge>
              </div>
              <p className="text-slate-700 font-medium text-[11px]">
                Alerta preventivo: ausência do check-in programado em {destinationCity}.
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                Enviado para Guardians de Segurança e Emergência cadastrados com e-mail.
              </p>
            </div>

            {/* Stage 4 */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
                currentAbsenceStage === 4
                  ? 'bg-red-50 border-red-400 ring-2 ring-red-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900 block text-xs">Etapa 4: +6h</span>
                <Badge className="bg-red-100 text-red-800 text-[9px] font-semibold">Todos</Badge>
              </div>
              <p className="text-slate-700 font-medium text-[11px]">
                Alerta de ausência prolongada (6h) com endereço de hospedagem.
              </p>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                Enviado a TODOS os Guardians ativos com dados para eventual busca consular/policial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Log: History of Sent Absence Notifications */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-600" /> Histórico de Notificações por E-mail (Log
              Visual)
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              {notifsList.length} registro(s)
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Registro de e-mails disparados pelo PocketBase para o viajante e seus Guardians.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-2.5">
          {notifsList.map((notif) => (
            <div
              key={notif.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={
                      notif.stage === 1
                        ? 'bg-sky-600 text-white'
                        : notif.stage === 2
                          ? 'bg-amber-600 text-white'
                          : notif.stage === 3
                            ? 'bg-orange-600 text-white'
                            : 'bg-red-600 text-white'
                    }
                  >
                    Etapa {notif.stage}
                  </Badge>
                  <span className="font-semibold text-slate-800">{notif.subject}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                  <span>
                    Destinatário: <strong>{notif.recipientEmail}</strong> (
                    {notif.recipientName || 'Contato'})
                  </span>
                  <span>Tipo: {notif.recipientType}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 self-end sm:self-auto flex-shrink-0">
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  E-mail Transmitido
                </span>
                <span>{new Date(notif.sentAt).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          ))}

          {notifsList.length === 0 && (
            <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <Mail className="w-6 h-6 mx-auto mb-1 opacity-40" />
              <p className="text-xs">
                Nenhuma notificação de ausência precisou ser disparada até o momento.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Check-in History Logs */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" /> Histórico de Confirmações do Viajante
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-2.5">
          {checkinHistory.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      log.status === 'ok'
                        ? 'bg-emerald-600 text-white'
                        : log.status === 'needs_help'
                          ? 'bg-red-600 text-white'
                          : log.status === 'cannot_speak'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-600 text-white'
                    }
                  >
                    {log.status === 'ok'
                      ? 'Confirmação OK'
                      : log.status === 'needs_help'
                        ? 'SOS / Ajuda'
                        : log.status === 'cannot_speak'
                          ? 'Discreto'
                          : 'Cancelado / Adiado'}
                  </Badge>
                  <span className="text-slate-500">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{log.note}</p>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {log.locationApprox}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
