const BASE = import.meta.env.VITE_API_URL || 'https://backend-carro-na-hora-production.up.railway.app'

function getToken() {
  return localStorage.getItem('admin_token')
}

async function request(method, path, body) {
  if (!BASE) throw new Error('VITE_API_URL não configurado.')

  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    localStorage.removeItem('admin_token')
    window.location.href = '/login'
    return
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
  return data
}

async function upload(path, formData) {
  if (!BASE) throw new Error('VITE_API_URL não configurado.')

  const token = getToken()
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

export const api = {
  login:            (email, password) => request('POST', '/api/auth/login', { email, password }),
  me:               ()                => request('GET',  '/api/auth/me'),

  getSettings:      ()                => request('GET',  '/api/settings'),
  getGroupedSettings: ()              => request('GET',  '/api/settings/grouped'),
  updateSetting:    (key, value)      => request('PUT',  `/api/settings/${key}`, { value }),
  updateSettings:   (obj)             => request('PUT',  '/api/settings', obj),
  publishSettings:  ()                => request('POST', '/api/settings/publish'),
  debugUploads:     ()                => request('GET',  '/api/settings/debug-uploads'),

  getPage:          (slug)            => request('GET',  `/api/content/pages/${slug}`),
  getPages:         ()                => request('GET',  '/api/content/pages'),
  updateSection:    (id, content)     => request('PUT',  `/api/content/sections/${id}`, { content }),

  getMedia:         (params)          => request('GET',  `/api/media${params || ''}`),
  uploadMedia:      (formData)        => upload('/api/media/upload', formData),
  deleteMedia:      (id)              => request('DELETE', `/api/media/${id}`),

  getVehicles:      ()                => request('GET',  '/api/vehicles'),
  getVehicle:       (id)              => request('GET',  `/api/vehicles/${id}`),
  createVehicle:    (data)            => request('POST', '/api/vehicles', data),
  updateVehicle:    (id, data)        => request('PUT',  `/api/vehicles/${id}`, data),
  deleteVehicle:    (id)              => request('DELETE', `/api/vehicles/${id}`),
  toggleFeatured:   (id, featured)    => request('PATCH', `/api/vehicles/${id}/featured`, { is_featured: featured }),
}

export default api
