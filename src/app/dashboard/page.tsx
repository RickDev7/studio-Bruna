'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail } from 'lucide-react'
import { AddContactForm } from '@/components/AddContactForm'
import { ContactActions } from '@/components/ContactActions'
import { supabase } from '@/config/supabase'
import { toast } from 'sonner'

interface Contact {
  id: string
  name: string
  phone: string
  email: string
  last_contact: string
}

export default function Dashboard() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchContacts = async () => {
    if (!supabase) {
      toast.error('Erro ao conectar com o banco de dados')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error('Você precisa estar logado para ver os contatos')
        return
      }

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setContacts(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Contatos</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-[#FF1493] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Contato
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar contatos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF69B4] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contatos...</p>
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                <ContactActions contactId={contact.id} onDelete={fetchContacts} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-[#FF69B4]" />
                  <a href={`tel:${contact.phone}`} className="hover:text-[#FF69B4] transition-colors">
                    {contact.phone}
                  </a>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-[#FF69B4]" />
                  <a href={`mailto:${contact.email}`} className="hover:text-[#FF69B4] transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum contato encontrado</p>
        </div>
      )}

      {showAddForm && (
        <AddContactForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            fetchContacts()
          }}
        />
      )}
    </div>
  )
} 