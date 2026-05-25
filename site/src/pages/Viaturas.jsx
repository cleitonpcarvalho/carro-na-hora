import { useState, useMemo } from 'react'
import { useVehicles } from '../hooks/useVehicles'
import { usePexels } from '../hooks/usePexels'
import VehicleCard from '../components/VehicleCard'

const FUELS = ['Todos', 'Gasolina', 'Diesel', 'Híbrido', 'Elétrico', 'GPL']
const YEARS = ['Todos', '2024', '2023', '2022', '2021', '2020', '2019', 'Anterior a 2019']

export default function Viaturas() {
  const { vehicles, loading } = useVehicles(false)
  const { url: heroBg } = usePexels('car dealership showroom', 'large2x', 'landscape')

  const [search, setSearch] = useState('')
  const [fuelFilter, setFuelFilter] = useState('Todos')
  const [yearFilter, setYearFilter] = useState('Todos')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let list = [...vehicles]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(v =>
        [v.name, v.brand, v.model].some(s => s?.toLowerCase().includes(q))
      )
    }
    if (fuelFilter !== 'Todos') {
      list = list.filter(v => v.fuel === fuelFilter)
    }
    if (yearFilter !== 'Todos') {
      if (yearFilter === 'Anterior a 2019') {
        list = list.filter(v => v.year && v.year < 2019)
      } else {
        list = list.filter(v => String(v.year) === yearFilter)
      }
    }
    if (sortBy === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return list
  }, [vehicles, search, fuelFilter, yearFilter, sortBy])

  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        {heroBg && (
          <>
            <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/96 to-dark-bg/98" />
          </>
        )}
        {!heroBg && <div className="absolute inset-0 bg-hero-gradient" />}

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">
            O Nosso Portefólio
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-2 mb-4">
            Todas as Viaturas
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Encontre o automóvel ideal para si. Filtre por combustível,
            ano ou preço e contacte-nos directamente.
          </p>
        </div>
      </section>

      <section className="bg-white shadow-soft sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Pesquisar por marca ou modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                       focus:outline-none focus:border-brand-blue-2 transition-colors duration-200"
          />
          <select
            value={fuelFilter}
            onChange={e => setFuelFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-blue
                       focus:outline-none focus:border-brand-blue-2 bg-white"
          >
            {FUELS.map(f => <option key={f}>{f}</option>)}
          </select>
          <select
            value={yearFilter}
            onChange={e => setYearFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-blue
                       focus:outline-none focus:border-brand-blue-2 bg-white"
          >
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-blue
                       focus:outline-none focus:border-brand-blue-2 bg-white"
          >
            <option value="newest">Mais Recentes</option>
            <option value="price-asc">Preço: Menor para Maior</option>
            <option value="price-desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-brand-blue mb-2">Nenhuma viatura encontrada</h3>
              <p className="text-muted text-sm">Tente ajustar os filtros ou contacte-nos directamente.</p>
              <a
                href="https://wa.me/351932992377?text=Ol%C3%A1!%20N%C3%A3o%20encontrei%20a%20viatura%20que%20procuro.%20Podem%20ajudar-me?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 bg-cta-gradient text-white font-bold px-8 py-3
                           rounded-xl btn-glow hover:scale-105 transition-all duration-300"
              >
                Falar Connosco
              </a>
            </div>
          ) : (
            <>
              <p className="text-muted text-sm mb-8">
                {filtered.length} viatura{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
