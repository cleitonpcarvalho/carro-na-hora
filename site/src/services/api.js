const BASE = import.meta.env.VITE_ADMIN_API_BASE || 'https://backend-carro-na-hora-production.up.railway.app'

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
