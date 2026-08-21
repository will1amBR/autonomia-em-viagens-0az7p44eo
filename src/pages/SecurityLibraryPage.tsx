import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileLock,
  DoorClosed,
  CreditCard,
  Smartphone,
  FileQuestion,
  HeartCrack,
  EyeOff,
  ShieldAlert,
  AlertTriangle,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Phone,
  Building2,
  Mail,
  MapPin,
  Clock,
  Shield,
  LifeBuoy,
  ChevronRight,
  HeartPulse,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'
import {
  SECURITY_LIBRARY,
  SecurityLibraryScenario,
  COUNTRY_EMERGENCY_CONTACTS,
} from '../lib/constants'

export const SecurityLibraryPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<SecurityLibraryScenario | null>(null)
  const [selectedCountryKey, setSelectedCountryKey] = useState<string>('Italia')

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'critica':
        return <Badge className="bg-red-600 text-white font-bold text-[10px]">Ação Crítica</Badge>
      case 'alta':
        return (
          <Badge className="bg-amber-600 text-white font-bold text-[10px]">Alta Prioridade</Badge>
        )
      default:
        return (
          <Badge className="bg-sky-600 text-white font-bold text-[10px]">
            Orientação Preventiva
          </Badge>
        )
    }
  }

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileLock':
        return <FileLock className="w-5 h-5 text-sky-600" />
      case 'DoorClosed':
        return <DoorClosed className="w-5 h-5 text-red-600" />
      case 'CreditCardOff':
        return <CreditCard className="w-5 h-5 text-amber-600" />
      case 'SmartphoneOff':
        return <Smartphone className="w-5 h-5 text-purple-600" />
      case 'FileQuestion':
        return <FileQuestion className="w-5 h-5 text-sky-600" />
      case 'HeartCrack':
        return <HeartCrack className="w-5 h-5 text-rose-600" />
      case 'EyeOff':
        return <EyeOff className="w-5 h-5 text-indigo-600" />
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-orange-600" />
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-600" />
      default:
        return <Shield className="w-5 h-5 text-sky-600" />
    }
  }

  const countryKeys = [
    { key: 'Italia', label: '🇮🇹 Itália' },
    { key: 'Franca', label: '🇫🇷 França' },
    { key: 'Portugal', label: '🇵🇹 Portugal' },
    { key: 'Espanha', label: '🇪🇸 Espanha' },
    { key: 'ReinoUnido', label: '🇬🇧 Reino Unido' },
    { key: 'EstadosUnidos', label: '🇺🇸 EUA' },
    { key: 'Argentina', label: '🇦🇷 Argentina' },
    { key: 'Japao', label: '🇯🇵 Japão' },
  ]

  const activeContact =
    COUNTRY_EMERGENCY_CONTACTS[selectedCountryKey] || COUNTRY_EMERGENCY_CONTACTS['Italia']

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
          >
            Biblioteca de Segurança Expandida
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Orientações para Situações de Risco
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Protocolos objetivos, direitos e contatos oficiais de emergência organizados para os 11
            cenários mais críticos em viagens internacionais.
          </p>
        </div>

        {/* Quick Emergency Mode CTA */}
        <div className="flex-shrink-0">
          <Link to="/emergency">
            <Button className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs h-10 px-4 rounded-xl shadow-md flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Modo SOS / Emergência</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Philosophy banner: Acolhedor, Neutro e Não-Alarmista */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>AUTONOMIA NÃO É DESCONFIANÇA: REGRA DE OURO EM QUALQUER IMPREVISTO</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs pt-1">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">1. Local Seguro</span>
            <p className="text-slate-300 text-[11px]">
              Vá para um local público e movimentado (lobby de hotel 24h, aeroporto, shopping).
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">2. Pessoa de Apoio</span>
            <p className="text-slate-300 text-[11px]">
              Comunique seu Guardian de segurança ou familiar de confiança.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">3. Recursos Próprios</span>
            <p className="text-slate-300 text-[11px]">
              Use sua reserva de emergência e canais consulares de suporte.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">4. Sem Confronto</span>
            <p className="text-slate-300 text-[11px]">
              Não confronte ninguém fisicamente se isso colocar sua integridade em risco.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">5. Ajuda Oficial</span>
            <p className="text-slate-300 text-[11px]">
              Procure a polícia de turismo ou o plantão consular brasileiro no país.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of the 11 Scenarios */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-sky-600" /> Os 11 Cenários de Proteção e Resposta
          </h2>
          <span className="text-xs text-slate-500">
            Selecione um cenário para ler o protocolo completo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECURITY_LIBRARY.map((item) => (
            <Card
              key={item.id}
              onClick={() => setSelectedTopic(item)}
              className="border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <CardHeader className="p-5 pb-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-sky-50 transition-colors">
                      {getScenarioIcon(item.iconName)}
                    </div>
                    {getUrgencyBadge(item.urgencyLevel)}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-xs text-slate-600 space-y-3">
                <p className="line-clamp-2 leading-relaxed">{item.shortSummary}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sky-600 font-semibold text-xs">
                  <span>5 passos imediatos & contatos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Comprehensive Country Emergency Directory section */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/50">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
            <Building2 className="w-4 h-4 text-sky-600" /> Diretório de Emergência e Apoio por País
          </CardTitle>
          <CardDescription className="text-xs">
            Contatos oficiais da polícia local, serviços de urgência médica, Embaixadas e Plantões
            Consulares 24h para brasileiros no exterior.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          {/* Country Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
            {countryKeys.map((c) => (
              <Button
                key={c.key}
                variant={selectedCountryKey === c.key ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCountryKey(c.key)}
                className={`text-xs h-8 rounded-lg font-semibold ${
                  selectedCountryKey === c.key
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {/* Active Country Detail Box */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>{activeContact.country}</span>
                  <Badge variant="outline" className="text-[10px] bg-slate-50">
                    Capital: {activeContact.city}
                  </Badge>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Plantão 24h Consular:</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  {activeContact.consulateEmergency24h}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Police & Medical Emergency */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Phone className="w-3.5 h-3.5 text-slate-600" /> Números de Emergência Local
                </span>
                <div className="space-y-1 text-slate-700 text-[11px]">
                  <p>
                    <strong>Polícia:</strong> {activeContact.policeNumber}
                  </p>
                  <p>
                    <strong>Emergência Médica / Ambulância:</strong>{' '}
                    {activeContact.medicalEmergencyNumber}
                  </p>
                  <p>
                    <strong>Número Geral:</strong> {activeContact.generalEmergencyNumber}
                  </p>
                </div>
              </div>

              {/* Consulate / Embassy */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" /> Representação Brasileira
                </span>
                <div className="space-y-1 text-slate-700 text-[11px]">
                  <p className="font-semibold text-slate-900">
                    {activeContact.consulateEmbassyName}
                  </p>
                  <p>
                    <MapPin className="w-3 h-3 inline mr-1 text-slate-400" />
                    {activeContact.consulateAddress}
                  </p>
                  <p>
                    <Phone className="w-3 h-3 inline mr-1 text-slate-400" />
                    {activeContact.consulatePhone}
                  </p>
                  <p>
                    <Mail className="w-3 h-3 inline mr-1 text-slate-400" />
                    {activeContact.consulateEmail}
                  </p>
                </div>
              </div>

              {/* Hospital & Support Lines */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" /> Saúde & Linhas de Apoio
                </span>
                <div className="space-y-1 text-slate-700 text-[11px]">
                  <p>
                    <strong>Hospital de Referência:</strong> {activeContact.referenceHospital}
                  </p>
                  {activeContact.womenHelpline && (
                    <p className="text-amber-900 bg-amber-50/80 p-1 rounded border border-amber-200/60">
                      <strong>Apoio a Mulheres / Vítimas:</strong> {activeContact.womenHelpline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic pt-1">
              * {activeContact.foreignerNote}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog with 5 steps, 3 behaviors to avoid, and Country-specific contacts tabs */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                {getUrgencyBadge(selectedTopic.urgencyLevel)}
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {selectedTopic.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 leading-relaxed">
                {selectedTopic.shortSummary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2 text-xs">
              {/* O QUE FAZER AGORA (5 PASSOS PRÁTICOS) */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2.5 text-emerald-950">
                <span className="font-extrabold text-emerald-900 flex items-center gap-2 text-xs tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> O QUE FAZER AGORA — 5 PASSOS
                  PRÁTICOS
                </span>
                <ol className="list-decimal list-inside space-y-2 leading-relaxed text-slate-800">
                  {selectedTopic.immediateSteps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* O QUE EVITAR (3 COMPORTAMENTOS DE RISCO) */}
              {selectedTopic.whatNotToDo && selectedTopic.whatNotToDo.length > 0 && (
                <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl space-y-2 text-red-950">
                  <span className="font-extrabold text-red-900 flex items-center gap-2 text-xs tracking-wide">
                    <XCircle className="w-4 h-4 text-red-600" /> O QUE EVITAR — 3 COMPORTAMENTOS DE
                    RISCO
                  </span>
                  <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-slate-800">
                    {selectedTopic.whatNotToDo.map((item, idx) => (
                      <li key={idx} className="pl-1">
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ONDE PEDIR APOIO — CONTATOS POR PAÍS */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                  <Building2 className="w-4 h-4 text-sky-600" /> ONDE PEDIR APOIO — CONTATOS
                  OFICIAIS POR PAÍS
                </span>
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="Italia"
                  className="w-full space-y-1"
                >
                  {Object.entries(COUNTRY_EMERGENCY_CONTACTS).map(([key, contact]) => (
                    <AccordionItem
                      key={key}
                      value={key}
                      className="border border-slate-200 rounded-xl px-3 bg-white"
                    >
                      <AccordionTrigger className="text-xs font-semibold hover:no-underline py-2.5">
                        <span className="flex items-center gap-2">
                          <span>
                            {contact.country} ({contact.city})
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            Polícia: {contact.policeNumber} | Plantão:{' '}
                            {contact.consulateEmergency24h.split(' ')[0]}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-slate-700 space-y-2 pt-1 pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg">
                          <div>
                            <p>
                              <strong>Polícia:</strong> {contact.policeNumber}
                            </p>
                            <p>
                              <strong>Ambulância:</strong> {contact.medicalEmergencyNumber}
                            </p>
                            <p>
                              <strong>Hospital Ref.:</strong> {contact.referenceHospital}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {contact.consulateEmbassyName}
                            </p>
                            <p>
                              <strong>Endereço:</strong> {contact.consulateAddress}
                            </p>
                            <p className="text-sky-700 font-bold">
                              <strong>Plantão 24h:</strong> {contact.consulateEmergency24h}
                            </p>
                          </div>
                        </div>
                        {contact.womenHelpline && (
                          <p className="text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200">
                            <strong>Apoio a Mulheres / Vítimas:</strong> {contact.womenHelpline}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 italic">
                          * {contact.foreignerNote}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* DIREITOS E AMPARO LEGAL */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1.5 text-sky-950">
                <span className="font-bold text-sky-900 block text-xs">
                  Seus Direitos e Amparo Legal:
                </span>
                {selectedTopic.rightsAndResources.map((res, idx) => (
                  <p key={idx} className="text-slate-700 leading-relaxed text-[11px]">
                    • {res}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="text-xs"
              >
                Fechar Artigo
              </Button>
              <Link to="/emergency">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Acesso Rápido ao Modo SOS</span>
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
