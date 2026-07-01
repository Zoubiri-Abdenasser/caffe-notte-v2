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
    <div style={{
      minHeight: '100vh', background: '#0E0B09',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', padding: 20,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1B1410', padding: '40px 36px', borderRadius: 8,
        border: '1px solid rgba(242,233,221,0.1)', width: 320, textAlign: 'center',
      }}>
        <h2 style={{ color: '#4DFFD2', marginBottom: 24, fontSize: '1.5rem' }}>
          دخول الإدارة
        </h2>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 4,
            marginBottom: 14, background: '#241B15',
            border: '1px solid rgba(242,233,221,0.15)', color: '#F2E9DD',
            fontFamily: 'sans-serif',
          }}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%', padding: '12px 14px', borderRadius: 4,
            marginBottom: 14, background: '#241B15',
            border: '1px solid rgba(242,233,221,0.15)', color: '#F2E9DD',
            fontFamily: 'sans-serif',
          }}
        />
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: 12, borderRadius: 4,
          background: '#4DFFD2', color: '#0E0B09',
          fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem',
        }}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
        {error && <p style={{ color: '#FFB23F', marginTop: 14, fontSize: '.85rem' }}>{error}</p>}
      </form>
    </div>
  )
}