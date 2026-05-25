import { useEffect, useCallback } from 'react'
import { createPortal }           from 'react-dom'

export default function Lightbox({ images, index, onClose, onPrev, onNext, onGoTo }) {
  const handleKey = useCallback(e => {
    if (e.key === 'Escape')     onClose()
    if (e.key === 'ArrowLeft')  onPrev()
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

  return createPortal(
    <div
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        backgroundColor: 'rgba(0,0,0,0.96)',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
      }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        style={{
          position:       'absolute',
          top:            0,
          left:           0,
          right:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '16px 20px',
          background:     'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          zIndex:         10,
        }}
        onClick={e => e.stopPropagation()}
      >
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          style={{
            background:   'rgba(255,255,255,0.15)',
            border:       'none',
            borderRadius: '50%',
            width:        40,
            height:       40,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            cursor:       'pointer',
            color:        'white',
            fontSize:     20,
            lineHeight:   1,
          }}
        >
          ×
        </button>
      </div>

      {/* Main image */}
      <div
        style={{
          flex:           1,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          width:          '100%',
          padding:        '60px 70px',
          boxSizing:      'border-box',
        }}
        onClick={e => e.stopPropagation()}
      >
        <img
          key={index}
          src={images[index]}
          alt={`Foto ${index + 1}`}
          style={{
            maxWidth:   '100%',
            maxHeight:  'calc(100vh - 160px)',
            objectFit:  'contain',
            borderRadius: 12,
            boxShadow:  '0 25px 60px rgba(0,0,0,0.5)',
            display:    'block',
          }}
          onError={e => { e.target.style.opacity = '0.3' }}
        />
      </div>

      {/* Prev arrow */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          style={{
            position:       'absolute',
            left:           12,
            top:            '50%',
            transform:      'translateY(-50%)',
            background:     'rgba(255,255,255,0.12)',
            border:         'none',
            borderRadius:   '50%',
            width:          52,
            height:         52,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            color:          'white',
            fontSize:       28,
            lineHeight:     1,
            zIndex:         10,
            transition:     'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          ‹
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          style={{
            position:       'absolute',
            right:          12,
            top:            '50%',
            transform:      'translateY(-50%)',
            background:     'rgba(255,255,255,0.12)',
            border:         'none',
            borderRadius:   '50%',
            width:          52,
            height:         52,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            cursor:         'pointer',
            color:          'white',
            fontSize:       28,
            lineHeight:     1,
            zIndex:         10,
            transition:     'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          ›
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          style={{
            position:       'absolute',
            bottom:         0,
            left:           0,
            right:          0,
            background:     'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            padding:        '20px 16px 16px',
            display:        'flex',
            justifyContent: 'center',
            gap:            8,
            flexWrap:       'wrap',
            zIndex:         10,
          }}
          onClick={e => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); onGoTo(i) }}
              style={{
                width:        52,
                height:       52,
                borderRadius: 8,
                overflow:     'hidden',
                border:       i === index ? '2px solid rgb(242,142,35)' : '2px solid rgba(255,255,255,0.2)',
                cursor:       'pointer',
                padding:      0,
                background:   'none',
                transform:    i === index ? 'scale(1.1)' : 'scale(1)',
                transition:   'all 0.2s',
                flexShrink:   0,
              }}
            >
              <img
                src={url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}
