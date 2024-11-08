import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token 過期處理
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api