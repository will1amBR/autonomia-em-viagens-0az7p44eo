import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, Mail, Lock, User, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export const ClientLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      await login(email, password)
      toast({
        title: 'Bem-vindo(a) de volta!',
        description: 'Sua sessão segura foi iniciada com sucesso.',
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error(err)
      setErrorMessage(
        err.message || 'Falha ao autenticar. Verifique seu e-mail e senha e tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link
          to="/entrar"
          className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium mb-1"
        >
          ← Voltar à seleção de portal
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Entrar como Viajante</h1>
        <p className="text-xs text-slate-600">
          Acesse suas viagens salvas, avaliações de autonomia e rede de Guardians.
        </p>
      </div>

      <Card className="border-slate-200 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2 space-y-1">
          <CardTitle className="text-lg font-bold text-slate-900">Credenciais de Acesso</CardTitle>
          <CardDescription className="text-xs">
            Digite seu e-mail e senha cadastrados no SafeTrip.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl leading-relaxed">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5">
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
                  className="pl-10 h-11 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Senha
                </Label>
                <Link
                  to="/recuperar-senha"
                  className="text-[11px] text-sky-600 hover:text-sky-800 font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11 text-sm rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 rounded-xl text-sm shadow-md shadow-sky-600/20 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block">Dica para teste rápido:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEmail('viajante@autonomia.com')
                setPassword('Skip@Pass')
              }}
              className="text-xs text-sky-700 border-sky-200 bg-sky-50/60 hover:bg-sky-100 rounded-lg h-8"
            >
              Preencher Viajante de Exemplo
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-2 text-xs text-slate-600">
        <p>
          Ainda não possui uma conta?{' '}
          <Link to="/cadastro" className="font-bold text-sky-600 hover:text-sky-800 underline">
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  )
}
