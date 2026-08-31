import React, { useState } from 'react'
import {
  Users,
  Plus,
  Shield,
  Trash2,
  Edit2,
  Mail,
  Send,
  MapPin,
  Smartphone,
  CheckCircle2,
  Info,
  Clock,
  Radio,
  ExternalLink,
  Loader2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog'
import { useTrip } from '../context/TripContext'
import { GuardianContact, GuardianAccessType } from '../types/trip'
import { presenceService } from '../services/presence'
import { useToast } from '../hooks/use-toast'

export const GuardiansPage: React.FC = () => {
  const { currentTrip, addGuardian, removeGuardian, updateGuardian, user } = useTrip()
  const { toast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuardian, setEditingGuardian] = useState<GuardianContact | null>(null)

  // GPS / Device email sending state
  const [isGpsModalOpen, setIsGpsModalOpen] = useState(false)
  const [isCapturingGps, setIsCapturingGps] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [selectedGuardianIds, setSelectedGuardianIds] = useState<string[]>([])
  const [gpsMessage, setGpsMessage] = useState(
    'Olá! Estou bem e confirmando minha localização atual com meu dispositivo.',
  )
  const [capturedLocation, setCapturedLocation] = useState<{
    lat?: number
    lng?: number
    accuracy?: number
    error?: string
  } | null>(null)
  const [manualLocationText, setManualLocationText] = useState('')
  const [detectedDeviceInfo, setDetectedDeviceInfo] = useState('')
  const [lastSentResult, setLastSentResult] = useState<{
    count: number
    timestamp: string
  } | null>(null)

  // Form State for new/edit guardian
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('Brasil')
  const [accessType, setAccessType] = useState<GuardianAccessType>('basic')
  const [notifyOnCheckin, setNotifyOnCheckin] = useState(true)
  const [receiveMissedAlert, setReceiveMissedAlert] = useState(true)
  const [receiveFullItinerary, setReceiveFullItinerary] = useState(false)
  const [notes, setNotes] = useState('')

  const guardians = currentTrip?.guardians || []

  const handleOpenAdd = () => {
    setEditingGuardian(null)
    setName('')
    setRelationship('')
    setPhone('')
    setEmail('')
    setCountry('Brasil')
    setAccessType('basic')
    setNotifyOnCheckin(true)
    setReceiveMissedAlert(true)
    setReceiveFullItinerary(false)
    setNotes('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (guardian: GuardianContact) => {
    setEditingGuardian(guardian)
    setName(guardian.name)
    setRelationship(guardian.relationship)
    setPhone(guardian.phone)
    setEmail(guardian.email)
    setCountry(guardian.country)
    setAccessType(guardian.accessType)
    setNotifyOnCheckin(guardian.notifyOnCheckin)
    setReceiveMissedAlert(guardian.receiveMissedCheckinAlert)
    setReceiveFullItinerary(guardian.receiveFullItinerary)
    setNotes(guardian.notes || '')
    setIsModalOpen(true)
  }

  const handleSaveGuardian = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return

    const guardianData = {
      name,
      relationship: relationship || 'Contato de Confiança',
      phone,
      email: email || '',
      country: country || 'Brasil',
      accessType,
      notifyOnCheckin,
      receiveMissedCheckinAlert: receiveMissedAlert,
      receiveFullItinerary,
      notes,
    }

    if (editingGuardian) {
      updateGuardian(editingGuardian.id, guardianData)
      toast({
        title: 'Guardião atualizado',
        description: `${name} foi atualizado com sucesso.`,
      })
    } else {
      addGuardian(guardianData)
      toast({
        title: 'Guardião cadastrado!',
        description: `${name} foi adicionado à sua rede de segurança.`,
      })
    }

    setIsModalOpen(false)
  }

  // Open GPS / Device sending modal
  const handleOpenGpsModal = async () => {
    const devInfo = presenceService.getDeviceInfo()
    setDetectedDeviceInfo(devInfo)
    setSelectedGuardianIds(guardians.map((g) => g.id))
    setManualLocationText('')
    setIsGpsModalOpen(true)

    // Automatically attempt GPS capture
    setIsCapturingGps(true)
    const pos = await presenceService.getCurrentPosition()
    setCapturedLocation(pos)
    setIsCapturingGps(false)
  }

  const handleRetryGps = async () => {
    setIsCapturingGps(true)
    const pos = await presenceService.getCurrentPosition()
    setCapturedLocation(pos)
    setIsCapturingGps(false)
  }

  const handleSendAutomaticGpsEmail = async () => {
    if (guardians.length === 0) {
      toast({
        title: 'Nenhum guardião cadastrado',
        description: 'Cadastre ao menos um guardião com e-mail para enviar a localização.',
        variant: 'destructive',
      })
      return
    }

    setIsSendingEmail(true)
    try {
      const now = new Date().toISOString()
      const lat = capturedLocation?.lat
      const lng = capturedLocation?.lng
      const accuracy = capturedLocation?.accuracy

      const res: any = await presenceService.sendGpsNotificationToGuardians({
        trip_id: currentTrip?.id,
        guardian_ids: selectedGuardianIds.length > 0 ? selectedGuardianIds : undefined,
        message: gpsMessage,
        location_lat: lat,
        location_lng: lng,
        location_name:
          manualLocationText.trim() ||
          (lat ? `GPS: ${lat.toFixed(5)}, ${lng?.toFixed(5)}` : 'Sem GPS'),
        accuracy_meters: accuracy,
        device_info: detectedDeviceInfo,
        timestamp: now,
        is_manual_location: !!manualLocationText.trim(),
      })

      setLastSentResult({
        count: res.sentCount || selectedGuardianIds.length || guardians.length,
        timestamp: now,
      })

      toast({
        title: 'E-mail enviado aos guardiões!',
        description: `Status de bem-estar e dados do dispositivo enviados com sucesso para ${res.sentCount || 'seus'} guardião(ões).`,
      })
      setIsGpsModalOpen(false)
    } catch (err: any) {
      console.error('Error sending GPS notification:', err)
      toast({
        title: 'Falha no envio',
        description: err.message || 'Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const toggleGuardianSelection = (id: string) => {
    setSelectedGuardianIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Rede de Confiança
            </Badge>
            <span className="text-xs text-slate-500 font-medium">
              {guardians.length} contato(s) ativo(s)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-600" /> Guardiões de Confiança
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Pessoas da sua inteira confiança que receberão alertas e atualizações caso você não
            confirme seus check-ins de rotina.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* EASY AUTOMATIC GPS EMAIL BUTTON */}
          <Button
            onClick={handleOpenGpsModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-4 rounded-xl shadow-lg shadow-emerald-950/20 text-xs sm:text-sm flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar E-mail com GPS & Aparelho</span>
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold h-11 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Adicionar Guardião
          </Button>
        </div>
      </div>

      {/* Philosophy banner: Autonomia não é desconfiança */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50 to-emerald-50 border border-sky-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs text-sky-950">
          <p className="font-bold">Princípio fundamental: Autonomia não é desconfiança.</p>
          <p className="text-slate-700 leading-relaxed">
            Ter guardiões e manter um canal aberto de confirmação de localização é uma prática de
            liberdade e autocuidado. Seus anfitriões ou terceiros não têm acesso a quem são seus
            guardiões.
          </p>
        </div>
      </div>

      {/* Confirmation of last sent GPS email */}
      {lastSentResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Último e-mail com GPS enviado:</strong>{' '}
              {new Date(lastSentResult.timestamp).toLocaleTimeString('pt-BR')} para{' '}
              {lastSentResult.count} guardião(ões).
            </span>
          </div>
          <Badge className="bg-emerald-200 text-emerald-900 border-none text-[10px]">
            Entregue
          </Badge>
        </div>
      )}

      {/* Guardians List Grid */}
      {guardians.length === 0 ? (
        <Card className="border-slate-200 border-dashed text-center p-8 sm:p-12 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-sky-100 text-sky-700 mx-auto flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Nenhum guardião cadastrado ainda</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Recomendamos cadastrar pelo menos 1 ou 2 pessoas de confiança (amigos, familiares)
              para acompanhar sua viagem com tranquilidade.
            </p>
          </div>
          <Button
            onClick={handleOpenAdd}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-6 h-10 rounded-xl text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Cadastrar Primeiro Guardião
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {guardians.map((g) => (
            <Card
              key={g.id}
              className={`border transition-all hover:shadow-md relative overflow-hidden ${
                g.accessType === 'emergency'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : g.accessType === 'security'
                    ? 'border-indigo-200 bg-indigo-50/20'
                    : 'border-slate-200 bg-white'
              }`}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-bold text-slate-900">{g.name}</CardTitle>
                    <p className="text-xs text-slate-600 font-medium">
                      {g.relationship} • {g.country || 'Brasil'}
                    </p>
                  </div>
                  <Badge
                    className={
                      g.accessType === 'emergency'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold'
                        : g.accessType === 'security'
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 text-[10px] font-bold'
                          : 'bg-slate-100 text-slate-700 border-slate-300 text-[10px]'
                    }
                  >
                    {g.accessType === 'emergency'
                      ? 'SOS / Emergência'
                      : g.accessType === 'security'
                        ? 'Segurança'
                        : 'Básico'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-2 space-y-3">
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> {g.phone}
                  </p>
                  {g.email && (
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-600 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {g.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        g.notifyOnCheckin ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>Notificar a cada check-in regular</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        g.receiveMissedCheckinAlert ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>Receber alerta se o check-in atrasar</span>
                  </div>
                </div>

                {g.notes && (
                  <p className="text-[11px] text-slate-500 italic bg-white/80 p-2 rounded-lg border border-slate-100">
                    "{g.notes}"
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(g)}
                    className="h-8 px-2.5 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGuardian(g.id)}
                    className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL: AUTOMATIC GPS & DEVICE NOTIFICATION EMAIL */}
      <Dialog open={isGpsModalOpen} onOpenChange={setIsGpsModalOpen}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" /> Enviar Localização & Status aos
              Guardiões
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Dispara um e-mail com as coordenadas do seu dispositivo para tranquilizar seus
              guardiões cadastrados.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* GPS Capture Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Coordenadas GPS (Automático)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetryGps}
                  disabled={isCapturingGps}
                  className="h-7 text-[11px] text-sky-700"
                >
                  {isCapturingGps ? 'Capturando...' : 'Recapturar GPS'}
                </Button>
              </div>

              {isCapturingGps ? (
                <div className="flex items-center gap-2 text-slate-600 text-[11px] py-1">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                  <span>Obtendo coordenadas de alta precisão do navegador...</span>
                </div>
              ) : capturedLocation?.lat && capturedLocation?.lng ? (
                <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                  <p className="font-semibold text-[11px]">
                    📍 Latitude: {capturedLocation.lat.toFixed(6)} | Longitude:{' '}
                    {capturedLocation.lng.toFixed(6)}
                  </p>
                  {capturedLocation.accuracy && (
                    <p className="text-[10px] text-emerald-700">
                      Precisão: aproximadamente {Math.round(capturedLocation.accuracy)} metros
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                  <p className="font-semibold text-[11px] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> GPS indisponível ou
                    permissão negada
                  </p>
                  <p className="text-[10px] text-amber-800">
                    Você pode digitar a localização manualmente no campo abaixo ou enviar mesmo
                    assim.
                  </p>
                </div>
              )}

              {/* Fallback Manual Location */}
              <div className="space-y-1 pt-1">
                <Label htmlFor="manual-loc" className="text-[11px] font-semibold text-slate-700">
                  Localização por extenso ou ponto de referência (opcional / fallback):
                </Label>
                <Input
                  id="manual-loc"
                  placeholder="Ex: Hotel Roma Centro, saguão principal, Roma, Itália"
                  value={manualLocationText}
                  onChange={(e) => setManualLocationText(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Device Details Card */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                <Smartphone className="w-3.5 h-3.5 text-sky-600" /> Dados Básicos do Aparelho
              </span>
              <p className="text-[11px] text-slate-600">
                {detectedDeviceInfo || 'Dispositivo Web'}
              </p>
            </div>

            {/* Custom Message to Guardians */}
            <div className="space-y-1">
              <Label htmlFor="gps-msg" className="text-xs font-semibold text-slate-700">
                Mensagem para os guardiões:
              </Label>
              <Input
                id="gps-msg"
                value={gpsMessage}
                onChange={(e) => setGpsMessage(e.target.value)}
                placeholder="Ex: Estou bem! Apenas enviando confirmação da localização."
                className="h-9 text-xs"
              />
            </div>

            {/* Select Recipient Guardians */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Selecione os guardiões destinatários:
              </Label>
              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {guardians.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedGuardianIds.includes(g.id)}
                        onChange={() => toggleGuardianSelection(g.id)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-semibold text-slate-800 text-xs">{g.name}</span>
                      <span className="text-[10px] text-slate-500">({g.relationship})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {g.email || 'sem e-mail'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsGpsModalOpen(false)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSendAutomaticGpsEmail}
              disabled={isSendingEmail || selectedGuardianIds.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Enviando E-mails...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Enviar Agora com GPS
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL: ADD / EDIT GUARDIAN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              {editingGuardian ? 'Editar Guardião' : 'Cadastrar Guardião'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Adicione um contato de confiança com telefone e e-mail para receber alertas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveGuardian} className="space-y-3.5 text-xs py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="g-name" className="text-xs font-semibold text-slate-700">
                  Nome Completo *
                </Label>
                <Input
                  id="g-name"
                  required
                  placeholder="Ex: Maria Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="g-rel" className="text-xs font-semibold text-slate-700">
                  Relação / Parentesco
                </Label>
                <Input
                  id="g-rel"
                  placeholder="Ex: Mãe, Irmã, Amiga de infância"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="g-phone" className="text-xs font-semibold text-slate-700">
                  WhatsApp / Telefone *
                </Label>
                <Input
                  id="g-phone"
                  required
                  placeholder="+55 (11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="g-email" className="text-xs font-semibold text-slate-700">
                  E-mail (para alertas automáticos)
                </Label>
                <Input
                  id="g-email"
                  type="email"
                  placeholder="guardiao@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Access Type Level */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-700">
                Nível de Confidencialidade e Acesso:
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAccessType('basic')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    accessType === 'basic'
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold ring-2 ring-sky-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs">Básico</p>
                  <p className="text-[10px] text-slate-500 font-normal">
                    Apenas status "Estou bem"
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessType('security')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    accessType === 'security'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs">Segurança</p>
                  <p className="text-[10px] text-slate-500 font-normal">Acionado na Etapa 3</p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessType('emergency')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    accessType === 'emergency'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs">Emergência</p>
                  <p className="text-[10px] text-slate-500 font-normal">Acesso total e SOS</p>
                </button>
              </div>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={notifyOnCheckin}
                  onChange={(e) => setNotifyOnCheckin(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Enviar aviso quando eu realizar meu check-in regular</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={receiveMissedAlert}
                  onChange={(e) => setReceiveMissedAlert(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span>Enviar alerta escalonado caso eu perca meu check-in</span>
              </label>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                {editingGuardian ? 'Salvar Alterações' : 'Salvar Guardião'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GuardiansPage
