import React from 'react';

export default function PlanosPage() {
  const planos = [
    {
      nome: "Plano Básico",
      preco: "€89",
      periodo: "/mês",
      beneficios: [
        "1 Design de Sobrancelhas",
        "1 Limpeza de Pele Básica",
        "10% de desconto em outros serviços",
        "Agendamento prioritário"
      ],
      destaque: false
    },
    {
      nome: "Plano Premium",
      preco: "€159",
      periodo: "/mês",
      beneficios: [
        "1 Design de Sobrancelhas",
        "1 Limpeza de Pele Completa",
        "1 Extensão de Cílios (manutenção)",
        "20% de desconto em outros serviços",
        "Agendamento prioritário",
        "Produtos exclusivos"
      ],
      destaque: true
    },
    {
      nome: "Plano VIP",
      preco: "€249",
      periodo: "/mês",
      beneficios: [
        "2 Design de Sobrancelhas",
        "1 Limpeza de Pele Premium",
        "1 Extensão de Cílios (manutenção)",
        "1 Massagem Relaxante",
        "30% de desconto em outros serviços",
        "Agendamento prioritário",
        "Kit de produtos exclusivos"
      ],
      destaque: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-16">
          Nossos Planos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map((plano, index) => (
            <div 
              key={index}
              className={`relative bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 ${
                plano.destaque ? 'border-2 border-pink-500 scale-105' : ''
              }`}
            >
              {plano.destaque && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}
              <h2 className="text-2xl font-bold text-purple-800 text-center mb-4">
                {plano.nome}
              </h2>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{plano.preco}</span>
                <span className="text-gray-600">{plano.periodo}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plano.beneficios.map((beneficio, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <svg className="h-5 w-5 text-pink-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {beneficio}
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <a
                  href="/agendar"
                  className={`inline-block px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    plano.destaque
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:-translate-y-1'
                      : 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 hover:from-pink-200 hover:to-purple-200 hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  Escolher Plano
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-12">
          Todos os planos incluem acesso ao nosso programa de fidelidade e benefícios exclusivos.
          Para mais informações, entre em contato conosco.
        </p>
      </div>
    </div>
  );
} 