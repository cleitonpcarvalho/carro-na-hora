export default function TermosDeUso() {
  return (
    <div className="pt-32 pb-20 bg-light-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-brand-blue mb-2">Termos de Uso</h1>
        <p className="text-muted text-sm mb-10">Última actualização: Janeiro de 2025</p>

        <div className="bg-white rounded-2xl shadow-soft p-10 space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao aceder e utilizar o website da Carro da Hora, declara aceitar plenamente os presentes
              Termos de Uso. Caso não concorde com alguma das condições aqui estabelecidas, deverá
              abster-se de utilizar este website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">2. Sobre o Serviço</h2>
            <p>
              A Carro da Hora disponibiliza um serviço de intermediação na compra e venda de veículos
              automóveis em Portugal. As informações presentes neste website têm carácter meramente
              informativo e não constituem uma proposta contratual vinculativa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo deste website - incluindo textos, imagens, logótipos e elementos de design -
              é propriedade exclusiva da Carro da Hora ou dos seus fornecedores de conteúdo, estando
              protegido pela legislação portuguesa e europeia sobre direitos de autor e propriedade intelectual.
              É proibida a reprodução, distribuição ou modificação sem autorização expressa e escrita.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">4. Exactidão das Informações</h2>
            <p>
              A Carro da Hora empenha-se em manter as informações do website actualizadas e correctas.
              Contudo, não garantimos a exactidão, completude ou actualidade de todos os conteúdos,
              em especial no que respeita à disponibilidade e características dos veículos anunciados.
              Recomendamos que confirme sempre os detalhes directamente connosco antes de tomar
              qualquer decisão de compra.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">5. Limitação de Responsabilidade</h2>
            <p>
              A Carro da Hora não se responsabiliza por danos directos ou indirectos resultantes da
              utilização deste website ou da impossibilidade de acesso ao mesmo, nos limites permitidos
              pela legislação portuguesa e europeia aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">6. Links Externos</h2>
            <p>
              Este website poderá conter ligações para websites de terceiros. A Carro da Hora não é
              responsável pelo conteúdo ou práticas de privacidade desses websites e recomenda que
              consulte as respectivas políticas antes de os utilizar.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">7. Lei Aplicável e Foro Competente</h2>
            <p>
              Os presentes Termos de Uso regem-se pela lei portuguesa, em conformidade com a legislação
              da União Europeia aplicável, incluindo a Directiva 2011/83/UE sobre os direitos dos
              consumidores. Em caso de litígio, é competente o tribunal da comarca de Lisboa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">8. Contacto</h2>
            <p>
              Para qualquer questão relativa a estes Termos de Uso, contacte-nos através do email{' '}
              <a href="mailto:perimetrodeeficacia@gmail.com" className="text-brand-blue font-semibold hover:text-brand-gold">
                perimetrodeeficacia@gmail.com
              </a>{' '}
              ou pelo telefone{' '}
              <a href="tel:+351932992377" className="text-brand-blue font-semibold hover:text-brand-gold">
                +351 932 992 377
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
