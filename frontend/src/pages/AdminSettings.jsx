import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'

const GROUP_LABELS = {
  geral: 'Geral',
  contacto: 'Contacto',
  email: 'Email',
  redes_sociais: 'Redes Sociais',
  sistema: 'Sistema',
}

export default function AdminSettings() {
  const [grouped, setGrouped] = useState({})
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getGroupedSettings()
      .then(data => {
        setGrouped(data)
        const flat = {}
        Object.values(data).flat().forEach(s => { flat[s.key] = s.value || '' })
        setValues(flat)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (key, val) => {
    setValues(v => ({ ...v, [key]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSettings(values)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Erro ao guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <AdminLayout title="Configurações">
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Configurações">
      <div className="space-y-8">
        {Object.entries(grouped)
          .filter(([group]) => group !== 'sistema')
          .map(([group, settings]) => (
          <div key={group} className="admin-card">
            <h2 className="text-lg font-black text-brand-blue mb-5">
              {GROUP_LABELS[group] || group}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings.map(s => (
                <div key={s.key}
                  className={s.key === 'contact_address' || s.key === 'site_tagline' ? 'sm:col-span-2' : ''}>
                  <label className="admin-label">{s.label || s.key}</label>
                  {s.type === 'textarea' ? (
                    <textarea
                      value={values[s.key] || ''}
                      onChange={e => handleChange(s.key, e.target.value)}
                      rows={3}
                      className="admin-input resize-none"
                    />
                  ) : (
                    <input
                      type={s.type === 'email' ? 'email' : 'text'}
                      value={values[s.key] || ''}
                      onChange={e => handleChange(s.key, e.target.value)}
                      className="admin-input"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving} className="btn-primary px-8 py-3">
            {saving ? 'A guardar...' : 'Guardar Configurações'}
          </button>
          {saved && (
            <span className="text-green-600 text-sm font-semibold animate-fade-in">
              Configurações guardadas!
            </span>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
