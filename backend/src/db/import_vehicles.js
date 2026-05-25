import { readdir, stat, readFile } from 'fs/promises'
import { join, extname, basename } from 'path'

// ── CONFIG ────────────────────────────────────────────────────
const API_BASE    = 'http://localhost:3001'
const PHOTOS_DIR  = '/Users/cleitonpcarvalho/Downloads/fotos_carro_da_hora'
const ADMIN_EMAIL = 'perimetrodeeficacia@gmail.com'
const ADMIN_PASS  = 'Carrosdovasco2025@'

// ── VEHICLE DATA ──────────────────────────────────────────────
// folder name -> vehicle metadata
// Folder names are matched case-insensitively and with fuzzy logic
const VEHICLE_DATA = [
  {
    folder_match: 'carrinha familiar',
    name:         'Carrinha Familiar',
    brand:        'Desconhecida',
    model:        'Carrinha',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Manual',
    price:        7500,
    is_featured:  true,
    description:  'Carrinha familiar espaçosa e versátil, ideal para o dia a dia e viagens longas. Excelente capacidade de bagageira, consumos reduzidos e habitabilidade superior. Uma escolha inteligente para famílias que valorizam conforto e economia.',
  },
  {
    folder_match: 'ford s-max',
    name:         'Ford S-Max',
    brand:        'Ford',
    model:        'S-Max',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Manual',
    price:        5500,
    is_featured:  true,
    description:  'O Ford S-Max combina o dinamismo de um automóvel desportivo com a practicidade de uma monovolume. Sete lugares, suspensão refinada e tecnologia moderna fazem deste modelo uma referência no segmento familiar. Fiabilidade comprovada.',
  },
  {
    folder_match: 'opel astra marrom',
    name:         'Opel Astra Marrom',
    brand:        'Opel',
    model:        'Astra',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Manual',
    price:        9000,
    is_featured:  false,
    description:  'Opel Astra numa elegante tonalidade marrom, interior bem equipado e motor eficiente. Compacto urbano com personalidade, conforto nas viagens longas e custos de manutenção acessíveis. Uma viatura que alia estilo a practicidade quotidiana.',
  },
  {
    folder_match: 'opel astra 1.6 cdti',
    name:         'Opel Astra 1.6 CDTi',
    brand:        'Opel',
    model:        'Astra 1.6 CDTi',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Manual',
    price:        9000,
    is_featured:  false,
    description:  'O motor 1.6 CDTi oferece o equilíbrio perfeito entre potência e economia de combustível. Opel Astra com equipamento completo, caixa precisa e comportamento estradal seguro. Viatura inspecionada e pronta a circular sem qualquer preocupação.',
  },
  {
    folder_match: 'opel astra',
    name:         'Opel Astra',
    brand:        'Opel',
    model:        'Astra',
    year:         null,
    fuel:         'Gasolina',
    transmission: 'Manual',
    price:        4000,
    is_featured:  false,
    description:  'Clássico compacto europeu com baixo custo de utilização e manutenção simplificada. O Opel Astra é sinónimo de fiabilidade urbana. Perfeito para quem procura mobilidade sem complicações e com o máximo aproveitamento do orçamento disponível.',
  },
  {
    folder_match: 'nissan leaf',
    name:         'Nissan Leaf',
    brand:        'Nissan',
    model:        'Leaf',
    year:         null,
    fuel:         'Elétrico',
    transmission: 'Automático',
    price:        15000,
    is_featured:  true,
    description:  'Pioneiro dos elétricos acessíveis, o Nissan Leaf oferece autonomia generosa, zero emissões e custos de energia muito reduzidos. Interior moderno, tecnologia avançada e condução suave. A escolha inteligente para quem quer poupar e proteger o ambiente.',
  },
  {
    folder_match: 'bmw x1',
    name:         'BMW X1',
    brand:        'BMW',
    model:        'X1',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Automático',
    price:        17000,
    is_featured:  true,
    description:  'O BMW X1 representa o melhor da engenharia bávara num SUV compacto premium. Dinâmica de condução envolvente, acabamentos de luxo e versatilidade SUV. Posição de condução elevada com o prazer de conduzir que só a BMW consegue proporcionar.',
  },
  {
    folder_match: 'renault grande espace',
    name:         'Renault Grande Espace 4',
    brand:        'Renault',
    model:        'Grande Espace 4',
    year:         null,
    fuel:         'Diesel',
    transmission: 'Manual',
    price:        6000,
    is_featured:  false,
    description:  'A referência francesa em monovolumes de grande capacidade. Sete lugares reais, interior configurável e espaço generoso para toda a família. O Grande Espace 4 oferece conforto de viagem superior com um preço de acesso muito apelativo.',
  },
  {
    folder_match: 'mercedes',
    name:         'Mercedes-Benz C-180',
    brand:        'Mercedes-Benz',
    model:        'C-180',
    year:         null,
    fuel:         'Gasolina',
    transmission: 'Automático',
    price:        15000,
    is_featured:  true,
    description:  'Elegância e prestígio alemão ao seu alcance. O Mercedes-Benz C-180 oferece acabamentos premium, conforto excepcional e uma presença na estrada inconfundível. Motor suave, transmissão automática e tecnologia de bordo que eleva cada viagem.',
  },
  {
    folder_match: 'peugeot 208',
    name:         'Peugeot 208 1200cc Turbo',
    brand:        'Peugeot',
    model:        '208 1200cc Turbo',
    year:         null,
    fuel:         'Gasolina',
    transmission: 'Manual',
    price:        16000,
    is_featured:  true,
    description:  'O Peugeot 208 Turbo combina design arrojado com um motor soberbo em eficiência e desempenho. Habitáculo moderno com i-Cockpit, condução ágil e equipamento tecnológico de topo. A opção francesa que lidera o segmento B em estilo e inovação.',
  },
]

