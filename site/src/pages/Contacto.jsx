import { useState } from 'react'
import { usePexels } from '../hooks/usePexels'

export default function Contacto() {
  const { url: heroBg } = usePexels('lisbon portugal city modern', 'large2x', 'landscape')

  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const base = import.meta.env.VITE_ADMIN_API_BASE || 'http://localhost:3001'
      const res = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ nome: '', email: '', assunto: '', mensagem: '' })
    } catch {
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  const contacts = [
    {
      label: 'Morada',
      value: 'Rua Quinta das Lavadeiras 8 B, 1750-239, Lisboa',
      href: 'https://maps.app.goo.gl/tFQTZ1pATAtxK6tC9',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      ),
    },
    {
      label: 'Telefone / WhatsApp',
      value: '+351 932 992 377',
      href: 'tel:+351932992377',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
      ),
    },
    {
      label: 'Email',
      value: 'perimetrodeeficacia@gmail.com',
      href: 'mailto:perimetrodeeficacia@gmail.com',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
    },
  ]

  return (
    <>
      <section className="relative pt-36 pb-24 overflow-hidden">
        {heroBg ? (
          <>
            <img
              src={heroBg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,24,50,0.88)' }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'rgb(0,36,71)' }}
          />
        )}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-brand-gold text-sm font-bold uppercase tracking-widest">Estamos Aqui</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mt-2 mb-4">Fale Connosco</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Estamos prontos para ajudá-lo a encontrar o automóvel certo.
            Contacte-nos por qualquer canal - respondemos rapidamente.
          </p>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-brand-blue mb-2">Informações de Contacto</h2>
              <p className="text-muted text-sm">Escolha a forma que preferir para nos contactar.</p>
            </div>
            {contacts.map(c => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-soft
                           card-hover group"
              >
                <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center
                                flex-shrink-0 group-hover:bg-brand-gold transition-colors duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {c.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted font-semibold uppercase tracking-wide">{c.label}</p>
                  <p className="text-brand-blue font-semibold text-sm mt-0.5 leading-snug">{c.value}</p>
                </div>
              </a>
            ))}
            <a
              href="https://wa.me/351932992377?text=Ol%C3%A1!%20Gostaria%20de%20obter%20informa%C3%A7%C3%B5es%20sobre%20as%20viaturas%20dispon%C3%ADveis."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-cta-gradient text-white
                         font-bold py-4 px-6 rounded-2xl btn-glow hover:scale-105
                         transition-all duration-300 w-full"
            >
              Enviar Mensagem no WhatsApp
            </a>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-2xl font-black text-brand-blue mb-6">Envie-nos uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-brand-blue uppercase tracking-wide mb-2">
                    Nome *
                  </label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-brand-blue-2 transition-colors duration-200"
                    placeholder="O seu nome"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-blue uppercase tracking-wide mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                               focus:outline-none focus:border-brand-blue-2 transition-colors duration-200"
                    placeholder="o.seu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-blue uppercase tracking-wide mb-2">
                  Assunto *
                </label>
                <input
                  name="assunto"
                  value={form.assunto}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:border-brand-blue-2 transition-colors duration-200"
                  placeholder="Sobre o que pretende falar?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-blue uppercase tracking-wide mb-2">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  value={form.mensagem}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:border-brand-blue-2 transition-colors duration-200
                             resize-none"
                  placeholder="Descreva aqui o que procura..."
                />
              </div>
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                  Mensagem enviada com sucesso! Entraremos em contacto brevemente.
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  Erro ao enviar. Por favor tente novamente ou contacte-nos directamente.
                </div>
              )}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-cta-gradient text-white font-bold py-4 rounded-xl
                           btn-glow hover:scale-105 transition-all duration-300
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {sending ? 'A enviar...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="rounded-2xl overflow-hidden shadow-soft h-80">
            <iframe
              src="https://maps.google.com/maps?q=Rua+Quinta+das+Lavadeiras+8+B,+1750-239,+Lisboa&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Carro da Hora"
            />
          </div>
        </div>
      </section>
    </>
  )
}
