'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/config/supabase'
import { toast } from 'sonner'

interface ContactActionsProps {
  contactId: string
  onDelete: () => void
}

export function ContactActions({ contactId, onDelete }: ContactActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return

    if (!supabase) {
      toast.error('Erro ao conectar com o banco de dados')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)

      if (error) throw error

      toast.success('Contato excluído com sucesso!')
      onDelete()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao excluir contato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Excluir contato"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
} 