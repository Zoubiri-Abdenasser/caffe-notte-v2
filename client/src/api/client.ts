import axios from 'axios'

const API_URL = 'http://localhost:4000'

export const api = axios.create({
  baseURL: API_URL,
})

// إضافة التوكن تلقائيًا لكل طلب محمي
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})