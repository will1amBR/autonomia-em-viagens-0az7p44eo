import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/use-toast'

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth()
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    try {
      await requestPasswordReset(email)
      setIsSuccess(true)
      toast({
        title: 'Instruções enviadas!',
        description:
          'Se houver uma conta cadastrada para este e-mail, enviamos o link de recuperação.',
      })
    } catch (err: any) {
      console.error(err)
      setErrorMessage(
        err.message || 'Não foi possível solicitar a recuperação de senha. Tente novamente.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-sky-500/20">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Recuperar Senha</h1>
        <p className="text-xs text-slate-600">
          Enviaremos um link seguro para redefinir o acesso à sua conta.
        </p>
      </div>

      <Card className="border-slate-200 shadow-lg rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-2 space-y-1">
          <CardTitle className="text-lg font-bold text-slate-900">Redefinição de Acesso</CardTitle>
          <CardDescription className="text-xs">
            Informe o e-mail cadastrado para receber o link de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">E-mail de recuperação enviado!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verifique a caixa de entrada de{' '}
                  <strong className="text-slate-800">{email}</strong> e siga as orientações para
                  criar uma nova senha.
                </p>
              </div>
              <Link to="/entrar/cliente" className="block pt-2">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold h-10 rounded-xl text-xs">
                  Voltar para o Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl leading-relaxed">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  E-mail cadastrado
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    <span>Enviando link...</span>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Enviar Link de Redefinição</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Link
          to="/entrar/cliente"
          className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para o login</span>
        </Link>
      </div>
    </div>
  )
}
