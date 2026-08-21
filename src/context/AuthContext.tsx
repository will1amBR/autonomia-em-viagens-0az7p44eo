import React, { createContext, useContext, useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { authService, PBUser } from '@/services/auth'

interface AuthContextType {
  user: PBUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<PBUser>
  register: (params: {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phone?: string
    role?: 'user' | 'admin'
  }) => Promise<PBUser>
  requestPasswordReset: (email: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PBUser | null>(() => authService.getCurrentUser())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refreshUser = () => {
    setUser(authService.getCurrentUser())
  }

  useEffect(() => {
    // Listen to PocketBase auth state changes
    const unsub = pb.authStore.onChange((token, record) => {
      if (record) {
        setUser({
          id: record.id,
          email: record.email,
          name: record.name || record.email.split('@')[0],
          role: (record.role as 'user' | 'admin') || 'user',
          phone: record.phone || '',
          emergency_passcode: record.emergency_passcode || '',
          avatar: record.avatar || '',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    // initial check
    refreshUser()
    setIsLoading(false)

    return () => {
      unsub()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password)
    setUser(loggedUser)
    return loggedUser
  }

  const register = async (params: {
    email: string
    password: string
    passwordConfirm: string
    name: string
    phone?: string
    role?: 'user' | 'admin'
  }) => {
    const registeredUser = await authService.register(params)
    setUser(registeredUser)
    return registeredUser
  }

  const requestPasswordReset = async (email: string) => {
    return authService.requestPasswordReset(email)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    requestPasswordReset,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
