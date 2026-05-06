import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL?.trim()
const normalizedApiUrl = rawApiUrl
  ? rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')
    ? rawApiUrl
    : `https://${rawApiUrl}`
  : undefined

const api = axios.create({
  baseURL:
    normalizedApiUrl ||
    (import.meta.env.PROD
      ? 'https://atletico-intelligence.vercel.app'
      : 'http://localhost:8000'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ai_token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
