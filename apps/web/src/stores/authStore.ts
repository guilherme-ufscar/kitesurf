import { create } from 'zustand'
import { api } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  verificationLevel: string
  subscriptionPlan: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('kite360_token', res.data.accessToken)
    localStorage.setItem('kite360_refresh', res.data.refreshToken)

    const me = await api.get('/users/me')
    localStorage.setItem('kite360_user_id', me.data.id)
    set({ user: me.data })
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('kite360_token', res.data.accessToken)
    localStorage.setItem('kite360_refresh', res.data.refreshToken)

    const me = await api.get('/users/me')
    localStorage.setItem('kite360_user_id', me.data.id)
    set({ user: me.data })
  },

  logout: async () => {
    await api.post('/auth/logout').catch(() => null)
    localStorage.removeItem('kite360_token')
    localStorage.removeItem('kite360_refresh')
    localStorage.removeItem('kite360_user_id')
    set({ user: null })
  },

  fetchMe: async () => {
    const token = localStorage.getItem('kite360_token')
    if (!token) return
    set({ isLoading: true })
    try {
      const me = await api.get('/users/me')
      set({ user: me.data })
    } catch {
      localStorage.removeItem('kite360_token')
    } finally {
      set({ isLoading: false })
    }
  },
}))
