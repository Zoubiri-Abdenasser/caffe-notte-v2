import { useState } from 'react'
import { api } from '../api/client'

export default function Home() {
  const [formMsg, setFormMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('coffee')

  const menu: Record<string, { name: string; desc: string; price: string }[]> = {
    coffee: [
      { name: 'إسبريسو دوبيو', desc: 'حبوب إيطالية محمّصة طازجة', price: '14 ر.س' },
      { name: 'كابتشينو', desc: 'إسبريسو مع حليب مخفوق كثيف', price: '18 ر.س' },
      { name: 'فلات وايت', desc: 'إسبريسو مزدوج مع حليب مخملي', price: '20 ر.س' },
      { name: 'أفوكاتو', desc: 'إسبريسو ساخن فوق آيس كريم فانيليا', price: '24 ر.س' },
    ],
    pastries: [
      { name: 'كرواسون بالزبدة', desc: 'مخبوز طازج يوميًا', price: '12 ر.س' },
      { name: 'تيراميسو', desc: 'حلى إيطالي بالماسكاربوني والقهوة', price: '26 ر.س' },
      { name: 'كانولي صقلّي', desc: 'محشو بكريمة الريكوتا والشوكولاتة', price: '16 ر.س' },
    ],
    specials: [
      { name: 'نوتّي لاتيه', desc: 'مزيج خاص بالبندق والكراميل', price: '22 ر.س' },
      { name: 'كولد برو نيون', desc: 'قهوة مثلجة بتخمير بارد 18 ساعة', price: '19 ر.س' },
    ],
  }

  const tabs = [
    { key: 'coffee', label: 'القهوة' },
    { key: 'pastries', label: 'المخبوزات' },
    { key: 'specials', label: 'مختارات الليل' },
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
      setFormMsg('تم حفظ حجزك بنجاح! سنتواصل معك قريبًا.')
      form.reset()
    } catch (err: any) {
      setFormMsg(err.response?.data?.error || 'حدث خطأ، حاول مجددًا')
    } finally {
      setLoading(false)
    }
  }

  const styles = {
    body: { background: '#0E0B09', color: '#F2E9DD', fontFamily: 'sans-serif', minHeight: '100vh' } as React.CSSProperties,
    nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 6%', background: 'rgba(14,11,9,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(242,233,221,0.08)' } as React.CSSProperties,
    hero: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', background: 'radial-gradient(circle at 50% 30%, rgba(77,255,210,0.06), transparent 50%), #0E0B09' } as React.CSSProperties,
    section: { padding: '100px 6%' } as React.CSSProperties,
    input: { width: '100%', padding: '13px 15px', background: '#1B1410', border: '1px solid rgba(242,233,221,0.15)', borderRadius: 4, color: '#F2E9DD', fontFamily: 'sans-serif', fontSize: '.95rem' } as React.CSSProperties,
  }

  return (
    <div style={styles.body} dir="rtl">
      {/* NAV */}
      <nav style={styles.nav}>
        <span style={{ color: '#F2E9DD', fontWeight: 700, fontSize: '1.3rem' }}>
          Caffè <span style={{ color: '#4DFFD2' }}>Notte</span>
        </span>
        <div style={{ display: 'flex', gap: 28, fontSize: '.9rem' }}>
          {['من نحن', 'القائمة', 'احجز طاولة'].map((item, i) => (
            <a key={i} href={`#${['about', 'menu', 'reserve'][i]}`}
              style={{ color: '#9C8F82', textDecoration: 'none' }}>
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <span style={{ color: '#FFB23F', letterSpacing: 3, fontSize: '.8rem', marginBottom: 20 }}>
          مقهى إيطالي · أجواء ليلية
        </span>
        <h1 style={{
          fontSize: 'clamp(3rem, 9vw, 7rem)', color: '#4DFFD2', margin: '0 0 16px',
          textShadow: '0 0 24px rgba(77,255,210,0.45), 0 0 60px rgba(77,255,210,0.25)',
        }}>
          Caffè Notte
        </h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 400, marginBottom: 20 }}>
          حيث تلتقي القهوة الإيطالية بسحر الليل
        </h2>
        <p style={{ color: '#9C8F82', maxWidth: 500, lineHeight: 1.8, marginBottom: 36 }}>
          تجربة قهوة عصرية بروح إيطالية أصيلة، في فضاء هادئ تتراقص فيه أضواء النيون.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#reserve" style={{
            padding: '13px 30px', background: '#4DFFD2', color: '#0E0B09',
            borderRadius: 4, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 0 24px rgba(77,255,210,0.35)',
          }}>احجز طاولتك</a>
          <a href="#menu" style={{
            padding: '13px 30px', border: '1px solid rgba(242,233,221,0.2)',
            color: '#F2E9DD', borderRadius: 4, textDecoration: 'none',
          }}>تصفح القائمة</a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ ...styles.section, background: '#1B1410' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div style={{ background: '#241B15', borderRadius: 8, aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
            ☕
          </div>
          <div>
            <div style={{ color: '#FFB23F', letterSpacing: 3, fontSize: '.78rem', marginBottom: 12 }}>حكايتنا</div>
            <h2 style={{ fontSize: '2rem', marginBottom: 18 }}>وُلدنا من شغف إيطالي بالليل</h2>
            <p style={{ color: '#9C8F82', lineHeight: 1.9, marginBottom: 14 }}>
              Caffè Notte بدأ كفكرة بسيطة: مكان يجمع بين دقة تحضير القهوة الإيطالية التقليدية وأجواء عصرية تناسب ساعات المساء.
            </p>
            <p style={{ color: '#9C8F82', lineHeight: 1.9 }}>
              كل كوب يُحضّر بعناية من حبوب مختارة، وكل زاوية صُممت لتشعرك بالراحة.
            </p>
            <div style={{ display: 'flex', gap: 36, marginTop: 28 }}>
              {[['100%', 'حبوب إيطالية'], ['16', 'ساعة عمل'], ['5000+', 'كوب شهريًا']].map(([num, label]) => (
                <div key={label}>
                  <strong style={{ display: 'block', fontSize: '1.8rem', color: '#FFB23F' }}>{num}</strong>
                  <span style={{ fontSize: '.82rem', color: '#9C8F82' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" style={styles.section}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ color: '#FFB23F', letterSpacing: 3, fontSize: '.78rem', marginBottom: 12 }}>القائمة</div>
          <h2 style={{ fontSize: '2rem' }}>نكهات تُحضّر بشغف</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 40, flexWrap: 'wrap' }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              background: activeTab === tab.key ? '#4DFFD2' : 'none',
              border: '1px solid rgba(242,233,221,0.2)',
              color: activeTab === tab.key ? '#0E0B09' : '#9C8F82',
              padding: '10px 26px', borderRadius: 30, cursor: 'pointer',
              fontFamily: 'sans-serif',
            }}>
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 50px', maxWidth: 980, margin: '0 auto' }}>
          {menu[activeTab].map((item) => (
            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid rgba(242,233,221,0.08)' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: '.82rem', color: '#9C8F82', marginTop: 4 }}>{item.desc}</div>
              </div>
              <div style={{ color: '#4DFFD2', fontWeight: 700, whiteSpace: 'nowrap' }}>{item.price}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESERVE */}
      <section id="reserve" style={{ ...styles.section, background: '#1B1410' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div>
            <div style={{ color: '#FFB23F', letterSpacing: 3, fontSize: '.78rem', marginBottom: 12 }}>تواصل معنا</div>
            <h2 style={{ fontSize: '2rem', marginBottom: 20 }}>احجز طاولتك الليلية</h2>
            <p style={{ color: '#9C8F82', lineHeight: 1.8, marginBottom: 30 }}>
              نفتح أبوابنا حتى ساعات متأخرة من الليل.
            </p>
            {[['📍', 'الموقع', 'شارع الأمير سلطان، جدة'], ['⏰', 'أوقات العمل', 'يوميًا من 4 عصرًا حتى 2 فجرًا'], ['📞', 'للحجز', '0566 789 123']].map(([icon, title, val]) => (
              <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                <span style={{ color: '#4DFFD2' }}>{icon}</span>
                <div>
                  <strong style={{ display: 'block' }}>{title}</strong>
                  <span style={{ color: '#9C8F82', fontSize: '.88rem' }}>{val}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <input name="name" placeholder="الاسم الكامل" required style={styles.input} />
              <input name="phone" placeholder="رقم الجوال" required style={styles.input} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <input name="date" type="date" required style={styles.input} />
              <select name="guests" required style={styles.input} defaultValue="">
                <option value="" disabled>عدد الأفراد</option>
                <option>1-2</option>
                <option>3-4</option>
                <option>5+</option>
              </select>
            </div>
            <textarea name="notes" placeholder="ملاحظات إضافية (اختياري)" style={{ ...styles.input, minHeight: 90, resize: 'vertical' }} />
            <button type="submit" disabled={loading} style={{
              background: '#4DFFD2', color: '#0E0B09', border: 'none',
              padding: 14, borderRadius: 4, fontWeight: 700, cursor: 'pointer',
              fontSize: '1rem', boxShadow: '0 0 20px rgba(77,255,210,0.3)',
            }}>
              {loading ? 'جاري الإرسال...' : 'تأكيد الحجز'}
            </button>
            {formMsg && <p style={{ color: formMsg.includes('خطأ') ? '#FFB23F' : '#4DFFD2', fontSize: '.9rem' }}>{formMsg}</p>}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1B1410', padding: '30px 6%', textAlign: 'center', color: '#9C8F82', borderTop: '1px solid rgba(242,233,221,0.08)' }}>
        <p>© 2026 Caffè Notte. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  )
}