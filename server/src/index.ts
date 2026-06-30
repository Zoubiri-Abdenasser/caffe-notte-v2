import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
)

const reservationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'عدد محاولات كبير جدًا، حاول لاحقًا' },
})

const reservationSchema = z.object({
  name: z.string().min(2, 'الاسم قصير جدًا'),
  phone: z.string().min(8, 'رقم جوال غير صحيح'),
  date: z.string().min(1, 'التاريخ مطلوب'),
  guests: z.string().min(1, 'عدد الأفراد مطلوب'),
  notes: z.string().optional(),
})

app.post('/api/reservations', reservationLimiter, async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message })
  }
  const { data, error } = await supabase
    .from('reservations')
    .insert([parsed.data])
    .select()
  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'حدث خطأ أثناء حفظ الحجز' })
  }
  res.status(201).json({ message: 'تم حفظ الحجز بنجاح', data })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`السيرفر يعمل على http://localhost:${PORT}`)
})