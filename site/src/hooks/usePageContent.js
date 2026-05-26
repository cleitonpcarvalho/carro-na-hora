import { useState, useEffect } from 'react'

const BASE  = import.meta.env.VITE_ADMIN_API_BASE || 'http://localhost:3001'
const cache = {}

export function usePageContent(pageSlug) {
  const [sections, setSections] = useState(cache[pageSlug] || null)
  const [loading,  setLoading]  = useState(!cache[pageSlug])

  useEffect(() => {
    if (cache[pageSlug]) {
      setSections(cache[pageSlug])
      setLoading(false)
      return
    }
    fetch(`${BASE}/api/content/pages/${pageSlug}`)
      .then(r => r.json())
      .then(data => {
        const map = {}
        if (data.sections) {
          data.sections.forEach(s => { map[s.slug] = s.content || {} })
        }
        cache[pageSlug] = map
        setSections(map)
      })
      .catch(() => setSections({}))
      .finally(() => setLoading(false))
  }, [pageSlug])

  const get = (sectionSlug, field, fallback = '') => {
    if (!sections) return fallback
    return sections[sectionSlug]?.[field] || fallback
  }

  return { sections, loading, get }
}
