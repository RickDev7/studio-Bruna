import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { generateTimeSlots, isWithinBusinessHours, holidays } from '@/config/businessHours';
import type { DayConfig } from '@/config/businessHours';
import { toast } from 'sonner';

interface UseAvailableSlotsProps {
  selectedDate: Date;
  dayConfig: DayConfig;
}

export function useAvailableSlots({ selectedDate, dayConfig }: UseAvailableSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchBookedSlots() {
      if (!selectedDate || !dayConfig) {
        console.error('Data ou configuração do dia não fornecida');
        setError('Dados inválidos');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Verificar se é feriado
        const dateString = selectedDate.toISOString().split('T')[0];
        console.log('Verificando data:', dateString);

        if (holidays.includes(dateString)) {
          console.log('É feriado');
          if (isMounted) {
            setAvailableSlots([]);
            setIsLoading(false);
          }
          return;
        }

        // Se o estabelecimento estiver fechado neste dia
        if (!dayConfig.isOpen) {
          console.log('Estabelecimento fechado');
          if (isMounted) {
            setAvailableSlots([]);
            setIsLoading(false);
          }
          return;
        }

        console.log('Buscando agendamentos para:', dateString);
        console.log('Períodos de funcionamento:', dayConfig.periods);

        // Busca os agendamentos confirmados para a data selecionada
        const { data: bookedSlots, error: supabaseError } = await supabase
          .from('appointments')
          .select('time')
          .eq('date', dateString)
          .in('status', ['confirmed', 'rescheduled']);

        if (supabaseError) {
          console.error('Erro Supabase:', supabaseError);
          throw new Error('Erro ao buscar agendamentos');
        }

        // Gera todos os horários possíveis para o dia
        const allTimeSlots = generateTimeSlots(dayConfig);
        if (!allTimeSlots.length) {
          console.error('Nenhum horário gerado para o dia');
          throw new Error('Erro ao gerar horários disponíveis');
        }
        console.log('Todos os horários gerados:', allTimeSlots);

        // Remove os horários já agendados
        const bookedTimes = bookedSlots?.map(slot => slot.time) || [];
        console.log('Horários ocupados:', bookedTimes);

        let availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));
        console.log('Horários disponíveis após remover agendados:', availableTimes);

        // Se for hoje, filtra horários que já passaram
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        if (selectedDay.getTime() === today.getTime()) {
          console.log('Filtrando horários passados para hoje');
          const currentHour = now.getHours();
          const currentMinutes = now.getMinutes();

          // Adiciona 30 minutos de margem para agendamentos
          const marginMinutes = currentMinutes + 30;
          const marginHour = currentHour + Math.floor(marginMinutes / 60);
          const adjustedMinutes = marginMinutes % 60;

          availableTimes = availableTimes.filter(time => {
            const [hours, minutes] = time.split(':').map(Number);
            const isAvailable = hours > marginHour || (hours === marginHour && minutes > adjustedMinutes);
            console.log(`Verificando horário ${time}: ${isAvailable ? 'disponível' : 'indisponível'}`);
            return isAvailable;
          });
        }

        // Verifica se cada horário está dentro do período de funcionamento
        availableTimes = availableTimes.filter(time => {
          const isWithin = isWithinBusinessHours(time, dayConfig);
          console.log(`Verificando horário de funcionamento ${time}: ${isWithin ? 'dentro' : 'fora'}`);
          return isWithin;
        });

        console.log('Horários finais disponíveis:', availableTimes);

        if (isMounted) {
          if (availableTimes.length === 0) {
            setError('Não há horários disponíveis para esta data');
          } else {
            setAvailableSlots(availableTimes);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Erro detalhado:', err);
        if (isMounted) {
          setError('Não foi possível carregar os horários disponíveis');
          setAvailableSlots([]);
          toast.error('Erro ao carregar horários. Por favor, tente novamente.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchBookedSlots();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, dayConfig]);

  return {
    availableSlots,
    isLoading,
    error
  };
} 