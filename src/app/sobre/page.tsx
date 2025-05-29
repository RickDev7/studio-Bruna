import React from 'react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-16">
          Sobre o Studio Bruna
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Nossa História</h2>
          <p className="text-gray-700 leading-relaxed">
            O Studio Bruna nasceu do sonho de proporcionar serviços de beleza de alta qualidade em Cuxhaven.
            Com anos de experiência e formação especializada no Brasil, trazemos para a Alemanha o melhor da
            técnica brasileira em serviços de beleza, combinando profissionalismo com o carinho e acolhimento
            característicos do nosso país.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed">
            Nosso compromisso é realçar a beleza natural de cada cliente, oferecendo serviços personalizados e
            de alta qualidade. Buscamos não apenas resultados estéticos excepcionais, mas também
            proporcionar uma experiência relaxante e acolhedora em cada visita.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Nosso Diferencial</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Profissionais altamente qualificados</li>
            <li>Produtos de primeira qualidade</li>
            <li>Ambiente acolhedor e higienizado</li>
            <li>Atendimento personalizado</li>
            <li>Técnicas modernas e atualizadas</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Localização</h2>
          <p className="text-gray-700 leading-relaxed">
            Estamos localizados em um ponto privilegiado de Cuxhaven, com fácil acesso e estacionamento.
            Nosso espaço foi pensado para proporcionar conforto e tranquilidade durante seu momento de
            cuidado pessoal.
          </p>
        </section>

        <div className="text-center mt-8">
          <a
            href="/agendar"
            className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors duration-300"
          >
            Agendar Horário
          </a>
        </div>
      </div>
    </div>
  );
} 