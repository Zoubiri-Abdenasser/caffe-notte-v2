import { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function Home() {
 const [activeTab, setActiveTab] = useState('coffee')
const [formMsg, setFormMsg] = useState('')
const [loading, setLoading] = useState(false)
const [menuOpen, setMenuOpen] = useState(false)
const [menuItems, setMenuItems] = useState<{
  id: number
  name: string
  description: string
  price: number
  category: string
  available: boolean
}[]>([])

useEffect(() => {
  api.get('/api/menu').then((res) => setMenuItems(res.data)).catch(() => {})
}, [])

const menu = {
  coffee: menuItems.filter(i => i.category === 'coffee' && i.available),
  pastries: menuItems.filter(i => i.category === 'pastries' && i.available),
  specials: menuItems.filter(i => i.category === 'specials' && i.available),
}
  }

  const tabs = [
    { key: 'coffee', label: 'القهوة' },
    { key: 'pastries', label: 'المخبوزات' },
    { key: 'specials', label: 'مختارات خاصة' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setFormMsg('')
    const form = e.currentTarget
    const formData = new FormData(form)
    try {
      await api.post('/api/reservations', {
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        guests: formData.get('guests'),
        notes: formData.get('notes'),
      })
      setFormMsg('✅ تم حفظ حجزك بنجاح! سنتواصل معك قريبًا.')
      form.reset()
    } catch (err: any) {
      setFormMsg('❌ ' + (err.response?.data?.error || 'حدث خطأ، حاول مجددًا'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810] font-[Tajawal,sans-serif]" dir="rtl">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-[Playfair Display,serif] text-2xl font-bold text-[#2C1810]">
            Caffè <span className="text-[#C8973F]">Notte</span>
          </span>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 text-sm font-medium">
            {[['#about', 'من نحن'], ['#menu', 'القائمة'], ['#reserve', 'احجز طاولة']].map(([href, label]) => (
              <a key={href} href={href}
                className="text-[#6B3F2A] hover:text-[#C8973F] transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#2C1810] text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#E8D5B7] px-4 py-4 flex flex-col gap-4">
            {[['#about', 'من نحن'], ['#menu', 'القائمة'], ['#reserve', 'احجز طاولة']].map(([href, label]) => (
              <a key={href} href={href}
                onClick={() => setMenuOpen(false)}
                className="text-[#6B3F2A] font-medium py-2 border-b border-[#E8D5B7]">
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
        style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #F0E6D3 50%, #E8D5B7 100%)' }}>
        <span className="text-xs font-bold tracking-[4px] text-[#C8973F] uppercase mb-6 border border-[#C8973F] px-4 py-2 rounded-full">
          مقهى إيطالي · أجواء كلاسيكية
        </span>
        <h1 className="font-[Playfair Display,serif] italic text-[clamp(3rem,10vw,7rem)] leading-tight text-[#2C1810] mb-4">
          Caffè Notte
        </h1>
        <h2 className="text-lg md:text-2xl font-light text-[#6B3F2A] mb-6 max-w-xl">
          حيث تلتقي القهوة الإيطالية بدفء الليل
        </h2>
        <p className="text-[#6B3F2A] max-w-lg leading-relaxed mb-10 text-sm md:text-base">
          تجربة قهوة عصرية بروح إيطالية أصيلة، في فضاء دافئ يجمع الأصدقاء حول كوب قهوة لا يُنسى.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="#reserve"
            className="bg-[#C8973F] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#A67C32] transition-colors duration-200 text-center shadow-lg">
            احجز طاولتك
          </a>
          <a href="#menu"
            className="border-2 border-[#C8973F] text-[#C8973F] font-bold px-8 py-4 rounded-lg hover:bg-[#C8973F] hover:text-white transition-all duration-200 text-center">
            تصفح القائمة
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#F0E6D3] rounded-2xl aspect-square flex items-center justify-center text-8xl shadow-inner">
            ☕
          </div>
          <div>
            <p className="text-xs font-bold tracking-[3px] text-[#C8973F] uppercase mb-3">حكايتنا</p>
            <h2 className="font-[Playfair Display,serif] italic text-3xl md:text-4xl text-[#2C1810] mb-6">
              وُلدنا من شغف إيطالي
            </h2>
            <p className="text-[#6B3F2A] leading-relaxed mb-4">
              Caffè Notte بدأ كفكرة بسيطة: مكان يجمع بين دقة تحضير القهوة الإيطالية التقليدية وأجواء دافئة تناسب كل الأوقات.
            </p>
            <p className="text-[#6B3F2A] leading-relaxed mb-8">
              كل كوب يُحضّر بعناية من حبوب مختارة، وكل زاوية صُممت لتشعرك بالراحة والدفء.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[['100%', 'حبوب إيطالية'], ['16', 'ساعة يومياً'], ['5000+', 'كوب شهرياً']].map(([num, label]) => (
                <div key={label} className="text-center bg-[#FAF7F2] rounded-xl p-4">
                  <div className="font-[Playfair Display,serif] text-2xl font-bold text-[#C8973F]">{num}</div>
                  <div className="text-xs text-[#6B3F2A] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 px-4 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[3px] text-[#C8973F] uppercase mb-3">القائمة</p>
            <h2 className="font-[Playfair Display,serif] italic text-3xl md:text-4xl text-[#2C1810]">
              نكهات تُحضّر بشغف
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => (
              <button key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-[#C8973F] text-white shadow-md'
                    : 'bg-white text-[#6B3F2A] border border-[#E8D5B7] hover:border-[#C8973F]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {menu[activeTab as keyof typeof menu].length === 0 ? (
  <div className="col-span-2 text-center py-8 text-[#6B3F2A]">
    لا توجد أطباق في هذه الفئة حالياً
  </div>
) : (
  menu[activeTab as keyof typeof menu].map((item) => (
    <div key={item.id}
      className="flex justify-between items-start py-5 px-4 border-b border-[#E8D5B7] hover:bg-white/50 transition-colors duration-150 rounded-lg">
      <div>
        <div className="font-semibold text-[#2C1810]">{item.name}</div>
        <div className="text-sm text-[#6B3F2A] mt-1">{item.description}</div>
      </div>
      <span className="font-bold text-[#C8973F] whitespace-nowrap mr-4">
        {item.price} ر.س
      </span>
    </div>
  ))
)}
                className="flex justify-between items-start py-5 px-4 border-b border-[#E8D5B7] hover:bg-white/50 transition-colors duration-150 rounded-lg">
                <div>
                  <div className="font-semibold text-[#2C1810]">{item.name}</div>
                  <div className="text-sm text-[#6B3F2A] mt-1">{item.desc}</div>
                </div>
                <span className="font-bold text-[#C8973F] whitespace-nowrap mr-4">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="py-16 px-4 bg-[#2C1810] text-white text-center">
        <p className="font-[Playfair Display,serif] italic text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-4">
          "القهوة الجيدة لا تحتاج زينة — هي تتكلم بنفسها."
        </p>
        <p className="text-[#C8973F] font-semibold text-sm">— مؤسس Caffè Notte</p>
      </section>

      {/* RESERVE */}
      <section id="reserve" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className="text-xs font-bold tracking-[3px] text-[#C8973F] uppercase mb-3">تواصل معنا</p>
            <h2 className="font-[Playfair Display,serif] italic text-3xl md:text-4xl text-[#2C1810] mb-6">
              احجز طاولتك
            </h2>
            <p className="text-[#6B3F2A] leading-relaxed mb-8">
              نفتح أبوابنا يومياً من 4 عصراً. احجز مسبقاً لضمان مكانك.
            </p>
            <div className="space-y-4">
              {[
                ['📍', 'الموقع', 'شارع الأمير سلطان، جدة'],
                ['⏰', 'أوقات العمل', 'يومياً من 4 عصراً حتى 2 فجراً'],
                ['📞', 'للحجز', '0566 789 123'],
              ].map(([icon, title, val]) => (
                <div key={title} className="flex items-start gap-4 bg-[#FAF7F2] rounded-xl p-4">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <div className="font-semibold text-[#2C1810] text-sm">{title}</div>
                    <div className="text-[#6B3F2A] text-sm mt-1">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" placeholder="الاسم الكامل" required
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all" />
              <input name="phone" placeholder="رقم الجوال" required
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="date" type="date" required
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all" />
              <select name="guests" required defaultValue=""
                className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] transition-all">
                <option value="" disabled>عدد الأفراد</option>
                <option>1-2</option>
                <option>3-4</option>
                <option>5+</option>
              </select>
            </div>
            <textarea name="notes" placeholder="ملاحظات إضافية (اختياري)" rows={3}
              className="w-full border border-[#E8D5B7] rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#C8973F] focus:ring-1 focus:ring-[#C8973F] transition-all resize-none" />
            <button type="submit" disabled={loading}
              className="w-full bg-[#C8973F] text-white font-bold py-4 rounded-xl hover:bg-[#A67C32] transition-colors duration-200 shadow-lg disabled:opacity-60">
              {loading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
            </button>
            {formMsg && (
              <p className={`text-sm text-center font-medium ${formMsg.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {formMsg}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2C1810] text-[#E8D5B7] py-10 px-4 text-center">
        <div className="font-[Playfair Display,serif] italic text-2xl mb-2">
          Caffè <span className="text-[#C8973F]">Notte</span>
        </div>
        <p className="text-sm text-[#E8D5B7]/60">© 2026 Caffè Notte. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}