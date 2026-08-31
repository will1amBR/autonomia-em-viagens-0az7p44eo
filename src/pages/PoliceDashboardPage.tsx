import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  MapPin,
  Clock,
  Smartphone,
  Camera,
  AlertTriangle,
  RefreshCw,
  Eye,
  User,
  Radio,
  ExternalLink,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface PolicePresenceLog {
  id: string
  user_id: string
  trip_id?: string
  event_type: string
  location_lat?: number
  location_lng?: number
  location_name?: string
  accuracy_meters?: number
  device_info?: string
  ip_address?: string
  battery_level?: string
  notes?: string
  is_duress?: boolean
  timestamp: string
  created: string
  expand?: {
    user_id?: { name?: string; email?: string; phone?: string }
    trip_id?: {
      title?: string
      destination_city?: string
      destination_country?: string
      host_responsible_person?: string
      host_phone?: string
      accommodation_address?: string
    }
  }
}

interface PoliceDuressAlert {
  id: string
  user_id: string
  trip_id?: string
  trigger_method: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  device_info?: string
  notified_guardians_count?: number
  notified_police?: boolean
  status: string
  timestamp: string
  created: string
  expand?: {
    user_id?: { name?: string; email?: string; phone?: string }
    trip_id?: {
      title?: string
      destination_city?: string
      destination_country?: string
      host_responsible_person?: string
      host_phone?: string
      accommodation_address?: string
    }
  }
}

interface PoliceMediaItem {
  id: string
  user_id: string
  trip_id?: string
  media_type: string
  file: string
  caption?: string
  location_approx?: string
  location_lat?: number
  location_lng?: number
  taken_under_duress?: boolean
  device_info?: string
  timestamp: string
  created: string
  fileUrl?: string
}

