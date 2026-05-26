import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import api         from '../services/api'

const SECTION_LABELS = {
  hero:              'Hero Principal',
  featured_vehicles: 'Viaturas em Destaque',
  why_us:            'Porquê a Carro da Hora',
  cta_banner:        'Banner de Conversão',
  testimonials:      'Testemunhos',
  about_hero:        'Cabeçalho Sobre Nós',
  about_story:       'A Nossa História',
  about_values:      'Os Nossos Valores',
  contact_hero:      'Cabeçalho Contacto',
  contact_map:       'Mapa e Morada',
}

const FIELD_LABELS = {
  headline:           'Título Principal',
  subheadline:        'Subtítulo',
  cta_primary_text:   'Botão Principal — Texto',
  cta_primary_url:    'Botão Principal — Destino',
  cta_secondary_text: 'Botão Secundário — Texto',
  title:              'Título',
  subtitle:           'Subtítulo',
  text:               'Texto',
  cta_text:           'Botão — Texto',
  address:            'Morada',
  phone:              'Telefone',
  email:              'Email',
  background_image:   'Imagem de Fundo',
  image:              'Imagem',
}

const HIDDEN_FIELDS = new Set([
  'maps_embed_url',
  'cta_primary_url',
])

function isImageField(key) {
  return key === 'background_image' || key === 'image'
}

function isLongText(key) {
  return ['text', 'subheadline', 'subtitle', 'headline'].includes(key)
}

function isValidUrl(val) {
  return val && (val.startsWith('http://') || val.startsWith('https://'))
}

function ImageFieldEditor({ fieldKey, value, onChange, sectionId }) {
  const fileRef   = useRef()
  const [uploading, setUploading] = useState(false)
  const isAuto    = !value || value === 'auto'
  const hasImage  = !isAuto && value && value.startsWith('http')

  const handleFileChange = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('category', 'site')
      const res  = await api.uploadMedia(fd)
      if (res?.url) {
        onChange(res.url)
      }
    } catch (err) {
      alert('Erro ao carregar imagem: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {hasImage ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200">
          <img
            src={value}
            alt=""
            className="w-full h-44 object-cover"
            onError={e => { e.target.style.opacity = '0.3' }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40
                          transition-all duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-white text-brand-blue text-xs font-bold
                         px-5 py-2.5 rounded-xl shadow-lg"
            >
              {uploading ? 'A carregar...' : 'Substituir Imagem'}
            </button>
          </div>
        </div>
      ) : (
        <div className="h-28 bg-light-bg rounded-xl border-2 border-dashed border-gray-200
                        flex flex-col items-center justify-center gap-2">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828
                 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12
                 a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-muted">Sem imagem</p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="text-xs text-brand-blue font-bold hover:underline"
          >
            {uploading ? 'A carregar...' : 'Escolher Imagem'}
          </button>
        </div>
      )}
    </div>
  )
}

function SectionEditor({ section, onSave }) {
  const [content, setContent] = useState(section.content || {})
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [open,    setOpen]    = useState(false)

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

  const editableFields = Object.entries(content).filter(([key, val]) =>
    typeof val === 'string' &&
    !Array.isArray(val) &&
    !HIDDEN_FIELDS.has(key)
  )

  const hasFields = editableFields.length > 0

  return (
    <div className="admin-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="font-black text-brand-blue text-base">
          {SECTION_LABELS[section.slug] || section.title || section.slug}
        </h3>
        <svg
          className={`w-5 h-5 text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-5 space-y-4 pt-5 border-t border-gray-100">
          {!hasFields ? (
            <p className="text-muted text-sm">
              Esta secção não tem campos editáveis directamente.
            </p>
          ) : (
            editableFields.map(([key, value]) => (
              <div key={key}>
                <label className="admin-label">
                  {FIELD_LABELS[key] || key}
                </label>

                {isImageField(key) ? (
                  <ImageFieldEditor
                    fieldKey={key}
                    value={value}
                    onChange={val => handleChange(key, val)}
                    sectionId={section.id}
                  />
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
            ))
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-xs py-2 px-5"
            >
              {saving ? 'A guardar...' : 'Guardar Secção'}
            </button>
            {saved && (
              <span className="text-green-600 text-xs font-semibold">
                Guardado!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminContent() {
  const [pages,   setPages]   = useState([])
  const [active,  setActive]  = useState(null)
  const [page,    setPage]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getPages().then(data => {
      setPages(data)
      if (data[0]) { setActive(data[0].slug); loadPage(data[0].slug) }
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

        <div className="flex-1 space-y-4">
          {loading || !page ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
              ))}
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
