import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShieldAlert, Mail, Lock, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAdmin } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('william@korenambiental.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      const loggedUser = await login(email, password)
      if (loggedUser.role !== 'admin') {
        setErrorMessage(
          'Acesso negado: Este usuário não possui privilégios de administrador (role != admin).',
        )
        return
      }
      toast({
        title: 'Painel Administrativo liberado',
        description: `Bem-vindo(a), ${loggedUser.name}!`,
      })
      navigate(from, { replace: true })
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Falha ao autenticar administrador. Verifique as credenciais.')
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
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium mb-1"
        >
          ← Voltar à seleção de portal
        </Link>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-amber-400 mx-auto shadow-md border border-slate-700">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold">
          ACESSO RESTRITO
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Área Administrativa</h1>
        <p className="text-xs text-slate-600">
          Painel de governança, gestão consular de destinos e biblioteca de segurança.
        </p>
      </div>

      <Card className="border-slate-800/20 shadow-xl rounded-3xl overflow-hidden bg-white">
        <CardHeader className="p-6 pb-2 space-y-1 bg-slate-900 text-white">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" /> Autenticação Institucional
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Apenas operadores e gestores de segurança credenciados.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl leading-relaxed flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold text-slate-700">
                E-mail de Administrador
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@autonomia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11 text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs font-semibold text-slate-700">
                Chave de Acesso / Senha
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
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
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl text-sm shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Validando permissões...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Entrar no Painel Admin</span>
                </>
              )}
            </Button>
          </form>

          {/* Seed credentials info */}
          <div className="pt-4 mt-4 border-t border-slate-100 text-center space-y-1.5">
            <span className="text-[11px] text-slate-400 block font-medium">
              Conta de Administrador Pré-configurada:
            </span>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-0.5">
              <p>
                <strong>Usuário:</strong>{' '}
                <code className="text-slate-800 font-bold">william@korenambiental.com</code>
              </p>
              <p>
                <strong>Senha:</strong> <code className="text-slate-800">Skip@Pass</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
