import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Credenciais inválidas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-blue flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/assets/logo-dark.png"
            alt="Carro da Hora"
            className="h-16 w-auto object-contain mx-auto mb-4"
          />
          <p className="text-white/50 text-sm">Painel Administrativo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-black text-brand-blue mb-6">Entrar</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3
                            text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="admin-label">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="admin-input"
                placeholder="admin@exemplo.com"
              />
            </div>
            <div>
              <label className="admin-label">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="admin-input"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-60"
            >
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
