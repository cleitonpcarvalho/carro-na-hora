const BASE = import.meta.env.VITE_ADMIN_API_BASE || 'http://localhost:3001'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`)
  return res.json()
}

export const api = {
  getSettings:         () => get('/api/settings'),
  getPage:             (slug) => get(`/api/content/pages/${slug}`),
  getVehicles:         (featured = false) => get(`/api/vehicles${featured ? '?featured=true' : ''}`),
  getVehicle:          (id) => get(`/api/vehicles/${id}`),
}

export default api
