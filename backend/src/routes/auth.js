import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── POST /api/auth/login ────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ error: 'Email e password são obrigatórios.' })

  try {
    const result = await pool.query(
      'SELECT * FROM admin_users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    const user = result.rows[0]
    if (!user)
      return res.status(401).json({ error: 'Credenciais inválidas.' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid)
      return res.status(401).json({ error: 'Credenciais inválidas.' })

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' }
    )
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error('[auth/login]', err.message)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── POST /api/auth/setup ─────────────────────────────────────
// Creates the first admin user. Blocks if one already exists.
router.post('/setup', async (req, res) => {
  try {
    const existing = await pool.query('SELECT id FROM admin_users LIMIT 1')
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'Administrador já existe.' })

    const email    = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name     = 'Administrador'

    if (!email || !password)
      return res.status(500).json({ error: 'ADMIN_EMAIL ou ADMIN_PASSWORD não configurados no .env' })

    const hash = await bcrypt.hash(password, 12)
    const result = await pool.query(
      'INSERT INTO admin_users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email.toLowerCase().trim(), hash, name]
    )
    res.status(201).json({ message: 'Administrador criado com sucesso.', user: result.rows[0] })
  } catch (err) {
    console.error('[auth/setup]', err.message)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── POST /api/auth/reset-password ───────────────────────────
// Temporary route to reset admin password in production.
router.post('/reset-password', requireAuth, async (req, res) => {
  const { new_password } = req.body
  if (!new_password || new_password.length < 8)
    return res.status(400).json({ error: 'A nova password deve ter pelo menos 8 caracteres.' })

  try {
    const hash = await bcrypt.hash(new_password, 12)
    await pool.query(
      'UPDATE admin_users SET password = $1 WHERE id = $2',
      [hash, req.user.id]
    )
    res.json({ message: 'Password actualizada com sucesso.' })
  } catch (err) {
    console.error('[auth/reset-password]', err.message)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM admin_users WHERE id = $1',
      [req.user.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' })
  }
})

export default router
