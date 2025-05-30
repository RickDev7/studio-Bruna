'use client'

import { useState } from 'react'

interface ContractProps {
  planoNome: string
  planoPreco: string
}

export function Contract({ planoNome, planoPreco }: ContractProps) {
  const [showContract, setShowContract] = useState(false)

  return (
    <div>
      <button
        onClick={() => setShowContract(true)}
        className="inline-flex items-center px-6 py-3 mt-4 text-sm font-medium rounded-full text-[#FF69B4] hover:text-white bg-white hover:bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] border-2 border-[#FFB6C1] transition-all duration-300"
      >
        Ver Contrato
      </button>

      {showContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="prose prose-pink max-w-none">
              <h2 className="text-center text-2xl font-bold mb-8 bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                VERTRAG ZUR ANMELDUNG FÜR EIN MONATLICHES SCHÖNHEITSPFLEGEPROGRAMM
                <br />
                CONTRATO DE ADESÃO A PLANO MENSAL DE CUIDADOS ESTÉTICOS
              </h2>

              <div className="mb-8">
                <p className="font-semibold">Firma / Empresa:</p>
                <p>Bruna Silva - Aesthetic & Nails</p>
                <p>Bei der Grodener Kirche 7, 27472 Cuxhaven</p>
                <p>Telefon: +49 152 800 7814</p>
                <p>E-Mail: bs.aestheticnails@gmail.com</p>
                <p>Steuernummer: 18/138/03805</p>
              </div>

              <div className="mb-8">
                <h3>1. Kundendaten / Dados do Cliente</h3>
                <p>Name / Nome: ________________________________________________________________</p>
                <p>Geburtsdatum / Data de nascimento: ____ / ____ / _______ Tel.: _______________________</p>
                <p>Adresse / Endereço: ___________________________________________________________</p>
                <p>E-Mail: ______________________________________________________________________</p>
              </div>

              <div className="mb-8">
                <h3>2. Gewähltes Paket / Plano Escolhido</h3>
                <p>
                  {planoNome === 'Plano Básico' && '☒ Basis-Paket / Essencial'}
                  {planoNome !== 'Plano Básico' && '☐ Basis-Paket / Essencial'}
                </p>
                <p>
                  {planoNome === 'Plano Balance' && '☒ Ausgeglichenes Paket / Equilíbrio'}
                  {planoNome !== 'Plano Balance' && '☐ Ausgeglichenes Paket / Equilíbrio'}
                </p>
                <p>
                  {planoNome === 'Plano Premium' && '☒ Premium-Paket / Premium'}
                  {planoNome !== 'Plano Premium' && '☐ Premium-Paket / Premium'}
                </p>
              </div>

              <div className="mb-8">
                <h3>3. Mindestvertragsdauer / Período de Fidelização</h3>
                <p>☐ 3 Monate / meses</p>
                <p>☐ 6 Monate / meses</p>
                <p className="mt-4 text-sm">
                  Nach Ablauf der Vertragsdauer erfolgt keine automatische Verlängerung. Die Firma wird die Kundin kontaktieren, um eine eventuelle Verlängerung oder Änderung zu besprechen.
                  <br />
                  Após o término do período contratado, não haverá renovação automática. A empresa entrará em contato com a cliente para verificar se deseja renovar ou alterar o plano.
                </p>
              </div>

              <div className="mb-8">
                <h3>4. Preis und Zahlung / Preço e Pagamento</h3>
                <p>Monatlicher Betrag / Valor mensal: EUR {planoPreco}</p>
                <p>Fälligkeitsdatum / Vencimento: ___ des Monats / de cada mês</p>
                <p>Zahlungsmethode / Forma de pagamento:</p>
                <p>☐ Überweisung / Transferência bancária</p>
                <p>☐ Barzahlung / Dinheiro</p>
                <p>☐ Andere / Outro: _______________________</p>
                <div className="mt-4">
                  <p>Bankverbindung / Dados bancários:</p>
                  <p>IBAN: DE13 1001 1001 2518 5510 36</p>
                  <p>Kontoinhaber / Titular: Bruna Silva - Aesthetic & Nails</p>
                </div>
              </div>

              <div className="mb-8">
                <h3>5. Vertragsbruch bei Treueverpflichtung / Incumprimento da Fidelização</h3>
                <p className="text-sm">
                  Bei vorzeitiger Kündigung des Vertrages vor Ablauf der vereinbarten Mindestlaufzeit behält sich das Unternehmen das Recht vor, den vollen Wert der bereits in Anspruch genommenen Leistungen gemäß der regulären Preisliste zu berechnen.
                  <br />
                  Em caso de cancelamento antecipado antes do término do período de fidelização acordado, a empresa reserva-se o direito de cobrar o valor integral dos serviços já utilizados, conforme tabela de preços regular.
                </p>
              </div>

              <div className="mb-8">
                <h3>6. Vertragspause / Pausa Temporária</h3>
                <p className="text-sm">
                  Die Kundin darf das Paket für bis zu 30 Tage mit Begründung und Vorankündigung pausieren.
                  <br />
                  O cliente poderá pausar o plano por até 30 dias, com justificativa e aviso prévio.
                </p>
              </div>

              <div className="mb-8">
                <h3>7. Terminvereinbarung und Umbuchungen / Agendamento e Remarcações</h3>
                <p className="text-sm">
                  Die Dienstleistungen müssen mindestens 48 Stunden im Voraus gebucht werden.
                  Umbuchungen werden nur akzeptiert, wenn sie mindestens 24 Stunden vorher erfolgen.
                  Bei Nichterscheinen oder Stornierung mit weniger als 24 Stunden Vorankündigung gilt die Leistung als erbracht, ohne Anspruch auf Nachholung oder Kompensation.
                  <br />
                  Os serviços deverão ser agendados com antecedência mínima de 48 horas.
                  As remarcações só serão aceitas com, no mínimo, 24 horas de antecedência.
                  Em caso de falta ou cancelamento com menos de 24 horas, o serviço será considerado como realizado, sem direito a reagendamento ou compensação.
                </p>
              </div>

              <div className="mb-8">
                <h3>8. Verspätungstoleranz / Tolerância de Atraso</h3>
                <p className="text-sm">
                  Bei einer Verspätung von mehr als 10 Minuten kann die Behandlungszeit vom Fachpersonal verkürzt werden, um den Zeitplan nicht zu beeinträchtigen.
                  Bei einer Verspätung von mehr als 15 Minuten kann der Termin abgesagt und als wahrgenommen betrachtet werden, ohne Anspruch auf Nachholung.
                  <br />
                  Em caso de atraso superior a 10 minutos, o profissional poderá reduzir o tempo do atendimento para não comprometer os agendamentos programados.
                  Em caso de atrasos superiores a 15 minutos, o atendimento poderá ser cancelado e considerado como realizado, sem direito a reagendamento.
                </p>
              </div>

              <div className="mb-8">
                <h3>9. Nagelreparaturen / Reparações de Unhas</h3>
                <p className="text-sm">
                  Ausgeglichenes Paket / Plano Equilíbrio: bis zu 2 pro Monat / até 2 por mês
                  <br />
                  Premium-Paket / Plano Premium: unbegrenzt / ilimitadas
                </p>
              </div>

              <div className="mb-8">
                <h3>10. Nichtübertragbarkeit / Intransferibilidade</h3>
                <p className="text-sm">
                  Die Pakete sind persönlich und dürfen nicht auf Dritte übertragen oder geteilt werden.
                  <br />
                  Os planos são pessoais e intransferíveis, não podendo ser utilizados por terceiros.
                </p>
              </div>

              <div className="mb-8">
                <h3>11. Teilweise Nutzung des Pakets / Uso Parcial do Plano</h3>
                <p className="text-sm">
                  Wenn der Kunde im Laufe des Monats nur einen Teil der im Paket enthaltenen Leistungen in Anspruch nimmt, wird der volle Paketpreis berechnet.
                  Es erfolgt keine zusätzliche Rückerstattung oder Kompensation für nicht genutzte Leistungen im Folgemonat.
                  <br />
                  Caso o cliente utilize apenas parte dos serviços incluídos no plano dentro do mês, o valor integral do plano será cobrado normalmente.
                  Não há reembolso adicional nem compensação no mês seguinte por serviços não utilizados.
                </p>
              </div>

              <div className="mb-8">
                <h3>12. Änderungen der Leistungen / Alterações nos Serviços</h3>
                <p className="text-sm">
                  Die Firma behält sich das Recht vor, Leistungen oder Preise mit einer Vorankündigung von mindestens 30 Tagen zu ändern.
                  <br />
                  A empresa reserva-se o direito de alterar os serviços ou preços com aviso prévio mínimo de 30 dias.
                </p>
              </div>

              <div className="mb-8">
                <h3>13. Datenschutz / Proteção de Dados</h3>
                <p className="text-sm">
                  Die persönlichen Daten der Kundin werden ausschließlich für die Vertragsabwicklung und interne Verwaltung verwendet, gemäß DSGVO.
                  <br />
                  Os dados pessoais da cliente serão utilizados exclusivamente para fins contratuais e administrativos internos, conforme o RGPD.
                </p>
              </div>

              <div className="mb-8">
                <h3>14. Gerichtsstand / Foro Competente</h3>
                <p className="text-sm">
                  Für Streitigkeiten aus diesem Vertrag gilt der Gerichtsstand Cuxhaven.
                  <br />
                  Em caso de litígio, fica eleito o foro da comarca de Cuxhaven.
                </p>
              </div>

              <div className="mb-8">
                <h3>Unterschriften / Assinaturas</h3>
                <p>Ort und Datum / Local e Data: ______________________________</p>
                <p className="mt-8">Unterschrift der Kundin / Assinatura da cliente: ______________________________</p>
                <p className="mt-8">Unterschrift der Firma / Assinatura da empresa: ______________________________</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowContract(false)}
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transition-all duration-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 