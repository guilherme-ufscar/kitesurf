import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kite360_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('kite360_refresh')
      const userId = localStorage.getItem('kite360_user_id')
      if (refreshToken && userId) {
        try {
          const res = await axios.post('/api/v1/auth/refresh', { userId, refreshToken })
          const { accessToken, refreshToken: newRefresh } = res.data
          localStorage.setItem('kite360_token', accessToken)
          localStorage.setItem('kite360_refresh', newRefresh)
          original.headers.Authorization = `Bearer ${accessToken}`
          return api(original)
        } catch {
          localStorage.clear()
          window.location.href = '/entrar'
        }
      }
    }
    return Promise.reject(err)
  },
)
