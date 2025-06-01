'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Service {
  id: string
  name: string
  category: string
  duration: number
  price: number
  description: string
  active: boolean
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const categories = [
    'Unhas',
    'Tratamentos Faciais',
    'Design e Embelezamento'
  ]

  const loadServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error

      setServices(data || [])
    } catch (err: any) {
      console.error('Erro ao carregar serviços:', err)
      toast.error('Erro ao carregar serviços')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingService) return

    try {
      setIsLoading(true)

      const { error } = editingService.id
        ? await supabase
            .from('services')
            .update({
              name: editingService.name,
              category: editingService.category,
              duration: editingService.duration,
              price: editingService.price,
              description: editingService.description,
              active: editingService.active
            })
            .eq('id', editingService.id)
        : await supabase
            .from('services')
            .insert([{
              name: editingService.name,
              category: editingService.category,
              duration: editingService.duration,
              price: editingService.price,
              description: editingService.description,
              active: editingService.active
            }])

      if (error) throw error

      toast.success(editingService.id ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!')
      setIsEditing(false)
      setEditingService(null)
      loadServices()
    } catch (err: any) {
      console.error('Erro ao salvar serviço:', err)
      toast.error(err.message || 'Erro ao salvar serviço')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return

    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Serviço excluído com sucesso!')
      loadServices()
    } catch (err: any) {
      console.error('Erro ao excluir serviço:', err)
      toast.error(err.message || 'Erro ao excluir serviço')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Gerenciar Serviços
          </h1>
          <p className="text-gray-600 text-lg">
            Adicione, edite ou remova os serviços oferecidos
          </p>
        </div>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-3 border border-[#FFB6C1] text-[#FF69B4] rounded-full hover:bg-pink-50 transition-colors duration-300"
          >
            Voltar
          </button>
          <button
            onClick={() => {
              setEditingService({
                id: '',
                name: '',
                category: categories[0],
                duration: 30,
                price: 0,
                description: '',
                active: true
              })
              setIsEditing(true)
            }}
            className="px-6 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
          >
            Novo Serviço
          </button>
        </div>

        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome do Serviço
                </label>
                <input
                  type="text"
                  id="name"
                  value={editingService?.name || ''}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Categoria
                </label>
                <select
                  id="category"
                  value={editingService?.category || categories[0]}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, category: e.target.value } : null)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={editingService?.duration || 30}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, duration: parseInt(e.target.value) } : null)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  min="15"
                  step="15"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Preço (€)
                </label>
                <input
                  type="number"
                  id="price"
                  value={editingService?.price || 0}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={editingService?.description || ''}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={editingService?.active || false}
                  onChange={(e) => setEditingService(prev => prev ? { ...prev, active: e.target.checked } : null)}
                  className="h-4 w-4 text-[#FF69B4] focus:ring-[#FF69B4] border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Serviço ativo
                </label>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditingService(null)
                  }}
                  className="px-6 py-3 border border-[#FFB6C1] text-[#FF69B4] rounded-full hover:bg-pink-50 transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Serviço'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF69B4]"></div>
              </div>
            ) : services.length === 0 ? (
              <div className="col-span-full bg-pink-50/30 rounded-xl p-6 border border-pink-100">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-pink-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-800 font-light mb-1">Nenhum serviço cadastrado</p>
                  <p className="text-gray-500 text-sm">Clique em "Novo Serviço" para começar</p>
                </div>
              </div>
            ) : (
              services.map(service => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      service.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-gray-600">
                      <span className="font-medium">Duração:</span> {service.duration} minutos
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Preço:</span> €{service.price.toFixed(2)}
                    </p>
                    {service.description && (
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingService(service)
                        setIsEditing(true)
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#FF69B4] hover:bg-pink-50 rounded-lg transition-colors duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
} 