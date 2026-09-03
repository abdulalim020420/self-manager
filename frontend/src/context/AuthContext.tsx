import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import * as authApi from '../api/auth'
import { TOKEN_STORAGE_KEY, extractErrorMessage } from '../api/client'

interface AuthContextValue {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY),
  )

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password)
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
      setToken(data.token)
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  }

  const register = async (email: string, password: string) => {
    try {
      await authApi.register(email, password)
      await login(email, password)
    } catch (err) {
      throw new Error(extractErrorMessage(err))
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
  }

  const value = useMemo(
    () => ({ token, isAuthenticated: !!token, login, register, logout }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
