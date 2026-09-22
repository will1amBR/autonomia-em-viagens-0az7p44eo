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
  Radio,
  Fingerprint,
  BellRing,
  UserCheck,
  Send,
  Eye,
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 w-full max-w-2xl mx-auto">
            <Link to="/assessment" className="w-full sm:w-auto flex-1">
              <Button
                size="lg"
                className="w-full text-sm sm:text-base font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/25 px-6 h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <span>Fazer Quiz de Autonomia</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/entrar" className="w-full sm:w-auto flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full text-sm sm:text-base border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 font-bold h-12 rounded-xl shadow-xs"
              >
                Área de Acesso / Entrar
              </Button>
            </Link>

            <Link to="/destinos" className="w-full sm:w-auto flex-1">
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-xs sm:text-sm text-slate-700 hover:bg-slate-100 border border-slate-200 font-semibold h-12 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-sky-600" />
                <span>Guia de Destinos</span>
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
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-12 text-white shadow-2xl overflow-hidden border border-indigo-900/50">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-4 text-center sm:text-left">
            <Badge className="bg-amber-400 text-slate-900 font-bold hover:bg-amber-400 text-xs">
              A Pergunta Central
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              "Se amanhã eu decidir que quero voltar para casa,{' '}
              <span className="text-sky-300">eu consigo sozinho(a)?</span>"
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              O fator crítico em viagens internacionais em que outra pessoa financia ou organiza
              tudo não é o afeto ou desconfiança. É você possuir pouca autonomia para sair da
              situação se algo mudar. Avaliamos sua autonomia prática, nunca o caráter de quem te
              convidou.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link to="/assessment" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm px-6 h-11 rounded-xl">
                  Fazer o Teste de Autonomia (2 min)
                </Button>
              </Link>
              <Link to="/destinos" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 text-xs sm:text-sm px-5 h-11 rounded-xl"
                >
                  Consultar Guia de Destinos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* SEÇÃO DIFERENCIAIS EM CARDS MOBILE-FIRST COM ÍCONES */}
      <section className="container mx-auto px-4 max-w-5xl space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge className="bg-sky-100 text-sky-800 border-sky-200 font-bold text-xs uppercase tracking-wider">
            Tecnologia de Proteção Discreta
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Diferenciais pensados para sua liberdade real
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Recursos práticos que operam sem alarde, respeitando sua privacidade e sua rede de apoio
            em qualquer parte do mundo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Código secreto / sinal sob ameaça discreto */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between">
            <CardHeader className="p-5 pb-3 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-amber-300 text-amber-800 bg-amber-50 mb-1.5 font-bold"
                >
                  Silencioso & Indetectável
                </Badge>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  Código secreto / Sinal sob ameaça discreto
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
              Alerta silencioso com coordenadas GPS em tempo real enviado diretamente para seus
              guardians e canal policial consular, sem que ninguém ao redor perceba nada na tela.
            </CardContent>
          </Card>

          {/* Card 2: Botão discreto flutuante */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between">
            <CardHeader className="p-5 pb-3 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-sky-300 text-sky-800 bg-sky-50 mb-1.5 font-bold"
                >
                  Acesso Instantâneo
                </Badge>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  Botão discreto flutuante
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
              Sempre visível no canto da interface, acionado por toques múltiplos ou pressão longa
              de 3 segundos para transformar a tela instantaneamente em modo neutro ou disparar SOS.
            </CardContent>
          </Card>

          {/* Card 3: Protocolo de ausência em 4 etapas */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between">
            <CardHeader className="p-5 pb-3 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-indigo-300 text-indigo-800 bg-indigo-50 mb-1.5 font-bold"
                >
                  Escalonamento Seguro
                </Badge>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  Protocolo de ausência em 4 etapas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
              Se você parar de responder aos check-ins programados, sua rede é avisada
              progressivamente (Lembrete suave → Confirmação direta → Alerta preventivo →
              Escalonamento total).
            </CardContent>
          </Card>

          {/* Card 4: Rede de guardians */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all rounded-2xl flex flex-col justify-between">
            <CardHeader className="p-5 pb-3 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="text-[10px] border-emerald-300 text-emerald-800 bg-emerald-50 mb-1.5 font-bold"
                >
                  Apoio Confiável
                </Badge>
                <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                  Rede de guardians
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed">
              Pessoas de estrita confiança com níveis granulares de acesso: básico (rotina),
              segurança (alertas preventivos de ausência) e emergência (localização GPS e suporte
              consular).
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SEÇÃO COMO FUNCIONA NA PRÁTICA: FLUXO REAL EM 4 PASSOS */}
      <section className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge className="bg-indigo-100 text-indigo-900 border-indigo-200 font-bold text-xs uppercase tracking-wider">
            Passo a Passo
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Como funciona na prática
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            O fluxo real e estruturado para garantir que você mantenha plena autonomia antes,
            durante e após sua viagem internacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Passo 1 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
            <div className="h-1 bg-sky-500 w-full absolute top-0 left-0" />
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 font-black flex items-center justify-center mb-2 text-sm shadow-xs">
                1
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                Crie sua viagem e rede de apoio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Cadastre seus dados de voo, acomodação e defina seus guardians de confiança com
                permissões individualizadas antes do embarque.
              </p>
            </CardContent>
          </Card>

          {/* Passo 2 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
            <div className="h-1 bg-indigo-500 w-full absolute top-0 left-0" />
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center mb-2 text-sm shadow-xs">
                2
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                Faça check-ins regulares e mídias de confirmação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Confirmações em 1 toque com foto periódica ou vídeo curto diário (manhã/noite) para
                registrar sua integridade sem incomodar sua rotina.
              </p>
            </CardContent>
          </Card>

          {/* Passo 3 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
            <div className="h-1 bg-amber-500 w-full absolute top-0 left-0" />
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center mb-2 text-sm shadow-xs">
                3
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                Acione alerta silencioso com GPS em qualquer situação imprevista
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Toque discreto ou código de coação transmite sua localização precisa imediatamente,
                mesmo com a tela fingindo normalidade ou aplicativo neutro.
              </p>
            </CardContent>
          </Card>

          {/* Passo 4 */}
          <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
            <div className="h-1 bg-emerald-500 w-full absolute top-0 left-0" />
            <CardHeader className="p-5 pb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center mb-2 text-sm shadow-xs">
                4
              </div>
              <CardTitle className="text-base font-bold text-slate-900">
                Guardians e apoio acompanham em tempo real com máxima discrição
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-slate-600 leading-relaxed space-y-2">
              <p>
                Sua rede recebe dados precisos, endereços e last-known GPS para agir com rapidez
                junto a consulados e autoridades sem expor você.
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
              <p className="text-red-700 line-through">"Essa pessoa é suspeita ou criminosa."</p>
              <p className="text-red-700 line-through">
                "Você está em risco iminente ou sendo enganada."
              </p>
              <p className="text-red-700 line-through">
                "Você é obrigada a desconfiar de quem te convidou."
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
                "Recomendamos resolver esse ponto antes do embarque."
              </p>
              <p className="text-emerald-800">
                "Você possui pouca autonomia para sair da situação se necessário."
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
            <Link to="/assessment" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 h-11 rounded-xl">
                Começar Quiz de Autonomia
              </Button>
            </Link>
            <Link to="/entrar" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-sky-300 text-sky-900 bg-sky-50 font-bold px-6 h-11 rounded-xl"
              >
                Acessar Minha Conta
              </Button>
            </Link>
            <Link to="/destinos" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                className="w-full sm:w-auto border border-slate-200 text-slate-700 font-semibold px-5 h-11 rounded-xl"
              >
                Explorar Destinos Públicos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer acolhedor e informativo */}
      <footer className="container mx-auto px-4 max-w-5xl pt-8 border-t border-slate-200 text-slate-500 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-8">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black text-xs">
                S
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">
                SafeTrip • Autonomia em Viagens
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Ferramenta independente de reflexão prática, proteção factual e suporte a viajantes
              internacionais. Promovemos liberdade de decisão e autonomia de retorno sem
              julgamentos.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
              Módulos
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/assessment" className="hover:text-sky-600">
                  Quiz de Autonomia
                </Link>
              </li>
              <li>
                <Link to="/destinos" className="hover:text-sky-600">
                  Catálogo de Destinos
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-sky-600">
                  Biblioteca de Orientações
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="hover:text-sky-600">
                  Passo a Passo
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
              Acesso ao Sistema
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <Link to="/entrar" className="hover:text-sky-600 font-medium">
                  Área da Viajante / Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-sky-600">
                  Área Administrativa
                </Link>
              </li>
              <li>
                <Link to="/police/dashboard" className="hover:text-sky-600">
                  Canal Policial / Consular
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="hover:text-sky-600">
                  Criar Nova Conta
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            © {new Date().getFullYear()} SafeTrip. Todos os direitos reservados. Autonomia não é
            desconfiança.
          </span>
          <div className="flex items-center gap-4">
            <Link to="/emergency" className="hover:underline text-red-600 font-medium">
              Canal de Emergência
            </Link>
          </div>
        </div>{' '}
      </footer>
    </div>
  )
}
