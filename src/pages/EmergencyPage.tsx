import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  PhoneCall,
  Users,
  MapPin,
  Building,
  PlaneTakeoff,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Share2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { useTrip } from '../context/TripContext'

export const EmergencyPage: React.FC = () => {
  const { currentTrip, triggerEmergencyAlert } = useTrip()
  const {
    destinationInfo,
    destinationCountry,
    destinationCity,
    guardians,
    accommodationAddress,
    quickNotes,
  } = currentTrip

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [alertSent, setAlertSent] = useState(false)

  const handleTriggerSos = (reason: string) => {
    triggerEmergencyAlert({ reason, location: `${destinationCity}, ${destinationCountry}` })
    setAlertSent(true)
    setTimeout(() => setAlertSent(false), 5000)
  }

  return (
    <div className="min-h-[85vh] bg-red-950/20 py-6 px-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        {/* Top Minimal Stress-Free Header */}
        <div className="flex items-center justify-between border-b border-red-200 pb-3">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Dashboard
            </Button>
          </Link>
          <Badge className="bg-red-600 text-white font-black text-xs px-3 py-1 animate-pulse">
            MODO DE EMERGÊNCIA ATIVO
          </Badge>
        </div>

        {/* Big Alert Banner */}
        <div className="bg-red-600 text-white rounded-3xl p-6 sm:p-8 text-center space-y-2 shadow-2xl shadow-red-600/30">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto text-white">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">PRECISO DE AJUDA</h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-md mx-auto">
            Interface otimizada para alto estresse. Ações rápidas com 1 toque.
          </p>
        </div>

        {alertSent && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span>Alerta de emergência com endereço e coordenadas transmitido aos Guardians!</span>
          </div>
        )}

        {/* High-Stress Action Buttons (Large, high-contrast, minimal text) */}
        <div className="grid grid-cols-1 gap-3.5">
          {/* Button 1: Ligar para Emergência Local */}
          <a href={`tel:${destinationInfo.policeNumber.split('/')[0].trim()}`} className="block">
            <Button className="w-full h-16 bg-slate-950 hover:bg-slate-900 text-white font-black text-base rounded-2xl flex items-center justify-between px-6 shadow-md">
              <div className="flex items-center gap-3 text-left">
                <PhoneCall className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <span className="block text-sm sm:text-base">
                    LIGAR PARA EMERGÊNCIA ({destinationCountry})
                  </span>
                  <span className="text-[11px] font-normal text-slate-300">
                    Número Oficial: {destinationInfo.policeNumber} (Polícia / Socorro)
                  </span>
                </div>
              </div>
              <Badge className="bg-red-500 text-white text-xs">Chamar</Badge>
            </Button>
          </a>

          {/* Button 2: Avisar meu Guardian */}
          <Button
            onClick={() =>
              handleTriggerSos('Aviso direto disparado pelo viajante no Modo Emergência')
            }
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white font-black text-base rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-red-600/30 active:scale-98"
          >
            <div className="flex items-center gap-3 text-left">
              <Users className="w-6 h-6 flex-shrink-0" />
              <div>
                <span className="block text-sm sm:text-base">
                  AVISAR MEU GUARDIAN IMEDIATAMENTE
                </span>
                <span className="text-[11px] font-normal text-red-100">
                  Envia SMS/Alerta com seu endereço salvo para {guardians.length} contatos
                </span>
              </div>
            </div>
            <Badge className="bg-white text-red-700 text-xs font-bold">1 Toque</Badge>
          </Button>

          {/* Button 3: Ver Consulado / Embaixada */}
          <Button
            variant="outline"
            onClick={() => setActiveModal('consulate')}
            className="w-full h-16 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold text-base rounded-2xl flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-left">
              <Building className="w-6 h-6 text-sky-600 flex-shrink-0" />
              <div>
                <span className="block text-sm sm:text-base">
                  VER EMBAIXADA / CONSULADO DO BRASIL
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Plantão 24h para assistência a brasileiros e documentos
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs">
              Abrir
            </Badge>
          </Button>

          {/* Button 4: Ver Endereço Seguro / Ponto de Apoio */}
          <Button
            variant="outline"
            onClick={() => setActiveModal('safehavens')}
            className="w-full h-16 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold text-base rounded-2xl flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-left">
              <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="block text-sm sm:text-base">
                  VER ENDEREÇOS SEGUROS & AEROPORTO
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Hospitais, estações centrais com polícia e postos 24h
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs">
              Ver Locais
            </Badge>
          </Button>

          {/* Button 5: Ver Plano de Saída Imediata */}
          <Button
            variant="outline"
            onClick={() => setActiveModal('exitplan')}
            className="w-full h-16 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-900 font-bold text-base rounded-2xl flex items-center justify-between px-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-left">
              <PlaneTakeoff className="w-6 h-6 text-indigo-600 flex-shrink-0" />
              <div>
                <span className="block text-sm sm:text-base">VER PROTOCOLO DE SAÍDA IMEDIATA</span>
                <span className="text-[11px] font-normal text-slate-500">
                  Como deixar a hospedagem e retornar em segurança
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs">
              Instruções
            </Badge>
          </Button>

          {/* Button 6: Não Consigo Falar (Modo Silencioso) */}
          <Button
            onClick={() =>
              handleTriggerSos(
                'MODO SILENCIOSO: Viajante indicou que não pode falar verbalmente no local',
              )
            }
            className="w-full h-14 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md"
          >
            <VolumeX className="w-5 h-5" />
            <span>NÃO CONSIGO FALAR (ALERTA SILENCIOSO)</span>
          </Button>
        </div>

        {/* Quick Offline Data Reference */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900 block">
            Dados Offline Salvos do seu Local Atual:
          </span>
          <p>
            <strong>Hospedagem:</strong> {accommodationAddress}
          </p>
          <p>
            <strong>Notas de Emergência:</strong> {quickNotes || 'Nenhuma nota adicional salva.'}
          </p>
        </div>
      </div>

      {/* Modal 1: Consulate Info */}
      <Dialog open={activeModal === 'consulate'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-600" /> {destinationInfo.consulateEmbassyName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assistência oficial consular brasileira no país de destino
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="block text-slate-900">Endereço da Representação:</strong>
              <p className="text-slate-700">{destinationInfo.consulateAddress}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1 text-red-900">
              <strong className="block">Plantão Consular de Emergência 24h:</strong>
              <p className="text-sm font-bold">{destinationInfo.consulateEmergency24h}</p>
              <p className="text-[11px] text-red-700">
                Utilize em caso de prisão, falecimento, perda documental ou perigo grave.
              </p>
            </div>
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1 text-sky-900">
              <strong className="block">Telefone Geral / E-mail:</strong>
              <p>{destinationInfo.consulatePhone}</p>
              <p>{destinationInfo.consulateEmail}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Safe Havens */}
      <Dialog open={activeModal === 'safehavens'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Locais Seguros e Refúgios 24h
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pontos monitorados com presença policial constante e apoio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs max-h-[60vh] overflow-y-auto">
            {destinationInfo.safeHavens.map((haven, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
              >
                <span className="font-bold text-slate-900 block">{haven.name}</span>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  {haven.type}
                </span>
                <p className="text-slate-600">{haven.address}</p>
                <p className="text-[11px] text-slate-500 italic pt-1">{haven.notes}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Exit Plan */}
      <Dialog open={activeModal === 'exitplan'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlaneTakeoff className="w-5 h-5 text-indigo-600" /> Protocolo de Saída Imediata
            </DialogTitle>
            <DialogDescription className="text-xs">
              Passos prioritários para deixar o ambiente com segurança
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 space-y-2">
              <strong className="block text-indigo-900">Passo a Passo de Saída:</strong>
              <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                <li>Pegue apenas o essencial: Passaporte, celular, cartões e remédios.</li>
                <li>Saia com calma sem anunciar sua partida caso haja risco de discussão.</li>
                <li>Peça um táxi oficial ou Uber para o Aeroporto Internacional mais próximo.</li>
                <li>
                  No aeroporto, permaneça próximo aos balcões de companhias ou posto de polícia.
                </li>
                <li>Avise seus Guardians de que você já está na área de segurança do aeroporto.</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
