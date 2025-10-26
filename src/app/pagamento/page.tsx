'use client'

import { FRESHA_CONFIG } from '@/config/fresha'
import { FreshaButton } from '@/components/FreshaButton'
import { ArrowLeft, Shield, CreditCard, Clock } from 'lucide-react'
import Link from 'next/link'

export default function PagamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-[#FF69B4] hover:text-[#FF1493] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Voltar ao início</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield size={16} />
              <span>Pagamento 100% Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            {FRESHA_CONFIG.iframeTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Agende seu horário e realize o pagamento de forma segura e rápida através da nossa plataforma parceira Fresha.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pagamento Seguro</h3>
            <p className="text-sm text-gray-600">SSL e criptografia de ponta a ponta</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Múltiplas Formas</h3>
            <p className="text-sm text-gray-600">Cartão, PIX, PayPal e mais</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Confirmação Imediata</h3>
            <p className="text-sm text-gray-600">Receba confirmação instantânea</p>
          </div>
        </div>

        {/* Fresha Iframe */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Sistema de Agendamento Fresha
            </h2>
            <p className="text-sm text-gray-600 text-center mt-2">
              Selecione seu serviço, horário e realize o pagamento
            </p>
          </div>
          
          <div className="relative" style={{ height: '800px' }}>
            <iframe
              src={FRESHA_CONFIG.url}
              className="w-full h-full border-0"
              title="Sistema de Agendamento Fresha"
              allow="payment; camera; microphone"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </div>

        {/* Alternative Button */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Prefere abrir em uma nova aba?
          </p>
          <FreshaButton size="lg">
            Abrir Sistema de Agendamento
          </FreshaButton>
        </div>

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4">
              Por que usar o Fresha?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">✅ Vantagens:</h4>
                <ul className="space-y-1">
                  <li>• Agendamento 24/7</li>
                  <li>• Lembretes automáticos</li>
                  <li>• Cancelamento fácil</li>
                  <li>• Histórico de agendamentos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔒 Segurança:</h4>
                <ul className="space-y-1">
                  <li>• Certificação PCI DSS</li>
                  <li>• Criptografia SSL</li>
                  <li>• Dados protegidos</li>
                  <li>• Suporte 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}