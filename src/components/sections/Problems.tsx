import { Flower, Sparkles, Heart, Gem } from 'lucide-react'

export function Problems() {
  const services = [
    {
      icon: <Flower className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Tratamentos Faciais",
      description: "Limpeza de pele, máscaras revitalizantes, microagulhamento e outros tratamentos para uma pele radiante e saudável."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Estética Corporal",
      description: "Massagens modeladoras, drenagem linfática, tratamentos redutores e protocolos personalizados para seu corpo."
    },
    {
      icon: <Heart className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Bem-estar",
      description: "Massagens relaxantes, aromaterapia e tratamentos holísticos para equilibrar corpo e mente."
    },
    {
      icon: <Gem className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Procedimentos Especiais",
      description: "Design de sobrancelhas, extensão de cílios e outros serviços para realçar sua beleza natural."
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Nossos Serviços
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Oferecemos uma variedade de tratamentos personalizados para cuidar da sua beleza e bem-estar
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <div key={index} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute -top-4 left-6 bg-[#FFE4E8] rounded-full p-3">
                {service.icon}
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900">{service.title}</h3>
              <p className="mt-2 text-base text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 