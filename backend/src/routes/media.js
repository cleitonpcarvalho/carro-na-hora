import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { unlink } from 'fs/promises'
import pool from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.env.UPLOAD_DIR ?? './uploads'))
  },
  filename: (_req, file, cb) => {
    const ext      = path.extname(file.originalname).toLowerCase()
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-')
    cb(null, safeName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_MB ?? '10') * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    cb(null, allowed.includes(file.mimetype))
  },
})

// ── GET /api/media (public) ──────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query
    let query  = "SELECT * FROM media WHERE category != 'sistema'"
    const params = []
    if (category) { params.push(category); query += ` AND category = $${params.length}` }
    if (q)        { params.push(`%${q}%`);  query += ` AND original_name ILIKE $${params.length}` }
    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/media/upload (protected) ──────────────────────
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum ficheiro enviado.' })
  try {
    const url = `${process.env.PUBLIC_URL}/uploads/${req.file.filename}`
    const result = await pool.query(
      'INSERT INTO media (filename, original_name, mime_type, size_bytes, url, alt_text, category) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url, req.body.alt_text ?? '', req.body.category ?? 'geral']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE /api/media/:id (protected) ───────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media WHERE id = $1', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Ficheiro não encontrado.' })
    const filePath = path.resolve(process.env.UPLOAD_DIR ?? './uploads', result.rows[0].filename)
    try { await unlink(filePath) } catch { /* file may not exist on disk */ }
    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id])
    res.json({ message: 'Ficheiro eliminado.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
