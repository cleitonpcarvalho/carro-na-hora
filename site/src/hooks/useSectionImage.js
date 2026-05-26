import { useState, useEffect } from 'react'
import { searchPexels, getPexelsUrl } from '../services/pexels'

const BASE = import.meta.env.VITE_ADMIN_API_BASE || 'https://backend-carro-na-hora-production.up.railway.app'

const pageCache = {}

async function fetchPage(slug) {
  if (pageCache[slug]) return pageCache[slug]
  const res  = await fetch(`${BASE}/api/content/pages/${slug}`)
  const data = await res.json()
  pageCache[slug] = data
  return data
}

export function useSectionImage({
  pageSlug,
  sectionSlug,
  field,
  fallbackQuery,
  orientation = 'landscape',
  size        = 'large2x',
}) {
  const [url,     setUrl]     = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const page    = await fetchPage(pageSlug)
        const section = page.sections?.find(s => s.slug === sectionSlug)
        const stored  = section?.content?.[field]

        if (stored && stored !== 'auto' && stored.startsWith('http')) {
          if (!cancelled) { setUrl(stored); setLoading(false) }
          return
        }

        if (fallbackQuery) {
          const photos   = await searchPexels(fallbackQuery, 1, orientation)
          const pexelUrl = getPexelsUrl(photos[0], size)
          if (!cancelled) { setUrl(pexelUrl); setLoading(false) }
        } else {
          if (!cancelled) setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [pageSlug, sectionSlug, field, fallbackQuery])

  return { url, loading }
}
