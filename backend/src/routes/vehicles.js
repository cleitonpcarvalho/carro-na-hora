import { Router } from 'express'
import pool from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/vehicles (public) ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query
    let query = 'SELECT * FROM vehicles WHERE is_active = true'
    if (featured === 'true') query += ' AND is_featured = true'
    query += ' ORDER BY created_at DESC'
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/vehicles/:id (public) ──────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1 AND is_active = true', [req.params.id])
    if (!result.rows[0]) return res.status(404).json({ error: 'Viatura não encontrada.' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── POST /api/vehicles (protected) ──────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { name, brand, model, year, fuel, mileage, price, color, transmission, power, description, extra_info, images, is_featured, whatsapp_message } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO vehicles (name, brand, model, year, fuel, mileage, price, color, transmission, power, description, extra_info, images, is_featured, whatsapp_message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [name, brand, model, year, fuel, mileage, price, color, transmission, power, description, JSON.stringify(extra_info ?? {}), images ?? [], is_featured ?? false, whatsapp_message ?? '']
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/vehicles/:id (protected) ───────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const { name, brand, model, year, fuel, mileage, price, color, transmission, power, description, extra_info, images, is_featured, is_active, whatsapp_message } = req.body
  try {
    const result = await pool.query(
      `UPDATE vehicles SET
        name=$1, brand=$2, model=$3, year=$4, fuel=$5, mileage=$6, price=$7,
        color=$8, transmission=$9, power=$10, description=$11,
        extra_info=$12, images=$13, is_featured=$14, is_active=$15,
        whatsapp_message=$16, updated_at=NOW()
       WHERE id=$17 RETURNING *`,
      [name, brand, model, year, fuel, mileage, price, color, transmission, power, description, JSON.stringify(extra_info ?? {}), images ?? [], is_featured ?? false, is_active ?? true, whatsapp_message ?? '', req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── DELETE /api/vehicles/:id (protected) ────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM vehicles WHERE id = $1', [req.params.id])
    res.json({ message: 'Viatura eliminada.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PATCH /api/vehicles/:id/featured (protected) ────────────
router.patch('/:id/featured', requireAuth, async (req, res) => {
  const { is_featured } = req.body
  try {
    const result = await pool.query(
      'UPDATE vehicles SET is_featured = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, is_featured',
      [is_featured, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
