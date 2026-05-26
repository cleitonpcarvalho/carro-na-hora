import { Link }              from 'react-router-dom'
import { useVehicles }       from '../hooks/useVehicles'
import { usePexels }         from '../hooks/usePexels'
import { useSectionImage }   from '../hooks/useSectionImage'
import { usePageContent }    from '../hooks/usePageContent'
import VehicleCard           from '../components/VehicleCard'

function HeroSection({ get }) {
  const { url: heroBg, loading } = useSectionImage({
    pageSlug:      'home',
    sectionSlug:   'hero',
    field:         'background_image',
    fallbackQuery: 'luxury car showroom night',
    orientation:   'landscape',
    size:          'large2x',
  })

  const headline    = get('hero', 'headline',          'O Seu Próximo Automóvel Na Hora Certa.')
  const subheadline = get('hero', 'subheadline',       'Acesso exclusivo a viaturas premium selecionadas com rigor.')
  const ctaPrimary  = get('hero', 'cta_primary_text',  'Ver Viaturas Disponíveis')
  const ctaPrimaryUrl = get('hero', 'cta_primary_url', '/viaturas')
  const ctaSecondary = get('hero', 'cta_secondary_text', 'Falar no WhatsApp')

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: loading || !heroBg
          ? 'linear-gradient(135deg, rgb(0,36,71) 0%, rgb(16,16,16) 100%)'
          : undefined,
      }}
    >
      {heroBg && !loading && (
        <>
          <img src={heroBg} alt="Hero background"
               className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0"
               style={{ background: 'rgba(0,24,50,0.88)' }} />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="inline-block bg-brand-gold/20 border border-brand-gold/40
                        text-brand-gold text-xs font-bold uppercase tracking-widest
                        px-4 py-2 rounded-full mb-8 animate-fade-in">
          Stand Premium em Lisboa
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
          {headline.includes('Na Hora Certa') ? (
            <>
              {headline.replace('Na Hora Certa.', '').trim()}<br />
              <span className="text-gradient-gold">Na Hora Certa.</span>
            </>
          ) : headline}
        </h1>

        <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10
                      leading-relaxed animate-fade-up"
           style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}>
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
             style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <Link to={ctaPrimaryUrl}
                className="bg-cta-gradient text-white font-bold px-8 py-4 rounded-xl
                           btn-glow hover:scale-105 transition-all duration-300 text-base">
            {ctaPrimary}
          </Link>
          <a href="https://wa.me/351932992377?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20as%20viaturas%20disponíveis."
             target="_blank" rel="noopener noreferrer"
             className="bg-glass border border-white/20 text-white font-bold px-8 py-4
                        rounded-xl hover:bg-white/15 transition-all duration-300 text-base">
            {ctaSecondary}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up"
             style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
          {[
            { value: '100+', label: 'Viaturas Vendidas' },
            { value: '48h',  label: 'Tempo Médio de Negócio' },
            { value: '5★',   label: 'Avaliação dos Clientes' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-gradient-gold">{stat.value}</div>
              <div className="text-white/60 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

function FeaturedVehicles({ get }) {
  const { vehicles, loading } = useVehicles(true)
  if (!loading && vehicles.length === 0) return null

  return (
    <section className="section-padding bg-light-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">
            Seleção Exclusiva
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2 mb-4">
            {get('featured_vehicles', 'title', 'Viaturas em Destaque')}
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            {get('featured_vehicles', 'subtitle', 'Uma seleção criteriosa de automóveis prontos para si.')}
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/viaturas"
                className="inline-block border-2 border-brand-blue text-brand-blue font-bold
                           px-8 py-4 rounded-xl hover:bg-brand-blue hover:text-white
                           transition-all duration-300">
            Ver Todas as Viaturas
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhyUsSection({ get }) {
  const { url: bgUrl } = usePexels('luxury car dealership interior', 'large', 'landscape')

  const features = [
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955
                 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824
                 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      title: 'Transparência Total',
      desc:  'Todas as viaturas com historial verificado. Sem surpresas, sem letras pequenas.',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z" />,
      title: 'Negociação Rápida',
      desc:  'Do primeiro contacto à chave na mão em tempo recorde. Valorizamos o seu tempo.',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0
                 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0
                 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1
                 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1
                 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0
                 00.951-.69l1.519-4.674z" />,
      title: 'Seleção Premium',
      desc:  'Cada automóvel é escolhido com critério. Só chegam até si viaturas que passam nos nossos padrões.',
    },
    {
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636
                 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5
                 0a4 4 0 11-8 0 4 4 0 018 0z" />,
      title: 'Apoio Personalizado',
      desc:  'A nossa equipa acompanha-o do início ao fim. Disponíveis para cada dúvida.',
    },
  ]

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        {bgUrl && <img src={bgUrl} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">
            As Nossas Vantagens
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2 mb-4">
            {get('why_us', 'title', 'Porquê Escolher a Carro da Hora?')}
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            {get('why_us', 'subtitle', 'Não somos apenas um stand. Somos o elo entre si e o automóvel que merece.')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-light-bg rounded-2xl p-8 card-hover group">
              <div className="w-14 h-14 bg-brand-blue rounded-xl flex items-center
                              justify-center mb-5 group-hover:bg-brand-gold transition-colors duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-brand-blue font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Escolha a Sua Viatura',    desc: 'Explore o nosso portefólio online ou visite-nos pessoalmente. Temos uma selecção criteriosa de viaturas premium prontas a ser testadas.' },
    { num: '02', title: 'Contacte-nos Directamente', desc: 'Fale connosco por WhatsApp, telefone ou email. Respondemos rapidamente e esclarecemos todas as suas dúvidas sem compromisso.' },
    { num: '03', title: 'Negocie sem Pressão',       desc: 'Acreditamos numa negociação transparente e justa. Sem letras pequenas, sem surpresas — o preço apresentado é o preço real.' },
    { num: '04', title: 'Chave na Mão',              desc: 'Tratamos de toda a documentação necessária. Da primeira visita à chave na mão, o processo é simples, rápido e descomplicado.' },
  ]

  return (
    <section className="section-padding bg-light-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Como Funciona</span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2 mb-4">
            Simples, Rápido e Transparente
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Comprar um automóvel connosco é um processo descomplicado. Veja como funciona em quatro passos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5
                                bg-gradient-to-r from-brand-gold/40 to-transparent z-0" />
              )}
              <div className="bg-white rounded-2xl p-7 shadow-soft card-hover relative z-10">
                <div className="w-14 h-14 bg-cta-gradient rounded-2xl flex items-center
                                justify-center mb-5 shadow-glow-gold">
                  <span className="text-white font-black text-lg">{step.num}</span>
                </div>
                <h3 className="text-brand-blue font-black text-base mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const { url: cityUrl } = usePexels('lisbon portugal aerial view', 'large2x', 'landscape')

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            {cityUrl ? (
              <img src={cityUrl} alt="Lisboa"
                   className="rounded-2xl shadow-hover w-full h-80 object-cover" />
            ) : (
              <div className="rounded-2xl bg-light-bg w-full h-80" />
            )}
            <div className="absolute -bottom-5 -right-5 bg-cta-gradient
                            text-white rounded-2xl p-5 shadow-glow-gold">
              <p className="text-3xl font-black">Lisboa</p>
              <p className="text-white/80 text-xs mt-1">Capital de Portugal</p>
            </div>
          </div>
          <div>
            <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">
              A Nossa Localização
            </span>
            <h2 className="text-4xl font-black text-brand-blue mt-2 mb-5 leading-tight">
              No Coração de Lisboa, Prontos para Si
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              Situados numa localização privilegiada em Lisboa, a Carro da Hora está acessível
              de qualquer ponto da cidade. O nosso espaço moderno e confortável foi pensado para
              que a sua visita seja uma experiência agradável, sem pressão e ao seu ritmo.
            </p>
            <p className="text-muted leading-relaxed mb-8">
              Visite-nos pessoalmente ou contacte-nos primeiro — estamos disponíveis para
              responder a todas as suas questões antes de se deslocar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 border-2 border-brand-blue text-brand-blue
                            font-bold px-6 py-3 rounded-xl hover:bg-brand-blue hover:text-white
                            transition-all duration-300">
                Ver no Mapa
              </a>
              <a href="tel:+351932992377"
                 className="inline-flex items-center gap-2 bg-cta-gradient text-white font-bold
                            px-6 py-3 rounded-xl btn-glow hover:scale-105 transition-all duration-300">
                Ligar Agora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection({ get }) {
  const { url: avatarM1 } = usePexels('professional man portrait headshot',   'small', 'square')
  const { url: avatarF1 } = usePexels('professional woman portrait headshot', 'small', 'square')
  const { url: avatarM2 } = usePexels('young man smiling portrait',           'small', 'square')

  const testimonials = [
    { name: 'Miguel Ferreira', text: 'Processo incrivelmente rápido. Em menos de 48 horas tinha o meu carro novo. Recomendo a todos.', stars: 5, gender: 'M1' },
    { name: 'Ana Sousa',       text: 'Excelente atendimento, total transparência no processo. Voltarei certamente para o próximo automóvel.', stars: 5, gender: 'F1' },
    { name: 'Carlos Mendes',   text: 'Encontrei exactamente o que procurava ao melhor preço. A equipa foi fantástica do início ao fim.', stars: 5, gender: 'M2' },
  ]

  const avatarMap = { M1: avatarM1, F1: avatarF1, M2: avatarM2 }

  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full translate-x-1/2 translate-y-1/2" />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            {get('testimonials', 'title', 'O Que Dizem os Nossos Clientes')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.name} className="bg-glass rounded-2xl p-8 card-hover">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-brand-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0
                             00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0
                             00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1
                             1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1
                             1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0
                             00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                {avatarMap[t.gender] ? (
                  <img src={avatarMap[t.gender]} alt={t.name}
                       className="w-11 h-11 rounded-full object-cover border-2 border-brand-gold/40"
                       onError={e => { e.target.style.display = 'none' }} />
                ) : (
                  <div className="w-11 h-11 bg-brand-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-gold font-bold">{t.name[0]}</span>
                  </div>
                )}
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">Cliente verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ get }) {
  const { url: bgUrl } = useSectionImage({
    pageSlug:      'home',
    sectionSlug:   'cta_banner',
    field:         'background_image',
    fallbackQuery: 'car keys handover dealership',
    orientation:   'landscape',
    size:          'large2x',
  })

  return (
    <section className="relative section-padding overflow-hidden">
      {bgUrl ? (
        <>
          <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(0,24,50,0.92)' }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-hero-gradient" />
      )}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          {get('cta_banner', 'title', 'Pronto para Encontrar o Seu Automóvel?').includes('Automóvel?') ? (
            <>
              Pronto para Encontrar<br />
              <span className="text-gradient-gold">o Seu Automóvel?</span>
            </>
          ) : get('cta_banner', 'title', 'Pronto para Encontrar o Seu Automóvel?')}
        </h2>
        <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
          {get('cta_banner', 'subtitle', 'A negociação mais rápida de Lisboa começa aqui.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/351932992377?text=Quero%20encontrar%20o%20meu%20próximo%20automóvel.%20Podem%20ajudar-me?"
             target="_blank" rel="noopener noreferrer"
             className="bg-cta-gradient text-white font-bold px-10 py-4 rounded-xl
                        btn-glow hover:scale-105 transition-all duration-300 text-base">
            {get('cta_banner', 'cta_text', 'Contactar via WhatsApp')}
          </a>
          <Link to="/viaturas"
                className="bg-glass border border-white/20 text-white font-bold px-10 py-4
                           rounded-xl hover:bg-white/15 transition-all duration-300 text-base">
            Explorar Viaturas
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const { get } = usePageContent('home')

  return (
    <>
      <HeroSection    get={get} />
      <FeaturedVehicles get={get} />
      <WhyUsSection   get={get} />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection get={get} />
      <CTASection     get={get} />
    </>
  )
}
