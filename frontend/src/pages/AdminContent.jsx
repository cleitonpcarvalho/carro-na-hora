import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'

const SECTION_LABELS = {
  hero: 'Hero Principal',
  featured_vehicles: 'Viaturas em Destaque',
  why_us: 'Porquê a Carro da Hora',
  cta_banner: 'Banner de Conversão',
  testimonials: 'Testemunhos',
  about_hero: 'Cabeçalho Sobre Nós',
  about_story: 'A Nossa História',
  about_values: 'Os Nossos Valores',
  contact_hero: 'Cabeçalho Contacto',
  contact_map: 'Mapa e Morada',
}

const FIELD_LABELS = {
  headline: 'Título Principal',
  subheadline: 'Subtítulo',
  cta_primary_text: 'Botão Principal - Texto',
  cta_primary_url: 'Botão Principal - URL',
  cta_secondary_text: 'Botão Secundário - Texto',
  title: 'Título',
  subtitle: 'Subtítulo',
  text: 'Texto',
  cta_text: 'Botão - Texto',
  maps_embed_url: 'URL do Google Maps',
  address: 'Morada',
  phone: 'Telefone',
  email: 'Email',
  background_image: 'Imagem de Fundo',
  image: 'Imagem',
}

function isImageField(key) {
  return key === 'background_image' || key === 'image'
}

function isLongText(key) {
  return key === 'text' || key === 'subheadline' || key === 'subtitle'
}

function isValidUrl(val) {
  return val && (val.startsWith('http://') || val.startsWith('https://'))
}

function SectionEditor({ section, onSave }) {
  const [content, setContent] = useState(section.content || {})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    setContent(c => ({ ...c, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.updateSection(section.id, content)
      setSaved(true)
      onSave && onSave()
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Erro ao guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const editableFields = Object.entries(content).filter(
    ([, val]) => typeof val === 'string' && !Array.isArray(val)
  )

  return (
    <div className="admin-card space-y-4">
      <h3 className="font-black text-brand-blue text-base">
        {SECTION_LABELS[section.slug] || section.title || section.slug}
      </h3>

      {editableFields.length === 0 ? (
        <p className="text-muted text-sm">Esta secção não tem campos de texto editáveis directamente.</p>
      ) : (
        <div className="space-y-4">
          {editableFields.map(([key, value]) => (
            <div key={key}>
              <label className="admin-label">{FIELD_LABELS[key] || key}</label>

              {isImageField(key) ? (
                <div className="space-y-2">
                  <input
                    value={value || ''}
                    onChange={e => handleChange(key, e.target.value)}
                    className="admin-input"
                    placeholder="URL da imagem"
                  />
                  {isValidUrl(value) ? (
                    <img
                      src={value}
                      alt=""
                      className="h-24 rounded-xl object-cover border border-gray-200"
                      onError={e => e.target.style.display = 'none'}
                    />
                  ) : (
                    <div className="h-16 bg-light-bg rounded-xl flex items-center justify-center">
                      <span className="text-xs text-muted">Sem imagem</span>
                    </div>
                  )}
                </div>
              ) : isLongText(key) ? (
                <textarea
                  value={value || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  rows={4}
                  className="admin-input resize-none"
                />
              ) : (
                <input
                  value={value || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="admin-input"
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5">
          {saving ? 'A guardar...' : 'Guardar Secção'}
        </button>
        {saved && (
          <span className="text-green-600 text-xs font-semibold">Guardado!</span>
        )}
      </div>
    </div>
  )
}

export default function AdminContent() {
  const [pages, setPages] = useState([])
  const [active, setActive] = useState(null)
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPages().then(data => {
      setPages(data)
      if (data[0]) {
        setActive(data[0].slug)
        loadPage(data[0].slug)
      }
    }).finally(() => setLoading(false))
  }, [])

  const loadPage = slug => {
    setPage(null)
    api.getPage(slug).then(setPage)
  }

  const selectPage = slug => {
    setActive(slug)
    loadPage(slug)
  }

  return (
    <AdminLayout title="Conteúdo do Site">
      <div className="flex gap-6">
        <aside className="w-48 flex-shrink-0">
          <div className="admin-card p-2 space-y-1">
            {pages.map(p => (
              <button
                key={p.slug}
                onClick={() => selectPage(p.slug)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold
                            transition-all duration-200 ${
                  active === p.slug
                    ? 'bg-brand-blue text-white'
                    : 'text-brand-blue hover:bg-light-bg'
                }`}
              >
                {p.title}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1 space-y-5">
          {loading || !page ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            page.sections?.map(section => (
              <SectionEditor
                key={section.id}
                section={section}
                onSave={() => loadPage(active)}
              />
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
