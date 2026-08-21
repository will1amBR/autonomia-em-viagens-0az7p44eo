import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Heart, Key, Compass, CheckCircle2, ArrowRight, Info, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
      <div className="text-center space-y-3">
        <Badge
          variant="outline"
          className="text-xs px-3 py-1 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
        >
          Onboarding e Propósito
        </Badge>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Bem-vindo(a) ao SafeTrip
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Um espaço seguro, discreto e sem julgamentos para apoiar você em qualquer jornada pelo
          mundo.
        </p>
      </div>

      <div className="space-y-4">
        {/* Core Manifesto Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block">
                Princípio Fundamental
              </span>
              <h2 className="text-lg sm:text-xl font-bold">Por que existimos?</h2>
            </div>
          </div>

          <blockquote className="border-l-4 border-sky-400 pl-4 py-1 text-sm sm:text-base font-medium text-slate-200 leading-relaxed italic space-y-2">
            <p>"Este aplicativo não existe para dizer com quem você pode viajar."</p>
            <p>
              "Ele existe para garantir que, independentemente de quem esteja ao seu lado, você
              continue tendo escolhas."
            </p>
          </blockquote>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Autonomia é um direito
              </span>
              <p>
                Ter suas próprias chaves, dinheiro e passagem não diminui o carinho ou a confiança
                em ninguém.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Prevenção Sem Alarme
              </span>
              <p>
                Sem dramatizações. Nosso foco é puramente logístico, financeiro e de comunicação
                prática.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Step Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2">
              <span className="text-xs font-bold text-sky-600">Passo 1</span>
              <CardTitle className="text-sm font-bold">Dados da Viagem</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-600">
              País de destino, datas, contatos de anfitriões e locais de estadia.
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2">
              <span className="text-xs font-bold text-indigo-600">Passo 2</span>
              <CardTitle className="text-sm font-bold">Diagnóstico de Autonomia</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-600">
              Perguntas rápidas sobre cartões, passagem de volta, posse do passaporte e limites.
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="p-4 pb-2">
              <span className="text-xs font-bold text-emerald-600">Passo 3</span>
              <CardTitle className="text-sm font-bold">Plano de Ação & Guardians</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-slate-600">
              Checklist interativo, pessoas de confiança cadastradas e SOS em 1 toque.
            </CardContent>
          </Card>
        </div>

        {/* Privacy Note */}
        <div className="p-4 bg-slate-100 rounded-xl flex items-start gap-3 text-xs text-slate-600 border border-slate-200">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Privacidade total:</strong> Você controla exatamente quais informações seus
            Guardians recebem. O aplicativo conta com botão de disfarce rápido (Quick Exit) no topo
            caso precise alternar a tela instantaneamente.
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-800">
          ← Voltar para a página inicial
        </Link>
        <Button
          size="lg"
          onClick={() => navigate('/create-trip')}
          className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 h-12 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-600/20"
        >
          <span>Começar minha avaliação</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
