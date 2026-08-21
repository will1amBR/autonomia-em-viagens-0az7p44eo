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
      const [m, d, s] = await Promise.all([
        adminService.getPlatformMetrics(),
        adminService.listDestinations(),
        adminService.listSecurityLibrary(),
      ])
      setMetrics(m)
      setDestinations(d)
      setSecurityArticles(s)
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

        {/* 1. METRICS TAB */}
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
                <span>Contas ativas no sistema</span>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-indigo-50/40">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs font-medium text-slate-500">
                  Planos de Viagem Criados
                </CardDescription>
                <CardTitle className="text-2xl font-black text-indigo-900">
                  {metrics?.totalTrips ?? '...'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-[11px] text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Viagens estruturadas</span>
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

          {/* Distribution Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5">
              <CardTitle className="text-base font-bold text-slate-900">
                Distribuição de Nível de Autonomia dos Viajantes
              </CardTitle>
              <CardDescription className="text-xs">
                Mapeamento das faixas de risco e prontidão dos usuários avaliados.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-xs font-semibold text-emerald-800">
                    Alta Autonomia (75-100)
                  </span>
                  <p className="text-2xl font-black text-emerald-900">
                    {metrics?.scoreDistribution.high ?? 0} viajantes
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Controle financeiro e retorno garantido
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-xs font-semibold text-amber-800">
                    Autonomia Moderada (45-74)
                  </span>
                  <p className="text-2xl font-black text-amber-900">
                    {metrics?.scoreDistribution.moderate ?? 0} viajantes
                  </p>
                  <p className="text-[11px] text-amber-700">Pontos de dependência a mitigar</p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <span className="text-xs font-semibold text-red-800">
                    Atenção Crítica (&lt;45)
                  </span>
                  <p className="text-2xl font-black text-red-900">
                    {metrics?.scoreDistribution.low ?? 0} viajantes
                  </p>
                  <p className="text-[11px] text-red-700">
                    Alta vulnerabilidade / sem retorno próprio
                  </p>
                </div>
              </div>
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
