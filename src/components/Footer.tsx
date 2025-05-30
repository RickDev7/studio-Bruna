// Footer component - Updated for deployment trigger
import { Clock, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
          {/* Horários */}
          <div className="flex flex-col items-center md:items-end justify-center space-y-2">
            <div className="flex items-center gap-2 text-rose-500 font-medium mb-1">
              <Clock className="h-4 w-4" />
              <span>Horário de Funcionamento</span>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-1.5">
              <div>Segunda a Sexta: 09:00 - 13:00</div>
              <div>Terça e Quinta: 15:00 - 18:00</div>
              <div>Sábado: 09:30 - 17:00</div>
            </div>
          </div>

          {/* Contatos */}
          <div className="flex flex-col items-center md:items-start justify-center space-y-2">
            <div className="flex items-center gap-2 text-rose-500 font-medium mb-1">
              <span>Contatos</span>
            </div>
            <div className="flex flex-col items-center md:items-start space-y-1.5">
              <Link 
                href="https://www.instagram.com/bs.aesthetic.nails?igsh=eXR0a2VqbmxqYXY0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-500 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>@bs.aesthetic.nails</span>
              </Link>
              
              <Link 
                href="mailto:bs.aestheticnails@gmail.com"
                className="flex items-center gap-2 hover:text-rose-500 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>bs.aestheticnails@gmail.com</span>
              </Link>

              <Link 
                href="https://maps.app.goo.gl/7fFdLwg5SKsHCkLr8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-500 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>Bei der Grodener Kirche 7</span>
              </Link>

              <Link 
                href="tel:+4915208007814"
                className="flex items-center gap-2 hover:text-rose-500 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+49 1520 800 7814</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8">
          <p className="text-center text-xs leading-5 text-gray-500">
            © {new Date().getFullYear()} BS Aesthetic & Nails. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
} 