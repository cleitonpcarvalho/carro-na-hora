import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <img src="/assets/logo-dark.png" alt="Carro da Hora" className="h-14 w-auto object-contain mb-4" />
          <p className="text-white/70 text-sm leading-relaxed">
            O seu próximo automóvel está a um passo. Rapidez, confiança e transparência em cada negócio.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-brand-gold mb-4 tracking-wide uppercase text-sm">Navegação</h4>
          <ul className="space-y-2">
            {[
              { label: 'Principal', to: '/' },
              { label: 'Viaturas',  to: '/viaturas' },
              { label: 'Sobre Nós', to: '/sobre' },
              { label: 'Contacto',  to: '/contacto' },
            ].map(item => (
              <li key={item.to}>
                <Link to={item.to} className="text-white/70 hover:text-brand-gold text-sm transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-brand-gold mb-4 tracking-wide uppercase text-sm">Contacto</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li>
              <a
                href="https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold transition-colors duration-200"
              >
                Rua Quinta das Lavadeiras 8 B,<br />1750-239, Lisboa
              </a>
            </li>
            <li>
              <a href="tel:+351932992377" className="hover:text-brand-gold transition-colors duration-200">
                +351 932 992 377
              </a>
            </li>
            <li>
              <a href="mailto:perimetrodeeficacia@gmail.com" className="hover:text-brand-gold transition-colors duration-200">
                perimetrodeeficacia@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <span>© {year} Carro da Hora. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <Link to="/politica-de-privacidade" className="hover:text-brand-gold transition-colors duration-200">
              Política de Privacidade
            </Link>
            <span>·</span>
            <Link to="/termos-de-uso" className="hover:text-brand-gold transition-colors duration-200">
              Termos de Uso
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/30 text-xs">Feito com ❤️ por</span>
            <a
              href="https://site.effectidea.com/#portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src="/assets/effect-idea-logo.png"
                alt="Effect Idea"
                className="h-7 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
