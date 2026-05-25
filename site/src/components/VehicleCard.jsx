import { useState } from 'react'
import Lightbox from './Lightbox'

function formatPrice(price) {
  if (!price) return 'Consultar'
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatMileage(km) {
  if (!km) return null
  return new Intl.NumberFormat('pt-PT').format(km) + ' km'
}

function Badge({ children }) {
  return (
    <span className="bg-light-bg text-brand-blue text-xs font-semibold
                     px-3 py-1 rounded-full whitespace-nowrap">
      {children}
    </span>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-center py-2
                    border-b border-gray-100 last:border-0">
      <span className="text-xs text-muted font-medium">{label}</span>
      <span className="text-xs text-brand-blue font-bold">{value}</span>
    </div>
  )
}

export default function VehicleCard({ vehicle }) {
  const [expanded, setExpanded] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const images = Array.isArray(vehicle.images)
    ? vehicle.images.filter(Boolean).slice(0, 10)
    : []
  const hasImgs = images.length > 0

  const waMsg = vehicle.whatsapp_message
    ? encodeURIComponent(vehicle.whatsapp_message)
    : encodeURIComponent(
        `Olá! Tenho interesse no ${vehicle.brand || ''} ${vehicle.model || ''} ${vehicle.year || ''}. Podem dar-me mais informações?`
      )

  const prevPhoto = () =>
    setPhotoIndex(p => (p - 1 + images.length) % images.length)
  const nextPhoto = () =>
    setPhotoIndex(p => (p + 1) % images.length)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft
                    card-hover group flex flex-col transition-all duration-300">

      {/* ── PHOTO GALLERY ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-dark-surface h-56 flex-shrink-0">
        {hasImgs ? (
          <>
            <img
              src={images[photoIndex]}
              alt={vehicle.name}
              onClick={() => setLightbox(true)}
              className="w-full h-full object-cover cursor-zoom-in
                         group-hover:scale-105 transition-transform duration-500"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prevPhoto() }}
                  className="absolute left-2 top-1/2 -translate-y-1/2
                             bg-black/50 hover:bg-black/70 text-white
                             w-8 h-8 rounded-full flex items-center justify-center
                             text-lg leading-none
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Foto anterior"
                >
                  ‹
                </button>
                <button
                  onClick={e => { e.stopPropagation(); nextPhoto() }}
                  className="absolute right-2 top-1/2 -translate-y-1/2
                             bg-black/50 hover:bg-black/70 text-white
                             w-8 h-8 rounded-full flex items-center justify-center
                             text-lg leading-none
                             opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  aria-label="Próxima foto"
                >
                  ›
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                              flex gap-1.5 flex-wrap justify-center max-w-32">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setPhotoIndex(i) }}
                    className={`rounded-full transition-all duration-200 ${
                      i === photoIndex
                        ? 'bg-white w-4 h-2'
                        : 'bg-white/50 w-2 h-2'
                    }`}
                    aria-label={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Photo counter */}
            <div className="absolute top-3 right-3 bg-black/50 text-white
                            text-xs font-semibold px-2 py-1 rounded-full">
              {photoIndex + 1}/{images.length}
            </div>

            <div className="absolute bottom-12 left-3 bg-black/50 text-white
                            text-xs px-2 py-1 rounded-lg opacity-0
                            group-hover:opacity-100 transition-opacity duration-200
                            pointer-events-none">
              Clique para ampliar
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-12 h-12 text-white/20" fill="none"
                 stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586
                   a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6
                   a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/30 text-xs">Sem fotos</span>
          </div>
        )}

        {/* Featured badge */}
        {vehicle.is_featured && (
          <div className="absolute top-3 left-3 bg-cta-gradient text-white
                          text-xs font-bold px-3 py-1 rounded-full shadow-glow-gold">
            Destaque
          </div>
        )}
      </div>

      {/* ── CARD BODY ─────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Title block */}
        <div>
          <p className="text-xs text-muted font-semibold uppercase tracking-wide">
            {[vehicle.brand, vehicle.year].filter(Boolean).join(' · ')}
          </p>
          <h3 className="text-brand-blue font-black text-lg leading-tight mt-0.5">
            {vehicle.name || [vehicle.brand, vehicle.model].filter(Boolean).join(' ')}
          </h3>
        </div>

        {/* Key specs row — Marca, Modelo, Ano, Combustível */}
        <div className="grid grid-cols-2 gap-2">
          {vehicle.brand && (
            <div className="bg-light-bg rounded-xl p-2.5">
              <p className="text-xs text-muted mb-0.5">Marca</p>
              <p className="text-xs font-bold text-brand-blue">{vehicle.brand}</p>
            </div>
          )}
          {vehicle.model && (
            <div className="bg-light-bg rounded-xl p-2.5">
              <p className="text-xs text-muted mb-0.5">Modelo</p>
              <p className="text-xs font-bold text-brand-blue truncate">{vehicle.model}</p>
            </div>
          )}
          {vehicle.year && (
            <div className="bg-light-bg rounded-xl p-2.5">
              <p className="text-xs text-muted mb-0.5">Ano</p>
              <p className="text-xs font-bold text-brand-blue">{vehicle.year}</p>
            </div>
          )}
          {vehicle.fuel && (
            <div className="bg-light-bg rounded-xl p-2.5">
              <p className="text-xs text-muted mb-0.5">Combustível</p>
              <p className="text-xs font-bold text-brand-blue">{vehicle.fuel}</p>
            </div>
          )}
        </div>

        {/* Extra badges */}
        {(vehicle.transmission || vehicle.mileage || vehicle.power) && (
          <div className="flex flex-wrap gap-1.5">
            {vehicle.transmission && <Badge>{vehicle.transmission}</Badge>}
            {vehicle.mileage && <Badge>{formatMileage(vehicle.mileage)}</Badge>}
            {vehicle.power && <Badge>{vehicle.power}</Badge>}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-brand-blue">
            {formatPrice(vehicle.price)}
          </span>
          {vehicle.color && (
            <span className="text-xs text-muted">{vehicle.color}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 border-2 border-brand-blue text-brand-blue font-bold
                       py-2.5 rounded-xl text-sm
                       hover:bg-brand-blue hover:text-white
                       transition-all duration-300"
          >
            {expanded ? 'Fechar' : 'Ver Detalhes'}
          </button>
          <a
            href={`https://wa.me/351932992377?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-cta-gradient text-white font-bold py-2.5
                       rounded-xl text-sm text-center
                       btn-glow hover:scale-105 transition-all duration-300"
          >
            Contactar
          </a>
        </div>

        {/* ── EXPANDED DETAILS ──────────────────────────── */}
        {expanded && (
          <div className="animate-fade-in space-y-4 pt-2
                          border-t border-gray-100">

            {/* Description */}
            {vehicle.description && (
              <p className="text-muted text-sm leading-relaxed">
                {vehicle.description}
              </p>
            )}

            {/* Full photo strip */}
            {images.length > 1 && (
              <div>
                <p className="text-xs font-bold text-brand-blue uppercase
                               tracking-wide mb-2">
                  Fotos ({images.length})
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {images.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`aspect-square rounded-lg overflow-hidden
                                  border-2 transition-all duration-200 ${
                        i === photoIndex
                          ? 'border-brand-gold'
                          : 'border-transparent hover:border-brand-blue/30'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Structured specs */}
            <div className="bg-light-bg rounded-xl p-4">
              <p className="text-xs font-bold text-brand-blue uppercase
                             tracking-wide mb-3">
                Especificações
              </p>
              <InfoRow label="Marca" value={vehicle.brand} />
              <InfoRow label="Modelo" value={vehicle.model} />
              <InfoRow label="Ano" value={vehicle.year} />
              <InfoRow label="Combustível" value={vehicle.fuel} />
              <InfoRow label="Transmissão" value={vehicle.transmission} />
              <InfoRow label="Quilometragem" value={formatMileage(vehicle.mileage)} />
              <InfoRow label="Potência" value={vehicle.power} />
              <InfoRow label="Cor" value={vehicle.color} />
            </div>

            {/* Extra info box — editable by client later */}
            <div className="border-2 border-dashed border-brand-blue/20
                            rounded-xl p-4 bg-white">
              <p className="text-xs font-bold text-brand-blue uppercase
                             tracking-wide mb-2">
                Informações Adicionais
              </p>
              {vehicle.extra_info &&
               Object.keys(vehicle.extra_info).length > 0 ? (
                <div className="space-y-0">
                  {Object.entries(vehicle.extra_info).map(([k, v]) => (
                    <InfoRow
                      key={k}
                      label={k.replace(/_/g, ' ')}
                      value={String(v)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted leading-relaxed">
                  Informações complementares a preencher pelo vendedor
                  — equipamentos, revisões, extras incluídos, etc.
                </p>
              )}
            </div>

            {/* Bottom WhatsApp CTA */}
            <a
              href={`https://wa.me/351932992377?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full
                         bg-cta-gradient text-white font-bold py-3
                         rounded-xl btn-glow hover:scale-105
                         transition-all duration-300 text-sm"
            >
              Pedir Informações no WhatsApp
            </a>
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={images}
          index={photoIndex}
          onClose={() => setLightbox(false)}
          onPrev={() => setPhotoIndex(p => (p - 1 + images.length) % images.length)}
          onNext={() => setPhotoIndex(p => (p + 1) % images.length)}
          onGoTo={i => setPhotoIndex(i)}
        />
      )}
    </div>
  )
}
