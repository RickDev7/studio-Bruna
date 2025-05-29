import React from 'react';

export default function ServicosPage() {
  const servicos = [
    {
      titulo: "Design de Sobrancelhas",
      descricao: "Modelagem personalizada para realçar sua expressão facial",
      preco: "€30",
      duracao: "45 min"
    },
    {
      titulo: "Extensão de Cílios",
      descricao: "Técnicas modernas para um olhar mais marcante e natural",
      preco: "€80",
      duracao: "120 min"
    },
    {
      titulo: "Micropigmentação",
      descricao: "Procedimento semi-permanente para sobrancelhas perfeitas",
      preco: "€250",
      duracao: "180 min"
    },
    {
      titulo: "Limpeza de Pele",
      descricao: "Tratamento completo para uma pele radiante e saudável",
      preco: "€60",
      duracao: "60 min"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-16">
          Nossos Serviços
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicos.map((servico, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-semibold text-purple-800 mb-3">
                {servico.titulo}
              </h2>
              <p className="text-gray-600 mb-4">
                {servico.descricao}
              </p>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-semibold text-pink-500">{servico.preco}</span>
                <span className="text-sm">{servico.duracao}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
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