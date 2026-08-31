import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Plane,
  FileCheck,
  Users,
  Compass,
  ArrowRight,
  ArrowLeft,
  Lock,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Autonomia não é desconfiança',
    subtitle: 'Por que avaliar sua independência em viagens internacionais?',
    icon: Compass,
    color: 'text-sky-500 bg-sky-50 border-sky-200',
    content: (
      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
        <p>
          Viajar para fora do país deve ser uma experiência de liberdade e descoberta. No entanto,
          em viagens para a casa de amigos, parceiros ou convites de trabalho, é comum que a
          logística fique 100% sob responsabilidade de quem recebe.
        </p>
        <p>
          Ter seus próprios recursos, sua passagem de retorno garantida e seus documentos em mãos
          não significa desconfiar de ninguém:{' '}
          <strong>significa proteger sua própria autonomia</strong> para dizer "sim" ou "não" a
          qualquer momento.
        </p>
        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-sky-900 text-xs">
          💡 O SafeTrip existe para apoiar você antes, durante e depois do embarque, sem
          julgamentos.
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'O Índice de Autonomia SafeTrip',
    subtitle: 'Uma avaliação pedagógica em 3 pilares fundamentais',
    icon: ShieldCheck,
    color: 'text-indigo-500 bg-indigo-50 border-indigo-200',
    content: (
      <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
        <p>Nossa plataforma calcula seu nível de autonomia através de 3 pilares práticos:</p>
        <ul className="space-y-2 text-xs">
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <FileCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              <strong>Documentação & Retorno:</strong> Posse física contínua do passaporte e bilhete
              de volta emitido.
            </span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Recursos Próprios:</strong> Dinheiro, cartão internacional (Wise/Nomad) e
              reserva de emergência.
            </span>
          </li>
          <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Rede de Apoio:</strong> Guardiões cadastrados e protocolo preventivo de
              ausência.
            </span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Guardiões & Protocolo de Ausência',
    subtitle: 'Seus contatos de confiança acionados caso você não confirme que está bem',
    icon: HeartHandshake,
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    content: (
      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
        <p>
          Durante sua estadia no exterior, você faz check-ins periódicos com apenas 1 clique pelo
          celular.
        </p>
        <p>
          Se você passar mais tempo do que o combinado sem fazer check-in, o sistema inicia um
          protocolo seguro e escalonado em 4 etapas, notificando seus guardiões de confiança para
          verificarem se está tudo bem.
        </p>
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Totalmente confidencial: quem te hospeda não sabe quando o alerta é ativado.</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: 'Tudo pronto para começar!',
    subtitle: 'Vamos cadastrar os dados da sua viagem e gerar seu diagnóstico',
    icon: Plane,
    color: 'text-sky-500 bg-sky-50 border-sky-200',
    content: (
      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
        <p>
          Na próxima tela, você irá informar sua <strong>cidade de origem</strong>, seu{' '}
          <strong>país de destino</strong> e eventuais <strong>escalas ou trânsito</strong>.
        </p>
        <p>Em seguida, responderá à pergunta central e às etapas do Quiz de Autonomia.</p>
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1 text-center">
          <span className="font-bold text-sky-300 block">
            Sua segurança começa no planejamento.
          </span>
          <p className="text-slate-300">Leva menos de 3 minutos para preencher.</p>
        </div>
      </div>
    ),
  },
]

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

  const currentStep = ONBOARDING_STEPS[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      // After finishing onboarding, redirect directly to create trip
      navigate('/trips/new')
    } else {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const Icon = currentStep.icon

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in duration-300">
        {/* Progress header */}
        <div className="space-y-2 text-center">
          <Badge variant="outline" className="text-xs bg-sky-50 text-sky-800 border-sky-200">
            Boas-vindas ao SafeTrip • Etapa {currentStepIndex + 1} de {ONBOARDING_STEPS.length}
          </Badge>
          <Progress
            value={((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}
            className="h-2 rounded-full"
          />
        </div>

        {/* Main Card */}
        <Card className="border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${currentStep.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {currentStep.title}
                </h2>
                <p className="text-xs text-slate-500">{currentStep.subtitle}</p>
              </div>
            </div>

            <div className="min-h-[160px] flex items-center">{currentStep.content}</div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`text-xs ${isFirstStep ? 'invisible' : ''}`}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Voltar
              </Button>

              <div className="flex items-center gap-2">
                {!isLastStep && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/trips/new')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Pular
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold rounded-xl px-5 h-10 shadow-md"
                >
                  {isLastStep ? 'Criar Minha Viagem' : 'Continuar'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default OnboardingPage
