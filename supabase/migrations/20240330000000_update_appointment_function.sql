-- Drop existing function if exists
drop function if exists create_appointment;

-- Create a function to insert appointments
create or replace function create_appointment(
  p_service text,
  p_date date,
  p_time time without time zone,
  p_user_id uuid,
  p_status text,
  p_notes text,
  p_profile_id uuid
) returns json language plpgsql security definer as $$
declare
  v_id uuid;
  v_scheduled_at timestamp;
begin
  -- Validate required fields
  if p_service is null or p_date is null or p_time is null or p_user_id is null or p_profile_id is null then
    return json_build_object(
      'success', false,
      'message', 'Todos os campos obrigatórios devem ser preenchidos'
    );
  end if;

  -- Combine date and time into scheduled_at
  v_scheduled_at := p_date + p_time;

  -- Insert the appointment
  insert into appointments (
    service,
    date,
    time,
    scheduled_at,
    user_id,
    profile_id,
    status,
    notes
  ) values (
    p_service,
    p_date,
    p_time,
    v_scheduled_at,
    p_user_id,
    p_profile_id,
    coalesce(p_status, 'confirmed'),
    p_notes
  )
  returning id into v_id;
  
  return json_build_object(
    'success', true,
    'message', 'Agendamento criado com sucesso',
    'appointment_id', v_id
  );
exception
  when others then
    return json_build_object(
      'success', false,
      'message', SQLERRM
    );
end;
$$;

-- Garantir que a coluna scheduled_at existe e está correta
DO $$ 
BEGIN 
  -- Atualizar scheduled_at para registros existentes
  UPDATE appointments 
  SET scheduled_at = date + time::time
  WHERE scheduled_at IS NULL;

  -- Tornar a coluna NOT NULL após a atualização
  ALTER TABLE appointments
  ALTER COLUMN scheduled_at SET NOT NULL;

  -- Atualizar profile_id para registros existentes
  UPDATE appointments 
  SET profile_id = user_id
  WHERE profile_id IS NULL;

  -- Garantir que profile_id é NOT NULL
  ALTER TABLE appointments
  ALTER COLUMN profile_id SET NOT NULL;
END $$; 