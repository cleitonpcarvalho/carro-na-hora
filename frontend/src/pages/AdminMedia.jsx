import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import api         from '../services/api'

export default function AdminMedia() {
  const [media,     setMedia]     = useState([])
  const [vehicles,  setVehicles]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleting,  setDeleting]  = useState(null)
  const [copied,    setCopied]    = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    api.getVehicles()
      .then(setVehicles)
      .catch(() => {})
  }, [])

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    api.getMedia(params.toString() ? '?' + params.toString() : '')
      .then(all => {
        if (vehicleId) {
          const v = vehicles.find(v => String(v.id) === vehicleId)
          if (v && Array.isArray(v.images) && v.images.length > 0) {
            const vUrls = new Set(v.images)
            setMedia(all.filter(m => vUrls.has(m.url)))
          } else {
            setMedia([])
          }
        } else {
          setMedia(all)
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, vehicleId, vehicles])

  const handleUpload = async e => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', vehicleId ? 'viaturas' : 'geral')
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
    if (!confirm('Eliminar esta imagem?')) return
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

  return (
    <AdminLayout title="Biblioteca de Media">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-input flex-1 min-w-48"
          />

          <select
            value={vehicleId}
            onChange={e => setVehicleId(e.target.value)}
            className="admin-input w-56"
          >
            <option value="">Todas as viaturas</option>
            {vehicles.map(v => (
              <option key={v.id} value={String(v.id)}>
                {v.name}
              </option>
            ))}
          </select>

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

        {vehicleId && (
          <div className="bg-brand-gold/10 border border-brand-gold/30
                          rounded-xl px-4 py-3 text-sm text-brand-blue font-semibold">
            A mostrar fotos de:{' '}
            <span className="text-brand-gold">
              {vehicles.find(v => String(v.id) === vehicleId)?.name}
            </span>
            <button
              onClick={() => setVehicleId('')}
              className="ml-3 text-muted hover:text-brand-blue text-xs underline"
            >
              Limpar filtro
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="admin-card text-center py-16">
            <p className="text-muted text-sm mb-4">
              {vehicleId ? 'Nenhuma imagem encontrada para esta viatura.' : 'Nenhuma imagem encontrada.'}
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-primary"
            >
              Carregar Imagem
            </button>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm">
              {media.length} ficheiro{media.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map(item => (
                <div key={item.id}
                     className="group relative bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-square bg-light-bg">
                    <img
                      src={item.url}
                      alt={item.alt_text || item.original_name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-brand-blue truncate">
                      {item.original_name}
                    </p>
                    <p className="text-xs text-muted">{formatSize(item.size_bytes)}</p>
                  </div>

                  <div className="absolute top-2 right-2 flex flex-col gap-1
                                  opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(item.id, item.url)}
                      className={`text-white text-xs px-2 py-1 rounded-lg
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
                      className="bg-red-500 hover:bg-red-600 text-white
                                 text-xs px-2 py-1 rounded-lg transition-colors"
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
