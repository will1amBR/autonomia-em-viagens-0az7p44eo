import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  KeyRound,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  EyeOff,
  AlertTriangle,
  Radio,
  Volume2,
  Hand,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { useTrip } from '../context/TripContext'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/auth'
import { useToast } from '../hooks/use-toast'

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { currentTrip, addGuardian } = useTrip()
  const { user: authUser, refreshUser } = useAuth()
  const { toast } = useToast()

  // 1: Boas-vindas, 2: Saída Rápida (Passcode), 3: Escolha do Sinal Discreto sob Ameaça, 4: Primeiro Guardião
  const [step, setStep] = useState(1)
  const [passcode, setPasscode] = useState('')
  const [duressMethod, setDuressMethod] = useState<'volume_key' | 'hold_3s' | 'secret_code'>(
    'volume_key',
  )
  const [duressSecretCode, setDuressSecretCode] = useState('9999')
  const [guardianName, setGuardianName] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [guardianEmail, setGuardianEmail] = useState('')
  const [guardianRelationship, setGuardianRelationship] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      if (authUser?.id) {
        await authService.updateProfile(authUser.id, {
          emergency_passcode: passcode,
          duress_method: duressMethod,
          duress_secret_code: duressSecretCode,
        })
        refreshUser()
      }

      if (guardianName.trim() && guardianPhone.trim()) {
        addGuardian({
          name: guardianName.trim(),
          relationship: guardianRelationship.trim() || 'Contato de Confiança',
          phone: guardianPhone.trim(),
          email: guardianEmail.trim(),
          country: 'Brasil',
          accessType: 'emergency',
          notifyOnCheckin: true,
          receiveMissedCheckinAlert: true,
          receiveFullItinerary: true,
        })
      }

      toast({
        title: 'Configuração concluída!',
        description: 'Seu perfil seguro e preferências de proteção foram salvos.',
      })

      navigate('/dashboard')
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Aviso',
        description: 'Algumas configurações foram salvas localmente.',
      })
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Passo {step} de 4
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-sky-500'
                    : s < step
                      ? 'w-3 bg-emerald-500'
                      : 'w-3 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Welcome & Philosophy */}
        {step === 1 && (
          <Card className="border-slate-800 bg-slate-900 text-white rounded-3xl shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-3xl bg-sky-500/20 text-sky-400 border border-sky-400/30 mx-auto flex items-center justify-center mb-2">
                <Shield className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-black">Bem-vindo(a) ao SafeTrip</CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                Autonomia e proteção sob medida para a sua viagem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs space-y-2 text-sky-200">
                <p className="font-bold text-sky-300">
                  Princípio Central: AUTONOMIA NÃO É DESCONFIANÇA
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Planejar sua rede de apoio, cadastrar guardiões e ter canais discretos de socorro
                  são atos de liberdade e respeito à sua segurança pessoal.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Configuração de Saída Rápida (fechamento discreto de tela)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Escolha do método de sinal discreto sob ameaça/coação</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cadastro do seu guardião principal de emergência</span>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold h-12 rounded-2xl mt-4"
              >
                Começar Configuração Segura <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Quick Exit Passcode */}
        {step === 2 && (
          <Card className="border-slate-800 bg-slate-900 text-white rounded-3xl shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold">Código de Saída Rápida (SOS)</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Se precisar fechar o aplicativo instantaneamente caso alguém se aproxime, defina uma
                senha de 4 dígitos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode-input" className="text-xs text-slate-300">
                  Senha numérica (4 dígitos):
                </Label>
                <Input
                  id="passcode-input"
                  type="password"
                  maxLength={4}
                  placeholder="Ex: 1234"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-950 border-slate-800 text-center tracking-widest text-lg font-mono text-white h-12 rounded-xl"
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                Você poderá usar o botão flutuante <strong>Saída Rápida</strong> a qualquer momento
                para mascarar a tela com uma página neutra de previsão do tempo.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-slate-800 text-slate-400 hover:bg-slate-800 text-xs h-11 rounded-xl"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-11 rounded-xl"
                >
                  Avançar <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: DISCREET THREAT SIGNAL METHOD SELECTION (User Decision) */}
        {step === 3 && (
          <Card className="border-slate-800 bg-slate-900 text-white rounded-3xl shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center mb-2">
                <EyeOff className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold">Método de Sinal sob Ameaça</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Escolha como você prefere emitir um alerta silencioso caso esteja sendo obrigado(a)
                a gravar vídeos ou tirar fotos sob coação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recommendation Note */}
              <div className="p-3.5 rounded-2xl bg-sky-950/50 border border-sky-500/30 text-xs text-sky-200">
                <span className="font-bold text-sky-300">💡 Recomendação de Segurança:</span> Uma{' '}
                <strong>tecla física (como o botão de volume)</strong> costuma ser o método mais
                discreto, pois pode ser acionada mesmo com o aparelho no bolso ou sem olhar para a
                tela.
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {/* 1. Volume Key */}
                <button
                  type="button"
                  onClick={() => setDuressMethod('volume_key')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    duressMethod === 'volume_key'
                      ? 'border-sky-500 bg-sky-950/40 text-white ring-2 ring-sky-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Pressionar Botão de Volume (Tecla)
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[9px]">
                        Recomendado
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Dispara alerta silencioso ao pressionar a tecla de volume do celular (ou
                      Ctrl+Shift+K no teclado).
                    </p>
                  </div>
                </button>

                {/* 2. Hold 3 seconds */}
                <button
                  type="button"
                  onClick={() => setDuressMethod('hold_3s')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    duressMethod === 'hold_3s'
                      ? 'border-sky-500 bg-sky-950/40 text-white ring-2 ring-sky-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Hand className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white">
                      Tocar e Segurar na Tela por 3 Segundos
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Dispara o alerta ao manter o dedo pressionado sobre o mini botão de proteção
                      na área de fotos/vídeos.
                    </p>
                  </div>
                </button>

                {/* 3. Secret Code */}
                <button
                  type="button"
                  onClick={() => setDuressMethod('secret_code')}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                    duressMethod === 'secret_code'
                      ? 'border-sky-500 bg-sky-950/40 text-white ring-2 ring-sky-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 w-full">
                    <span className="text-xs font-bold text-white">Digitar um Código Secreto</span>
                    <p className="text-[11px] text-slate-400">
                      Dispara o alerta quando você digita um código específico no campo discreto.
                    </p>
                  </div>
                </button>
              </div>

              {/* Secret Code Configuration if selected */}
              {duressMethod === 'secret_code' && (
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <Label htmlFor="sec-code" className="text-xs text-slate-300">
                    Defina seu Código Secreto de Coação:
                  </Label>
                  <Input
                    id="sec-code"
                    value={duressSecretCode}
                    onChange={(e) => setDuressSecretCode(e.target.value)}
                    placeholder="Ex: 9999"
                    className="bg-slate-900 border-slate-700 text-xs h-9 text-white"
                  />
                </div>
              )}

              <p className="text-[10px] text-slate-400 italic">
                * O alerta silencioso é enviado aos seus guardiões de emergência e autoridades com
                sua localização sem alterar nada na tela do celular.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-slate-800 text-slate-400 hover:bg-slate-800 text-xs h-11 rounded-xl"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-11 rounded-xl"
                >
                  Avançar <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: First Guardian Registration */}
        {step === 4 && (
          <Card className="border-slate-800 bg-slate-900 text-white rounded-3xl shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mb-2">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold">Guardião Principal de Emergência</CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Cadastre agora uma pessoa de confiança para receber seus check-ins e socorro SOS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="g-name" className="text-xs text-slate-300">
                  Nome do(a) Guardião(ã):
                </Label>
                <Input
                  id="g-name"
                  placeholder="Ex: Mãe, Irmão, Melhor Amiga"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs h-9 text-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="g-rel" className="text-xs text-slate-300">
                  Relação:
                </Label>
                <Input
                  id="g-rel"
                  placeholder="Ex: Irmã"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-xs h-9 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="g-phone" className="text-xs text-slate-300">
                    WhatsApp:
                  </Label>
                  <Input
                    id="g-phone"
                    placeholder="+55 11 99999-9999"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs h-9 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="g-email" className="text-xs text-slate-300">
                    E-mail (para alertas com GPS):
                  </Label>
                  <Input
                    id="g-email"
                    type="email"
                    placeholder="guardiao@exemplo.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs h-9 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  className="border-slate-800 text-slate-400 hover:bg-slate-800 text-xs h-11 rounded-xl"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 rounded-xl shadow-lg"
                >
                  {isLoading ? 'Finalizando...' : 'Concluir e Ir ao Painel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default OnboardingPage
