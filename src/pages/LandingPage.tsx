import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  CheckCircle2,
  Compass,
  Users,
  AlertCircle,
  PhoneCall,
  Lock,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Info,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-100 bg-gradient-to-b from-sky-50/60 via-white to-white">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold shadow-sm">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>Plataforma de Autonomia e Segurança para Viagens Internacionais</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            "Autonomia não é{' '}
            <span className="text-sky-600 underline decoration-sky-300 decoration-wavy decoration-2">
              desconfiança
            </span>
            ."
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Antes de viajar, certifique-se de que você{' '}
            <span className="font-semibold text-slate-800">consegue voltar</span>.
          </p>

          <div className="p-4 sm:p-5 max-w-2xl mx-auto bg-slate-900 text-slate-100 rounded-2xl shadow-xl shadow-slate-900/10 text-left border border-slate-800 flex items-start gap-3.5">
            <HeartHandshake className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Você pode confiar em alguém e ainda assim possuir:
              </p>
              <p className="text-xs sm:text-xs text-slate-300 leading-relaxed">
                Dinheiro próprio • Passagem de retorno • Documentos na sua mão • Seguro •
                Comunicação ativa • Rede de contatos • Plano de saída independente.
              </p>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link to="/assessment" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 px-8 h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <span>Fazer Quiz de Autonomia</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/entrar" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 font-bold h-12 rounded-xl"
              >
                Entrar / Login
              </Button>
            </Link>

            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-xs text-slate-700 hover:bg-slate-100 border border-slate-200 h-12 rounded-xl flex items-center gap-1.5"
              >
                <span>Preparar Viagem (Passo a Passo)</span>
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sem julgamentos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Foco em recursos práticos
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% privado e controlado por
              você
            </span>
          </div>
        </div>
      </section>

      {/* Philosophy Callout: Central Question */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl overflow-hidden border border-indigo-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4 text-center sm:text-left">
            <Badge className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-400 text-xs">
              A Pergunta Central
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              "Se amanhã eu decidir que quero voltar para casa,{' '}
              <span className="text-sky-300">eu consigo sozinho(a)?</span>"
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              O problema de muitas viagens em que outra pessoa financia tudo não é falta de afeto ou
              desconfiança. É a vulnerabilidade de perder a liberdade prática de saída. Avaliamos a
              sua autonomia, nunca o caráter de quem te convidou.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/assessment">
                <Button className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-10 rounded-lg">
                  Fazer o Teste de Autonomia (2 min)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of the Product Flow */}
      <section className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Como funciona o SafeTrip
          </h2>
          <p className="text-sm text-slate-600">
            Quatro passos simples e estruturados para garantir que sua experiência internacional
            aconteça com total tranquilidade e liberdade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 font-bold flex items-center justify-center mb-2 text-sm">
                1
              </div>
              <CardTitle className="text-base">Prepare sua viagem</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Cadastre datas, destino, contatos do anfitrião e hospedagem para ter tudo
                centralizado e acessível offline.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-2 text-sm">
                2
              </div>
              <CardTitle className="text-base">Avalie sua autonomia</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Responda a perguntas objetivas sobre retorno, passaporte físico, cartões, e-SIM e
                limites sem constrangimento.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2 text-sm">
                3
              </div>
              <CardTitle className="text-base">Crie sua rede de segurança</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Defina Guardians de confiança (família ou amigos) com níveis granulares de acesso e
                check-ins preventivos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center mb-2 text-sm">
                4
              </div>
              <CardTitle className="text-base">Tenha um plano de saída</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Checklist interativo, consulados, hospitais, hotéis alternativos e Modo de
                Emergência acionável com 1 clique.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Non-accusatory tone explanation */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Lock className="w-5 h-5 text-sky-600" />
            <span>Nossa Linguagem e Filosofia Não-Acusatória</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="bg-red-50/60 border border-red-200/70 p-4 rounded-xl space-y-1.5">
              <span className="font-semibold text-red-800 block text-xs">
                O QUE O SAFETRIP NUNCA DIZ:
              </span>
              <p className="text-red-700 line-through">"Essa pessoa é perigosa ou criminosa."</p>
              <p className="text-red-700 line-through">"Você está caindo em um golpe."</p>
              <p className="text-red-700 line-through">
                "Você é obrigado(a) a desconfiar de quem te convidou."
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-xl space-y-1.5">
              <span className="font-semibold text-emerald-800 block text-xs">
                COMO O SAFETRIP ORIENTA VOCÊ:
              </span>
              <p className="text-emerald-800">
                "Esse fator pode aumentar sua dependência física ou financeira."
              </p>
              <p className="text-emerald-800">
                "Recomendamos garantir sua passagem e dinheiro próprio antes do embarque."
              </p>
              <p className="text-emerald-800">
                "Preserve sempre sua posse física de documentos e meios de voltar."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Callout Section for Quick Exploration */}
      <section className="container mx-auto px-4 max-w-4xl text-center space-y-4 pt-4">
        <div className="p-8 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pronto para organizar sua autonomia de viagem?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Leva menos de 3 minutos para responder a avaliação, gerar seu score e configurar seus
            primeiros contatos de segurança.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/onboarding">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6">
                Começar Onboarding
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-slate-300 text-slate-700">
                Ver Viagem Demonstração (Roma)
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
