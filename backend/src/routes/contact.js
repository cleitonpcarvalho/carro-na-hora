import { Router } from 'express'
import pool from '../db/connection.js'

const router = Router()

router.post('/', async (req, res) => {
  const { nome, email, assunto, mensagem } = req.body
  if (!nome || !email || !assunto || !mensagem)
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })

  try {
    const settingRes = await pool.query(
      "SELECT value FROM site_settings WHERE key = 'resend_to_email'"
    )
    const toEmail = settingRes.rows[0]?.value || 'perimetrodeeficacia@gmail.com'
    const apiKey  = process.env.RESEND_API_KEY

    const html = `
      <h2>Novo contacto do site - ${assunto}</h2>
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Assunto:</strong> ${assunto}</p>
      <hr />
      <p><strong>Mensagem:</strong></p>
      <p>${mensagem.replace(/\n/g, '<br/>')}</p>
    `

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from:     'noreply@effectidea.com',
        to:       toEmail,
        reply_to: email,
        subject:  `Novo contacto do site - ${assunto}`,
        html,
      }),
    })

    if (!sendRes.ok) {
      const errBody = await sendRes.text()
      console.error('[contact] Resend error:', errBody)
      return res.status(500).json({ error: 'Erro ao enviar email.' })
    }

    res.json({ message: 'Mensagem enviada com sucesso.' })
  } catch (err) {
    console.error('[contact]', err.message)
    res.status(500).json({ error: 'Erro interno.' })
  }
})

export default router
