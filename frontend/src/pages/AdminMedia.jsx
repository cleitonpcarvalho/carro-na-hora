import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import api         from '../services/api'

const CATEGORY_OPTIONS = [
  { value: '',         label: 'Todas as imagens'         },
  { value: 'viaturas', label: 'Fotografias de Viaturas'  },
  { value: 'site',     label: 'Imagens do Site'          },
  { value: 'geral',    label: 'Geral'                    },
]

export default function AdminMedia() {
  const [media,     setMedia]     = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [copied,    setCopied]    = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(() => {})
  }, [])

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)   params.set('q', search)
    if (category) params.set('category', category)

    api.getMedia(params.toString() ? '?' + params.toString() : '')
      .then(all => {
        let filtered = all.filter(m =>
          !m.filename.startsWith('site-avatar')
        )

        if (vehicleId) {
          const v = vehicles.find(v => String(v.id) === vehicleId)
          if (v && Array.isArray(v.images) && v.images.length > 0) {
            const vUrls = new Set(v.images)
            filtered = filtered.filter(m => vUrls.has(m.url))
          } else {
            filtered = []
          }
        }

        setMedia(filtered)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, category, vehicleId, vehicles])

  const handleUpload = async e => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', category || 'geral')
        await api.uploadMedia(fd)
      }
      load()
    } catch (err) {
      alert('Erro ao carregar: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async id => {
    if (!confirm('Eliminar esta imagem permanentemente?')) return
    setDeleting(id)
    try {
      await api.deleteMedia(id)
      setMedia(m => m.filter(x => x.id !== id))
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleCopy = (id, url) => {
    navigator.clipboard.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatSize = bytes => {
    if (!bytes) return ''
    if (bytes < 1024)      return bytes + ' B'
    if (bytes < 1024*1024) return (bytes/1024).toFixed(0) + ' KB'
    return (bytes/(1024*1024)).toFixed(1) + ' MB'
  }

  const activeVehicle = vehicles.find(v => String(v.id) === vehicleId)

  return (
    <AdminLayout title="Biblioteca de Media">
      <div className="space-y-5">

        {/* ── FILTERS ── */}
        <div className="admin-card">
          <div className="flex flex-wrap items-end gap-4">

            <div className="flex-1 min-w-48">
              <label className="admin-label">Pesquisar</label>
              <input
                type="text"
                placeholder="Nome do ficheiro..."
                value={search}
                onChange={e => { setSearch(e.target.value); setVehicleId('') }}
                className="admin-input"
              />
            </div>

            <div className="w-56">
              <label className="admin-label">Categoria</label>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setVehicleId('') }}
                className="admin-input"
              >
                {CATEGORY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="w-56">
              <label className="admin-label">Filtrar por Viatura</label>
              <select
                value={vehicleId}
                onChange={e => {
                  setVehicleId(e.target.value)
                  setCategory('')
                  setSearch('')
                }}
                className="admin-input"
              >
                <option value="">Todas as viaturas</option>
                {vehicles.map(v => (
                  <option key={v.id} value={String(v.id)}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? 'A carregar...' : '↑ Carregar Imagens'}
              </button>
            </div>
          </div>

          {vehicleId && activeVehicle && (
            <div className="mt-4 flex items-center gap-3 bg-brand-gold/10
                            border border-brand-gold/30 rounded-xl px-4 py-2.5">
              <span className="text-sm text-brand-blue font-semibold">
                A mostrar fotos de:
                <span className="text-brand-gold ml-1">{activeVehicle.name}</span>
              </span>
              <button
                onClick={() => setVehicleId('')}
                className="text-xs text-muted hover:text-brand-blue underline ml-auto"
              >
                Limpar filtro
              </button>
            </div>
          )}
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="admin-card text-center py-16">
            <svg className="w-12 h-12 text-gray-200 mx-auto mb-3"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586
                   a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6
                   a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-muted text-sm mb-4">Nenhuma imagem encontrada.</p>
            <button onClick={() => fileRef.current?.click()} className="btn-primary">
              Carregar Imagem
            </button>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm px-1">
              {media.length} ficheiro{media.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map(item => (
                <div key={item.id}
                     className="group relative bg-white rounded-2xl overflow-hidden shadow-sm
                                border border-gray-100 hover:border-brand-gold/30
                                transition-colors duration-200">
                  <div className="aspect-square bg-light-bg">
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-brand-blue truncate leading-tight">
                      {item.original_name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted">{formatSize(item.size_bytes)}</p>
                      <span className="text-xs bg-light-bg text-muted px-2 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 flex flex-col gap-1
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`text-white text-xs px-2.5 py-1.5 rounded-lg font-semibold
                                  transition-colors duration-200 ${
                        copied === item.id
                          ? 'bg-green-500'
                          : 'bg-brand-blue hover:bg-brand-blue-2'
                      }`}
                    >
                      {copied === item.id ? '✓ Copiado' : 'Copiar URL'}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs
                                 px-2.5 py-1.5 rounded-lg font-semibold
                                 transition-colors duration-200"
                    >
                      {deleting === item.id ? '...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
