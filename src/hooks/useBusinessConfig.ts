import { useState, useEffect } from 'react'
import { createClient } from '@/config/supabase-client'

interface BusinessConfig {
  id: string
  created_at: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  business_hours: Record<string, {
    start: string
    end: string
    lunchStart?: string
    lunchEnd?: string
  }>
}

export function useBusinessConfig() {
  const [config, setConfig] = useState<BusinessConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('business_config')
          .select('*')
          .single()

        if (error) throw error
        setConfig(data)
      } catch (error) {
        console.error('Erro ao buscar configurações:', error)
        setError(error instanceof Error ? error.message : 'Erro ao buscar configurações')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, loading, error }
} 