import api, { setAuthToken } from './axios'

interface LoginResponse {
  token: string
  email: string
}

interface RegisterResponse {
  id: number
  name: string
  email: string
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, password })
  setAuthToken(data.token)
  return data
}

// Backend register does NOT return a token. We return the payload and let caller login afterwards.
export const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post<RegisterResponse>('/api/auth/register', {
    name,
    email,
    password,
  })
  return data
}