// ── HELPERS ───────────────────────────────────────────────────
function matchFolder(folderName, matchStr) {
  const normalize = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, '')
  const f = normalize(folderName)
  const m = normalize(matchStr)
  return f.includes(m)
}

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
}

async function getImages(dir) {
  try {
    const files = await readdir(dir)
    return files
      .filter(f => IMG_EXTS.has(extname(f).toLowerCase()))
      .map(f => join(dir, f))
      .slice(0, 10)
  } catch {
    return []
  }
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
  // 1. Login
  console.log('[import] Logging in...')
  const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }),
  })
  const { token } = await loginRes.json()
  if (!token) { console.error('[import] Login failed'); process.exit(1) }
  console.log('[import] Login OK')

  const authHeaders = { Authorization: `Bearer ${token}` }

  // 2. List top-level folders in PHOTOS_DIR
  const topLevel = await readdir(PHOTOS_DIR)
  const folders  = []
  for (const name of topLevel) {
    const fullPath = join(PHOTOS_DIR, name)
    const s = await stat(fullPath)
    if (s.isDirectory()) folders.push({ name, path: fullPath })
  }
  console.log(`[import] Found ${folders.length} folders:`, folders.map(f => f.name))

  // 3. Process each folder
  for (const folder of folders) {
    // Find matching vehicle data
    const vehicleData = VEHICLE_DATA.find(v => matchFolder(folder.name, v.folder_match))
    if (!vehicleData) {
      console.log(`[import] No match for folder "${folder.name}" — skipping`)
      continue
    }

    console.log(`\n[import] Processing: ${folder.name} -> ${vehicleData.name}`)

    // 4. Upload images
    const imgPaths = await getImages(folder.path)
    console.log(`[import]   Found ${imgPaths.length} images`)

    const uploadedUrls = []
    for (const imgPath of imgPaths) {
      try {
        const fd = new FormData()
        const buffer = await readFile(imgPath)
        const ext = extname(imgPath).toLowerCase()
        const mime = MIME_BY_EXT[ext] ?? 'application/octet-stream'
        const blob = new Blob([buffer], { type: mime })
        fd.set('file', blob, basename(imgPath))
        fd.set('category', 'viaturas')

        const BASE_URL = `${API_BASE}/api/media/upload`
        const upRes = await fetch(BASE_URL, {
          method:  'POST',
          headers: authHeaders,
          body:    fd,
        })
        const upData = await upRes.json().catch(async () => ({ error: await upRes.text() }))
        if (upData.url) {
          uploadedUrls.push(upData.url)
          console.log(`[import]   Uploaded: ${basename(imgPath)} -> ${upData.url}`)
        } else {
          console.warn(`[import]   Upload failed for ${basename(imgPath)}:`, upData)
        }
      } catch (err) {
        console.warn(`[import]   Error uploading ${basename(imgPath)}:`, err.message)
      }
    }

    // 5. Create vehicle record
    const { folder_match, ...vehiclePayload } = vehicleData
    const payload = {
      ...vehiclePayload,
      images: uploadedUrls,
      whatsapp_message: `Olá! Tenho interesse no ${vehicleData.name} por €${vehicleData.price?.toLocaleString('pt-PT')}. Podem dar-me mais informações?`,
    }

    const createRes = await fetch(`${API_BASE}/api/vehicles`, {
      method:  'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const created = await createRes.json()
    if (created.id) {
      console.log(`[import]   Vehicle created: ID ${created.id} — ${created.name}`)
    } else {
      console.error(`[import]   Failed to create vehicle:`, created)
    }
  }

  console.log('\n[import] Done.')
}

main().catch(err => {
  console.error('[import] Fatal error:', err)
  process.exit(1)
})
