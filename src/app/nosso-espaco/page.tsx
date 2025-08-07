import Image from 'next/image'

const servicos = [
  {
    titulo: 'Manicure e Pedicure',
    imagem: '/images/manicure-pedicure.jpg',
    descricao: 'Espaço dedicado para cuidados com suas unhas, oferecendo conforto e qualidade.'
  },
  {
    titulo: 'Limpeza de Pele',
    imagem: '/images/limpeza-pele.jpg',
    descricao: 'Ambiente especializado para tratamentos faciais com produtos de primeira linha.'
  },
  {
    titulo: 'Depilação',
    imagem: '/images/depilacao.jpg',
    descricao: 'Sala privativa e higienizada para sua sessão de depilação.'
  },
  {
    titulo: 'Design com Manicure Rosa',
    imagem: '/images/manicure-rosa.jpg',
    descricao: 'Espaço dedicado para designs especiais e nail art.'
  },
  {
    titulo: 'Manicure Francesa',
    imagem: '/images/manicure-francesa.jpg',
    descricao: 'Ambiente preparado para realizar a tradicional e elegante francesinha.'
  }
]

export default function NossoEspaco() {
  return (
    <main className="pt-32 pb-16 bg-gradient-to-b from-pink-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nosso Espaço
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conheça nosso ambiente acolhedor e profissional, projetado para proporcionar 
            a melhor experiência em cuidados de beleza.
          </p>
        </div>

        {/* Imagem principal do estúdio */}
        <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl mb-16">
          <Image
            src="/images/hero-nails.jpg"
            alt="Studio Bruna"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Studio Bruna</h2>
            <p className="text-lg text-white/90">
              Um espaço pensado em você
            </p>
          </div>
        </div>

        {/* Grade de serviços/ambientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicos.map((servico, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <Image
                  src={servico.imagem}
                  alt={servico.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {servico.titulo}
                </h3>
                <p className="text-gray-600">
                  {servico.descricao}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Biossegurança e Conforto
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Nosso espaço foi cuidadosamente planejado para proporcionar o máximo de conforto 
            e bem-estar durante seu atendimento. Contamos com equipamentos modernos e um 
            ambiente totalmente higienizado, seguindo todos os protocolos de biossegurança 
            para garantir sua segurança e satisfação.
          </p>
        </div>
      </div>
    </main>
  )
}