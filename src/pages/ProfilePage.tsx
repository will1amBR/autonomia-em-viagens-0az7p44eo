import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Shield,
  Key,
  Trash2,
  Lock,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Users,
  Info,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/context/AuthContext'
import { useTrip } from '@/context/TripContext'
import { authService } from '@/services/auth'
import { useToast } from '@/hooks/use-toast'

export const ProfilePage: React.FC = () => {
  const { user: authUser, logout, refreshUser } = useAuth()
  const { user: tripUser, setUser: setTripUser } = useTrip()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Profile fields state
  const [name, setName] = useState(authUser?.name || tripUser?.name || '')
  const [phone, setPhone] = useState(authUser?.phone || tripUser?.phone || '')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password change state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Account deletion state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser?.id) return

    setIsSavingProfile(true)
    try {
      const updated = await authService.updateProfile(authUser.id, {
        name: name.trim(),
        phone: phone.trim(),
      })
      refreshUser()
      setTripUser({
        ...tripUser,
        name: updated.name,
        phone: updated.phone,
      })
      toast({
        title: 'Perfil atualizado!',
        description: 'Seus dados pessoais foram salvos com segurança.',
      })
    } catch (err: any) {
      console.error('Error updating profile:', err)
      toast({
        title: 'Erro ao atualizar perfil',
        description: err.message || 'Verifique as informações e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authUser?.id) return

    if (newPassword !== confirmNewPassword) {
      toast({
        title: 'Senhas não coincidem',
        description: 'A nova senha e a confirmação devem ser idênticas.',
        variant: 'destructive',
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Senha muito curta',
        description: 'A nova senha precisa de pelo menos 8 caracteres.',
        variant: 'destructive',
      })
      return
    }

    setIsChangingPassword(true)
    try {
      await authService.changePassword(authUser.id, oldPassword, newPassword, confirmNewPassword)
      setOldPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      toast({
        title: 'Senha alterada com sucesso!',
        description: 'Utilize sua nova senha no próximo acesso à plataforma.',
      })
    } catch (err: any) {
      console.error('Error changing password:', err)
      toast({
        title: 'Erro ao alterar senha',
        description:
          err.message || 'A senha atual digitada está incorreta ou não atende aos requisitos.',
        variant: 'destructive',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!authUser?.id) return

    setIsDeletingAccount(true)
    try {
      await authService.deleteAccount(authUser.id)
      toast({
        title: 'Conta excluída',
        description: 'Sua conta e todos os dados vinculados foram permanentemente removidos.',
      })
      navigate('/')
    } catch (err: any) {
      console.error('Error deleting account:', err)
      toast({
        title: 'Erro ao excluir conta',
        description: err.message || 'Não foi possível excluir a conta no momento.',
        variant: 'destructive',
      })
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-100 text-sky-800 border-sky-300 text-xs">
            Configurações & Privacidade
          </Badge>
          <span className="text-xs text-slate-500">ID: {authUser?.id || 'offline'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-sky-600" /> Perfil do Viajante
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Gerencie suas informações cadastrais, credenciais de segurança e revise a visibilidade dos
          seus dados perante sua rede de guardiões.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <User className="w-4 h-4 text-sky-600" /> Dados Pessoais
            </CardTitle>
            <CardDescription className="text-xs">
              Informações do viajante sincronizadas no PocketBase.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-semibold text-slate-700">
                  Nome Completo
                </Label>
                <Input
                  id="prof-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email" className="text-xs font-semibold text-slate-700">
                  E-mail de Acesso (Login)
                </Label>
                <div className="relative">
                  <Input
                    id="prof-email"
                    type="email"
                    value={authUser?.email || tripUser?.email || ''}
                    disabled
                    className="h-10 text-sm bg-slate-50 text-slate-500 pl-8 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-500">
                  O e-mail principal é a chave de autenticação da conta.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-phone" className="text-xs font-semibold text-slate-700">
                  WhatsApp / Telefone de Contato
                </Label>
                <div className="relative">
                  <Input
                    id="prof-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                    className="h-10 text-sm pl-8"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-slate-500">
                  Usado apenas para comunicações do protocolo preventivo.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold h-10 rounded-xl text-xs sm:text-sm"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando Alterações...
                    </>
                  ) : (
                    'Salvar Dados Pessoais'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Change Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
              <Key className="w-4 h-4 text-indigo-600" /> Trocar Senha de Acesso
            </CardTitle>
            <CardDescription className="text-xs">
              Atualize sua senha com validação direta no PocketBase.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="old-pass" className="text-xs font-semibold text-slate-700">
                  Senha Atual
                </Label>
                <div className="relative">
                  <Input
                    id="old-pass"
                    type={showOldPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    required
                    className="h-9 text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-pass" className="text-xs font-semibold text-slate-700">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="new-pass"
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="h-9 text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-new-pass" className="text-xs font-semibold text-slate-700">
                  Confirmar Nova Senha
                </Label>
                <Input
                  id="confirm-new-pass"
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                  className="h-9 text-sm"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isChangingPassword || !oldPassword || !newPassword}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-10 rounded-xl text-xs sm:text-sm"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Atualizando Senha...
                    </>
                  ) : (
                    'Atualizar Senha'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Levels Explanation & Review */}
      <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 via-white to-sky-50/20">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
            <Shield className="w-4 h-4 text-emerald-600" /> Níveis de Privacidade e Permissões dos
            Guardiões
          </CardTitle>
          <CardDescription className="text-xs">
            Entenda em linguagem simples o que cada nível de guardião cadastrado pode acessar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Level 1: Basic */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-slate-100 text-slate-800 border-slate-300 font-bold text-xs">
                  Nível Básico
                </Badge>
                <span className="text-[11px] text-slate-400">Rotina</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Contato de Rotina</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Recebe apenas a confirmação de que você realizou seu check-in com sucesso ("Tudo
                bem"). Não tem acesso ao seu itinerário detalhado, respostas do questionário nem
                cópias de documentos.
              </p>
            </div>

            {/* Level 2: Security */}
            <div className="p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 font-bold text-xs">
                  Nível Segurança
                </Badge>
                <span className="text-[11px] text-indigo-500 font-semibold">Etapa 3</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Guardião de Segurança</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                É acionado no Protocolo de Ausência se você passar mais de 6 horas sem responder aos
                lembretes. Recebe sua cidade de destino e informações essenciais para checar se você
                está bem.
              </p>
            </div>

            {/* Level 3: Emergency */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-xs">
                  Nível Emergência
                </Badge>
                <span className="text-[11px] text-emerald-600 font-semibold">Etapa 4 + Alerta</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">Guardião Principal / SOS</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Acesso completo ao itinerário, cópias de segurança autorizadas e endereço de
                hospedagem para acionar consulados e órgãos oficiais em caso de emergência crítica.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-start gap-2.5 text-xs text-sky-950">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              <strong>Princípio da Confidencialidade:</strong> Seus anfitriões, companheiros de
              viagem ou pessoas que te convidaram <strong>nunca</strong> têm acesso às suas
              respostas ou aos seus guardiões. A autonomia é sua.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Delete Account */}
      <Card className="border-red-200 shadow-sm bg-red-50/30">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-red-700">
            <Trash2 className="w-4 h-4 text-red-600" /> Zona de Risco — Exclusão de Conta
          </CardTitle>
          <CardDescription className="text-xs text-red-600/80">
            A exclusão da conta é permanente e irreversível.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            Ao excluir sua conta, todas as suas viagens, histórico de check-ins, guardiões
            cadastrados e avaliações de autonomia serão apagados permanentemente dos nossos
            servidores.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Excluir Minha Conta Definitivamente
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-bold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> Confirmar Exclusão de Conta?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-slate-600 space-y-2 pt-1">
                  <p>
                    Esta ação <strong>não pode ser desfeita</strong>. Você perderá todos os dados de
                    viagens ativas, guardiões e registros de segurança no PocketBase.
                  </p>
                  <p>Tem certeza absoluta de que deseja continuar?</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-2">
                <AlertDialogCancel className="text-xs">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  {isDeletingAccount ? 'Excluindo...' : 'Sim, Excluir Minha Conta'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
export default ProfilePage
