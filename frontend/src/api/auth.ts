import { apiClient } from './client'
import type { AuthResponse, User } from './types'

export function register(email: string, password: string) {
  return apiClient.post<User>('/auth/register', { email, password })
}

export function login(email: string, password: string) {
  return apiClient.post<AuthResponse>('/auth/login', { email, password })
}
