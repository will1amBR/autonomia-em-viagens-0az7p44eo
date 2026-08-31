import React, { useState } from 'react'
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Phone,
  Save,
  Clock,
  EyeOff,
  Volume2,
  Hand,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [emergencyPasscode, setEmergencyPasscode] = useState(user?.emergency_passcode || '')
  const [duressMethod, setDuressMethod] = useState<'volume_key' | 'hold_3s' | 'secret_code'>(
    user?.duressMethod || 'secret_code',
  )
  const [duressSecretCode, setDuressSecretCode] = useState(user?.duressSecretCode || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setIsSaving(true)
    try {
      await authService.updateProfile(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        emergency_passcode: emergencyPasscode.trim(),
        duress_method: duressMethod,
        duress_secret_code: duressSecretCode.trim(),
      })
      refreshUser()
      toast({
        title: 'Perfil atualizado com sucesso!',
        description: 'Suas informações e preferências de proteção foram salvas.',
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Erro ao atualizar perfil',
        description: err.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-100 text-sky-800 border-sky-300 text-xs font-semibold">
            <User className="w-3.5 h-3.5 mr-1 text-sky-600" /> Perfil Pessoal & Segurança
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            Filosofia: Autonomia não é desconfiança
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          Meu Perfil & Configurações de Proteção
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Gerencie seus dados de contato, o código de saída rápida e o método de sinal discreto sob
          ameaça.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info Card */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" /> Informações Básicas
            </CardTitle>
            <CardDescription className="text-xs">
              Seus dados de identificação no aplicativo.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-semibold text-slate-700">
                  Nome Completo:
                </Label>
                <Input
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email" className="text-xs font-semibold text-slate-700">
                  E-mail (Login):
                </Label>
                <Input
                  id="prof-email"
                  disabled
                  value={user?.email || ''}
                  className="h-10 text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-phone" className="text-xs font-semibold text-slate-700">
                  WhatsApp / Celular:
                </Label>
                <Input
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-passcode" className="text-xs font-semibold text-slate-700">
                  Código de Saída Rápida (4 dígitos):
                </Label>
                <Input
                  id="prof-passcode"
                  type="password"
                  maxLength={4}
                  value={emergencyPasscode}
                  onChange={(e) => setEmergencyPasscode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 1234"
                  className="h-10 text-xs font-mono tracking-widest"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* THREAT / DURESS SIGNAL CONFIGURATION CARD */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-indigo-600" /> Método de Sinal Discreto sob Ameaça
                </CardTitle>
                <CardDescription className="text-xs">
                  Configuração escolhida no onboarding para disparar alerta silencioso sem alterar
                  nada na tela.
                </CardDescription>
              </div>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200 text-xs">
                {duressMethod === 'volume_key'
                  ? 'Tecla de Volume'
                  : duressMethod === 'hold_3s'
                    ? 'Pressionar 3s'
                    : 'Código Secreto'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            {/* Safety Guidance Box */}
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
              <span className="font-bold text-sky-900">💡 Método Discreto Seguro em Mobile:</span> O{' '}
              <strong>Código Secreto de Coação</strong> e o{' '}
              <strong>Padrão de Toques no Botão Flutuante</strong> funcionam confiavelmente em
              qualquer celular e navegador móvel, acionando o socorro imediatamente com GPS sem
              alterar nada na tela.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Secret Code (Recommended) */}
              <button
                type="button"
                onClick={() => setDuressMethod('secret_code')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  duressMethod === 'secret_code'
                    ? 'border-purple-500 bg-purple-50/80 text-purple-950 font-bold ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs">Código Secreto</span>
                    <span className="text-[9px] text-purple-700 font-bold">Recomendado Mobile</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  Digite este código na saída rápida ou em qualquer tela para fingir fechar e
                  acionar alerta com GPS.
                </p>
              </button>

              {/* Option 2: Hold 3s / Multi-tap */}
              <button
                type="button"
                onClick={() => setDuressMethod('hold_3s')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  duressMethod === 'hold_3s'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-600 flex items-center justify-center">
                    <Hand className="w-4 h-4" />
                  </div>
                  <span className="text-xs">Toque 3s / 4 Toques</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  Pressione por 3s ou dê 4 toques rápidos no botão flutuante discreto em qualquer
                  página.
                </p>
              </button>

              {/* Option 3: Keyboard Shortcut (Desktop) */}
              <button
                type="button"
                onClick={() => setDuressMethod('volume_key')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  duressMethod === 'volume_key'
                    ? 'border-sky-500 bg-sky-50/80 text-sky-950 font-bold ring-2 ring-sky-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-600 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs">Atalho Teclado</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  Pressione Alt+Shift+S no computador caso utilize a plataforma via desktop.
                </p>
              </button>
            </div>

            {duressMethod === 'secret_code' && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 max-w-sm">
                <Label htmlFor="sec-code-prof" className="text-xs font-semibold text-slate-700">
                  Seu Código Secreto de Coação:
                </Label>
                <Input
                  id="sec-code-prof"
                  value={duressSecretCode}
                  onChange={(e) => setDuressSecretCode(e.target.value)}
                  placeholder="Ex: 9999"
                  className="h-9 text-xs"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold h-11 px-6 rounded-xl text-xs sm:text-sm shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando Alterações...' : 'Salvar Alterações do Perfil'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePage
