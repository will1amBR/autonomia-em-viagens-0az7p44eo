import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Video,
  History,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Clock,
  Smartphone,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Lock,
  Radio,
  FileCheck,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useAuth } from '@/context/AuthContext'
import { useTrip } from '@/context/TripContext'
import { presenceService } from '@/services/presence'
import { PresenceLog, ConfirmationMedia } from '@/types/trip'
import { useToast } from '@/hooks/use-toast'

export const PresenceLogsPage: React.FC = () => {
  const { user: authUser } = useAuth()
  const { currentTrip } = useTrip()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'timeline' | 'media' | 'threat_signal'>('timeline')
  const [presenceLogs, setPresenceLogs] = useState<PresenceLog[]>([])
  const [mediaList, setMediaList] = useState<ConfirmationMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Upload/Capture states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedMediaType, setSelectedMediaType] = useState<
    'photo_routine' | 'video_morning' | 'video_night' | 'photo_emergency'
  >('photo_routine')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaCaption, setMediaCaption] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [gpsLocation, setGpsLocation] = useState<{
    lat?: number
    lng?: number
    accuracy?: number
  } | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  // Discreet duress trigger state (Mini Button inside media upload)
  const [duressTriggeredSilently, setDuressTriggeredSilently] = useState(false)
  const [isPressingDiscreet, setIsPressingDiscreet] = useState(false)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Secret code modal for manual duress verification
  const [secretCodeInput, setSecretCodeInput] = useState('')
  const [showSecretCodeModal, setShowSecretCodeModal] = useState(false)

  // Key press listener for volume key/shortcut duress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses specific discreet key shortcut: Alt + Shift + S or VolumeDown
      if (
        (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        e.key === 'VolumeDown' ||
        e.key === 'F8'
      ) {
        triggerDiscreetDuressAlert('volume_key')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [authUser, currentTrip])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [logs, medias] = await Promise.all([
        presenceService.listPresenceLogs(authUser?.id, currentTrip?.id),
        presenceService.listConfirmationMedia(authUser?.id, currentTrip?.id),
      ])
      setPresenceLogs(logs)
      setMediaList(medias)
    } catch (err) {
      console.warn('Error loading presence and media:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [authUser?.id, currentTrip?.id])

  // Capture GPS coordinates for media
  const captureGps = async () => {
    setIsLocating(true)
    const pos = await presenceService.getCurrentPosition()
    if (pos.lat && pos.lng) {
      setGpsLocation({ lat: pos.lat, lng: pos.lng, accuracy: pos.accuracy })
    }
    setIsLocating(false)
  }

  const handleOpenUpload = (type: 'photo_routine' | 'video_morning' | 'video_night') => {
    setSelectedMediaType(type)
    setMediaFile(null)
    setMediaCaption('')
    setPreviewUrl(null)
    setDuressTriggeredSilently(false)
    setIsUploadModalOpen(true)
    captureGps()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setMediaFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // DISCREET SILENT THREAT ALERT DISPATCHER (duress)
  const triggerDiscreetDuressAlert = async (
    method: 'button_hold' | 'volume_key' | 'secret_code' | 'discreet_media_button',
  ) => {
    try {
      // Capture device info and location silently
      const pos = await presenceService.getCurrentPosition()
      const devInfo = presenceService.getDeviceInfo()

      await presenceService.triggerSilentDuressAlert({
        trip_id: currentTrip?.id,
        trigger_method: method,
        location_lat: pos.lat || gpsLocation?.lat,
        location_lng: pos.lng || gpsLocation?.lng,
        location_address: currentTrip?.destinationCity
          ? `${currentTrip.destinationCity}, ${currentTrip.destinationCountry || ''}`
          : undefined,
        device_info: devInfo,
        timestamp: new Date().toISOString(),
      })

      setDuressTriggeredSilently(true)
      // Note: intentionally NO alarming message is shown to prevent endangering the traveler
    } catch (e) {
      console.warn('Duress error (silent):', e)
    }
  }

  // Hold 3 seconds handlers for discreet dot
  const handleTouchStartDiscreet = () => {
    setIsPressingDiscreet(true)
    holdTimerRef.current = setTimeout(() => {
      triggerDiscreetDuressAlert('button_hold')
      // Slight haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }, 3000)
  }

  const handleTouchEndDiscreet = () => {
    setIsPressingDiscreet(false)
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const handleSubmitMedia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mediaFile) {
      toast({
        title: 'Selecione um arquivo',
        description: 'Tire uma foto ou grave um vídeo para enviar a confirmação.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('user_id', authUser?.id || '')
      if (currentTrip?.id) formData.append('trip_id', currentTrip.id)
      formData.append('media_type', selectedMediaType)
      formData.append('file', mediaFile)
      formData.append('caption', mediaCaption.trim())
      formData.append(
        'location_approx',
        gpsLocation?.lat
          ? `${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lng?.toFixed(5)}`
          : currentTrip?.destinationCity || 'Localização não informada',
      )
      if (gpsLocation?.lat) formData.append('location_lat', String(gpsLocation.lat))
      if (gpsLocation?.lng) formData.append('location_lng', String(gpsLocation.lng))
      formData.append('taken_under_duress', duressTriggeredSilently ? 'true' : 'false')
      formData.append('device_info', presenceService.getDeviceInfo())
      formData.append('timestamp', new Date().toISOString())

      await presenceService.uploadConfirmationMedia(formData)

      // Also record presence log
      await presenceService.recordPresenceLog(authUser?.id || '', 'media_upload', {
        tripId: currentTrip?.id,
        lat: gpsLocation?.lat,
        lng: gpsLocation?.lng,
        locationName: gpsLocation?.lat
          ? `${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lng?.toFixed(5)}`
          : currentTrip?.destinationCity,
        notes: `Mídia de confirmação enviada: ${selectedMediaType}`,
        isDuress: duressTriggeredSilently,
      })

      toast({
        title: 'Confirmação enviada com sucesso!',
        description: 'Sua foto/vídeo de rotina foi registrada e sincronizada com segurança.',
      })

      setIsUploadModalOpen(false)
      loadData()
    } catch (err: any) {
      console.error('Error uploading media:', err)
      toast({
        title: 'Erro no envio',
        description: err.message || 'Falha ao salvar a mídia. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSecretCodeSubmit = () => {
    const configuredCode = authUser?.duressSecretCode?.trim()
    if (configuredCode && secretCodeInput.trim() === configuredCode) {
      triggerDiscreetDuressAlert('secret_code')
    } else if (!configuredCode && secretCodeInput.trim()) {
      // If none set yet, simulate duress trigger with entered input
      triggerDiscreetDuressAlert('secret_code')
    }
    setShowSecretCodeModal(false)
    setSecretCodeInput('')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-sky-100 text-sky-800 border-sky-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-sky-600" /> Presença & Prova de Vida
            </Badge>
            <span className="text-xs text-slate-500">
              {presenceLogs.length} registro(s) • {mediaList.length} mídia(s)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-7 h-7 text-sky-600" /> Histórico de Presença & Mídia
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Linha do tempo contínua de presença online e repositório seguro de fotos periódicas e
            vídeos diários (manhã/noite) para garantir sua integridade e tranquilizar sua rede de
            apoio.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-10 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Button
            onClick={() => handleOpenUpload('photo_routine')}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold h-10 px-4 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Enviar Foto/Vídeo</span>
          </Button>
        </div>
      </div>

      {/* Philosophy banner: Autonomia não é desconfiança */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-slate-50 border border-sky-100 flex items-start gap-3 text-xs">
        <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-sky-950">
          <p className="font-bold text-slate-900">
            Filosofia SafeTrip: "Autonomia não é desconfiança."
          </p>
          <p className="text-slate-600 leading-relaxed">
            Registrar fotos periódicas e vídeos matinais/noturnos não significa desconfiar de quem
            te hospeda. Significa que você mantém o controle factual sobre sua jornada, com
            registros criptografados acessíveis apenas por você e, em caso de emergência extrema,
            por guardiões autorizados e autoridades consulares.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-lg bg-slate-100 p-1 rounded-2xl">
          <TabsTrigger value="timeline" className="text-xs font-bold gap-1.5 rounded-xl">
            <History className="w-3.5 h-3.5" />
            <span>Linha do Tempo</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="text-xs font-bold gap-1.5 rounded-xl">
            <Camera className="w-3.5 h-3.5" />
            <span>Fotos & Vídeos ({mediaList.length})</span>
          </TabsTrigger>
          <TabsTrigger value="threat_signal" className="text-xs font-bold gap-1.5 rounded-xl">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Sinal sob Ameaça</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. TIMELINE OF PRESENCE LOGS */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" /> Eventos Recentes de Presença & Localização
            </h2>
            <Badge variant="outline" className="text-[11px]">
              Sincronizado no PocketBase
            </Badge>
          </div>

          {presenceLogs.length === 0 ? (
            <Card className="border-slate-200 border-dashed text-center p-8 sm:p-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                <History className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Nenhum registro de presença ainda
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Seus logins, check-ins, envios com GPS e uploads de foto aparecerão
                  automaticamente aqui em ordem cronológica.
                </p>
              </div>
              <Button
                onClick={() => handleOpenUpload('photo_routine')}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold h-9 px-4 rounded-xl"
              >
                Fazer Primeiro Registro com Foto
              </Button>
            </Card>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
              {presenceLogs.map((log) => {
                const isDuress = log.isDuress
                const dateObj = new Date(log.timestamp || log.created || '')
                return (
                  <div key={log.id} className="relative group">
                    {/* Dot on timeline */}
                    <div
                      className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                        isDuress
                          ? 'bg-amber-500 ring-2 ring-amber-300'
                          : log.eventType === 'checkin'
                            ? 'bg-emerald-500'
                            : log.eventType === 'media_upload'
                              ? 'bg-indigo-500'
                              : 'bg-sky-500'
                      }`}
                    />

                    <Card className="border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                      <CardContent className="p-4 space-y-2 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              className={
                                log.eventType === 'checkin'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.eventType === 'media_upload'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : log.eventType === 'guardian_gps_notification'
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-slate-100 text-slate-800'
                              }
                            >
                              {log.eventType === 'checkin'
                                ? 'Check-in OK'
                                : log.eventType === 'media_upload'
                                  ? 'Upload de Mídia'
                                  : log.eventType === 'guardian_gps_notification'
                                    ? 'Notificação GPS Guardiões'
                                    : log.eventType === 'duress_signal'
                                      ? 'Sinal de Segurança'
                                      : 'Login / Presença'}
                            </Badge>
                            <span className="font-bold text-slate-800 text-xs">
                              {log.notes || 'Registro de atividade online'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {dateObj.toLocaleDateString('pt-BR')} às{' '}
                            {dateObj.toLocaleTimeString('pt-BR')}
                          </span>
                        </div>

                        {/* Location and Device details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                          {log.locationName && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{log.locationName}</span>
                            </div>
                          )}
                          {log.deviceInfo && (
                            <div className="flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{log.deviceInfo}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* 2. CONFIRMATION MEDIA GALLERY & UPLOADER */}
        <TabsContent value="media" className="space-y-6">
          {/* Quick Upload action boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card
              onClick={() => handleOpenUpload('photo_routine')}
              className="border-sky-200 bg-sky-50/50 hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <Badge className="bg-sky-200 text-sky-900 border-none text-[10px]">
                  A cada 4-6h
                </Badge>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Foto de Rotina</h3>
              <p className="text-xs text-slate-600">
                Tire uma foto do local ou refeição para comprovar localização sem esforço.
              </p>
            </Card>

            <Card
              onClick={() => handleOpenUpload('video_morning')}
              className="border-amber-200 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <Badge className="bg-amber-200 text-amber-900 border-none text-[10px]">
                  Manhã (08:00)
                </Badge>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Vídeo Matinal (5-10s)</h3>
              <p className="text-xs text-slate-600">
                Vídeo curto ao acordar confirmando que está iniciando o dia em segurança.
              </p>
            </Card>

            <Card
              onClick={() => handleOpenUpload('video_night')}
              className="border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <Badge className="bg-indigo-200 text-indigo-900 border-none text-[10px]">
                  Noite (21:00)
                </Badge>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Vídeo Noturno (5-10s)</h3>
              <p className="text-xs text-slate-600">
                Vídeo breve no quarto/hotel antes de dormir confirmando seu bem-estar.
              </p>
            </Card>
          </div>

          {/* Media Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Galeria de Confirmações ({mediaList.length} registros)
              </h3>
            </div>

            {mediaList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500 space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs font-semibold">
                  Nenhuma foto ou vídeo enviado até o momento.
                </p>
                <p className="text-[11px] text-slate-400">
                  Use os cards acima para enviar sua primeira foto ou vídeo de rotina.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mediaList.map((m) => {
                  const isVideo =
                    m.mediaType === 'video_morning' ||
                    m.mediaType === 'video_night' ||
                    m.file?.endsWith('.mp4') ||
                    m.file?.endsWith('.webm') ||
                    m.file?.endsWith('.mov')
                  return (
                    <Card
                      key={m.id}
                      className="border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
                        {m.fileUrl ? (
                          isVideo ? (
                            <video
                              src={m.fileUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={m.fileUrl}
                              alt={m.caption || 'Foto de rotina'}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                            <Camera className="w-6 h-6" />
                            <span>Mídia Registrada</span>
                          </div>
                        )}
                        <Badge
                          className={`absolute top-2 left-2 text-[10px] font-bold ${
                            m.mediaType === 'video_morning'
                              ? 'bg-amber-600 text-white'
                              : m.mediaType === 'video_night'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-sky-600 text-white'
                          }`}
                        >
                          {m.mediaType === 'video_morning'
                            ? 'Vídeo Manhã'
                            : m.mediaType === 'video_night'
                              ? 'Vídeo Noite'
                              : 'Foto Rotina'}
                        </Badge>
                      </div>

                      <CardContent className="p-3 space-y-1.5 text-xs">
                        {m.caption && (
                          <p className="font-semibold text-slate-800 line-clamp-2">"{m.caption}"</p>
                        )}
                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          <p className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(m.timestamp || m.created || '').toLocaleString('pt-BR')}
                          </p>
                          {m.locationApprox && (
                            <p className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{m.locationApprox}</span>
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* 3. DISCREET DURESS SIGNAL DOCUMENTATION & SHORTCUTS */}
        <TabsContent value="threat_signal" className="space-y-6">
          <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Como Funciona o Sinal sob Ameaça Discreto
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600">
                Mecanismos desenvolvidos para você acionar socorro sem levantar nenhuma suspeita se
                alguém estiver observando sua tela ou exigindo que você use o aplicativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Method 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-100 text-amber-800 font-bold text-[10px]">
                      Método 1: Toque de 3s
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Ponto Discreto na Mídia</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Durante o envio de qualquer foto ou vídeo, toque e segure o pequeno indicador de
                    segurança por 3 segundos. O alerta é transmitido silenciosamente.
                  </p>
                </div>
                {/* Method 2: Secret Code (Recommended Mobile) */}
                <div className="p-3.5 rounded-xl bg-white border border-emerald-300 ring-2 ring-emerald-400/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Método 2: Código Secreto (Recomendado Mobile)
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Código Secreto de Coação</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Se for obrigado(a) a digitar um código de saída ou confirmação, digite seu
                    código secreto de coação cadastrado. O app finge desbloquear ou fechar, mas
                    dispara o SOS silencioso com sua localização GPS.
                  </p>
                </div>
                {/* Method 3: Desktop shortcut */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-slate-100 text-slate-800 font-bold text-[10px]">
                      Método 3: Atalho Teclado (Desktop)
                    </Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Atalho no Computador</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Pressione <strong>Alt + Shift + S</strong> no teclado do computador para acionar
                    o sinal discreto imediato.
                  </p>
                </div>{' '}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] flex items-center justify-between gap-3">
                <span>
                  Sua preferência ativa configurada no perfil:{' '}
                  <strong className="text-sky-300">
                    {authUser?.duressMethod === 'secret_code'
                      ? 'Código Secreto de Coação (Recomendado Mobile)'
                      : authUser?.duressMethod === 'hold_3s'
                        ? 'Padrão de Toques Discretos (3s / 4 Toques)'
                        : 'Atalho de Teclado (Desktop)'}
                  </strong>
                </span>
                <Link to="/perfil">
                  <Button size="sm" className="h-7 text-[10px] bg-sky-600 text-white font-bold">
                    Alterar no Perfil
                  </Button>
                </Link>
              </div>

              {/* Test secret code trigger dialog button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <span className="text-[11px] text-slate-500">
                  Teste a simulação do código de coação (discreto):
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecretCodeModal(true)}
                  className="h-8 text-xs text-slate-700"
                >
                  Digitar Código de Teste
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL: UPLOAD / CAMERA CAPTURE WITH DISCREET DURESS MINI-BUTTON */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-sky-600" />
                <span>
                  {selectedMediaType === 'video_morning'
                    ? 'Vídeo Matinal de Confirmação'
                    : selectedMediaType === 'video_night'
                      ? 'Vídeo Noturno de Confirmação'
                      : 'Foto de Rotina & Presença'}
                </span>
              </div>

              {/* MINI BUTTON DISCREET DURESS SIGNAL (hold 3s or tap) */}
              <div className="relative">
                <button
                  type="button"
                  onMouseDown={handleTouchStartDiscreet}
                  onMouseUp={handleTouchEndDiscreet}
                  onTouchStart={handleTouchStartDiscreet}
                  onTouchEnd={handleTouchEndDiscreet}
                  title="Status de Conexão Criptografada"
                  className={`w-3.5 h-3.5 rounded-full transition-all focus:outline-none ${
                    isPressingDiscreet
                      ? 'bg-amber-400 scale-125'
                      : duressTriggeredSilently
                        ? 'bg-emerald-400'
                        : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label="Indicador de Status"
                />
              </div>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Grave diretamente pela câmera do celular ou selecione da galeria para registrar no
              PocketBase.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitMedia} className="space-y-4 pt-1 text-xs">
            {/* File Input & Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Arquivo de Mídia (Foto ou Vídeo):
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-sky-400 transition-colors bg-slate-50/50">
                {previewUrl ? (
                  <div className="space-y-2">
                    {mediaFile?.type.startsWith('video') ? (
                      <video src={previewUrl} controls className="max-h-48 mx-auto rounded-xl" />
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-xl object-contain"
                      />
                    )}
                    <p className="text-[11px] text-slate-500">{mediaFile?.name}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMediaFile(null)
                        setPreviewUrl(null)
                      }}
                      className="h-7 text-[11px] text-red-600"
                    >
                      Trocar arquivo
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs">
                      Tirar foto / Gravar vídeo ou escolher da galeria
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Suporta JPG, PNG, MP4, WEBM, MOV (máx. 25MB)
                    </span>
                    <input
                      type="file"
                      accept={
                        selectedMediaType.startsWith('video')
                          ? 'video/*,image/*'
                          : 'image/*,video/*'
                      }
                      capture="user"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Optional Caption */}
            <div className="space-y-1">
              <Label htmlFor="media-caption" className="text-xs font-semibold text-slate-700">
                Legenda / Observação rápida (opcional):
              </Label>
              <Input
                id="media-caption"
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
                placeholder="Ex: Almoçando no restaurante perto do museu, tudo bem"
                className="h-9 text-xs"
              />
            </div>

            {/* GPS & Device info display */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {isLocating
                    ? 'Capturando GPS...'
                    : gpsLocation?.lat
                      ? `GPS: ${gpsLocation.lat.toFixed(5)}, ${gpsLocation.lng?.toFixed(5)}`
                      : 'Sem GPS (usando cidade de destino)'}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={captureGps}
                  className="h-6 text-[10px] text-sky-700"
                >
                  Recapturar
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isUploading || !mediaFile}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enviando Mídia...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Enviar Confirmação
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: SECRET CODE SIMULATION */}
      <Dialog open={showSecretCodeModal} onOpenChange={setShowSecretCodeModal}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Código de Confirmação Rápida
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Digite seu código para prosseguir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <Input
              type="password"
              placeholder="Digite o código (4 dígitos)"
              value={secretCodeInput}
              onChange={(e) => setSecretCodeInput(e.target.value)}
              className="text-center font-mono text-base tracking-widest h-11"
              maxLength={6}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSecretCodeModal(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSecretCodeSubmit}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PresenceLogsPage
