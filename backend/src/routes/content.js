import { Router } from 'express'
import pool from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/content/pages (public) ─────────────────────────
router.get('/pages', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pages WHERE is_active = true ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── GET /api/content/pages/:slug (public) ───────────────────
router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await pool.query('SELECT * FROM pages WHERE slug = $1 AND is_active = true', [req.params.slug])
    if (!page.rows[0]) return res.status(404).json({ error: 'Página não encontrada.' })

    const sections = await pool.query(
      'SELECT * FROM sections WHERE page_id = $1 AND is_active = true ORDER BY order_num',
      [page.rows[0].id]
    )
    res.json({ ...page.rows[0], sections: sections.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── PUT /api/content/sections/:id (protected) ───────────────
router.put('/sections/:id', requireAuth, async (req, res) => {
  const { content } = req.body
  try {
    const result = await pool.query(
      `UPDATE sections
       SET content    = content || $1::jsonb,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(content), req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/sections/:id/merge', async (req, res) => {
  const { content } = req.body
  if (!content || typeof content !== 'object')
    return res.status(400).json({ error: 'content object required' })

  const allowedKeys = ['background_image', 'image']
  const safe = {}
  for (const key of allowedKeys) {
    if (content[key] && typeof content[key] === 'string'
        && content[key].startsWith('http://localhost')) {
      safe[key] = content[key]
    }
  }

  if (Object.keys(safe).length === 0)
    return res.status(400).json({ error: 'no valid image fields' })

  try {
    await pool.query(
      `UPDATE sections
       SET content    = content || $1::jsonb,
           updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(safe), req.params.id]
    )
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
