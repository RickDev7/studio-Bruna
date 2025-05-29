import { Heart, Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react'

export function Footer() {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Bei+der+Grodener+Kirche+7+27472+Cuxhaven+Deutschland"

  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-[#FFC0CB]" />
                <a href="tel:+4915208007814" className="hover:text-[#FFC0CB] transition-colors">
                  +49 1520 800 7814
                </a>
              </li>
              <li className="flex items-center justify-center text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-[#FFC0CB]" />
                <a href="mailto:bs.aestheticnails@gmail.com" className="hover:text-[#FFC0CB] transition-colors">
                  bs.aestheticnails@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center text-gray-600">
                <Instagram className="h-5 w-5 mr-2 text-[#FFC0CB]" />
                <a href="https://www.instagram.com/bs.aesthetic.nails?igsh=eXR0a2VqbmxqYXY0" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="hover:text-[#FFC0CB] transition-colors">
                  @bs.aesthetic.nails
                </a>
              </li>
              <li className="flex items-center justify-center text-gray-600 group">
                <MapPin className="h-5 w-5 mr-2 text-[#FFC0CB] group-hover:scale-110 transition-transform" />
                <a 
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFC0CB] transition-colors text-center"
                >
                  Bei der Grodener Kirche 7<br />
                  27472 Cuxhaven<br />
                  Alemanha
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Horário de Funcionamento</h3>
            <ul className="space-y-4">
              <li className="flex items-center justify-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-[#FFC0CB]" />
                <div>
                  <p>Segunda a Sexta: 9:00 - 13:00</p>
                  <p>Terça e Quinta: 15:00 - 18:00</p>
                  <p>Sábado: 9:30 - 17:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-[#FFC0CB]" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Bruna Silva - Aesthetic & Nails</span>
          </div>
          <p className="text-gray-600 mb-4">
            Seu estúdio de beleza para tratamentos profissionais e bem-estar.
          </p>
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Bruna Silva - Aesthetic & Nails. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 