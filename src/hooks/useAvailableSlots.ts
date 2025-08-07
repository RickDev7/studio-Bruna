import { useState, useEffect } from 'react';
import { generateTimeSlots, isWithinBusinessHours, holidays } from '@/config/businessHours';
import type { DayConfig } from '@/config/businessHours';
import { toast } from 'react-hot-toast';

interface UseAvailableSlotsProps {
  selectedDate: Date;
  dayConfig: DayConfig;
}

interface AppointmentResponse {
  data: Array<{ scheduled_at: string; status: string }>;
  count: number;
  range?: {
    start: string;
    end: string;
  };
  error?: string;
  details?: string;
  message?: string;
  retry?: boolean;
}

export function useAvailableSlots({ selectedDate, dayConfig }: UseAvailableSlotsProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryAttempt = 0;
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1500; // 1.5 segundos

    async function generateAvailableSlots(bookedTimes: string[] = []) {
      if (!isMounted) return;

      try {
        // 1. Gerar todos os horários possíveis
        const allTimeSlots = generateTimeSlots(dayConfig);
        console.log('✨ Horários gerados:', allTimeSlots.length);

        // 2. Remover horários ocupados
        let availableTimes = allTimeSlots.filter(time => !bookedTimes.includes(time));
        console.log('🕒 Horários disponíveis iniciais:', availableTimes.length);

        // 3. Filtrar horários passados se for hoje
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        if (selectedDay.getTime() === today.getTime()) {
          const currentHour = now.getHours();
          const currentMinutes = now.getMinutes();
          const marginMinutes = currentMinutes + 30;
          const marginHour = currentHour + Math.floor(marginMinutes / 60);
          const adjustedMinutes = marginMinutes % 60;

          availableTimes = availableTimes.filter(time => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours > marginHour || (hours === marginHour && minutes > adjustedMinutes);
          });
          console.log('⏰ Horários após filtro de hora atual:', availableTimes.length);
        }

        // 4. Verificar horários dentro do período de funcionamento
        availableTimes = availableTimes.filter(time => isWithinBusinessHours(time, dayConfig));
        console.log('📅 Horários dentro do período de funcionamento:', availableTimes.length);

        // 5. Atualizar estado
        if (availableTimes.length === 0) {
          setError('No time slots available for this date');
        } else {
          setAvailableSlots(availableTimes);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Erro ao gerar horários:', err);
        setError('Error processing available time slots');
        setAvailableSlots([]);
      }
    }

    async function fetchBookedSlots() {
              if (!selectedDate || !dayConfig) {
          console.error('❌ Data ou configuração do dia não fornecida');
          setError('Invalid data');
          setIsLoading(false);
          return;
        }

      try {
        setIsLoading(true);
        setError(null);

        // 1. Verificar se é feriado
        const dateString = selectedDate.toISOString().split('T')[0];
        console.log('📅 Verificando data:', dateString);

        if (holidays.includes(dateString)) {
          console.log('🏖️ É feriado - retornando lista vazia');
          setAvailableSlots([]);
          setIsLoading(false);
          return;
        }

        // 2. Verificar se estabelecimento está aberto
        if (!dayConfig.isOpen) {
          console.log('🔒 Estabelecimento fechado - retornando lista vazia');
          setAvailableSlots([]);
          setIsLoading(false);
          return;
        }

        // 3. Tentar buscar agendamentos
        const startDate = `${dateString}T00:00:00`;
        const endDate = `${dateString}T23:59:59`;
        
        console.log(`🔄 Buscando agendamentos (tentativa ${retryAttempt + 1}/${MAX_RETRIES + 1}):`, 
          { startDate, endDate });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

        try {
          const response = await fetch(
            `/api/appointments?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
            { 
              signal: controller.signal,
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            }
          );

          clearTimeout(timeoutId);
          const responseData: AppointmentResponse = await response.json();

          // 4. Tratar resposta da API
          if (!response.ok) {
            console.warn('⚠️ Resposta não-ok da API:', {
              status: response.status,
              statusText: response.statusText,
              retry: responseData.retry,
              attempt: retryAttempt + 1,
              error: responseData.error,
              details: responseData.details,
              message: responseData.message
            });

            // Se for erro 503 ou retry e ainda temos tentativas
            if ((response.status === 503 || responseData.retry) && retryAttempt < MAX_RETRIES) {
              retryAttempt++;
              const delay = RETRY_DELAY * retryAttempt;
              console.log(`🔄 Aguardando ${delay}ms para tentar novamente...`);
              
              // Notificar o usuário sobre a tentativa
              toast.loading(
                `Trying to connect to server... (${retryAttempt}/${MAX_RETRIES})`,
                { duration: delay }
              );
              
              await new Promise(resolve => setTimeout(resolve, delay));
              await fetchBookedSlots();
              return;
            }

            // Se acabaram as tentativas, usar fallback
            console.log('⚠️ Máximo de tentativas atingido - usando fallback com horários vazios');
            toast.error('Could not load time slots. Showing all available time slots.');
            await generateAvailableSlots([]);
            return;
          }

          // 5. Processar dados recebidos
          const bookedSlots = responseData.data || [];
          console.log(`✅ Agendamentos encontrados: ${bookedSlots.length}`);

          const bookedTimes = bookedSlots.map(slot => {
            const date = new Date(slot.scheduled_at);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          });

          // 6. Gerar horários disponíveis
          await generateAvailableSlots(bookedTimes);

        } catch (fetchError) {
          console.error('❌ Erro na requisição:', fetchError);
          
          if (fetchError instanceof Error) {
            if (fetchError.name === 'AbortError') {
              console.warn('⏱️ Timeout na requisição');
              if (retryAttempt < MAX_RETRIES) {
                retryAttempt++;
                console.log(`🔄 Tentando novamente após timeout (${retryAttempt}/${MAX_RETRIES})`);
                
                // Notificar o usuário sobre a tentativa após timeout
                toast.loading(
                  `Slow connection, trying again... (${retryAttempt}/${MAX_RETRIES})`,
                  { duration: RETRY_DELAY * retryAttempt }
                );
                
                await fetchBookedSlots();
                return;
              }
            }
          }

          // Fallback em caso de erro
          console.log('⚠️ Usando fallback após erro na requisição');
          toast.error('Connection error. Showing all available time slots.');
          await generateAvailableSlots([]);
        }
      } catch (err) {
        console.error('❌ Erro não tratado:', err);
        // Garantir que a UI continue funcional
        toast.error('An error occurred. Showing all available time slots.');
        await generateAvailableSlots([]);
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