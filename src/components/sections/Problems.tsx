import { Flower, Sparkles, Heart, Gem } from 'lucide-react'
import { services } from '@/config/services'

export function Problems() {
  const categorias = [
    {
      icon: <Flower className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Tratamentos Faciais",
      description: services.filter(s => s.category === 'face').map(s => s.name).join(', '),
      category: 'face'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Unhas",
      description: services.filter(s => s.category === 'nails').map(s => s.name).join(', '),
      category: 'nails'
    },
    {
      icon: <Heart className="w-6 h-6 text-[#FFC0CB]" />,
      title: "Design e Embelezamento",
      description: services.filter(s => s.category === 'eyebrows').map(s => s.name).join(', '),
      category: 'eyebrows'
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

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria, index) => (
            <div key={index} className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute -top-4 left-6 bg-[#FFE4E8] rounded-full p-3">
                {categoria.icon}
              </div>
              <h3 className="mt-8 text-lg font-medium text-gray-900">{categoria.title}</h3>
              <p className="mt-2 text-base text-gray-500">{categoria.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 