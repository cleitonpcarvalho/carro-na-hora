const PEXELS_KEY = 'HXUq6GnePewGsEH9v7GaeKQAiGo3Ctvq2F3atYnPh9BLaetAIKB6jqNU'

export async function searchPexels(query, perPage = 1, orientation = 'landscape') {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } })
  if (!res.ok) return []
  const data = await res.json()
  return data.photos || []
}

export function getPexelsUrl(photo, size = 'large2x') {
  return photo?.src?.[size] || photo?.src?.large || ''
}
