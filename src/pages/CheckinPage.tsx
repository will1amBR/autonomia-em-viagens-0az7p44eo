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
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { useTrip } from '../context/TripContext'
import { CheckinStatus } from '../types/trip'

export const CheckinPage: React.FC = () => {
  const { currentTrip, performCheckin, updateCheckinConfig } = useTrip()
  const { checkinConfig, checkinHistory, destinationCity, destinationCountry, guardians } =
    currentTrip

  const [selectedStatus, setSelectedStatus] = useState<CheckinStatus>('ok')
  const [customNote, setCustomNote] = useState<string>('')
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false)

  const handleSendCheckin = (status: CheckinStatus) => {
    performCheckin(
      status,
      customNote ||
        (status === 'ok' ? 'Estou bem! Tudo sob controle no destino.' : 'Check-in com ressalvas.'),
    )
    setJustSubmitted(true)
    setCustomNote('')
    setTimeout(() => setJustSubmitted(false), 4000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <Badge
          variant="outline"
          className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
        >
          Check-in Periódico & Protocolo de Ausência
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Confirmação de Segurança
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Envie sua confirmação de rotina para tranquilizar seus Guardians ou acione ajuda discreta
          se necessário.
        </p>
      </div>

      {/* Main Check-in Action Screen: "Você está bem?" */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/40 text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">
            Horário Programado: {checkinConfig.preferredTime} ({destinationCity})
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">"Você está bem?"</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Selecione uma das opções abaixo para registrar seu estado atual:
          </p>
        </div>

        {justSubmitted && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-emerald-300 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Check-in registrado com sucesso! Notificação enviada aos Guardians.</span>
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

          {/* Button 4: CANCELAR CHECK-IN */}
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
            placeholder="Mensagem rápida opcional (ex: 'Cheguei ao restaurante')"
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-xs h-9"
          />
        </div>
      </div>

      {/* Multi-level Check-in Architecture (V1 / V2 Roadmap) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" /> Modalidades do Check-in Multinível
          </CardTitle>
          <CardDescription className="text-xs">
            Níveis modulares configurados pelo próprio viajante (sem obrigatoriedade de rastreio)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs text-center">
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl space-y-1">
              <Badge className="bg-sky-600 text-white text-[10px]">Nível 1 (Ativo)</Badge>
              <span className="block font-bold text-slate-800">Confirmação</span>
              <p className="text-[10px] text-slate-600">1 toque no botão "Estou bem"</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <Badge variant="outline" className="text-[10px]">
                Nível 2
              </Badge>
              <span className="block font-bold text-slate-800">Foto Rápida</span>
              <p className="text-[10px] text-slate-500">Selfie ou foto do ambiente</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <Badge variant="outline" className="text-[10px]">
                Nível 3
              </Badge>
              <span className="block font-bold text-slate-800">Voz</span>
              <p className="text-[10px] text-slate-500">Áudio de 5s autenticado</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <Badge variant="outline" className="text-[10px]">
                Nível 4
              </Badge>
              <span className="block font-bold text-slate-800">Vídeo</span>
              <p className="text-[10px] text-slate-500">Breve gravação de segurança</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <Badge variant="outline" className="text-[10px]">
                Nível 5
              </Badge>
              <span className="block font-bold text-slate-800">Localização</span>
              <p className="text-[10px] text-slate-500">PIN aproximado voluntário</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protocol of Absence (Protocolo de Ausência - 4 Etapas) */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/50">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
            <Clock className="w-4 h-4 text-amber-600" /> Protocolo de Ausência Escalonada
          </CardTitle>
          <CardDescription className="text-xs">
            O que acontece quando você não realiza um check-in no horário combinado
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs">
                Etapa 1: Notificação Direta
              </span>
              <p className="text-slate-600 text-[11px]">
                O app envia aviso push/vibratório para o seu celular no horário programado.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-xs">
                Etapa 2: Nova Tentativa (+60min)
              </span>
              <p className="text-slate-600 text-[11px]">
                Segundo lembrete sonoro com contagem regressiva de segurança.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-amber-900 block text-xs">
                Etapa 3: Contato Preventivo
              </span>
              <p className="text-amber-800 text-[11px]">
                Mensagem moderada ao Guardian:{' '}
                <em>"Não recebemos a confirmação esperada. Este é um alerta preventivo."</em>
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-red-900 block text-xs">
                Etapa 4: Alerta de Segurança
              </span>
              <p className="text-red-800 text-[11px]">
                Liberação controlada do itinerário e contatos da hospedagem aos Guardians de
                Emergência.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in History Logs */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <History className="w-4 h-4 text-slate-600" /> Histórico de Check-ins Registrados
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
                          : 'Cancelado'}
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
