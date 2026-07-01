import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://caffe-notte-v2.vercel.app',
  ],
app.use(express.json())

// الاتصال بقاعدة البيانات (للعمليات العامة)
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
)

// الاتصال بقاعدة البيانات (للعمليات الإدارية)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
)

// حماية من السبام
const reservationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'عدد محاولات كبير جدًا، حاول لاحقًا' },
})

// مخططات التحقق من المدخلات
const reservationSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جدًا'),
  phone: z.string().min(8, 'رقم جوال غير صحيح'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  guests: z.string().min(1, 'عدد الأفراد مطلوب'),
  notes: z.string().optional(),
})

const authSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  name: z.string().min(2, 'الاسم قصير جدًا').optional(),
})

// Middleware: التحقق من التوكن
const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.admin = decoded
    next()
  } catch {
    return res.status(401).json({ error: 'توكن غير صالح' })
  }
}

// ======= نقاط API =======

// حجز طاولة (عام)
app.post('/api/reservations', reservationLimiter, async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { data, error } = await supabaseAdmin
    .from('reservations')
    .insert([parsed.data])
    .select()
  if (error) {
    console.error('Supabase error:', JSON.stringify(error, null, 2))
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الحجز', details: error })
  }
  res.status(201).json({ message: 'تم حفظ الحجز بنجاح', data })
})

// عرض الحجوزات (للمالك فقط)
app.get('/api/reservations', requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return res.status(500).json({ error: 'حدث خطأ أثناء جلب الحجوزات' })
  }
  res.json(data)
})

// تسجيل المالك (مرة واحدة فقط)
app.post('/api/auth/register', async (req, res) => {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { email, password, name } = parsed.data
  const { data: existing } = await supabaseAdmin
    .from('admins')
    .select('id')
    .limit(1)
  if (existing && existing.length > 0) {
    return res.status(403).json({ error: 'المالك مسجّل مسبقًا' })
  }
  const password_hash = await bcrypt.hash(password, 12)
  const { error } = await supabaseAdmin
    .from('admins')
    .insert([{ email, password_hash, name: name || 'المالك' }])
  if (error) {
    return res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' })
  }
  res.status(201).json({ message: 'تم تسجيل المالك بنجاح' })
})

// تسجيل الدخول
app.post('/api/auth/login', async (req, res) => {
  const parsed = authSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { email, password } = parsed.data
  const { data: admins } = await supabaseAdmin
    .from('admins')
    .select('*')
    .eq('email', email)
    .limit(1)
  if (!admins || admins.length === 0) {
    return res.status(401).json({ error: 'بريد أو كلمة مرور غير صحيحة' })
  }
  const admin = admins[0]
  const isValid = await bcrypt.compare(password, admin.password_hash)
  if (!isValid) {
    return res.status(401).json({ error: 'بريد أو كلمة مرور غير صحيحة' })
  }
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )
  res.json({ message: 'تم تسجيل الدخول بنجاح', token, name: admin.name })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`السيرفر يعمل على http://localhost:${PORT}`)
})