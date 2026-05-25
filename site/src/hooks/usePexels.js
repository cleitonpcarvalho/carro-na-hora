import { useState, useEffect } from 'react'
import { searchPexels, getPexelsUrl } from '../services/pexels'

export function usePexels(query, size = 'large2x', orientation = 'landscape') {
  const [url,     setUrl]     = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return
    searchPexels(query, 1, orientation)
      .then(photos => setUrl(getPexelsUrl(photos[0], size)))
      .catch(() => setUrl(''))
      .finally(() => setLoading(false))
  }, [query])

  return { url, loading }
}
