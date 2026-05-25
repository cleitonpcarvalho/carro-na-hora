import { useVehicles } from '../hooks/useVehicles'
import { usePexels }   from '../hooks/usePexels'
import { Link }        from 'react-router-dom'
import VehicleCard     from '../components/VehicleCard'

function HeroSection() {
  const { url: heroBg, loading } = usePexels('luxury car showroom night', 'large2x', 'landscape')

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
          <img
            src={heroBg}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/95 via-brand-blue/85 to-dark-bg/98" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div
          className="inline-block bg-brand-gold/20 border border-brand-gold/40 text-brand-gold
                     text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8
                     animate-fade-in"
        >
          Stand Premium em Lisboa
        </div>

        <h1
          className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fade-up"
          style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}
        >
          O Seu Próximo Automóvel<br />
          <span className="text-gradient-gold">Na Hora Certa.</span>
        </h1>

        <p
          className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.25s', opacity: 0, animationFillMode: 'forwards' }}
        >
          Acesso exclusivo a viaturas premium selecionadas com rigor.
          Rapidez na negociação, transparência em cada detalhe -
          do primeiro contacto à chave na mão.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
          style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <Link
            to="/viaturas"
            className="bg-cta-gradient text-white font-bold px-8 py-4 rounded-xl
                       btn-glow hover:scale-105 transition-all duration-300 text-base"
          >
            Ver Viaturas Disponíveis
          </Link>
          <a
            href="https://wa.me/351932992377?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20viaturas%20dispon%C3%ADveis."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-glass border border-white/20 text-white font-bold px-8 py-4 rounded-xl
                       hover:bg-white/15 transition-all duration-300 text-base"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up"
          style={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}
        >
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

function FeaturedVehicles() {
  const { vehicles, loading } = useVehicles(true)

  return (
    <section className="section-padding bg-light-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Seleção Exclusiva</span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2 mb-4">
            Viaturas em Destaque
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Uma seleção criteriosa de automóveis prontos para si.
            Cada viatura verificada antes de chegar até você.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        ) : (
          <div className="text-center bg-white rounded-2xl p-12 shadow-soft">
            <h3 className="text-2xl font-black text-brand-blue mb-3">Sem viaturas em destaque de momento</h3>
            <p className="text-muted mb-6">Fale connosco e ajudamos a encontrar a opção certa para si.</p>
            <a
              href="https://wa.me/351932992377?text=Ol%C3%A1!%20Gostaria%20de%20ser%20avisado%20sobre%20as%20pr%C3%B3ximas%20viaturas%20em%20destaque."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-cta-gradient text-white font-bold px-8 py-3 rounded-xl btn-glow"
            >
              Pedir Apoio
            </a>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/viaturas"
            className="inline-block border-2 border-brand-blue text-brand-blue font-bold
                       px-8 py-4 rounded-xl hover:bg-brand-blue hover:text-white
                       transition-all duration-300"
          >
            Ver Todas as Viaturas
          </Link>
        </div>
      </div>
    </section>
  )
}

function WhyUsSection() {
  const { url: bgUrl } = usePexels('luxury car dealership interior', 'large', 'landscape')

  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      ),
      title: 'Transparência Total',
      desc:  'Todas as viaturas com historial verificado. Sem surpresas, sem letras pequenas.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      title: 'Negociação Rápida',
      desc:  'Do primeiro contacto à chave na mão em tempo recorde. Valorizamos o seu tempo.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      ),
      title: 'Seleção Premium',
      desc:  'Cada automóvel é escolhido com critério. Só chegam até si viaturas que passam nos nossos padrões.',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      ),
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
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">As Nossas Vantagens</span>
          <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2 mb-4">
            Porquê Escolher a Carro da Hora?
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            Não somos apenas um stand. Somos o elo entre si e o automóvel que merece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(f => (
            <div
              key={f.title}
              className="bg-light-bg rounded-2xl p-8 card-hover group"
            >
              <div className="w-14 h-14 bg-brand-blue rounded-xl flex items-center justify-center mb-5
                              group-hover:bg-brand-gold transition-colors duration-300">
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

function TestimonialsSection() {
  const testimonials = [
    { name: 'Miguel Ferreira',  text: 'Processo incrivelmente rápido. Em menos de 48 horas tinha o meu carro novo. Recomendo a todos.', stars: 5 },
    { name: 'Ana Sousa',        text: 'Excelente atendimento, total transparência no processo. Voltarei certamente para o próximo automóvel.', stars: 5 },
    { name: 'Carlos Mendes',    text: 'Encontrei exactamente o que procurava ao melhor preço. A equipa foi fantástica do início ao fim.', stars: 5 },
  ]

  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Depoimentos</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            O Que Dizem os Nossos Clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(t => (
            <div key={t.name} className="bg-glass rounded-2xl p-8 card-hover">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-brand-gold fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-brand-gold font-bold text-sm">{t.name[0]}</span>
                </div>
                <span className="text-white font-semibold text-sm">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { url: bgUrl } = usePexels('car keys handover dealership', 'large2x', 'landscape')

  return (
    <section className="relative section-padding overflow-hidden">
      {bgUrl && (
        <>
          <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/98 to-dark-bg/95" />
        </>
      )}
      {!bgUrl && (
        <div className="absolute inset-0 bg-hero-gradient" />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Pronto para Encontrar<br />
          <span className="text-gradient-gold">o Seu Automóvel?</span>
        </h2>
        <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
          A negociação mais rápida de Lisboa começa aqui.
          Fale connosco agora e encontre a viatura ideal para si.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/351932992377?text=Quero%20encontrar%20o%20meu%20pr%C3%B3ximo%20autom%C3%B3vel.%20Podem%20ajudar-me?"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cta-gradient text-white font-bold px-10 py-4 rounded-xl
                       btn-glow hover:scale-105 transition-all duration-300 text-base"
          >
            Contactar via WhatsApp
          </a>
          <Link
            to="/viaturas"
            className="bg-glass border border-white/20 text-white font-bold px-10 py-4
                       rounded-xl hover:bg-white/15 transition-all duration-300 text-base"
          >
            Explorar Viaturas
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedVehicles />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
