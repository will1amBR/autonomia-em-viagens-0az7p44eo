import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (password !== passwordConfirm) {
      setErrorMessage('As senhas não coincidem. Por favor, verifique.')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setErrorMessage('A senha deve conter no mínimo 8 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      await register({
        name,
        email,
        phone,
        password,
        passwordConfirm,
        role: 'user',
      })
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Sua conta de viajante está pronta para uso seguro.',
      })
      navigate('/onboarding')
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Erro ao criar conta. O e-mail já pode estar cadastrado.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Criar Conta no SafeTrip
        </h1>
        <p className="text-xs text-slate-600">
          Cadastre-se para planejar suas viagens com autonomia e segurança garantidas.
        </p>
      </div>

      <Card className="border-slate-200 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2 space-y-1">
          <CardTitle className="text-lg font-bold text-slate-900">Dados do Viajante</CardTitle>
          <CardDescription className="text-xs">
            Preencha seus dados para criar sua conta individual e privada.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl leading-relaxed">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Telefone celular com DDD (WhatsApp)
              </Label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+55 (11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-10 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Senha (mín. 8 caracteres)
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-10 text-sm rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="passwordConfirm" className="text-xs font-semibold text-slate-700">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                    className="pl-10 h-10 text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Ao se cadastrar, você concorda que seus dados de viagem são confidenciais e
                controlados exclusivamente por você.
              </span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 rounded-xl text-sm shadow-md shadow-sky-600/20 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Criar minha conta gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center space-y-2 text-xs text-slate-600">
        <p>
          Já possui cadastro?{' '}
          <Link
            to="/entrar/cliente"
            className="font-bold text-sky-600 hover:text-sky-800 underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  )
}
