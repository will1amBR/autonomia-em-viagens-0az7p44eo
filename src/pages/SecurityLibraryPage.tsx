import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileLock,
  FileQuestion,
  DoorClosed,
  CreditCard,
  Smartphone,
  ShieldAlert,
  HeartCrack,
  EyeOff,
  Compass,
  AlertTriangle,
  PlaneTakeoff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
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
import { SECURITY_LIBRARY, SecurityLibraryCategory } from '../lib/constants'

export const SecurityLibraryPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<SecurityLibraryCategory | null>(null)

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <Badge
          variant="outline"
          className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
        >
          Biblioteca de Protocolos e Direitos
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Orientações para Situações de Risco
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Instruções simples, diretas e acionáveis para 11 cenários comuns em viagens
          internacionais.
        </p>
      </div>

      {/* Universal 5-Step Golden Rule Callout */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>REGRA DE OURO UNIVERSAL: O QUE FAZER EM QUALQUER IMPREVISTO</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs pt-1">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">1. Local Seguro</span>
            <p className="text-slate-300 text-[11px]">
              Vá para um local público e movimentado (lobby de hotel, aeroporto, shopping).
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">2. Pessoa de Apoio</span>
            <p className="text-slate-300 text-[11px]">
              Entre em contato imediato com seu Guardian ou família de confiança.
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
              Não confronte ninguém fisicamente se isso aumentar seu risco pessoal.
            </p>
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
            <span className="font-bold text-sky-300 block">5. Ajuda Oficial</span>
            <p className="text-slate-300 text-[11px]">
              Procure a polícia de turismo ou o plantão consular brasileiro.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 11 Library Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECURITY_LIBRARY.map((item) => (
          <Card
            key={item.id}
            onClick={() => setSelectedTopic(item)}
            className="border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <CardHeader className="p-5 pb-2 space-y-2">
              <div className="flex items-center justify-between">
                {getUrgencyBadge(item.urgencyLevel)}
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 space-y-3">
              <p className="line-clamp-2 leading-relaxed">{item.shortSummary}</p>
              <div className="pt-1 flex items-center text-sky-600 font-semibold text-xs">
                <span>Ver instruções de ação</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader className="space-y-2">
              <div className="flex items-center gap-2">
                {getUrgencyBadge(selectedTopic.urgencyLevel)}
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 leading-tight">
                {selectedTopic.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                {selectedTopic.shortSummary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              {/* O que fazer agora */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-emerald-950">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> O QUE FAZER AGORA (PASSO A
                  PASSO)
                </span>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-800">
                  {selectedTopic.immediateSteps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* O que NÃO fazer */}
              {selectedTopic.whatNotToDo && selectedTopic.whatNotToDo.length > 0 && (
                <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-2 text-red-950">
                  <span className="font-bold text-red-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                    <XCircle className="w-4 h-4 text-red-600" /> O QUE EVITAR FAZER
                  </span>
                  <ul className="list-disc list-inside space-y-1 leading-relaxed text-slate-800">
                    {selectedTopic.whatNotToDo.map((item, idx) => (
                      <li key={idx} className="pl-1">
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direitos e Recursos */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1.5 text-sky-950">
                <span className="font-bold text-sky-900 block text-xs">
                  Seus Direitos e Amparo Legal:
                </span>
                {selectedTopic.rightsAndResources.map((res, idx) => (
                  <p key={idx} className="text-slate-700 leading-relaxed">
                    • {res}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTopic(null)}
                className="text-xs"
              >
                Fechar
              </Button>
              <Link to="/emergency">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                >
                  Ir para Modo SOS
                </Button>
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
