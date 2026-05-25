import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { label: 'Principal', to: '/' },
  { label: 'Sobre Nós', to: '/sobre' },
  { label: 'Viaturas',  to: '/viaturas' },
  { label: 'Contacto',  to: '/contacto' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={(scrolled || !isHome) ? '/assets/logo.png' : '/assets/logo-dark.png'}
            alt="Carro da Hora"
            className="h-12 w-auto object-contain transition-all duration-300"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold tracking-wide transition-all duration-200 relative group ${
                scrolled || !isHome ? 'text-brand-blue' : 'text-white'
              } ${location.pathname === item.to ? 'text-brand-gold' : ''}`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${
                location.pathname === item.to ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
          <a
            href="https://wa.me/351932992377?text=Ol%C3%A1!%20Estou%20a%20visitar%20o%20site%20e%20quero%20apoio%20para%20escolher%20uma%20viatura."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cta-gradient text-white text-sm font-bold px-5 py-2.5 rounded-lg btn-glow transition-all duration-300 hover:scale-105"
          >
            Contactar
          </a>
        </nav>

        <button
          className={`md:hidden p-2 ${scrolled || !isHome ? 'text-brand-blue' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white shadow-hover border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {NAV.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-semibold text-brand-blue py-2 border-b border-gray-100 ${
                location.pathname === item.to ? 'text-brand-gold' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://wa.me/351932992377?text=Ol%C3%A1!%20Estou%20no%20menu%20m%C3%B3vel%20e%20quero%20falar%20convosco%20sobre%20uma%20viatura."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cta-gradient text-white text-sm font-bold px-5 py-3 rounded-lg text-center"
          >
            Contactar via WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
