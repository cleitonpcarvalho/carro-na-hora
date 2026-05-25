import { Router } from 'express'
import pool from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/settings (public) ──────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT key, value, label, type, group_name FROM site_settings ORDER BY group_name, key')
    const settings = {}
    result.rows.forEach(row => { settings[row.key] = row.value })
    res.json(settings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/settings/grouped (protected) ───────────────────
router.get('/grouped', requireAuth, async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings ORDER BY group_name, key')
    const grouped = {}
    result.rows.forEach(row => {
      if (!grouped[row.group_name]) grouped[row.group_name] = []
      grouped[row.group_name].push(row)
    })
    res.json(grouped)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/settings/:key (protected) ──────────────────────
router.put('/:key', requireAuth, async (req, res) => {
  const { key } = req.params
  const { value } = req.body
  try {
    await pool.query(
      'UPDATE site_settings SET value = $1 WHERE key = $2',
      [value, key]
    )
    res.json({ message: 'Configuração actualizada.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/settings (protected, bulk update) ──────────────
router.put('/', requireAuth, async (req, res) => {
  const updates = req.body
  if (!updates || typeof updates !== 'object')
    return res.status(400).json({ error: 'Formato inválido.' })
  try {
    const promises = Object.entries(updates).map(([key, value]) =>
      pool.query('UPDATE site_settings SET value = $1 WHERE key = $2', [value, key])
    )
    await Promise.all(promises)
    res.json({ message: 'Configurações actualizadas.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/settings/publish (protected) ──────────────────
router.post('/publish', requireAuth, async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO site_settings (key, value, label, group_name) VALUES ('last_published', NOW()::text, 'Última publicação', 'sistema') ON CONFLICT (key) DO UPDATE SET value = NOW()::text"
    )
    res.json({ message: 'Alterações publicadas.', timestamp: new Date().toISOString() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/settings/run-seeds (protected) ────────────────
router.post('/run-seeds', requireAuth, async (req, res) => {
  try {
    const { readFileSync } = await import('fs')
    const { fileURLToPath } = await import('url')
    const { dirname, join } = await import('path')
    const __filename = fileURLToPath(import.meta.url)
    const __dirname  = dirname(__filename)
    const sql = readFileSync(join(__dirname, '../db/migrations/001_initial.sql'), 'utf8')
    await pool.query(sql)
    res.json({ message: 'Seeds executados com sucesso.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/settings/debug-uploads (protected) ─────────────
router.get('/debug-uploads', requireAuth, async (req, res) => {
  try {
    const { readdirSync, statSync } = await import('fs')
    const { resolve } = await import('path')
    const dir   = resolve(process.env.UPLOAD_DIR ?? './uploads')
    const files = readdirSync(dir).map(f => {
      const s = statSync(`${dir}/${f}`)
      return { name: f, size: s.size, modified: s.mtime }
    })
    res.json({ upload_dir: dir, count: files.length, files })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
