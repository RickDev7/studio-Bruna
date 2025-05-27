'use client'

const servicos = [
  {
    categoria: 'Unhas',
    items: [
      'Manicure com Shellac',
      'Pedicure com Shellac',
      'Spa Pedicure',
      'Tratamento de unhas em gel',
      'Reparos de unhas',
      'Manutenção de unhas em gel',
      'Remoção de unhas em gel'
    ]
  },
  {
    categoria: 'Tratamentos Faciais',
    items: [
      'Limpeza facial',
      'Tratamento anti-idade',
      'Hidratação facial',
      'Microagulhamento',
      'Peeling facial',
      'Máscaras faciais'
    ]
  },
  {
    categoria: 'Design e Embelezamento',
    items: [
      'Design de sobrancelhas',
      'Coloração de sobrancelhas',
      'Extensão de cílios',
      'Manutenção de cílios',
      'Remoção de cílios'
    ]
  },
  {
    categoria: 'Depilação',
    items: [
      'Depilação facial',
      'Depilação axilas',
      'Depilação pernas',
      'Depilação virilha',
      'Depilação completa'
    ]
  }
]

export function AllServices() {
  return (
    <section className="py-24 bg-gradient-to-br from-pink-50 to-white" id="todos-servicos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nossos Serviços
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Conheça todos os nossos serviços disponíveis
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {servicos.map((categoria) => (
            <div
              key={categoria.categoria}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{categoria.categoria}</h3>
              <ul className="space-y-4">
                {categoria.items.map((servico, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-[#FFC0CB] mr-3"
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
                    <span className="text-gray-600">{servico}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/agendar"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Agendar Horário
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
} 