import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clearAuthToken, setAuthToken, setUnauthorizedHandler } from '../api/axios'
import { login as loginApi, register as registerApi } from '../api/auth'
import { UserProfile } from '../types'

interface AuthContextValue {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const LOCAL_USER_KEY = 'finscope_user'
const LOCAL_TOKEN_KEY = 'finscope_token'

const decodeToken = (token: string): { id?: number; email?: string } => {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return {
      id: decoded?.userId ? Number(decoded.userId) : undefined,
      email: decoded?.sub || decoded?.email,
    }
  } catch {
    return {}
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(LOCAL_TOKEN_KEY),
  )
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(LOCAL_USER_KEY)
    return cached ? (JSON.parse(cached) as UserProfile) : null
  })

  const persistUser = useCallback((nextUser: UserProfile | null) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(LOCAL_USER_KEY)
    }
  }, [])

  const logout = useCallback(() => {
    clearAuthToken()
    setToken(null)
    persistUser(null)
    if (location.pathname !== '/auth/login') {
      navigate('/auth/login')
    }
  }, [navigate, persistUser, location.pathname])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  const login = useCallback(
    async (email: string, password: string) => {
      const { token: loginToken } = await loginApi(email, password)
      setToken(loginToken)
      setAuthToken(loginToken)
      const decoded = decodeToken(loginToken)
      persistUser({
        id: decoded.id?.toString(),
        email: decoded.email || email,
      })
      navigate('/dashboard')
    },
    [navigate, persistUser],
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerApi(name, email, password)
      // Immediately login to obtain token
      await login(email, password)
      persistUser({ name, email })
    },
    [login, persistUser],
  )

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      if (!user?.id) {
        const decoded = decodeToken(token)
        persistUser({
          id: decoded.id?.toString() || user?.id,
          email: decoded.email || user?.email || '',
          name: user?.name,
        })
      }
    }
  }, [token, user, persistUser])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


