import { useState, useEffect } from 'react'
import { businessConfig, weekDays } from '@/config/businessConfig'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useBusinessConfig() {
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
  }, [])

  const saveConfig = async (newConfig: typeof businessConfig) => {
    try {
      const { error } = await supabase
        .from('business_config')
        .upsert(newConfig)

      if (error) throw error

      setConfig(newConfig)
      return { success: true }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      return { success: false, error }
    }
  }

  const isBusinessOpen = (date: Date) => {
    const weekDay = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const dayOfWeek = weekDay as keyof typeof weekDays
    const hours = config.businessHours[dayOfWeek]
    
    if (!hours.start || !hours.end) return false

    const now = date.getHours() * 60 + date.getMinutes()
    const [startHour, startMinute] = hours.start.split(':').map(Number)
    const [endHour, endMinute] = hours.end.split(':').map(Number)
    const start = startHour * 60 + startMinute
    const end = endHour * 60 + endMinute

    // Se tem horário de almoço, verifica se está no intervalo
    if (hours.lunchStart && hours.lunchEnd) {
      const [lunchStartHour, lunchStartMinute] = hours.lunchStart.split(':').map(Number)
      const [lunchEndHour, lunchEndMinute] = hours.lunchEnd.split(':').map(Number)
      const lunchStart = lunchStartHour * 60 + lunchStartMinute
      const lunchEnd = lunchEndHour * 60 + lunchEndMinute

      return (now >= start && now < lunchStart) || (now >= lunchEnd && now < end)
    }

    return now >= start && now < end
  }

  const getBusinessHours = (dayOfWeek: keyof typeof weekDays) => {
    const hours = config.businessHours[dayOfWeek]
    if (!hours.start || !hours.end) return 'Fechado'

    let schedule = `${hours.start} às ${hours.end}`
    if (hours.lunchStart && hours.lunchEnd) {
      schedule += ` (Almoço: ${hours.lunchStart} às ${hours.lunchEnd})`
    }
    return schedule
  }

  const formatWeekDay = (day: keyof typeof weekDays) => {
    return weekDays[day]
  }

  return {
    config,
    isLoading,
    saveConfig,
    isBusinessOpen,
    getBusinessHours,
    formatWeekDay
  }
} 