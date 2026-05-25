import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from './connection.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

async function migrate() {
  const sql = readFileSync(
    join(__dirname, 'migrations', '001_initial.sql'),
    'utf8'
  )
  const client = await pool.connect()
  try {
    await client.query(sql)
    console.log('[migrate] Migration applied successfully.')
  } catch (err) {
    console.error('[migrate] Migration failed:', err.message)
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
