import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('adminName', res.data.name)
      navigate('/admin')
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-[Playfair Display,serif] italic text-4xl text-[#2C1810]">
            Caffè <span className="text-[#C8973F]">Notte</span>
          </h1>
          <p className="text-[#6B3F2A] text-sm mt-2">دخول لوحة التحكم</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E8D5B7]">
          <h2 className="font-[Playfair Display,serif] text-2xl text-[#2C1810] mb-6 text-center">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@restaurant.com"
                required
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8973F] text-white font-bold py-4 rounded-xl hover:bg-[#A67C32] transition-colors duration-200 shadow-md disabled:opacity-60 mt-2">
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B3F2A]/60 mt-6">
          Caffè Notte © 2026
        </p>
      </div>
    </div>
  )
}