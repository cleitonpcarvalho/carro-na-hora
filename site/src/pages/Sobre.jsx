import { usePexels }         from '../hooks/usePexels'
import { useSectionImage }   from '../hooks/useSectionImage'
import { usePageContent }    from '../hooks/usePageContent'

function SobreGallerySection() {
  const { url: img1 } = usePexels('car showroom luxury interior',    'large', 'landscape')
  const { url: img2 } = usePexels('car salesman customer handshake', 'large', 'landscape')
  const { url: img3 } = usePexels('car keys close up premium',       'large', 'portrait')

  return (
    <section className="section-padding bg-light-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">O Nosso Espaço</span>
          <h2 className="text-4xl font-black text-brand-blue mt-2 mb-4">Venha Conhecer-nos</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Um ambiente moderno e acolhedor onde cada cliente é tratado com a atenção e o respeito que merece.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[img1, img2, img3].map((url, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-soft card-hover">
              {url ? (
                <img src={url} alt={`Espaço Carro da Hora ${i + 1}`} className="w-full h-56 object-cover" />
              ) : (
                <div className="w-full h-56 bg-white" />
              )}
            </div>
          ))}
        </div>
        <div className="bg-brand-blue rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-black text-white mb-3">Pronto para Visitar-nos?</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Rua Quinta das Lavadeiras 8 B, 1750-239, Lisboa. Estamos abertos e prontos para o receber.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9" target="_blank" rel="noopener noreferrer"
               className="bg-glass border border-white/20 text-white font-bold px-7 py-3
                          rounded-xl hover:bg-white/15 transition-all duration-300">
              Abrir no Google Maps
            </a>
            <a href="https://wa.me/351932992377?text=Olá!%20Gostaria%20de%20visitar%20o%20stand%20da%20Carro%20da%20Hora."
               target="_blank" rel="noopener noreferrer"
               className="bg-cta-gradient text-white font-bold px-7 py-3 rounded-xl
                          btn-glow hover:scale-105 transition-all duration-300">
              Marcar Visita
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Sobre() {
  const { get } = usePageContent('sobre')

  const { url: heroUrl } = useSectionImage({
    pageSlug:      'sobre',
    sectionSlug:   'about_hero',
    field:         'background_image',
    fallbackQuery: 'luxury car showroom portugal',
    orientation:   'landscape',
    size:          'large2x',
  })

  const { url: teamUrl } = useSectionImage({
    pageSlug:      'sobre',
    sectionSlug:   'about_story',
    field:         'image',
    fallbackQuery: 'car dealership professional team',
    orientation:   'landscape',
    size:          'large',
  })

  const { url: carUrl } = usePexels('premium car detail close up', 'large', 'portrait')

  const values = [
    { title: 'Confiança', description: 'A nossa reputação é construída negócio a negócio, cliente a cliente. Cada transacção é tratada com o mesmo rigor e dedicação, independentemente do valor envolvido.' },
    { title: 'Rapidez',   description: 'Sabemos que o seu tempo é precioso. Por isso, tornámos o processo de compra tão ágil quanto possível — sem burocracia desnecessária, sem esperas intermináveis.' },
    { title: 'Qualidade', description: 'Não comprometemos nos padrões. Cada viatura é verificada e avaliada com rigor antes de entrar no nosso portefólio.' },
  ]

  return (
    <>
      <section className="relative pt-36 pb-24 overflow-hidden">
        {heroUrl ? (
          <>
            <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(0,24,50,0.88)' }} />
          </>
        ) : (
          <div className="absolute inset-0 bg-brand-blue" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Quem Somos</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-2 mb-4">
            {get('about_hero', 'title', 'Sobre a Carro da Hora')}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {get('about_hero', 'subtitle', 'Uma história construída sobre confiança, velocidade e paixão genuína por automóveis.')}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">A Nossa História</span>
              <h2 className="text-4xl font-black text-brand-blue mt-2 mb-6 leading-tight">
                {get('about_story', 'title', 'Nascemos para Simplificar a Compra do Seu Automóvel')}
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>{get('about_story', 'text', 'Na Carro da Hora, acreditamos que comprar um automóvel deve ser uma experiência positiva.')}</p>
              </div>
              <a href="https://wa.me/351932992377?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Carro%20da%20Hora."
                 target="_blank" rel="noopener noreferrer"
                 className="inline-block mt-8 bg-cta-gradient text-white font-bold px-8 py-4
                            rounded-xl btn-glow hover:scale-105 transition-all duration-300">
                Fale Connosco
              </a>
            </div>
            <div className="relative">
              {teamUrl ? (
                <img src={teamUrl} alt="Equipa Carro da Hora"
                     className="rounded-2xl shadow-hover w-full h-96 object-cover" />
              ) : (
                <div className="rounded-2xl bg-light-bg w-full h-96" />
              )}
              <div className="absolute -bottom-6 -left-6 bg-brand-blue text-white rounded-2xl p-6 shadow-hover">
                <div className="text-3xl font-black text-gradient-gold">5★</div>
                <div className="text-sm text-white/70 mt-1">Avaliação dos Clientes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">O Que Nos Move</span>
            <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2">
              {get('about_values', 'title', 'Os Nossos Valores')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-soft card-hover">
                <div className="w-12 h-12 bg-cta-gradient rounded-xl flex items-center justify-center mb-5">
                  <span className="text-white font-black text-lg">{i + 1}</span>
                </div>
                <h3 className="text-brand-blue font-black text-xl mb-3">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Os Nossos Números</span>
            <h2 className="text-4xl font-black text-brand-blue mt-2">Resultados que Falam por Si</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '100+', label: 'Viaturas Vendidas',    sub: 'e a crescer' },
              { value: '48h',  label: 'Tempo Médio de Fecho', sub: 'do 1.º contacto à chave' },
              { value: '5★',   label: 'Avaliação Média',      sub: 'pelos nossos clientes' },
              { value: '100%', label: 'Transparência',        sub: 'sem letras pequenas' },
            ].map(stat => (
              <div key={stat.label} className="bg-light-bg rounded-2xl p-8 text-center card-hover">
                <p className="text-4xl font-black text-gradient-gold mb-1">{stat.value}</p>
                <p className="text-brand-blue font-bold text-sm">{stat.label}</p>
                <p className="text-muted text-xs mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SobreGallerySection />

      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {carUrl && <img src={carUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Venha Conhecer-nos</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Estamos em Lisboa, prontos para o receber e mostrar-lhe as melhores viaturas do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9" target="_blank" rel="noopener noreferrer"
               className="bg-glass border border-white/20 text-white font-bold px-8 py-4
                          rounded-xl hover:bg-white/15 transition-all duration-300">
              Ver no Mapa
            </a>
            <a href="tel:+351932992377"
               className="bg-cta-gradient text-white font-bold px-8 py-4 rounded-xl
                          btn-glow hover:scale-105 transition-all duration-300">
              Ligar Agora
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
