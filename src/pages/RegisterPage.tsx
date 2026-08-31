import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, UserPlus, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    if (password.length < 8) {
      setErrorMsg('A senha precisa ter pelo menos 8 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      await register({
        email,
        password,
        passwordConfirm: confirmPassword,
        name,
        phone,
      })

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Vamos iniciar seu onboarding para configurar sua viagem com segurança.',
      })

      // Redirect new user directly to onboarding
      navigate('/onboarding')
    } catch (err: any) {
      console.error('Registration failed:', err)
      setErrorMsg(
        err.message || 'Erro ao criar conta. Verifique os dados ou tente um e-mail diferente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-slate-200 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center border border-sky-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-black text-white">
            Criar Conta Segura
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            Criptografia ponta-a-ponta para suas viagens e contatos de confiança.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Seu Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Daianny Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                E-mail Pessoal
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                WhatsApp / Celular com DDD (opcional)
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+55 (11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 text-sm pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <span>
                Seus dados são confidenciais. Acompanhantes ou anfitriões não têm acesso às suas
                respostas nem aos seus guardiões.
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold h-11 rounded-xl shadow-md text-sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {isLoading ? 'Criando Conta...' : 'Cadastrar e Começar Onboarding'}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-sky-600 font-bold hover:underline">
                Fazer login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default RegisterPage
