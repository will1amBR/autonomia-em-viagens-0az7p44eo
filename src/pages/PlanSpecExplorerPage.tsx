import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Shield,
  Layers,
  GitBranch,
  Database,
  Cpu,
  Lock,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Activity,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

export const PlanSpecExplorerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('architecture')

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-indigo-600 text-white font-bold text-xs px-3 py-1">
            Skip PLAN MODE Complete Spec
          </Badge>
          <Badge
            variant="outline"
            className="text-xs border-indigo-300 text-indigo-800 bg-indigo-50 font-semibold"
          >
            Seções A até Q Detalhadas
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Especificação Arquitetural do Produto
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Mapeamento exaustivo de fluxos, modelos de dados, lógica de score, matriz de permissões de
          Guardians e protocolos de ausência conforme solicitado no PLAN Mode.
        </p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 h-auto p-1 bg-slate-100 gap-1 rounded-xl">
          <TabsTrigger value="architecture" className="text-xs py-2">
            A. Arquitetura
          </TabsTrigger>
          <TabsTrigger value="userflows" className="text-xs py-2">
            B. Fluxos & Telas
          </TabsTrigger>
          <TabsTrigger value="datamodel" className="text-xs py-2">
            E. Modelo Dados
          </TabsTrigger>
          <TabsTrigger value="scorelogic" className="text-xs py-2">
            H. Lógica Score
          </TabsTrigger>
          <TabsTrigger value="guardiancheckin" className="text-xs py-2">
            I/J/K. Guardian & SOS
          </TabsTrigger>
          <TabsTrigger value="scoperec" className="text-xs py-2">
            L-Q. Escopo & Riscos
          </TabsTrigger>
        </TabsList>

        {/* TAB A: Product Architecture */}
        <TabsContent value="architecture" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" /> A. Product Architecture & Filosofia
                Técnica
              </CardTitle>
              <CardDescription className="text-xs">
                A plataforma foi desenhada sob o princípio: "Autonomia não é desconfiança".
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <strong className="block text-slate-900 font-bold">1. Camadas da Aplicação:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>
                    <strong>Frontend Core:</strong> Single-page application React 19 + TypeScript +
                    Tailwind CSS com componentes Shadcn UI acessíveis.
                  </li>
                  <li>
                    <strong>Offline-First State:</strong> Armazenamento local redundante
                    (LocalStorage/IndexedDB) para garantir que números de emergência, endereço da
                    hospedagem e checklist funcionem mesmo sem chip ou Wi-Fi no exterior.
                  </li>
                  <li>
                    <strong>Backend & Auth Layer:</strong> Skip Cloud (PocketBase) com autenticação
                    de usuários, logs de auditoria e tabelas protegidas por permissões granulares.
                  </li>
                  <li>
                    <strong>Privacy Guard & Quick Exit:</strong> Camada de disfarce instantâneo
                    (notícias/tempo) ativada por 1 toque ou atalho rápido.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-indigo-950">
                <strong className="block font-bold text-indigo-900">
                  2. Princípio Psicológico e Não-Julgador:
                </strong>
                <p className="text-xs">
                  O sistema nunca classifica pessoas como criminosas ou emitirá alertas acusatórios.
                  Avalia-se exclusivamente a **autonomia logística e financeira** da pessoa usuária
                  (posse física do passaporte, passagem de volta garantida, reserva financeira
                  própria e rede de comunicação).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB B: User Flows & Screen Map */}
        <TabsContent value="userflows" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-sky-600" /> B & C. User Flows e Mapeamento de
                Telas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs sm:text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <strong className="block font-bold text-slate-900">
                  Fluxo Principal do Viajante:
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <Badge className="bg-sky-600 text-white text-[10px]">1. Entrada</Badge>
                    <span className="font-bold block text-slate-800">Landing & Onboarding</span>
                    <p className="text-slate-500 text-[11px]">
                      Explicação do propósito sem alarme e consentimento de privacidade.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <Badge className="bg-indigo-600 text-white text-[10px]">2. Diagnóstico</Badge>
                    <span className="font-bold block text-slate-800">Criar Viagem & Score</span>
                    <p className="text-slate-500 text-[11px]">
                      Cadastro do destino, pergunta central ("Volto amanhã?") e cálculo de autonomia
                      0-100.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <Badge className="bg-emerald-600 text-white text-[10px]">3. Execução</Badge>
                    <span className="font-bold block text-slate-800">
                      Checklist, Guardians & SOS
                    </span>
                    <p className="text-slate-500 text-[11px]">
                      Check-ins diários com protocolo de ausência e Emergency Mode com botões
                      grandes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB E: Data Model */}
        <TabsContent value="datamodel" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" /> E. Data Model (Tabelas do Sistema)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-sky-400 font-bold block">users</span>
                  <p className="text-[11px] text-slate-400">
                    id, name, email, phone, quick_exit_code, created_at
                  </p>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-sky-400 font-bold block">trips</span>
                  <p className="text-[11px] text-slate-400">
                    id, user_id, title, country, city, departure, return, host_name, host_phone,
                    address
                  </p>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-emerald-400 font-bold block">safety_scores</span>
                  <p className="text-[11px] text-slate-400">
                    id, trip_id, overall_score, tier, breakdown_json, identified_risks
                  </p>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-indigo-400 font-bold block">guardians</span>
                  <p className="text-[11px] text-slate-400">
                    id, trip_id, name, phone, email, access_type (basic/security/emergency)
                  </p>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-amber-400 font-bold block">checkin_events</span>
                  <p className="text-[11px] text-slate-400">
                    id, trip_id, status (ok/needs_help/cannot_speak), note, timestamp,
                    escalation_stage
                  </p>
                </div>
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1">
                  <span className="text-rose-400 font-bold block">emergency_protocols</span>
                  <p className="text-[11px] text-slate-400">
                    id, trip_id, triggered_at, reason, notifications_dispatched
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB H: Score Logic */}
        <TabsContent value="scorelogic" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" /> H. Regras e Fórmulas do Índice de
                Autonomia
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <strong className="block text-amber-950 font-bold text-xs uppercase tracking-wide">
                  Pesos Ponderados (0 a 100):
                </strong>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-900">
                  <li>
                    <strong>Retorno Independente (25%):</strong> Passagem comprada e viabilidade de
                    retorno imediato no dia seguinte.
                  </li>
                  <li>
                    <strong>Recursos Financeiros Próprios (20%):</strong> Cartão internacional e
                    dinheiro para alimentação e hospedagem.
                  </li>
                  <li>
                    <strong>Documentação & Posse (15%):</strong> Passaporte sob a guarda do próprio
                    viajante com mais de 6 meses de validade.
                  </li>
                  <li>
                    <strong>Comunicação (15%):</strong> Aparelho funcional e eSIM/roaming
                    internacional ativado.
                  </li>
                  <li>
                    <strong>Hospedagem & Mobilidade (15%):</strong> Conhecimento do endereço exato e
                    liberdade para sair da estadia sozinho(a).
                  </li>
                  <li>
                    <strong>Rede de Apoio (10%):</strong> Pelo menos 1 Guardian ativo e familiares
                    com o itinerário.
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-900 block">75 a 100: Alta Autonomia</span>
                  <p className="text-emerald-700 text-[11px]">
                    Plena liberdade de decisão e capacidade de retorno autônomo.
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900 block">
                    45 a 74: Autonomia Moderada
                  </span>
                  <p className="text-amber-700 text-[11px]">
                    Existem dependências financeiras ou de passagem a ajustar.
                  </p>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-bold text-rose-900 block">0 a 44: Baixa Autonomia</span>
                  <p className="text-rose-700 text-[11px]">
                    Dependência severa de terceiros; alto risco de retenção involuntária.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB I/J/K: Guardian & SOS */}
        <TabsContent value="guardiancheckin" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" /> I, J & K. Guardian, Check-in & Modo de
                Emergência
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <strong className="block font-bold text-slate-900 text-xs">
                    Protocolo de Ausência em 4 Etapas:
                  </strong>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-xs">
                    <li>Notificação push para o próprio viajante no horário programado.</li>
                    <li>Segunda tentativa após 60 minutos de tolerância.</li>
                    <li>
                      Mensagem preventiva ao Guardian:{' '}
                      <em>"Não recebemos a confirmação esperada."</em>
                    </li>
                    <li>Alerta de segurança completo aos Guardians autorizados.</li>
                  </ol>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-red-950">
                  <strong className="block font-bold text-red-900 text-xs">
                    Ergonomia do Modo de Emergência:
                  </strong>
                  <p className="text-xs">
                    Projetado para estresse severo: botões gigantes, contraste máximo, 1 toque para
                    acionamento de discagem 112/911, envio de coordenadas e consulta aos telefones
                    consulares 24h.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB L-Q: Scope & Risks */}
        <TabsContent value="scoperec" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-800" /> L a Q. Escopo MVP vs V2, Riscos & Ordem
                de Construção
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <strong className="block font-bold text-emerald-900 text-xs uppercase">
                    Escopo Concluído no MVP:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-xs text-emerald-800">
                    <li>Landing page com manifesto e tom não-acusatório</li>
                    <li>Onboarding e criação detalhada de viagem</li>
                    <li>Avaliação de autonomia completa e cálculo de score 0-100</li>
                    <li>Checklist interativo de segurança pré-embarque</li>
                    <li>Gestão de Guardians com controle granular de acesso</li>
                    <li>Sistema de check-in e protocolo escalonado</li>
                    <li>Modo de emergência com discagem e refúgios 24h</li>
                    <li>Biblioteca de segurança cobrindo 11 categorias de risco</li>
                    <li>Modo Quick Exit (disfarce imediato)</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <strong className="block font-bold text-slate-900 text-xs uppercase">
                    Roadmap para V2:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    <li>Integração direta com APIs de WhatsApp e SMS (Twilio)</li>
                    <li>Upload de arquivos criptografados para cofre de documentos</li>
                    <li>Integração automática com feeds consulares do Itamaraty</li>
                    <li>Check-in por voz e biometria de segurança opcional</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
