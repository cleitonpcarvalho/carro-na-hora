import { writeFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const PEXELS_KEY  = 'HXUq6GnePewGsEH9v7GaeKQAiGo3Ctvq2F3atYnPh9BLaetAIKB6jqNU'
const UPLOADS_DIR = '/Users/cleitonpcarvalho/Documents/Sites Effect Idea/site_carro_na_hora/backend/uploads'
const API_BASE    = 'http://localhost:3001'

if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true })

const IMAGES = [
  {
    query:       'luxury car showroom night',
    orientation: 'landscape',
    filename:    'site-hero-bg.jpg',
    section:     'hero',
    field:       'background_image',
    sectionId:   null,
  },
  {
    query:       'car keys handover dealership',
    orientation: 'landscape',
    filename:    'site-cta-bg.jpg',
    section:     'cta_banner',
    field:       'background_image',
    sectionId:   null,
  },
  {
    query:       'luxury car dealership interior',
    orientation: 'landscape',
    filename:    'site-whyus-bg.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'luxury car showroom portugal',
    orientation: 'landscape',
    filename:    'site-sobre-hero.jpg',
    section:     'about_hero',
    field:       'background_image',
    sectionId:   null,
  },
  {
    query:       'car dealership professional team',
    orientation: 'landscape',
    filename:    'site-sobre-team.jpg',
    section:     'about_story',
    field:       'image',
    sectionId:   null,
  },
  {
    query:       'lisbon portugal city modern',
    orientation: 'landscape',
    filename:    'site-contacto-hero.jpg',
    section:     'contact_hero',
    field:       'background_image',
    sectionId:   null,
  },
  {
    query:       'lisbon portugal aerial view',
    orientation: 'landscape',
    filename:    'site-lisbon-city.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'car showroom luxury interior',
    orientation: 'landscape',
    filename:    'site-sobre-gallery-1.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'car salesman customer handshake',
    orientation: 'landscape',
    filename:    'site-sobre-gallery-2.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'car keys close up premium',
    orientation: 'portrait',
    filename:    'site-sobre-gallery-3.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'premium car detail close up',
    orientation: 'portrait',
    filename:    'site-sobre-car.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'professional man portrait headshot',
    orientation: 'square',
    filename:    'site-avatar-m1.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'professional woman portrait headshot',
    orientation: 'square',
    filename:    'site-avatar-f1.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
  {
    query:       'young man smiling portrait',
    orientation: 'square',
    filename:    'site-avatar-m2.jpg',
    section:     null,
    field:       null,
    sectionId:   null,
  },
]

async function searchPexels(query, orientation) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`
  const res  = await fetch(url, { headers: { Authorization: PEXELS_KEY } })
  if (!res.ok) throw new Error(`Pexels error ${res.status}`)
  const data = await res.json()
  const photo = data.photos?.[0]
  if (!photo) throw new Error(`No photos for: ${query}`)
  return photo.src.large2x || photo.src.large || photo.src.original
}

async function downloadFile(imageUrl, filename) {
  const dest = join(UPLOADS_DIR, filename)
  if (existsSync(dest)) {
    console.log(`[skip] Already exists: ${filename}`)
    return
  }
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${imageUrl}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buffer)
  console.log(`[ok] Downloaded: ${filename}`)
}

async function getSection(slug) {
  const res  = await fetch(`${API_BASE}/api/content/pages/home`)
  const home = await res.json()
  let section = home.sections?.find(s => s.slug === slug)
  if (section) return section

  for (const pageSlug of ['sobre', 'contacto']) {
    const r = await fetch(`${API_BASE}/api/content/pages/${pageSlug}`)
    const p = await r.json()
    section  = p.sections?.find(s => s.slug === slug)
    if (section) return section
  }
  return null
}

async function saveToSection(slug, field, localUrl) {
  const section = await getSection(slug)
  if (!section) { console.warn(`[warn] Section not found: ${slug}`); return }

  const res = await fetch(`${API_BASE}/api/content/sections/${section.id}/merge`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ content: { [field]: localUrl } }),
  })
  if (!res.ok) {
    const body = await res.text()
    console.warn(`[warn] Merge failed for ${slug}.${field}: ${res.status} ${body}`)
  } else {
    console.log(`[db] Saved ${slug}.${field} -> ${localUrl}`)
  }
}

async function main() {
  console.log('[start] Downloading site images...\n')

  for (const img of IMAGES) {
    try {
      const pexelsUrl = await searchPexels(img.query, img.orientation)
      await downloadFile(pexelsUrl, img.filename)

      const localUrl = `${API_BASE}/uploads/${img.filename}`

      // Register in media table
      try {
        await fetch(`${API_BASE}/api/media/register`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            filename:      img.filename,
            original_name: img.filename,
            mime_type:     'image/jpeg',
            url:           localUrl,
            category:      'site',
          }),
        })
      } catch { /* non-critical */ }

      if (img.section && img.field) {
        await saveToSection(img.section, img.field, localUrl)
      }
    } catch (err) {
      console.error(`[error] ${img.filename}: ${err.message}`)
    }
  }

  console.log('\n[done] All images processed.')
}

main()
