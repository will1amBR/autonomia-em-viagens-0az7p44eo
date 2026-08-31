import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Shield } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requirePolice?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requirePolice = false,
}) => {
  const { isAuthenticated, isAdmin, isPolice, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 animate-pulse">
          <Shield className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-500 font-medium">Verificando credenciais seguras...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  if (requirePolice && !(isPolice || isAdmin)) {
    return <Navigate to="/entrar" replace />
  }

  return <>{children}</>
}
