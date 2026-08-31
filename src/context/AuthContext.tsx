import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import { PBUser, authService } from '@/services/auth'

interface AuthContextType {
  user: PBUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isPolice: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<PBUser>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isPolice: false,
  isLoading: true,
  login: async () => {
    throw new Error('Not implemented')
  },
  logout: () => {},
  refreshUser: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PBUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = () => {
    const cur = authService.getCurrentUser()
    setUser(cur)
  }

  useEffect(() => {
    // Initial check
    refreshUser()
    setIsLoading(false)

    // Listen to authStore changes
    const unsubscribe = pb.authStore.onChange((token, record) => {
      if (record) {
        setUser({
          id: record.id,
          email: record.email,
          name: record.name || record.email.split('@')[0],
          role: (record.role as any) || 'user',
          phone: record.phone || '',
          emergency_passcode: record.emergency_passcode || '',
          duressMethod: (record.duress_method as any) || 'volume_key',
          duressSecretCode: record.duress_secret_code || '',
          lastOnlineAt: record.last_online_at || '',
          lastLocationApprox: record.last_location_approx || '',
          avatar: record.avatar || '',
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    const u = await authService.login(email, pass)
    setUser(u)
    return u
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPolice: user?.role === 'police',
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
