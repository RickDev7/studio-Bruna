import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white py-16" id="contatos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contato */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Contato</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-700">+49 1520 800 7814</p>
                  <a 
                    href="https://wa.me/4915208007814" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#FF69B4] hover:text-[#FF1493] text-sm"
                  >
                    Enviar mensagem no WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#FF69B4] shrink-0" />
                <a 
                  href="mailto:bs.aestheticnails@gmail.com"
                  className="ml-3 text-gray-700 hover:text-[#FF69B4]"
                >
                  bs.aestheticnails@gmail.com
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <a 
                    href="https://maps.app.goo.gl/amTiE5dBr3j7pDt36"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-[#FF69B4] transition-colors"
                  >
                    Bei der Grodener Kirche 7<br />
                    27472 Cuxhaven, Alemanha
                  </a>
                </div>
            </div>
            </div>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Horário de Funcionamento</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-700">Segunda, Quarta e Sexta</p>
                  <p className="text-gray-600">09:00 - 13:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-700">Terça e Quinta</p>
                  <p className="text-gray-600">09:00 - 13:00</p>
                  <p className="text-gray-600">15:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-700">Sábado</p>
                  <p className="text-gray-600">09:30 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#FF69B4] shrink-0 mt-1" />
                <div className="ml-3">
                  <p className="text-gray-700">Domingo</p>
                  <p className="text-gray-600">Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/bs.aesthetic.nails"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF69B4] hover:text-[#FF1493] transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.facebook.com/people/Bruna-Silva-Aesthetic-Nails/61573618850298/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF69B4] hover:text-[#FF1493] transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Logo e Copyright */}
        <div className="mt-16 text-center">
          <div className="mb-6">
            <Image
              src="/images/logo.png.jpg"
              alt="Bruna Silva - Aesthetic & Nails"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <p className="text-gray-600 mb-4">
            Seu estúdio de beleza para tratamentos profissionais e bem-estar.
          </p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bruna Silva - Aesthetic & Nails. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 