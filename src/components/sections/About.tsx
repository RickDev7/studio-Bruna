'use client'

import { Facebook, MessageCircle } from 'lucide-react'

export function About() {
  return (
    <section id="sobre" className="py-24 bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            Sobre a Bruna Silva
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Conheça nossa história e compromisso com sua beleza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossa História</h3>
              <p className="text-gray-600 leading-relaxed">
                A Bruna Silva - Aesthetic & Nails nasceu do sonho de proporcionar serviços de beleza de alta qualidade em Cuxhaven.
                Com anos de experiência e formação especializada em Portugal, trazemos para a Alemanha o melhor da
                técnica portuguesa em serviços de beleza.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Nosso compromisso é realçar a beleza natural de cada cliente, oferecendo serviços personalizados
                e de alta qualidade. Buscamos não apenas resultados estéticos excepcionais, mas também
                proporcionar uma experiência relaxante e acolhedora.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossos Valores</h3>
              <ul className="space-y-4">
                {[
                  'Excelência em cada atendimento',
                  'Compromisso com a satisfação do cliente',
                  'Ambiente acolhedor e higienizado',
                  'Profissionais altamente qualificados',
                  'Produtos de primeira qualidade'
                ].map((valor, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-[#FFB6C1] mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{valor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Localização</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estamos localizados em um ponto privilegiado de Cuxhaven, com fácil acesso.
                Nosso espaço foi pensado para proporcionar conforto e tranquilidade durante seu momento de
                cuidado pessoal.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/agendar"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            Agendar Horário
          </a>
        </div>
      </div>

      {/* Nova seção de Horários e Contatos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Horários de Funcionamento */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#FF69B4] mb-6">Horário de Funcionamento</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Segunda, Quarta e Sexta</span>
                <span className="text-gray-800 font-medium">09:00 - 13:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Terça e Quinta</span>
                <div className="text-right">
                  <div className="text-gray-800 font-medium">09:00 - 13:00</div>
                  <div className="text-gray-800 font-medium">15:00 - 18:00</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sábado</span>
                <span className="text-gray-800 font-medium">09:30 - 17:00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Domingo</span>
                <span className="text-gray-800 font-medium">Fechado</span>
              </div>
              <div className="mt-6 pt-6 border-t border-[#FFC0CB]/30">
                <p className="text-gray-600 text-sm">
                  * Horários podem variar em feriados. Consulte disponibilidade.
                </p>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold text-[#FF69B4] mb-6">Contatos</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <svg className="h-6 w-6 text-[#FFB6C1] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <h4 className="text-gray-800 font-medium mb-1">Endereço</h4>
                  <a 
                    href="https://maps.google.com/?q=Bei+der+Grodener+Kirche+7,+27472+Cuxhaven,+Deutschland" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-[#FF69B4] transition-colors block"
                  >
                    <p>Bei der Grodener Kirche 7</p>
                    <p>27472 Cuxhaven, Alemanha</p>
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <svg className="h-6 w-6 text-[#FFB6C1] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <h4 className="text-gray-800 font-medium mb-1">Telefone/WhatsApp</h4>
                  <a 
                    href="tel:+4915208007814" 
                    className="text-gray-600 hover:text-[#FF69B4] transition-colors block"
                  >
                    +49 1520 8007814
                  </a>
                  <a 
                    href="https://wa.me/4915208007814" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 hover:text-[#FF69B4] transition-colors block mt-1"
                  >
                    Enviar mensagem no WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <svg className="h-6 w-6 text-[#FFB6C1] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <div>
                  <h4 className="text-gray-800 font-medium mb-1">Email</h4>
                  <a 
                    href="mailto:bs.aestheticnails@gmail.com" 
                    className="text-gray-600 hover:text-[#FF69B4] transition-colors"
                  >
                    bs.aestheticnails@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <svg className="h-6 w-6 text-[#FFB6C1] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                <div>
                  <h4 className="text-gray-800 font-medium mb-1">Instagram</h4>
                  <a 
                    href="https://www.instagram.com/bs.aesthetic.nails" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#FF69B4] hover:text-[#FFB6C1] transition-colors"
                  >
                    @bs.aesthetic.nails
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 