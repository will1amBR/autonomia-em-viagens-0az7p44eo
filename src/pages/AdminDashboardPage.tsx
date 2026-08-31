import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  Users,
  Compass,
  FileText,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  Eye,
  LogOut,
  Building,
  Layers,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { useAuth } from '../context/AuthContext'
import { adminService, PlatformMetrics } from '../services/admin'
import { useToast } from '../hooks/use-toast'

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null)
  const [destinations, setDestinations] = useState<any[]>([])
  const [securityArticles, setSecurityArticles] = useState<any[]>([])
  const [activeTrips, setActiveTrips] = useState<any[]>([])
  const [selectedTripDetail, setSelectedTripDetail] = useState<any | null>(null)
  const [isTripModalOpen, setIsTripModalOpen] = useState(false)
  const [tripSearch, setTripSearch] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Modals state
  const [editingDest, setEditingDest] = useState<any | null>(null)
  const [isDestModalOpen, setIsDestModalOpen] = useState<boolean>(false)
  const [isNewDest, setIsNewDest] = useState<boolean>(false)

  const [editingArticle, setEditingArticle] = useState<any | null>(null)
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false)

  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const [m, d, s, trips] = await Promise.all([
        adminService.getPlatformMetrics(),
        adminService.listDestinations(),
        adminService.listSecurityLibrary(),
        adminService.listActiveTrips(),
      ])
      setMetrics(m)
      setDestinations(d)
      setSecurityArticles(s)
      setActiveTrips(trips)
    } catch (e) {
      console.error(e)
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível buscar as informações do backend.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDest) return
    try {
      if (isNewDest) {
        await adminService.createDestination(editingDest)
        toast({
          title: 'Destino criado!',
          description: 'Novo destino adicionado ao catálogo oficial.',
        })
      } else {
        await adminService.updateDestination(editingDest.id, editingDest)
        toast({
          title: 'Destino atualizado!',
          description: 'Informações consulares salvas com sucesso.',
        })
      }
      setIsDestModalOpen(false)
      loadAllData()
    } catch (e: any) {
      toast({
        title: 'Erro ao salvar destino',
        description: e.message || 'Verifique os campos informados.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteDestination = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o destino ${name}?`)) return
    try {
      await adminService.deleteDestination(id)
      toast({ title: 'Destino removido' })
      loadAllData()
    } catch (e: any) {
      toast({ title: 'Erro ao deletar', description: e.message, variant: 'destructive' })
    }
  }

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingArticle) return
    try {
      await adminService.updateSecurityTopic(editingArticle.id, editingArticle)
      toast({
        title: 'Artigo atualizado!',
        description: 'Orientações salvas na Biblioteca de Segurança.',
      })
      setIsArticleModalOpen(false)
      loadAllData()
    } catch (e: any) {
      toast({ title: 'Erro ao salvar artigo', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>PAINEL DE ADMINISTRAÇÃO INSTITUCIONAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Governança & Conteúdo SafeTrip
          </h1>
          <p className="text-xs text-slate-500">
            Logado como <strong className="text-slate-800">{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={isLoading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Atualizar Dados</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout()
              navigate('/entrar')
            }}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair do Admin</span>
          </Button>
        </div>
      </div>

      {/* Main Admin Tabs */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="metrics" className="text-xs font-bold gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Métricas</span>
          </TabsTrigger>
          <TabsTrigger value="destinations" className="text-xs font-bold gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Destinos ({destinations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="text-xs font-bold gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Biblioteca ({securityArticles.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. METRICS & ACTIVE TRIPS TAB */}
        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-sky-50/40">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs font-medium text-slate-500">
                  Total de Viajantes
                </CardDescription>
                <CardTitle className="text-2xl font-black text-sky-900">
                  {metrics?.totalUsers ?? '...'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                <span>Contas cadastradas no PocketBase</span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-indigo-50/40">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs font-medium text-slate-500">
                  Viagens Registradas
                </CardDescription>
                <CardTitle className="text-2xl font-black text-indigo-900">
                  {metrics?.totalTrips ?? activeTrips.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rotas e itinerários criados</span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs font-medium text-slate-500">
                  Média do Índice de Autonomia
                </CardDescription>
                <CardTitle className="text-2xl font-black text-emerald-900">
                  {metrics?.averageScore ?? '...'} / 100
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-emerald-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Baseado em {metrics?.totalAssessments ?? 0} avaliações</span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs font-medium text-slate-500">
                  Destinos Consulares Homologados
                </CardDescription>
                <CardTitle className="text-2xl font-black text-amber-900">
                  {destinations.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-amber-700 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                <span>Com contatos consulares 24h</span>
              </CardContent>
            </Card>
          </div>

          {/* ACTIVE TRIPS LIST & DETAILS SECTION */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-600" /> Lista de Viagens Ativas & Detalhes de
                  Hospedagem
                </CardTitle>
                <CardDescription className="text-xs">
                  Monitoramento administrativo: dados do viajante, origem→destino, datas, anfitrião
                  e endereço completo de estadia.
                </CardDescription>
              </div>

              <div className="w-full sm:w-64">
                <Input
                  placeholder="Filtrar por cidade, país ou viajante..."
                  value={tripSearch}
                  onChange={(e) => setTripSearch(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {activeTrips.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-500 text-xs">
                  Nenhuma viagem registrada até o momento no backend.
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW: Responsive Stacked Cards (Issue 7) */}
                  <div className="md:hidden space-y-3">
                    {activeTrips
                      .filter((t) => {
                        if (!tripSearch) return true
                        const term = tripSearch.toLowerCase()
                        return (
                          t.title?.toLowerCase().includes(term) ||
                          t.destination_city?.toLowerCase().includes(term) ||
                          t.destination_country?.toLowerCase().includes(term) ||
                          t.user_email?.toLowerCase().includes(term) ||
                          t.userName?.toLowerCase().includes(term) ||
                          t.host_responsible_person?.toLowerCase().includes(term)
                        )
                      })
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                            <div>
                              <span className="font-bold text-slate-900 text-sm block">
                                {t.userName || t.user_name || 'Viajante'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {t.user_email || t.userEmail || 'ID: ' + t.user_id}
                              </span>
                            </div>
                            <Badge className="bg-sky-100 text-sky-800 border-sky-200 text-[10px]">
                              {t.destination_country || t.destinationCountry}
                            </Badge>
                          </div>

                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center gap-1 text-slate-800 font-semibold">
                              <Compass className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>
                                {t.origin_city || t.originCity || 'Brasil'} →{' '}
                                {t.destination_city || t.destinationCity}
                              </span>
                            </div>
                            {t.transit_countries && (
                              <p className="text-[10px] text-slate-500 pl-4.5">
                                Escala / Conexão:{' '}
                                <span className="text-slate-700 font-medium">
                                  {t.transit_countries}
                                </span>
                              </p>
                            )}
                            <p className="text-slate-500 font-mono text-[10px]">
                              Período: {t.start_date || t.startDate || '—'} até{' '}
                              {t.end_date || t.endDate || '—'}
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Anfitrião:</span>
                              <span className="font-semibold text-slate-800">
                                {t.host_responsible_person ||
                                  t.hostResponsiblePerson ||
                                  t.staying_with ||
                                  'Não informado'}
                              </span>
                            </div>
                            {(t.host_phone || t.hostPhone) && (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Tel:</span>
                                <span className="text-slate-700">
                                  {t.host_phone || t.hostPhone}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-slate-500">Hospedagem:</span>
                              <span className="text-slate-700 capitalize">
                                {t.accommodation_type || t.accommodationType || 'Hotel'}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTripDetail(t)
                              setIsTripModalOpen(true)
                            }}
                            className="w-full h-8 text-xs font-bold text-sky-700 border-sky-200 hover:bg-sky-50 rounded-xl"
                          >
                            Ver Detalhes Completos
                          </Button>
                        </div>
                      ))}
                  </div>

                  {/* DESKTOP VIEW: Structured Table (Issue 7) */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                          <th className="p-3">Viajante</th>
                          <th className="p-3">Rota (Origem → Destino)</th>
                          <th className="p-3">Datas</th>
                          <th className="p-3">Com Quem Ficará / Anfitrião</th>
                          <th className="p-3">Hospedagem & Endereço</th>
                          <th className="p-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeTrips
                          .filter((t) => {
                            if (!tripSearch) return true
                            const term = tripSearch.toLowerCase()
                            return (
                              t.title?.toLowerCase().includes(term) ||
                              t.destination_city?.toLowerCase().includes(term) ||
                              t.destination_country?.toLowerCase().includes(term) ||
                              t.user_email?.toLowerCase().includes(term) ||
                              t.userName?.toLowerCase().includes(term) ||
                              t.host_responsible_person?.toLowerCase().includes(term)
                            )
                          })
                          .map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3 font-semibold text-slate-900">
                                <div>{t.userName || t.user_name || 'Viajante'}</div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                  {t.user_email || t.userEmail || 'ID: ' + t.user_id}
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-sky-800">
                                  {t.origin_city || t.originCity || 'Brasil'} →{' '}
                                  {t.destination_city || t.destinationCity},{' '}
                                  {t.destination_country || t.destinationCountry}
                                </span>
                                {t.transit_countries && (
                                  <div className="text-[10px] text-slate-400">
                                    Escala: {t.transit_countries}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-slate-600 font-mono text-[11px]">
                                {t.start_date || t.startDate || '—'} até{' '}
                                {t.end_date || t.endDate || '—'}
                              </td>
                              <td className="p-3 text-slate-700">
                                <div className="font-semibold text-slate-800">
                                  {t.host_responsible_person ||
                                    t.hostResponsiblePerson ||
                                    t.staying_with ||
                                    'Não informado'}
                                </div>
                                {(t.host_phone || t.hostPhone) && (
                                  <div className="text-[10px] text-slate-500">
                                    Tel: {t.host_phone || t.hostPhone}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-slate-600 max-w-xs truncate">
                                <div className="font-medium capitalize text-slate-800">
                                  {t.accommodation_type || t.accommodationType || 'Hotel'}
                                </div>
                                <div
                                  className="text-[10px] text-slate-500 truncate"
                                  title={t.accommodation_address || t.accommodationAddress}
                                >
                                  {t.accommodation_address ||
                                    t.accommodationAddress ||
                                    'Endereço não informado'}
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTripDetail(t)
                                    setIsTripModalOpen(true)
                                  }}
                                  className="h-7 text-[11px] font-semibold text-sky-700 border-sky-200 hover:bg-sky-50"
                                >
                                  Ver Detalhes
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. DESTINATIONS CRUD TAB */}
        <TabsContent value="destinations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Catálogo de Destinos Consulares</h2>
              <p className="text-xs text-slate-500">
                Gerencie números de emergência local, embaixadas, consulados e hospitais de apoio.
              </p>
            </div>
            <Button
              onClick={() => {
                setIsNewDest(true)
                setEditingDest({
                  country: '',
                  city: '',
                  countryCode: 'XX',
                  policeNumber: '112',
                  medicalEmergencyNumber: '112',
                  generalEmergencyNumber: '112',
                  consulateEmbassyName: 'Consulado do Brasil',
                  consulateAddress: '',
                  consulatePhone: '',
                  consulateEmail: '',
                  consulateEmergency24h: '',
                  safeHavens: [],
                  travelTips: [],
                })
                setIsDestModalOpen(true)
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold gap-1.5 h-9 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Destino</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {destinations.map((d) => (
              <Card key={d.id} className="border-slate-200 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-bold text-slate-900">
                        {d.country} ({d.city})
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold">
                        {d.country_code || d.countryCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsNewDest(false)
                        setEditingDest({
                          id: d.id,
                          country: d.country,
                          city: d.city,
                          countryCode: d.country_code || d.countryCode,
                          policeNumber: d.police_number || d.policeNumber,
                          medicalEmergencyNumber:
                            d.medical_emergency_number || d.medicalEmergencyNumber,
                          generalEmergencyNumber:
                            d.general_emergency_number || d.generalEmergencyNumber,
                          consulateEmbassyName: d.consulate_embassy_name || d.consulateEmbassyName,
                          consulateAddress: d.consulate_address || d.consulateAddress,
                          consulatePhone: d.consulate_phone || d.consulatePhone,
                          consulateEmail: d.consulate_email || d.consulateEmail,
                          consulateEmergency24h:
                            d.consulate_emergency_24h || d.consulateEmergency24h,
                          safeHavens: d.safe_havens || d.safeHavens || [],
                          travelTips: d.travel_tips || d.travelTips || [],
                        })
                        setIsDestModalOpen(true)
                      }}
                      className="h-8 w-8 text-slate-600 hover:text-sky-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDestination(d.id, d.country)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-slate-600">
                  <p>
                    <strong>Emergência Geral:</strong>{' '}
                    {d.general_emergency_number || d.generalEmergencyNumber}
                  </p>
                  <p>
                    <strong>Plantão Consular 24h:</strong>{' '}
                    <span className="text-red-700 font-semibold">
                      {d.consulate_emergency_24h || d.consulateEmergency24h || 'Não informado'}
                    </span>
                  </p>
                  <p className="truncate">
                    <strong>Representação:</strong>{' '}
                    {d.consulate_embassy_name || d.consulateEmbassyName} -{' '}
                    {d.consulate_address || d.consulateAddress}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 3. SECURITY LIBRARY EDITOR TAB */}
        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Biblioteca de Protocolos & Emergências
              </h2>
              <p className="text-xs text-slate-500">
                Edite orientações de resposta rápida para passaporte retido, perda de fundos, etc.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {securityArticles.map((art) => (
              <Card key={art.id} className="border-slate-200 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold ${
                          art.urgency_level === 'critica'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        Urgência {art.urgency_level}
                      </Badge>
                      <h3 className="text-sm font-bold text-slate-900">{art.title}</h3>
                    </div>
                    <p className="text-xs text-slate-600">{art.short_summary}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingArticle({
                        id: art.id,
                        title: art.title,
                        shortSummary: art.short_summary,
                        urgencyLevel: art.urgency_level,
                        immediateSteps: Array.isArray(art.immediate_steps)
                          ? art.immediate_steps.join('\n')
                          : '',
                        whatNotToDo: Array.isArray(art.what_not_to_do)
                          ? art.what_not_to_do.join('\n')
                          : '',
                        rightsAndResources: Array.isArray(art.rights_and_resources)
                          ? art.rights_and_resources.join('\n')
                          : '',
                      })
                      setIsArticleModalOpen(true)
                    }}
                    className="text-xs font-semibold gap-1.5 flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Editar Conteúdo</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* DESTINATION EDIT / CREATE MODAL */}
      <Dialog open={isDestModalOpen} onOpenChange={setIsDestModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isNewDest
                ? 'Adicionar Novo Destino Consular'
                : `Editar Destino: ${editingDest?.country}`}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Preencha os dados e telefones oficiais de suporte consular brasileiro.
            </DialogDescription>
          </DialogHeader>

          {editingDest && (
            <form onSubmit={handleSaveDestination} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">País</Label>
                  <Input
                    value={editingDest.country}
                    onChange={(e) => setEditingDest({ ...editingDest, country: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Cidade Principal</Label>
                  <Input
                    value={editingDest.city}
                    onChange={(e) => setEditingDest({ ...editingDest, city: e.target.value })}
                    required
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Código (ISO)</Label>
                  <Input
                    value={editingDest.countryCode}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, countryCode: e.target.value })
                    }
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Polícia</Label>
                  <Input
                    value={editingDest.policeNumber}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, policeNumber: e.target.value })
                    }
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Emergência Geral</Label>
                  <Input
                    value={editingDest.generalEmergencyNumber}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, generalEmergencyNumber: e.target.value })
                    }
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Nome da Embaixada / Consulado</Label>
                <Input
                  value={editingDest.consulateEmbassyName}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, consulateEmbassyName: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Endereço Completo</Label>
                <Input
                  value={editingDest.consulateAddress}
                  onChange={(e) =>
                    setEditingDest({ ...editingDest, consulateAddress: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Telefone Regular</Label>
                  <Input
                    value={editingDest.consulatePhone}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, consulatePhone: e.target.value })
                    }
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-red-700">
                    Plantão Consular 24h (Urgências)
                  </Label>
                  <Input
                    value={editingDest.consulateEmergency24h}
                    onChange={(e) =>
                      setEditingDest({ ...editingDest, consulateEmergency24h: e.target.value })
                    }
                    className="h-9 text-xs border-red-300 bg-red-50/30"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDestModalOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                >
                  Salvar Destino
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* TRIP DETAIL MODAL (Maximized details view) */}
      <Dialog open={isTripModalOpen} onOpenChange={setIsTripModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-600" />
              <span>Detalhes da Viagem: {selectedTripDetail?.title}</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Registro completo de segurança, acomodação, anfitrião e dados de contato.
            </DialogDescription>
          </DialogHeader>

          {selectedTripDetail && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Traveler & Route */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Viajante
                  </span>
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedTripDetail.userName || selectedTripDetail.user_name || 'Viajante'}
                  </span>
                  <span className="text-slate-500 block">
                    {selectedTripDetail.user_email ||
                      selectedTripDetail.userEmail ||
                      'ID: ' + selectedTripDetail.user_id}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Rota & Datas
                  </span>
                  <span className="font-bold text-sky-800 block">
                    {selectedTripDetail.origin_city || selectedTripDetail.originCity || 'Brasil'} →{' '}
                    {selectedTripDetail.destination_city || selectedTripDetail.destinationCity},{' '}
                    {selectedTripDetail.destination_country ||
                      selectedTripDetail.destinationCountry}
                  </span>
                  <span className="text-slate-500 block font-mono text-[11px]">
                    {selectedTripDetail.start_date || selectedTripDetail.startDate || '—'} até{' '}
                    {selectedTripDetail.end_date || selectedTripDetail.endDate || '—'}
                  </span>
                </div>
              </div>

              {/* Host & Companion info */}
              <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
                <span className="font-bold text-indigo-950 block text-xs">
                  Anfitrião & Pessoas no Destino:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      Responsável / Anfitrião:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.host_responsible_person ||
                        selectedTripDetail.hostResponsiblePerson ||
                        selectedTripDetail.accommodation_details?.responsibleName ||
                        'Não informado'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Telefone do Anfitrião:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.host_phone ||
                        selectedTripDetail.hostPhone ||
                        selectedTripDetail.accommodation_details?.responsiblePhone ||
                        selectedTripDetail.destination_contact ||
                        selectedTripDetail.destinationContact ||
                        'Não informado'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Relação com Viajante:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.host_relationship ||
                        selectedTripDetail.hostRelationship ||
                        selectedTripDetail.accommodation_details?.relationship ||
                        'Não informada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      Documento / ID do Anfitrião:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.host_document ||
                        selectedTripDetail.hostDocument ||
                        selectedTripDetail.accommodation_details?.responsibleDocument ||
                        'Não informado'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Companhia de Viagem:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.traveling_with ||
                        selectedTripDetail.travelingWith ||
                        'Sozinho(a)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">
                      Detalhes dos Companheiros / Hospedagem:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {selectedTripDetail.companion_details ||
                        selectedTripDetail.companionDetails ||
                        selectedTripDetail.accommodation_details?.companionNotes ||
                        'Nenhum detalhe adicional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accommodation Full Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">
                  Endereço Completo da Hospedagem:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                  {selectedTripDetail.accommodation_address ||
                    selectedTripDetail.accommodationAddress ||
                    'Endereço não cadastrado pelo viajante'}
                </p>
                <div className="flex gap-4 text-[11px] text-slate-500 pt-1">
                  <span>
                    Tipo:{' '}
                    <strong className="capitalize text-slate-700">
                      {selectedTripDetail.accommodation_type ||
                        selectedTripDetail.accommodationType ||
                        'Hotel'}
                    </strong>
                  </span>
                  <span>
                    Pagamento:{' '}
                    <strong className="text-slate-700">
                      {selectedTripDetail.who_is_paying ||
                        selectedTripDetail.whoIsPaying ||
                        'Não informado'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTripModalOpen(false)}
              className="text-xs"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ARTICLE EDIT MODAL */}
      <Dialog open={isArticleModalOpen} onOpenChange={setIsArticleModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Editar Artigo de Segurança</DialogTitle>
            <DialogDescription className="text-xs">
              Atualize as instruções e direitos exibidos aos viajantes em emergências.
            </DialogDescription>
          </DialogHeader>

          {editingArticle && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formattedArticle = {
                  id: editingArticle.id,
                  title: editingArticle.title,
                  shortSummary: editingArticle.shortSummary,
                  urgencyLevel: editingArticle.urgencyLevel,
                  immediateSteps: editingArticle.immediateSteps
                    .split('\n')
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                  whatNotToDo: editingArticle.whatNotToDo
                    .split('\n')
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                  rightsAndResources: editingArticle.rightsAndResources
                    .split('\n')
                    .map((s: string) => s.trim())
                    .filter(Boolean),
                }
                editingArticle.immediateSteps = formattedArticle.immediateSteps
                editingArticle.whatNotToDo = formattedArticle.whatNotToDo
                editingArticle.rightsAndResources = formattedArticle.rightsAndResources
                handleSaveArticle(e)
              }}
              className="space-y-3 pt-2"
            >
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Título do Tópico</Label>
                <Input
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Resumo Curto</Label>
                <Input
                  value={editingArticle.shortSummary}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, shortSummary: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Passos Imediatos (1 por linha)</Label>
                <Textarea
                  rows={4}
                  value={editingArticle.immediateSteps}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, immediateSteps: e.target.value })
                  }
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">O que NÃO fazer (1 por linha)</Label>
                <Textarea
                  rows={3}
                  value={editingArticle.whatNotToDo}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, whatNotToDo: e.target.value })
                  }
                  className="text-xs font-mono"
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
                >
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
