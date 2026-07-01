import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface Reservation {
  id: number
  name: string
  phone: string
  date: string
  guests: string
  notes: string
  created_at: string
}

export default function Admin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const adminName = localStorage.getItem('adminName') || 'المالك'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    api.get('/api/reservations')
      .then((res) => {
        setReservations(res.data)
        setLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('token')
        navigate('/login')
      })
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminName')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0E0B09', color: '#F2E9DD', fontFamily: 'sans-serif' }}>
      <nav style={{
        background: '#1B1410', padding: '16px 6%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(242,233,221,0.08)',
      }}>
        <span style={{ color: '#4DFFD2', fontWeight: 700, fontSize: '1.2rem' }}>
          Caffè Notte — لوحة التحكم
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#9C8F82', fontSize: '.9rem' }}>مرحبًا، {adminName}</span>
          <button onClick={handleLogout} style={{
            background: 'none', border: '1px solid rgba(242,233,221,0.2)',
            color: '#F2E9DD', padding: '8px 16px', borderRadius: 4,
            cursor: 'pointer', fontSize: '.85rem',
          }}>
            تسجيل خروج
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 6%' }}>
        <h1 style={{ color: '#4DFFD2', marginBottom: 8, fontSize: '1.8rem' }}>
          الحجوزات
        </h1>
        <p style={{ color: '#9C8F82', marginBottom: 30 }}>
          إجمالي الحجوزات: {reservations.length}
        </p>

        {loading && <p>جاري التحميل...</p>}
        {error && <p style={{ color: '#FFB23F' }}>{error}</p>}

        {!loading && reservations.length === 0 && (
          <p style={{ color: '#9C8F82' }}>لا توجد حجوزات حتى الآن.</p>
        )}

        {!loading && reservations.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #4DFFD2', textAlign: 'right' }}>
                  <th style={{ padding: '12px 10px' }}>#</th>
                  <th style={{ padding: '12px 10px' }}>الاسم</th>
                  <th style={{ padding: '12px 10px' }}>الجوال</th>
                  <th style={{ padding: '12px 10px' }}>التاريخ</th>
                  <th style={{ padding: '12px 10px' }}>الأفراد</th>
                  <th style={{ padding: '12px 10px' }}>ملاحظات</th>
                  <th style={{ padding: '12px 10px' }}>وقت التسجيل</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(242,233,221,0.08)' }}>
                    <td style={{ padding: '12px 10px' }}>{r.id}</td>
                    <td style={{ padding: '12px 10px' }}>{r.name}</td>
                    <td style={{ padding: '12px 10px' }}>{r.phone}</td>
                    <td style={{ padding: '12px 10px' }}>{r.date}</td>
                    <td style={{ padding: '12px 10px' }}>{r.guests}</td>
                    <td style={{ padding: '12px 10px', color: '#9C8F82' }}>{r.notes || '—'}</td>
                    <td style={{ padding: '12px 10px', color: '#9C8F82' }}>
                      {new Date(r.created_at).toLocaleDateString('ar')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}