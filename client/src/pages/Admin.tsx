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
    if (!token) { navigate('/login'); return }
    api.get('/api/reservations')
      .then((res) => { setReservations(res.data); setLoading(false) })
      ..catch((err: any) => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token')
    navigate('/login')
  }
})
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminName')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]" dir="rtl">

      {/* NAV */}
      <nav className="bg-[#2C1810] text-white px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-[Playfair Display,serif] italic text-xl">
            Caffè <span className="text-[#C8973F]">Notte</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#E8D5B7] text-sm hidden sm:block">
              مرحباً، {adminName}
            </span>
            <button onClick={() => navigate('/admin/menu')}
              className="border border-[#E8D5B7]/40 text-[#E8D5B7] px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
              إدارة القائمة
</button>
            <button onClick={handleLogout}
              className="border border-[#E8D5B7]/40 text-[#E8D5B7] px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors">
              تسجيل خروج
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[Playfair Display,serif] italic text-3xl text-[#2C1810] mb-1">
            لوحة التحكم
          </h1>
          <p className="text-[#6B3F2A] text-sm">إدارة حجوزات Caffè Notte</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            ['إجمالي الحجوزات', reservations.length, '📋'],
            ['اليوم', reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length, '📅'],
            ['هذا الأسبوع', reservations.filter(r => {
              const d = new Date(r.date)
              const now = new Date()
              const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              return diff >= 0 && diff <= 7
            }).length, '📊'],
            ['إجمالي الأفراد', reservations.reduce((acc, r) => {
              const g = r.guests?.includes('+') ? 6 : parseInt(r.guests?.split('-')[0] || '0')
              return acc + g
            }, 0), '👥'],
          ].map(([label, value, icon]) => (
            <div key={label as string} className="bg-white rounded-2xl p-4 border border-[#E8D5B7] shadow-sm">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-[Playfair Display,serif] text-2xl font-bold text-[#C8973F]">{value}</div>
              <div className="text-xs text-[#6B3F2A] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E8D5B7] flex items-center justify-between">
            <h2 className="font-semibold text-[#2C1810]">جميع الحجوزات</h2>
            <span className="text-xs bg-[#FAF7F2] border border-[#E8D5B7] px-3 py-1 rounded-full text-[#6B3F2A]">
              {reservations.length} حجز
            </span>
          </div>

          {loading && (
            <div className="text-center py-12 text-[#6B3F2A]">جاري التحميل...</div>
          )}

          {error && (
            <div className="text-center py-12 text-red-500">{error}</div>
          )}

          {!loading && reservations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-[#6B3F2A]">لا توجد حجوزات حتى الآن</p>
            </div>
          )}

          {!loading && reservations.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF7F2] text-[#6B3F2A] text-xs">
                    <tr>
                      {['#', 'الاسم', 'الجوال', 'التاريخ', 'الأفراد', 'ملاحظات', 'وقت التسجيل'].map(h => (
                        <th key={h} className="px-4 py-3 text-right font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((r, i) => (
                      <tr key={r.id} className={`border-t border-[#E8D5B7] hover:bg-[#FAF7F2] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFBF8]'}`}>
                        <td className="px-4 py-3 text-[#C8973F] font-bold">{r.id}</td>
                        <td className="px-4 py-3 font-medium text-[#2C1810]">{r.name}</td>
                        <td className="px-4 py-3 text-[#6B3F2A]">{r.phone}</td>
                        <td className="px-4 py-3 text-[#6B3F2A]">{r.date}</td>
                        <td className="px-4 py-3">
                          <span className="bg-[#FAF7F2] border border-[#E8D5B7] px-2 py-1 rounded-full text-xs text-[#6B3F2A]">
                            {r.guests}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#6B3F2A] text-xs">{r.notes || '—'}</td>
                        <td className="px-4 py-3 text-[#6B3F2A] text-xs">
                          {new Date(r.created_at).toLocaleDateString('ar')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-[#E8D5B7]">
                {reservations.map((r) => (
                  <div key={r.id} className="p-4 hover:bg-[#FAF7F2] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-[#2C1810]">{r.name}</span>
                        <span className="text-xs text-[#C8973F] mr-2">#{r.id}</span>
                      </div>
                      <span className="text-xs bg-[#FAF7F2] border border-[#E8D5B7] px-2 py-1 rounded-full text-[#6B3F2A]">
                        {r.guests} أفراد
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-[#6B3F2A]">
                      <div>📞 {r.phone}</div>
                      <div>📅 {r.date}</div>
                      {r.notes && <div className="col-span-2">📝 {r.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}