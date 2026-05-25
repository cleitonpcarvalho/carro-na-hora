import { usePexels } from '../hooks/usePexels'

export default function Sobre() {
  const { url: heroUrl } = usePexels('luxury car showroom portugal', 'large2x', 'landscape')
  const { url: teamUrl } = usePexels('car dealership professional team', 'large', 'landscape')
  const { url: carUrl } = usePexels('premium car detail close up', 'large', 'portrait')

  const values = [
    {
      title: 'Confiança',
      desc: 'A nossa reputação é construída negócio a negócio, cliente a cliente. Cada transacção é tratada com o mesmo rigor e dedicação, independentemente do valor envolvido.',
    },
    {
      title: 'Rapidez',
      desc: 'Sabemos que o seu tempo é precioso. Por isso, tornámos o processo de compra tão ágil quanto possível - sem burocracia desnecessária, sem esperas intermináveis.',
    },
    {
      title: 'Qualidade',
      desc: 'Não comprometemos nos padrões. Cada viatura é verificada e avaliada com rigor antes de entrar no nosso portefólio.',
    },
  ]

  return (
    <>
      <section className="relative pt-36 pb-24 overflow-hidden">
        {heroUrl ? (
          <>
            <img src={heroUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/96 to-dark-bg/98" />
          </>
        ) : (
          <div className="absolute inset-0 bg-hero-gradient" />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Quem Somos</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-2 mb-4">Sobre a Carro da Hora</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Uma história construída sobre confiança, velocidade e paixão genuína por automóveis.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">A Nossa História</span>
              <h2 className="text-4xl font-black text-brand-blue mt-2 mb-6 leading-tight">
                Nascemos para Simplificar a Compra do Seu Automóvel
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Na Carro da Hora, acreditamos que comprar um automóvel deve ser uma experiência
                  positiva - sem burocracia excessiva, sem pressão, sem incertezas. Surgimos com
                  uma missão clara: colocar as melhores viaturas à disposição de quem as procura,
                  com a rapidez que o mercado actual exige e a confiança que cada cliente merece.
                </p>
                <p>
                  Localizados no coração de Lisboa, a nossa equipa de profissionais dedicados
                  trabalha todos os dias para garantir que cada transacção seja transparente,
                  ágil e verdadeiramente satisfatória. Do primeiro contacto à entrega das chaves,
                  estamos consigo em cada passo.
                </p>
                <p>
                  Não somos apenas um stand. Somos o parceiro que o acompanha na decisão mais
                  importante do ano - aquela que o vai levar longe.
                </p>
              </div>
              <a
                href="https://wa.me/351932992377?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Carro%20da%20Hora."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-8 bg-cta-gradient text-white font-bold px-8 py-4
                           rounded-xl btn-glow hover:scale-105 transition-all duration-300"
              >
                Fale Connosco
              </a>
            </div>
            <div className="relative">
              {teamUrl ? (
                <img
                  src={teamUrl}
                  alt="Equipa Carro da Hora"
                  className="rounded-2xl shadow-hover w-full h-96 object-cover"
                />
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
            <h2 className="text-4xl md:text-5xl font-black text-brand-blue mt-2">Os Nossos Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-soft card-hover">
                <div className="w-12 h-12 bg-cta-gradient rounded-xl flex items-center justify-center mb-5">
                  <span className="text-white font-black text-lg">{i + 1}</span>
                </div>
                <h3 className="text-brand-blue font-black text-xl mb-3">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {carUrl && <img src={carUrl} alt="" className="w-full h-full object-cover" />}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Venha Conhecer-nos
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Estamos em Lisboa, prontos para o receber e mostrar-lhe as melhores viaturas do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-glass border border-white/20 text-white font-bold px-8 py-4
                         rounded-xl hover:bg-white/15 transition-all duration-300"
            >
              Ver no Mapa
            </a>
            <a
              href="tel:+351932992377"
              className="bg-cta-gradient text-white font-bold px-8 py-4 rounded-xl
                         btn-glow hover:scale-105 transition-all duration-300"
            >
              Ligar Agora
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
