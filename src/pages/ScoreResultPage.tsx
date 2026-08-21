import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Lock,
  Compass,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { useTrip } from '../context/TripContext'

export const ScoreResultPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentTrip } = useTrip()
  const { scoreResult, destinationCountry, destinationCity } = currentTrip

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'HIGH':
        return (
          <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1">
            ALTA AUTONOMIA
          </Badge>
        )
      case 'MODERATE':
        return (
          <Badge className="bg-amber-500 text-white font-bold text-xs px-3 py-1">
            AUTONOMIA MODERADA
          </Badge>
        )
      default:
        return (
          <Badge className="bg-rose-600 text-white font-bold text-xs px-3 py-1">
            BAIXA AUTONOMIA
          </Badge>
        )
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'HIGH':
        return 'text-emerald-600'
      case 'MODERATE':
        return 'text-amber-500'
      default:
        return 'text-rose-600'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
          Resultado da Avaliação
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Índice de Autonomia da Viagem
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Viagem planejada para{' '}
          <strong>
            {destinationCity}, {destinationCountry}
          </strong>
        </p>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Score Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-sky-400/30 bg-slate-900/60 shadow-inner">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                {scoreResult.overallScore}
              </span>
              <span className="text-xs text-sky-300 font-bold absolute bottom-4">/ 100</span>
            </div>
            <div>{getTierBadge(scoreResult.tier)}</div>
            <p className="text-[11px] text-slate-300">
              Mede sua capacidade prática de tomada de decisão e saída independente.
            </p>
          </div>

          {/* Explanation & Philosophy */}
          <div className="md:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Avaliação Técnica e Não-Julgadora</span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {scoreResult.summaryText}
            </p>

            <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">Lembrete Importante:</p>
              <p>
                Este score não avalia a índole de quem te convidou. Ele indica que você pode
                equilibrar a viagem resolvendo pontos de dependência antes de decolar.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/checklist" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-slate-950 font-extrabold text-xs sm:text-sm px-6 h-11 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20">
                  <span>Criar meu Plano de Segurança</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-xs h-11 rounded-xl"
                >
                  Ir para o Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" /> Detalhamento por Área de Autonomia
          </CardTitle>
          <CardDescription className="text-xs">
            Percentual de preparo e controle em cada pilar da sua viagem
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Documentação */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Documentação & Posse</span>
                <span className="text-slate-900 font-bold">
                  {scoreResult.breakdown.documentation}%
                </span>
              </div>
              <Progress value={scoreResult.breakdown.documentation} className="h-2" />
            </div>

            {/* Retorno */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Passagem & Retorno Independente</span>
                <span className="text-slate-900 font-bold">{scoreResult.breakdown.return}%</span>
              </div>
              <Progress value={scoreResult.breakdown.return} className="h-2" />
            </div>

            {/* Financeiro */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Recursos Financeiros Próprios</span>
                <span className="text-slate-900 font-bold">{scoreResult.breakdown.finances}%</span>
              </div>
              <Progress value={scoreResult.breakdown.finances} className="h-2" />
            </div>

            {/* Comunicação */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Comunicação & Internet</span>
                <span className="text-slate-900 font-bold">
                  {scoreResult.breakdown.communication}%
                </span>
              </div>
              <Progress value={scoreResult.breakdown.communication} className="h-2" />
            </div>

            {/* Hospedagem & Mobilidade */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Hospedagem & Saída Livre</span>
                <span className="text-slate-900 font-bold">{scoreResult.breakdown.housing}%</span>
              </div>
              <Progress value={scoreResult.breakdown.housing} className="h-2" />
            </div>

            {/* Rede de Proteção */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Rede de Proteção & Guardians</span>
                <span className="text-slate-900 font-bold">
                  {scoreResult.breakdown.protectionNetwork}%
                </span>
              </div>
              <Progress value={scoreResult.breakdown.protectionNetwork} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identified Points & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Dependence Factors */}
        <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Fatores de Dependência Detectados
            </CardTitle>
            <CardDescription className="text-xs text-amber-800">
              Pontos que aumentam sua vulnerabilidade caso algo dê errado
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2.5">
            {scoreResult.identifiedDependenceFactors.length > 0 ? (
              scoreResult.identifiedDependenceFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-amber-950 bg-white/80 p-3 rounded-lg border border-amber-200/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                  <span>{factor}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 bg-white p-3 rounded-lg border border-emerald-200">
                Nenhum fator crítico de dependência imediata detectado.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card className="border-sky-200 bg-sky-50/40 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold text-sky-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600" /> Ações Recomendadas Pré-Embarque
            </CardTitle>
            <CardDescription className="text-xs text-sky-800">
              Passos simples para elevar sua autonomia para 100%
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2.5">
            {scoreResult.recommendedActions.length > 0 ? (
              scoreResult.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-sky-950 bg-white/80 p-3 rounded-lg border border-sky-200/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 bg-white p-3 rounded-lg">
                Continue mantendo suas rotinas de check-in e contatos informados.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={() => navigate('/assessment')}
          className="text-xs text-slate-600"
        >
          ← Refazer Avaliação
        </Button>

        <Link to="/checklist" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 h-11 rounded-xl flex items-center justify-center gap-2">
            <span>Ir para o Checklist de Segurança</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
