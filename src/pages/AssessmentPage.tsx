import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Plane,
  CreditCard,
  FileCheck,
  Smartphone,
  Users,
  Compass,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Lock,
  RotateCcw,
  Building,
  HeartHandshake,
  Loader2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'
import { Progress } from '../components/ui/progress'
import { Badge } from '../components/ui/badge'
import { useTrip } from '../context/TripContext'
import { TripAssessmentAnswers } from '../types/trip'
import { useToast } from '../hooks/use-toast'

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentTrip, updateTripAssessment } = useTrip()
  const { toast } = useToast()

  const defaultAnswers: TripAssessmentAnswers = {
    canReturnTomorrow: 'yes_dependent',
    hasValidPassport: true,
    hasDigitalCopies: false,
    hasRequiredVisas: true,
    hasPhysicalControlOfPassport: true,
    hasReturnTicket: false,
    hasOwnMoney: false,
    hasInternationalCard: true,
    hasEmergencyReserve: false,
    whoPaysTrip: 'other_person',
    whoPaysHousing: 'other_person',
    hasWorkingPhone: true,
    hasInternetEsim: false,
    canBuyEssentialsAlone: true,
    canLeaveHousingAlone: true,
    canStayElsewhereIfNecessary: false,
    relationshipDuration: '1_to_6_months',
    inPersonMeetingsCount: '1_to_2_times',
    hasVisitedCountryBefore: false,
    knowsHostPersonally: 'partially',
    exactAddressKnown: true,
    respectsLimits: 'sometimes',
    minimizesConcerns: 'sometimes',
    feelsPressureToAcceptConditions: true,
    feltNeedToChooseBetweenSafetyAndTrip: false,
    familyFriendsInformedDetailed: true,
  }

  const [answers, setAnswers] = useState<TripAssessmentAnswers>(
    currentTrip?.assessment || defaultAnswers,
  )
  // Steps:
  // 1: Pergunta Central
  // 2: Pausa Pedagógica 1 ("Autonomia não é desconfiança")
  // 3: Documentação & Posse Física
  // 4: Retorno & Financeiro
  // 5: Comunicação & Hospedagem
  // 6: Pausa Pedagógica 2 ("Dinâmica da Viagem sem Julgamentos")
  // 7: Dinâmica do Relacionamento & Limites
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const totalSteps = 7

  const handleUpdate = <K extends keyof TripAssessmentAnswers>(
    key: K,
    value: TripAssessmentAnswers[K],
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      await updateTripAssessment(answers)
      toast({
        title: 'Avaliação concluída com sucesso!',
        description: 'Seu Índice de Autonomia foi calculado e salvo com segurança.',
      })
      navigate('/score-result')
    } catch (e) {
      console.warn('Error submitting assessment', e)
      navigate('/score-result')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      {/* Step Indicator & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs px-2.5 py-0.5 border-sky-300 bg-sky-50 text-sky-800 font-semibold"
          >
            Etapa {currentStep} de {totalSteps}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            Progresso da Avaliação: {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* STEP 1: A PERGUNTA CENTRAL */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <Card className="border-2 border-indigo-500/80 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 shadow-md">
            <CardHeader className="p-5 pb-3">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                1. A Pergunta Central de Autonomia
              </span>
              <CardTitle className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                "Se você quiser voltar para o Brasil amanhã, você consegue sozinho(a)?"
              </CardTitle>
              <CardDescription className="text-xs text-slate-600">
                Considere se você tem acesso a passagens, fundos e transporte para o aeroporto sem
                pedir autorização a ninguém.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <RadioGroup
                value={answers.canReturnTomorrow}
                onValueChange={(val) => handleUpdate('canReturnTomorrow', val as any)}
                className="space-y-2.5"
              >
                <div
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    answers.canReturnTomorrow === 'yes_alone'
                      ? 'border-sky-600 bg-sky-50/80 ring-1 ring-sky-500'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem value="yes_alone" id="ret-alone" className="mt-0.5" />
                  <Label
                    htmlFor="ret-alone"
                    className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    Sim, consigo sozinho(a) imediatamente por meios próprios.
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      Tenho passagem ou limite em cartão/dinheiro e sei como chegar ao aeroporto.
                    </span>
                  </Label>
                </div>

                <div
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    answers.canReturnTomorrow === 'yes_dependent'
                      ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem value="yes_dependent" id="ret-dep" className="mt-0.5" />
                  <Label
                    htmlFor="ret-dep"
                    className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    Consigo, mas dependo de outra pessoa para comprar a passagem ou me levar.
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      Não possuo saldo individual suficiente ou transporte próprio para o embarque.
                    </span>
                  </Label>
                </div>

                <div
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    answers.canReturnTomorrow === 'no'
                      ? 'border-red-500 bg-red-50/80 ring-1 ring-red-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem value="no" id="ret-no" className="mt-0.5" />
                  <Label
                    htmlFor="ret-no"
                    className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    Não consigo no momento.
                    <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                      Ficaria retido(a) sem recursos ou meios práticos de retornar sem ajuda
                      externa.
                    </span>
                  </Label>
                </div>

                <div
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    answers.canReturnTomorrow === 'not_sure'
                      ? 'border-slate-400 bg-slate-100 ring-1 ring-slate-400'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <RadioGroupItem value="not_sure" id="ret-unsure" className="mt-0.5" />
                  <Label
                    htmlFor="ret-unsure"
                    className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer"
                  >
                    Não sei ao certo / Preciso verificar.
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 2: PAUSA EDUCATIVA 1 (ENTRE A PERGUNTA CENTRAL E OS PILARES) */}
      {currentStep === 2 && (
        <Card className="border-sky-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-400/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-bold block">
                Momento de Reflexão
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Autonomia não é desconfiança
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-slate-200 text-sm sm:text-base leading-relaxed border-l-4 border-sky-400 pl-4">
            <p>
              Ter seu próprio dinheiro, sua passagem de volta e seus documentos não significa que
              você desconfia de alguém.
            </p>
            <p className="font-semibold text-white">
              Significa que você tem autonomia para tomar decisões a qualquer instante.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              As próximas perguntas vão ajudar você a avaliar sua independência durante a viagem em
              3 pilares práticos: Documentação, Finanças e Hospedagem.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 space-y-1">
            <span className="font-bold text-sky-300">Lembre-se:</span>
            <p>
              Você não está prestando contas a ninguém. Esse diagnóstico é uma ferramenta para você
              identificar pontos em que pode se fortalecer antes de embarcar.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 3: DOCUMENTAÇÃO & POSSE FÍSICA */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-600" /> Documentação Pessoal & Posse Física
              </CardTitle>
              <CardDescription className="text-xs">
                Garantir que seus documentos estejam válidos e sob seu controle contínuo durante
                toda a viagem.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você terá a posse física do seu passaporte durante toda a viagem?
                </Label>
                <RadioGroup
                  value={answers.hasPhysicalControlOfPassport ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('hasPhysicalControlOfPassport', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="pass-ctrl-yes" />
                    <Label htmlFor="pass-ctrl-yes" className="text-xs cursor-pointer">
                      Sim, sempre comigo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="pass-ctrl-no" />
                    <Label
                      htmlFor="pass-ctrl-no"
                      className="text-xs cursor-pointer text-red-600 font-medium"
                    >
                      Não / Alguém guardará por mim
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-800">
                    Passaporte com validade &gt; 6 meses?
                  </Label>
                  <RadioGroup
                    value={answers.hasValidPassport ? 'yes' : 'no'}
                    onValueChange={(v) => handleUpdate('hasValidPassport', v === 'yes')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="pass-val-yes" />
                      <Label htmlFor="pass-val-yes" className="text-xs cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="pass-val-no" />
                      <Label htmlFor="pass-val-no" className="text-xs cursor-pointer">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-800">
                    Cópias digitais salvas em nuvem segura?
                  </Label>
                  <RadioGroup
                    value={answers.hasDigitalCopies ? 'yes' : 'no'}
                    onValueChange={(v) => handleUpdate('hasDigitalCopies', v === 'yes')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="copies-yes" />
                      <Label htmlFor="copies-yes" className="text-xs cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="copies-no" />
                      <Label htmlFor="copies-no" className="text-xs cursor-pointer">
                        Ainda não
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 4: RETORNO & FINANCEIRO */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" /> Autonomia Financeira & Passagens
              </CardTitle>
              <CardDescription className="text-xs">
                A capacidade de comprar refeições, transporte e passagens sem pedir autorização.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              {/* Return ticket */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você já possui a passagem de retorno emitida e com código localizador no seu nome?
                </Label>
                <RadioGroup
                  value={answers.hasReturnTicket ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('hasReturnTicket', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tick-yes" />
                    <Label htmlFor="tick-yes" className="text-xs cursor-pointer">
                      Sim, já está comprada e confirmada
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tick-no" />
                    <Label
                      htmlFor="tick-no"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Não / Prometeram comprar depois
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Own money */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você terá dinheiro próprio (espécie ou saldo em conta) para gastar livremente?
                </Label>
                <RadioGroup
                  value={answers.hasOwnMoney ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('hasOwnMoney', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="money-yes" />
                    <Label htmlFor="money-yes" className="text-xs cursor-pointer">
                      Sim, tenho reserva própria
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="money-no" />
                    <Label
                      htmlFor="money-no"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Não, dependerei 100% da outra pessoa
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-800">
                    Cartão internacional ativo (Wise, Nomad, etc)?
                  </Label>
                  <RadioGroup
                    value={answers.hasInternationalCard ? 'yes' : 'no'}
                    onValueChange={(v) => handleUpdate('hasInternationalCard', v === 'yes')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="card-yes" />
                      <Label htmlFor="card-yes" className="text-xs cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="card-no" />
                      <Label htmlFor="card-no" className="text-xs cursor-pointer">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-800">
                    Reserva de emergência para imprevistos?
                  </Label>
                  <RadioGroup
                    value={answers.hasEmergencyReserve ? 'yes' : 'no'}
                    onValueChange={(v) => handleUpdate('hasEmergencyReserve', v === 'yes')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="res-yes" />
                      <Label htmlFor="res-yes" className="text-xs cursor-pointer">
                        Sim
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="res-no" />
                      <Label htmlFor="res-no" className="text-xs cursor-pointer">
                        Não
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 5: COMUNICAÇÃO, HOSPEDAGEM & MOBILIDADE */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" /> Comunicação & Mobilidade no
                Destino
              </CardTitle>
              <CardDescription className="text-xs">
                Garantir que você não fique incomunicável ou impossibilitado(a) de se locomover.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você terá acesso irrestrito ao seu próprio celular e à internet (eSIM / Roaming)?
                </Label>
                <RadioGroup
                  value={answers.hasInternetEsim && answers.hasWorkingPhone ? 'yes' : 'no'}
                  onValueChange={(v) => {
                    handleUpdate('hasInternetEsim', v === 'yes')
                    handleUpdate('hasWorkingPhone', true)
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="comm-yes" />
                    <Label htmlFor="comm-yes" className="text-xs cursor-pointer">
                      Sim, pacote de dados próprio garantido
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="comm-no" />
                    <Label
                      htmlFor="comm-no"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Dependerei do Wi-Fi de terceiros
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você conseguiria sair da hospedagem sozinho(a) a qualquer hora do dia ou da noite
                  se precisasse?
                </Label>
                <RadioGroup
                  value={answers.canLeaveHousingAlone ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('canLeaveHousingAlone', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="leave-yes" />
                    <Label htmlFor="leave-yes" className="text-xs cursor-pointer">
                      Sim, tenho chaves e livre acesso
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="leave-no" />
                    <Label
                      htmlFor="leave-no"
                      className="text-xs cursor-pointer text-red-600 font-medium"
                    >
                      Não / Dependo de alguém abrir ou autorizar
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você conseguiria passar uma noite em outro local (hotel/hostel) se fosse
                  necessário?
                </Label>
                <RadioGroup
                  value={answers.canStayElsewhereIfNecessary ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('canStayElsewhereIfNecessary', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hotel-yes" />
                    <Label htmlFor="hotel-yes" className="text-xs cursor-pointer">
                      Sim, tenho como reservar e pagar
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hotel-no" />
                    <Label
                      htmlFor="hotel-no"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Não teria condições financeiras ou conhecimento
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 6: PAUSA EDUCATIVA 2 (ANTES DO RELATIONSHIP & DYNAMICS CHECK) */}
      {currentStep === 6 && (
        <Card className="border-indigo-300 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block">
                Pausa Pedagógica
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Dinâmica da Viagem sem Julgamentos
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-slate-200 text-sm sm:text-base leading-relaxed border-l-4 border-indigo-400 pl-4">
            <p>
              As próximas perguntas são sobre a dinâmica da sua viagem, não sobre julgar ninguém.
            </p>
            <p className="font-semibold text-white">
              Nosso objetivo é unicamente mapear eventuais pressões ou pontos cegos para que você
              esteja preparado(a) para qualquer situação.
            </p>
            <p className="text-xs sm:text-sm text-slate-300">
              Seja 100% sincero(a). Suas respostas são estritamente confidenciais e protegidas por
              criptografia.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-slate-200 space-y-1">
            <span className="font-bold text-indigo-300">Privacidade Garantida:</span>
            <p>
              Nenhum anfitrião ou acompanhante tem acesso às respostas deste questionário. O
              SafeTrip existe para proteger você.
            </p>
          </div>
        </Card>
      )}

      {/* STEP 7: RELATIONSHIP & PRESSURE CHECK */}
      {currentStep === 7 && (
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-700" /> Dinâmica do Relacionamento & Limites
                Pessoais
              </CardTitle>
              <CardDescription className="text-xs">
                Perguntas objetivas para avaliar se você sente liberdade plena de escolha ou se há
                pressões que reduzem sua autonomia.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Há quanto tempo você conhece a pessoa que está te convidando ou viajando com você?
                </Label>
                <RadioGroup
                  value={answers.relationshipDuration}
                  onValueChange={(v) => handleUpdate('relationshipDuration', v as any)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less_than_1_month" id="dur-1" />
                    <Label htmlFor="dur-1" className="text-xs cursor-pointer">
                      Menos de 1 mês
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1_to_6_months" id="dur-2" />
                    <Label htmlFor="dur-2" className="text-xs cursor-pointer">
                      1 a 6 meses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6_to_12_months" id="dur-3" />
                    <Label htmlFor="dur-3" className="text-xs cursor-pointer">
                      6 a 12 meses
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more_than_1_year" id="dur-4" />
                    <Label htmlFor="dur-4" className="text-xs cursor-pointer">
                      Mais de 1 ano / Amigo de longa data
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Quantas vezes vocês já se encontraram pessoalmente?
                </Label>
                <RadioGroup
                  value={answers.inPersonMeetingsCount}
                  onValueChange={(v) => handleUpdate('inPersonMeetingsCount', v as any)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="meet-0" />
                    <Label htmlFor="meet-0" className="text-xs cursor-pointer">
                      Nunca (apenas internet/vídeo)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1_to_2_times" id="meet-1" />
                    <Label htmlFor="meet-1" className="text-xs cursor-pointer">
                      1 a 2 vezes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3_to_5_times" id="meet-3" />
                    <Label htmlFor="meet-3" className="text-xs cursor-pointer">
                      3 a 5 vezes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="many_times" id="meet-many" />
                    <Label htmlFor="meet-many" className="text-xs cursor-pointer">
                      Muitas vezes / Convivência habitual
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Quando você demonstra preocupação com sua segurança, essa pessoa costuma dizer que
                  você está exagerando?
                </Label>
                <RadioGroup
                  value={answers.minimizesConcerns}
                  onValueChange={(v) => handleUpdate('minimizesConcerns', v as any)}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="min-never" />
                    <Label htmlFor="min-never" className="text-xs cursor-pointer">
                      Nunca, apoia minhas precauções
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sometimes" id="min-some" />
                    <Label htmlFor="min-some" className="text-xs cursor-pointer">
                      Às vezes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequently" id="min-freq" />
                    <Label
                      htmlFor="min-freq"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Frequentemente diz que não preciso disso
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Você sente que precisa aceitar determinadas condições para não perder a viagem?
                </Label>
                <RadioGroup
                  value={answers.feelsPressureToAcceptConditions ? 'yes' : 'no'}
                  onValueChange={(v) =>
                    handleUpdate('feelsPressureToAcceptConditions', v === 'yes')
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="press-yes" />
                    <Label
                      htmlFor="press-yes"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Sim, sinto essa pressão
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="press-no" />
                    <Label htmlFor="press-no" className="text-xs cursor-pointer">
                      Não, sinto total liberdade de escolha
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <Label className="text-xs font-bold text-slate-800">
                  Sua família ou amigos próximos sabem exatamente onde você estará hospedado(a)?
                </Label>
                <RadioGroup
                  value={answers.familyFriendsInformedDetailed ? 'yes' : 'no'}
                  onValueChange={(v) => handleUpdate('familyFriendsInformedDetailed', v === 'yes')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="fam-yes" />
                    <Label htmlFor="fam-yes" className="text-xs cursor-pointer">
                      Sim, todos têm o endereço e voos
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="fam-no" />
                    <Label
                      htmlFor="fam-no"
                      className="text-xs cursor-pointer text-amber-700 font-medium"
                    >
                      Não / Pediram para eu não contar detalhes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (currentStep > 1) setCurrentStep(currentStep - 1)
            else navigate('/create-trip')
          }}
          className="text-xs text-slate-600"
        >
          ← Voltar etapa
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={() => setCurrentStep(currentStep + 1)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 text-xs h-10 rounded-lg flex items-center gap-1.5"
          >
            <span>Próxima etapa</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleFinish}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 text-sm h-11 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando e Calculando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calcular meu Índice de Autonomia</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
