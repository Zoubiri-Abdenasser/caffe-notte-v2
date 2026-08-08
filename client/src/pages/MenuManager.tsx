import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
}

const emptyForm = { name: '', description: '', price: 0, category: 'coffee', available: true }

const categoryLabels: Record<string, string> = {
  coffee: 'القهوة',
  pastries: 'المخبوزات',
  specials: 'مختارات خاصة',
}

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState('coffee')
  const navigate = useNavigate()

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/menu')
      setItems(res.data)
    } catch {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/menu/${editingId}`, form)
        setMsg('✅ تم تعديل الطبق بنجاح')
      } else {
        await api.post('/api/menu', form)
        setMsg('✅ تم إضافة الطبق بنجاح')
      }
      setForm(emptyForm)
      setEditingId(null)
      setShowForm(false)
      fetchItems()
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.error || 'حدث خطأ'))
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const handleEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      available: item.available,
    })
    setEditingId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return
    try {
      await api.delete(`/api/menu/${id}`)
      setMsg('✅ تم حذف الطبق')
      fetchItems()
    } catch {
      setMsg('❌ خطأ في الحذف')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  const filteredItems = items.filter(i => i.category === activeTab)

  return (
    <div className="min-h-screen bg-[#FAF7F2]" dir="rtl">

      {/* NAV */}
      <nav className="bg-[#2C1810] text-white px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="font-[Playfair Display,serif] italic text-xl">
            Caffè <span className="text-[#C8973F]">Notte</span>
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')}
              className="text-sm text-[#E8D5B7] hover:text-white transition-colors">
              ← لوحة التحكم
            </button>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
              className="border border-[#E8D5B7]/40 text-[#E8D5B7] px-3 py-1.5 rounded-lg text-sm hover:bg-white/10 transition-colors">
              خروج
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-[Playfair Display,serif] italic text-3xl text-[#2C1810]">
              إدارة القائمة
            </h1>
            <p className="text-[#6B3F2A] text-sm mt-1">{items.length} طبق في القائمة</p>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }}
            className="bg-[#C8973F] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#A67C32] transition-colors shadow-md">
            {showForm ? '✕ إغلاق' : '+ إضافة طبق جديد'}
          </button>
        </div>

        {/* Message */}
        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium text-center ${
            msg.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {msg}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-sm p-6 mb-8">
            <h2 className="font-semibold text-[#2C1810] mb-6 text-lg">
              {editingId ? 'تعديل الطبق' : 'إضافة طبق جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">اسم الطبق *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: كابتشينو"
                    required
                    className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">السعر (ر.س) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    required
                    className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2C1810] mb-1">الوصف</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="وصف مختصر للطبق"
                  className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2C1810] mb-1">الفئة *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F]">
                    <option value="coffee">القهوة</option>
                    <option value="pastries">المخبوزات</option>
                    <option value="specials">مختارات خاصة</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="available"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 accent-[#C8973F]"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-[#2C1810]">
                    متاح للطلب
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-[#C8973F] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#A67C32] transition-colors">
                  {editingId ? 'حفظ التعديلات' : 'إضافة الطبق'}
                </button>
                <button type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm) }}
                  className="border border-[#E8D5B7] text-[#6B3F2A] px-8 py-3 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-[#C8973F] text-white shadow-md'
                  : 'bg-white border border-[#E8D5B7] text-[#6B3F2A] hover:border-[#C8973F]'
              }`}>
              {label} ({items.filter(i => i.category === key).length})
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="bg-white rounded-2xl border border-[#E8D5B7] shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-[#6B3F2A]">جاري التحميل...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-[#6B3F2A]">لا توجد أطباق في هذه الفئة</p>
              <button onClick={() => setShowForm(true)}
                className="mt-4 text-[#C8973F] font-medium text-sm hover:underline">
                + أضف أول طبق
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E8D5B7]">
              {filteredItems.map((item) => (
                <div key={item.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[#2C1810]">{item.name}</span>
                        {!item.available && (
                          <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded-full">
                            غير متاح
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-[#6B3F2A] mt-0.5 truncate">{item.description}</p>
                      )}
                    </div>
                    <span className="font-bold text-[#C8973F] whitespace-nowrap">
                      {item.price} ر.س
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mr-4">
                    <button onClick={() => handleEdit(item)}
                      className="text-xs bg-[#FAF7F2] border border-[#E8D5B7] px-3 py-1.5 rounded-lg hover:border-[#C8973F] hover:text-[#C8973F] transition-colors">
                      تعديل
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)}
                      className="text-xs bg-red-50 border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}