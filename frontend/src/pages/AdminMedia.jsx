import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'

export default function AdminMedia() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (category) params.set('category', category)
    api.getMedia(params.toString() ? '?' + params.toString() : '')
      .then(setMedia)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, category])

  const handleUpload = async e => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', 'geral')
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

  const formatSize = bytes => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="admin-input w-44"
          >
            <option value="">Todas as categorias</option>
            <option value="geral">Geral</option>
            <option value="viaturas">Viaturas</option>
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="admin-card text-center py-16">
            <p className="text-muted text-sm mb-4">Nenhuma imagem encontrada.</p>
            <button onClick={() => fileRef.current?.click()} className="btn-primary">
              Carregar Primeira Imagem
            </button>
          </div>
        ) : (
          <>
            <p className="text-muted text-sm">{media.length} ficheiro{media.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map(item => (
                <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm">
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
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7
                               rounded-full flex items-center justify-center text-xs
                               opacity-0 group-hover:opacity-100 transition-opacity
                               hover:bg-red-600"
                  >
                    {deleting === item.id ? '...' : '×'}
                  </button>
                  <button
                    onClick={() => { navigator.clipboard.writeText(item.url); alert('URL copiado!') }}
                    className="absolute bottom-10 right-2 bg-brand-blue text-white text-xs
                               px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100
                               transition-opacity hover:bg-brand-blue-2"
                  >
                    Copiar URL
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
