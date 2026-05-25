import { useEffect, useCallback } from 'react'

export default function Lightbox({ images, index, onClose, onPrev, onNext, onGoTo }) {
  const handleKey = useCallback(e => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!images || images.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white
                   bg-white/10 hover:bg-white/20 w-11 h-11 rounded-full
                   flex items-center justify-center transition-all duration-200 z-10"
        aria-label="Fechar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute top-5 left-1/2 -translate-x-1/2
                      bg-black/60 text-white text-sm font-semibold
                      px-4 py-1.5 rounded-full z-10">
        {index + 1} / {images.length}
      </div>

      <div
        className="relative max-w-5xl w-full px-16 flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Foto ${index + 1}`}
          className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
          onError={e => { e.target.src = '' }}
        />
      </div>

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2
                     bg-white/10 hover:bg-white/25 text-white
                     w-12 h-12 rounded-full flex items-center justify-center
                     transition-all duration-200 text-2xl z-10"
          aria-label="Anterior"
        >‹</button>
      )}

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2
                     bg-white/10 hover:bg-white/25 text-white
                     w-12 h-12 rounded-full flex items-center justify-center
                     transition-all duration-200 text-2xl z-10"
          aria-label="Seguinte"
        >›</button>
      )}

      {images.length > 1 && (
        <div
          className="absolute bottom-5 left-1/2 -translate-x-1/2
                     flex gap-2 flex-wrap justify-center max-w-2xl px-4"
          onClick={e => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); onGoTo(i) }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2
                          transition-all duration-200 flex-shrink-0 ${
                i === index
                  ? 'border-brand-gold scale-110'
                  : 'border-white/20 hover:border-white/50'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
