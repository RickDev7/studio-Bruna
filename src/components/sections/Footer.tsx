import { Heart, Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react'
import Link from 'next/link'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  'aria-hidden': boolean;
}

const navigation = {
  product: [
    { name: 'Recursos', href: '#' },
    { name: 'Segurança', href: '#' },
    { name: 'Planos', href: '#' },
    { name: 'Empresas', href: '#' },
    { name: 'Histórias de Sucesso', href: '#' },
  ],
  support: [
    { name: 'Documentação', href: '#' },
    { name: 'Guias', href: '#' },
    { name: 'Status', href: '#' },
  ],
  company: [
    { name: 'Sobre', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Carreiras', href: '#' },
    { name: 'Imprensa', href: '#' },
    { name: 'Parcerias', href: '#' },
  ],
  legal: [
    { name: 'Privacidade', href: '#' },
    { name: 'Termos', href: '#' },
  ],
  social: [
    {
      name: 'Twitter',
      href: '#',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

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