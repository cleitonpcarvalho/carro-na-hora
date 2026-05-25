export default function Privacidade() {
  return (
    <div className="pt-32 pb-20 bg-light-bg min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-brand-blue mb-2">Política de Privacidade</h1>
        <p className="text-muted text-sm mb-10">Última actualização: Janeiro de 2025</p>

        <div className="bg-white rounded-2xl shadow-soft p-10 space-y-8 text-sm text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">1. Responsável pelo Tratamento de Dados</h2>
            <p>
              A Carro da Hora, com sede na Rua Quinta das Lavadeiras 8 B, 1750-239, Lisboa, é responsável
              pelo tratamento dos dados pessoais recolhidos através deste website, em conformidade com o
              Regulamento Geral sobre a Protecção de Dados (RGPD - Regulamento UE 2016/679) e a
              legislação portuguesa aplicável.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">2. Dados Recolhidos</h2>
            <p>Recolhemos os seguintes dados pessoais quando preenche o formulário de contacto:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Nome completo</li>
              <li>Endereço de email</li>
              <li>Assunto e conteúdo da mensagem</li>
            </ul>
            <p className="mt-3">
              Não recolhemos dados sensíveis na acepção do Artigo 9.º do RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">3. Finalidade do Tratamento</h2>
            <p>Os dados recolhidos são utilizados exclusivamente para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Responder a pedidos de informação e contacto</li>
              <li>Prestar o serviço de intermediação na compra e venda de veículos automóveis</li>
              <li>Melhorar a qualidade do nosso serviço ao cliente</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">4. Base Legal</h2>
            <p>
              O tratamento dos seus dados é efectuado com base no seu consentimento expresso (Artigo 6.º,
              n.º 1, alínea a) do RGPD) e no interesse legítimo da Carro da Hora na prestação de serviços
              de qualidade (Artigo 6.º, n.º 1, alínea f)).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">5. Partilha de Dados</h2>
            <p>
              Os seus dados pessoais não são vendidos, alugados ou partilhados com terceiros para fins
              comerciais. Poderão ser partilhados com prestadores de serviços tecnológicos estritamente
              necessários ao funcionamento do website, os quais estão contratualmente vinculados a
              garantir a confidencialidade e segurança dos dados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">6. Conservação dos Dados</h2>
            <p>
              Os dados pessoais são conservados pelo período estritamente necessário à finalidade para
              que foram recolhidos, ou conforme exigido por obrigação legal. Após esse período, os dados
              são eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">7. Direitos do Titular dos Dados</h2>
            <p>Nos termos do RGPD, tem os seguintes direitos:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Direito de acesso aos seus dados pessoais</li>
              <li>Direito de rectificação de dados inexactos</li>
              <li>Direito ao apagamento («direito a ser esquecido»)</li>
              <li>Direito à limitação do tratamento</li>
              <li>Direito de oposição ao tratamento</li>
              <li>Direito à portabilidade dos dados</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um destes direitos, contacte-nos através do email{' '}
              <a href="mailto:perimetrodeeficacia@gmail.com" className="text-brand-blue font-semibold hover:text-brand-gold">
                perimetrodeeficacia@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">8. Cookies</h2>
            <p>
              Este website pode utilizar cookies técnicos essenciais ao seu funcionamento. Não são
              utilizados cookies de rastreamento ou publicidade sem o seu consentimento expresso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">9. Reclamações</h2>
            <p>
              Caso considere que os seus direitos não foram respeitados, tem o direito de apresentar
              reclamação à autoridade de supervisão competente em Portugal:{' '}
              <a
                href="https://www.cnpd.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue font-semibold hover:text-brand-gold"
              >
                Comissão Nacional de Protecção de Dados (CNPD)
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-brand-blue mb-3">10. Alterações a Esta Política</h2>
            <p>
              Reservamo-nos o direito de actualizar esta Política de Privacidade. Quaisquer alterações
              serão publicadas nesta página com a respectiva data de actualização.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
