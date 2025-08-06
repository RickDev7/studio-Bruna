import { useState, useEffect } from 'react'
import { businessConfig } from '@/config/businessConfig'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function usePublicBusinessConfig() {
  const [config, setConfig] = useState(businessConfig)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data, error } = await supabase
          .from('business_config')
          .select('*')
          .single()

        if (error) throw error

        if (data) {
          setConfig(data)
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [supabase])

  interface DayHours {
    start: string;
    end: string;
    lunchStart?: string;
    lunchEnd?: string;
  }

  const isBusinessOpen = (date: Date) => {
    // Horário de funcionamento fixo
    const hours: Record<string, DayHours> = {
      monday: { start: '09:00', end: '13:00' },
      tuesday: { start: '09:00', end: '18:00', lunchStart: '13:00', lunchEnd: '15:00' },
      wednesday: { start: '09:00', end: '13:00' },
      thursday: { start: '09:00', end: '18:00', lunchStart: '13:00', lunchEnd: '15:00' },
      friday: { start: '09:00', end: '13:00' },
      saturday: { start: '09:30', end: '17:00' },
      sunday: { start: '', end: '' }
    }

    const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const dayHours = hours[weekDay as keyof typeof hours]
    
    if (!dayHours.start || !dayHours.end) return false

    const now = date.getHours() * 60 + date.getMinutes()
    const [startHour, startMinute] = dayHours.start.split(':').map(Number)
    const [endHour, endMinute] = dayHours.end.split(':').map(Number)
    const start = startHour * 60 + startMinute
    const end = endHour * 60 + endMinute

    // Se tem horário de almoço, verifica se está no intervalo
    if (dayHours.lunchStart && dayHours.lunchEnd) {
      const [lunchStartHour, lunchStartMinute] = dayHours.lunchStart.split(':').map(Number)
      const [lunchEndHour, lunchEndMinute] = dayHours.lunchEnd.split(':').map(Number)
      const lunchStart = lunchStartHour * 60 + lunchStartMinute
      const lunchEnd = lunchEndHour * 60 + lunchEndMinute

      return (now >= start && now < lunchStart) || (now >= lunchEnd && now < end)
    }

    return now >= start && now < end
  }

  const getBusinessHours = (dayOfWeek: string) => {
    // Horário de funcionamento fixo
    const hours: Record<string, DayHours> = {
      monday: { start: '09:00', end: '13:00' },
      tuesday: { start: '09:00', end: '18:00', lunchStart: '13:00', lunchEnd: '15:00' },
      wednesday: { start: '09:00', end: '13:00' },
      thursday: { start: '09:00', end: '18:00', lunchStart: '13:00', lunchEnd: '15:00' },
      friday: { start: '09:00', end: '13:00' },
      saturday: { start: '09:30', end: '17:00' },
      sunday: { start: '', end: '' }
    }

    const dayHours = hours[dayOfWeek as keyof typeof hours]
    if (!dayHours.start || !dayHours.end) return 'Fechado'

    let schedule = `${dayHours.start} às ${dayHours.end}`
    if (dayHours.lunchStart && dayHours.lunchEnd) {
      schedule += ` (Almoço: ${dayHours.lunchStart} às ${dayHours.lunchEnd})`
    }
    return schedule
  }

  return {
    config,
    isLoading,
    isBusinessOpen,
    getBusinessHours
  }
} 