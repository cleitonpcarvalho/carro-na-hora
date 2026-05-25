import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

import authRoutes     from './routes/auth.js'
import settingsRoutes from './routes/settings.js'
import contentRoutes  from './routes/content.js'
import mediaRoutes    from './routes/media.js'
import vehicleRoutes  from './routes/vehicles.js'
import contactRoutes  from './routes/contact.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 3001

// ── CORS ────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN ?? '')
  .split(',').map(o => o.trim())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin))
      callback(null, true)
    else
      callback(new Error('CORS not allowed'))
  },
  credentials: true,
}))

// ── BODY PARSERS ────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── STATIC UPLOADS ──────────────────────────────────────────
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads')
app.use('/uploads', express.static(uploadDir))

// ── ROUTES ──────────────────────────────────────────────────
app.use('/api/auth',     authRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/content',  contentRoutes)
app.use('/api/media',    mediaRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/contact',  contactRoutes)

// ── HEALTH CHECK ────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', project: 'Carro da Hora', timestamp: new Date().toISOString() })
})

// ── GLOBAL ERROR HANDLER ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server error]', err.message)
  res.status(500).json({ error: err.message ?? 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`)
})

export default app
