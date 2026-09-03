import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'selfmanager.token'

export const apiClient = axios.create({
  baseURL: '/api',
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export interface ApiErrorBody {
  timestamp?: string
  status: number
  error: string
  message: string
  details?: string[]
}

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ApiErrorBody | undefined
    if (body?.details?.length) return body.details.join(', ')
    if (body?.message) return body.message
  }
  return 'Something went wrong. Please try again.'
}
