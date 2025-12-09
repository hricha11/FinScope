import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8080'

let authToken = localStorage.getItem('finscope_token') || ''
let unauthorizedHandler: (() => void) | null = null

export const setAuthToken = (token: string) => {
  authToken = token
  localStorage.setItem('finscope_token', token)
}

export const clearAuthToken = () => {
  authToken = ''
  localStorage.removeItem('finscope_token')
}

export const setUnauthorizedHandler = (handler: () => void) => {
  unauthorizedHandler = handler
}

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {}
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken()
      unauthorizedHandler?.()
      // Final fallback to keep users safe if handler is not registered
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  },
)

export { API_BASE_URL }
export default api


