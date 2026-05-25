import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'

const EMPTY = {
  name: '', brand: '', model: '', year: '', fuel: '',
  mileage: '', price: '', color: '', transmission: '',
  power: '', description: '', extra_info: {}, images: [],
  is_featured: false, is_active: true, whatsapp_message: '',
}

const FUELS = ['Gasolina', 'Diesel', 'Híbrido', 'Elétrico', 'GPL', 'Outro']
const TRANS = ['Manual', 'Automático', 'Semi-automático']

export default function AdminViaturas() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [imgInput, setImgInput] = useState('')
  const [uploadingImgs, setUploadingImgs] = useState(false)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    api.getVehicles()
      .then(setVehicles)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY)
    setImgInput('')
    setModal(true)
  }

  const openEdit = v => {
    setEditing(v.id)
    setForm({
      ...EMPTY, ...v,
      year: v.year || '',
      mileage: v.mileage || '',
      price: v.price || '',
      images: Array.isArray(v.images) ? v.images : [],
      extra_info: v.extra_info || {},
    })
    setImgInput('')
    setModal(true)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const addImageUrl = () => {
    const url = imgInput.trim()
    if (!url) return
    setForm(f => ({ ...f, images: [...(f.images || []), url].slice(0, 10) }))
    setImgInput('')
  }

  const removeImage = idx => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  const handleFileUpload = async e => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingImgs(true)
    try {
      const urls = []
      for (const file of files.slice(0, 10 - (form.images?.length || 0))) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('category', 'viaturas')
        const res = await api.uploadMedia(fd)
        urls.push(res.url)
      }
      setForm(f => ({ ...f, images: [...(f.images || []), ...urls].slice(0, 10) }))
    } catch (err) {
      alert('Erro ao fazer upload: ' + err.message)
    } finally {
      setUploadingImgs(false)
      e.target.value = ''
    }
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        year: form.year ? parseInt(form.year) : null,
        mileage: form.mileage ? parseInt(form.mileage) : null,
        price: form.price ? parseFloat(form.price) : null,
      }
      if (editing) {
        await api.updateVehicle(editing, payload)
      } else {
        await api.createVehicle(payload)
      }
      setModal(false)
      load()
    } catch (err) {
      alert('Erro ao guardar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Tem a certeza que deseja eliminar esta viatura?')) return
    setDeleting(id)
    try {
      await api.deleteVehicle(id)
      load()
    } catch (err) {
      alert('Erro: ' + err.message)
    } finally {
      setDeleting(null)
    }
  }

  const toggleFeatured = async (id, current) => {
    try {
      await api.toggleFeatured(id, !current)
      load()
    } catch (err) {
      alert('Erro: ' + err.message)
    }
  }

  return (
    <AdminLayout title="Viaturas">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">{vehicles.length} viatura{vehicles.length !== 1 ? 's' : ''}</p>
          <button onClick={openCreate} className="btn-primary">+ Nova Viatura</button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="admin-card text-center py-16">
            <p className="text-muted text-sm mb-4">Nenhuma viatura adicionada ainda.</p>
            <button onClick={openCreate} className="btn-primary">Adicionar Primeira Viatura</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {vehicles.map(v => (
              <div key={v.id} className="admin-card flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-brand-blue truncate">{v.name}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {[v.brand, v.model, v.year].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFeatured(v.id, v.is_featured)}
                    className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200 ${
                      v.is_featured
                        ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
                        : 'bg-gray-100 text-muted hover:bg-brand-gold/10'
                    }`}
                    title="Clique para alternar destaque"
                  >
                    {v.is_featured ? '★ Destaque' : '☆ Destaque'}
                  </button>
                </div>

                {Array.isArray(v.images) && v.images[0] && (
                  <img
                    src={v.images[0]}
                    alt={v.name}
                    className="w-full h-40 object-cover rounded-xl"
                    onError={e => e.target.style.display = 'none'}
                  />
                )}

                <div className="flex flex-wrap gap-2 text-xs">
                  {v.fuel && (
                    <span className="bg-light-bg text-brand-blue font-semibold px-2.5 py-1 rounded-full">
                      {v.fuel}
                    </span>
                  )}
                  {v.price && (
                    <span className="bg-light-bg text-brand-blue font-semibold px-2.5 py-1 rounded-full">
                      {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.price)}
                    </span>
                  )}
                  {!v.is_active && (
                    <span className="bg-red-50 text-red-500 font-semibold px-2.5 py-1 rounded-full">
                      Inactiva
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(v)}
                    className="flex-1 btn-secondary text-xs py-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={deleting === v.id}
                    className="btn-danger text-xs py-2 px-3"
                  >
                    {deleting === v.id ? '...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-brand-blue">
                {editing ? 'Editar Viatura' : 'Nova Viatura'}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="text-muted hover:text-brand-blue transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="admin-label">Nome da Viatura *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    required className="admin-input" placeholder="Ex: BMW Série 3 320d" />
                </div>
                <div>
                  <label className="admin-label">Marca</label>
                  <input name="brand" value={form.brand} onChange={handleChange}
                    className="admin-input" placeholder="Ex: BMW" />
                </div>
                <div>
                  <label className="admin-label">Modelo</label>
                  <input name="model" value={form.model} onChange={handleChange}
                    className="admin-input" placeholder="Ex: Série 3 320d" />
                </div>
                <div>
                  <label className="admin-label">Ano</label>
                  <input name="year" type="number" value={form.year} onChange={handleChange}
                    className="admin-input" placeholder="Ex: 2021" min="1990" max="2030" />
                </div>
                <div>
                  <label className="admin-label">Combustível</label>
                  <select name="fuel" value={form.fuel} onChange={handleChange} className="admin-input">
                    <option value="">Seleccionar...</option>
                    {FUELS.map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Quilometragem (km)</label>
                  <input name="mileage" type="number" value={form.mileage} onChange={handleChange}
                    className="admin-input" placeholder="Ex: 45000" />
                </div>
                <div>
                  <label className="admin-label">Preço (€)</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange}
                    className="admin-input" placeholder="Ex: 18500" />
                </div>
                <div>
                  <label className="admin-label">Cor</label>
                  <input name="color" value={form.color} onChange={handleChange}
                    className="admin-input" placeholder="Ex: Branco Pérola" />
                </div>
                <div>
                  <label className="admin-label">Transmissão</label>
                  <select name="transmission" value={form.transmission} onChange={handleChange}
                    className="admin-input">
                    <option value="">Seleccionar...</option>
                    {TRANS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Potência</label>
                  <input name="power" value={form.power} onChange={handleChange}
                    className="admin-input" placeholder="Ex: 190 cv" />
                </div>
                <div className="sm:col-span-2">
                  <label className="admin-label">Descrição</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    rows={3} className="admin-input resize-none"
                    placeholder="Descrição da viatura..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="admin-label">Mensagem WhatsApp personalizada</label>
                  <input name="whatsapp_message" value={form.whatsapp_message} onChange={handleChange}
                    className="admin-input"
                    placeholder="Deixe vazio para usar mensagem automática" />
                </div>
              </div>

              <div>
                <label className="admin-label">Imagens (máx. 10)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={imgInput}
                    onChange={e => setImgInput(e.target.value)}
                    className="admin-input flex-1"
                    placeholder="Colar URL de imagem"
                  />
                  <button type="button" onClick={addImageUrl} className="btn-secondary px-4">
                    Adicionar URL
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingImgs}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    {uploadingImgs ? 'A carregar...' : '↑ Carregar Ficheiros'}
                  </button>
                  <span className="text-xs text-muted">{form.images?.length || 0}/10 imagens</span>
                </div>
                {form.images?.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover"
                          onError={e => e.target.src = ''} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5
                                     rounded-full text-xs flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_featured" checked={form.is_featured}
                    onChange={handleChange} className="w-4 h-4 accent-brand-gold" />
                  <span className="text-sm font-semibold text-brand-blue">Mostrar na Página Principal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_active" checked={form.is_active}
                    onChange={handleChange} className="w-4 h-4 accent-brand-blue" />
                  <span className="text-sm font-semibold text-brand-blue">Viatura Activa</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
                  {saving ? 'A guardar...' : (editing ? 'Guardar Alterações' : 'Criar Viatura')}
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary px-6">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
