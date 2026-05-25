import { useState } from 'react'

function formatPrice(price) {
  if (!price) return 'Consultar'
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

function formatMileage(km) {
  if (!km) return null
  return new Intl.NumberFormat('pt-PT').format(km) + ' km'
}

export default function VehicleCard({ vehicle }) {
  const [expanded, setExpanded] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const images = Array.isArray(vehicle.images) ? vehicle.images.filter(Boolean) : []
  const hasImgs = images.length > 0

  const waMsg = vehicle.whatsapp_message
    ? encodeURIComponent(vehicle.whatsapp_message)
    : encodeURIComponent(
        `Olá! Tenho interesse no ${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.year || ''}. Podem dar-me mais informações?`
      )

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-soft card-hover group
                     transition-all duration-300 ${expanded ? 'md:col-span-1' : ''}`}>
      <div className="relative overflow-hidden bg-dark-surface h-56">
        {hasImgs ? (
          <>
            <img
              src={images[photoIndex]}
              alt={vehicle.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.slice(0, 10).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      i === photoIndex ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex(p => (p - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60
                             text-white w-8 h-8 rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ‹
                </button>
                <button
                  onClick={() => setPhotoIndex(p => (p + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60
                             text-white w-8 h-8 rounded-full flex items-center justify-center
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {vehicle.is_featured && (
          <div className="absolute top-3 left-3 bg-cta-gradient text-white text-xs font-bold
                          px-3 py-1 rounded-full shadow-glow-gold">
            Destaque
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide">
            {vehicle.brand} {vehicle.year && `· ${vehicle.year}`}
          </p>
          <h3 className="text-brand-blue font-black text-xl leading-tight mt-0.5">
            {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {vehicle.fuel && (
            <span className="bg-light-bg text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              {vehicle.fuel}
            </span>
          )}
          {vehicle.transmission && (
            <span className="bg-light-bg text-brand-blue text-xs font-semibold px-3 py-1 rounded-full">
              {vehicle.transmission}
            </span>
          )}
          {vehicle.mileage && (
            <span className="bg-light-bg text-muted text-xs font-semibold px-3 py-1 rounded-full">
              {formatMileage(vehicle.mileage)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-black text-brand-blue">{formatPrice(vehicle.price)}</span>
          {vehicle.power && (
            <span className="text-xs text-muted">{vehicle.power}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 border-2 border-brand-blue text-brand-blue font-bold py-2.5 rounded-xl
                       hover:bg-brand-blue hover:text-white transition-all duration-300 text-sm"
          >
            {expanded ? 'Fechar Detalhes' : 'Ver Detalhes'}
          </button>
          <a
            href={`https://wa.me/351932992377?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-cta-gradient text-white font-bold py-2.5 rounded-xl
                       btn-glow hover:scale-105 transition-all duration-300 text-sm text-center"
          >
            Contactar
          </a>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
            {vehicle.description && (
              <p className="text-muted text-sm leading-relaxed mb-4">{vehicle.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              {vehicle.color && (
                <div className="bg-light-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Cor</p>
                  <p className="text-brand-blue font-semibold text-sm">{vehicle.color}</p>
                </div>
              )}
              {vehicle.year && (
                <div className="bg-light-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Ano</p>
                  <p className="text-brand-blue font-semibold text-sm">{vehicle.year}</p>
                </div>
              )}
              {vehicle.fuel && (
                <div className="bg-light-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Combustível</p>
                  <p className="text-brand-blue font-semibold text-sm">{vehicle.fuel}</p>
                </div>
              )}
              {vehicle.mileage && (
                <div className="bg-light-bg rounded-lg p-3">
                  <p className="text-xs text-muted">Quilometragem</p>
                  <p className="text-brand-blue font-semibold text-sm">{formatMileage(vehicle.mileage)}</p>
                </div>
              )}
            </div>

            {vehicle.extra_info && Object.keys(vehicle.extra_info).length > 0 && (
              <div className="bg-light-bg rounded-xl p-4">
                <p className="text-xs font-bold text-brand-blue uppercase tracking-wide mb-3">
                  Informações Adicionais
                </p>
                {Object.entries(vehicle.extra_info).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-muted capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="text-brand-blue font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