export const PoliceDashboardPage: React.FC = () => {
  const { user: authUser } = useAuth()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'alerts' | 'presence' | 'media'>('alerts')
  const [duressAlerts, setDuressAlerts] = useState<PoliceDuressAlert[]>([])
  const [presenceLogs, setPresenceLogs] = useState<PolicePresenceLog[]>([])
  const [mediaList, setMediaList] = useState<PoliceMediaItem[]>([])
  const [searchFilter, setSearchFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<PoliceDuressAlert | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch duress alerts
      const alertsResult = await pb.collection('duress_alerts').getList(1, 50, {
        sort: '-created',
        expand: 'user_id,trip_id',
      })
      setDuressAlerts(alertsResult.items as any)

      // 2. Fetch presence logs
      const logsResult = await pb.collection('presence_logs').getList(1, 100, {
        sort: '-created',
        expand: 'user_id,trip_id',
      })
      setPresenceLogs(logsResult.items as any)

      // 3. Fetch confirmation media
      const mediaResult = await pb.collection('confirmation_media').getList(1, 50, {
        sort: '-created',
        expand: 'user_id,trip_id',
      })
      const itemsWithUrl = mediaResult.items.map((m) => {
        let fileUrl = ''
        if (m.file) {
          try {
            fileUrl = pb.files.getURL(m, m.file)
          } catch {
            /* intentionally ignored */
          }
        }
        return {
          ...m,
          fileUrl,
        } as unknown as PoliceMediaItem
      })
      setMediaList(itemsWithUrl)
    } catch (err: any) {
      console.error('Error loading police monitoring data:', err)
      toast({
        title: 'Aviso de Acesso Policial',
        description: 'Exibindo registros autorizados para sua jurisdição.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await pb.collection('duress_alerts').update(alertId, {
        status: 'investigating',
      })
      toast({
        title: 'Status atualizado',
        description: 'Alerta marcado como Em Investigação pelas autoridades.',
      })
      loadData()
    } catch (err: any) {
      console.error(err)
    }
  }

  const filteredAlerts = duressAlerts.filter((a) => {
    if (!searchFilter.trim()) return true
    const q = searchFilter.toLowerCase()
    const name = a.expand?.user_id?.name?.toLowerCase() || ''
    const email = a.expand?.user_id?.email?.toLowerCase() || ''
    const city = a.expand?.trip_id?.destination_city?.toLowerCase() || ''
    const addr = a.location_address?.toLowerCase() || ''
    return name.includes(q) || email.includes(q) || city.includes(q) || addr.includes(q)
  })

  const filteredLogs = presenceLogs.filter((l) => {
    if (!searchFilter.trim()) return true
    const q = searchFilter.toLowerCase()
    const name = l.expand?.user_id?.name?.toLowerCase() || ''
    const loc = l.location_name?.toLowerCase() || ''
    const notes = l.notes?.toLowerCase() || ''
    return name.includes(q) || loc.includes(q) || notes.includes(q)
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/40 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Canal de Cooperação Policial & Consular
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-400 border-slate-700">
              Operador: {authUser?.name || authUser?.email || 'Autoridade'}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Central de Monitoramento & Alertas sob Ameaça
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Painel restrito a autoridades policiais e de proteção consular para visualização de
            sinais silenciosos sob ameaça, última localização GPS conhecida (Last-Known) e
            comprovantes de presença de viajantes sob coação.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadData}
            disabled={isLoading}
            variant="outline"
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 h-10 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Philosophy note: Strict authorization & privacy */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sky-900">
          <Lock className="w-4 h-4 text-sky-700" />
          <span>Protocolo de Privacidade e Decisão do Usuário</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          O viajante autorizou expressamente o compartilhamento de sua presença e sinais silenciosos
          com a rede de segurança em caso de acionamento do protocolo de ausência ou disparo de
          sinal sob coação (duress alert). Trate todos os dados com confidencialidade e tom
          não-acusatório.
        </p>
      </div>

      {/* Filter and Stats bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar por viajante, cidade ou endereço..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9 h-10 text-xs rounded-xl bg-white border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
            {duressAlerts.filter((a) => a.status === 'dispatched').length} Alerta(s) Ativo(s)
          </Badge>
          <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-xs">
            {presenceLogs.length} Registro(s) de Presença
          </Badge>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-4">
        <TabsList className="grid grid-cols-3 max-w-md bg-slate-100 p-1 rounded-2xl">
          <TabsTrigger value="alerts" className="text-xs font-bold gap-1.5 rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Sinais de Coação ({duressAlerts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="presence" className="text-xs font-bold gap-1.5 rounded-xl">
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>Logs Last-Known ({presenceLogs.length})</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="text-xs font-bold gap-1.5 rounded-xl">
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mídias Periódicas ({mediaList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DURESS ALERTS */}
        <TabsContent value="alerts" className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-200 space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">Nenhum alerta de coação pendente</h3>
              <p className="text-xs text-slate-500">
                Quando um viajante aciona o sinal silencioso discreto (botão de volume, toque 3s ou
                código), o evento é transmitido imediatamente para cá.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => {
                const traveler = alert.expand?.user_id
                const trip = alert.expand?.trip_id
                const isDispatched = alert.status === 'dispatched'
                const googleMapsUrl =
                  alert.location_lat && alert.location_lng
                    ? `https://maps.google.com/?q=${alert.location_lat},${alert.location_lng}`
                    : null

                return (
                  <Card
                    key={alert.id}
                    className={`border transition-all shadow-sm ${
                      isDispatched ? 'border-red-300 bg-red-50/30' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <CardContent className="p-4 space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={
                              isDispatched
                                ? 'bg-red-600 text-white font-bold'
                                : 'bg-amber-500 text-white font-semibold'
                            }
                          >
                            {isDispatched ? '🚨 SOS ATIVO' : 'Em Investigação'}
                          </Badge>
                          <span className="font-bold text-slate-900 text-sm">
                            {traveler?.name || 'Viajante Protegido(a)'}
                          </span>
                          <span className="text-slate-500 text-[11px]">
                            ({traveler?.phone || traveler?.email || alert.user_id})
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(alert.timestamp || alert.created).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-700">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">Viagem & Destino:</span>
                          <p className="text-slate-800">{trip?.title || 'Viagem Registrada'}</p>
                          <p className="text-slate-500">
                            {trip?.destination_city}, {trip?.destination_country}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Hospedagem: {trip?.accommodation_address || 'Não cadastrada'}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">
                            Dados do Anfitrião:
                          </span>
                          <p className="text-slate-800 font-medium">
                            {trip?.host_responsible_person || 'Não informado'}
                          </p>
                          <p className="text-slate-500">
                            Tel: {trip?.host_phone || 'Não informado'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            Método de Disparo:{' '}
                            <strong className="text-slate-800">{alert.trigger_method}</strong>
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">
                            Localização do Disparo:
                          </span>
                          <p className="flex items-center gap-1 text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span className="truncate">
                              {alert.location_address || 'Coordenadas recebidas'}
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            Dispositivo: {alert.device_info}
                          </p>
                          {googleMapsUrl && (
                            <a
                              href={googleMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-sky-700 hover:underline font-bold text-[10px] mt-1"
                            >
                              Ver no Google Maps <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
                        <span className="text-[10px] text-slate-500">
                          Guardiões notificados: {alert.notified_guardians_count || 0} contato(s)
                        </span>

                        <div className="flex items-center gap-2">
                          {isDispatched && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-8 text-xs rounded-lg"
                            >
                              Assumir Ocorrência
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: PRESENCE LOGS (LAST-KNOWN LOCATION) */}
        <TabsContent value="presence" className="space-y-4">
          <div className="space-y-2">
            {filteredLogs.map((log) => {
              const traveler = log.expand?.user_id
              const trip = log.expand?.trip_id
              const googleMapsUrl =
                log.location_lat && log.location_lng
                  ? `https://maps.google.com/?q=${log.location_lat},${log.location_lng}`
                  : null

              return (
                <Card key={log.id} className="border-slate-200 shadow-xs">
                  <CardContent className="p-3.5 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={
                            log.is_duress
                              ? 'bg-red-100 text-red-800 font-bold'
                              : log.event_type === 'login'
                                ? 'bg-sky-100 text-sky-800'
                                : log.event_type === 'checkin'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-800'
                          }
                        >
                          {log.is_duress
                            ? 'Sinal de Coação'
                            : log.event_type === 'login'
                              ? 'Login / Online'
                              : log.event_type === 'checkin'
                                ? 'Check-in Realizado'
                                : log.event_type === 'media_upload'
                                  ? 'Upload de Mídia'
                                  : 'Presença'}
                        </Badge>
                        <span className="font-bold text-slate-800">
                          {traveler?.name || 'Viajante'}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          ({traveler?.email || log.user_id})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(log.timestamp || log.created).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <p className="text-slate-700 text-[11px] font-medium">
                      {log.notes || 'Evento de conexão registrado'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {log.location_name ||
                            (log.location_lat
                              ? `${log.location_lat.toFixed(5)}, ${log.location_lng?.toFixed(5)}`
                              : 'Sem GPS')}
                        </span>
                        {googleMapsUrl && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-700 font-bold ml-1 hover:underline"
                          >
                            [Mapa]
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{log.device_info || 'Navegador Web'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 3: CONFIRMATION MEDIA (ROUTINE PHOTOS & VIDEOS) */}
        <TabsContent value="media" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((m) => {
              const isVideo =
                m.media_type === 'video_morning' ||
                m.media_type === 'video_night' ||
                m.file?.endsWith('.mp4') ||
                m.file?.endsWith('.webm') ||
                m.file?.endsWith('.mov')

              return (
                <Card
                  key={m.id}
                  className="border-slate-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
                    {m.fileUrl ? (
                      isVideo ? (
                        <video src={m.fileUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={m.fileUrl}
                          alt={m.caption || 'Prova de vida'}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <Camera className="w-6 h-6 text-slate-400" />
                    )}
                    <Badge
                      className={`absolute top-2 left-2 text-[10px] ${
                        m.taken_under_duress
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-900 text-slate-200'
                      }`}
                    >
                      {m.taken_under_duress ? 'Sob Coação' : m.media_type}
                    </Badge>
                  </div>
                  <CardContent className="p-3 space-y-1 text-xs">
                    {m.caption && <p className="font-semibold text-slate-800">"{m.caption}"</p>}
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(m.timestamp || m.created).toLocaleString('pt-BR')}
                    </p>
                    {m.location_approx && (
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{m.location_approx}</span>
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PoliceDashboardPage
