-- Drop existing function if exists
drop function if exists create_appointment;

-- Create a function to insert appointments
create or replace function create_appointment(
  p_service text,
  p_date date,
  p_time time without time zone,
  p_user_id uuid,
  p_status text,
  p_notes text
) returns json language plpgsql security definer as $$
declare
  v_id uuid;
  v_scheduled_at timestamp;
begin
  -- Validate required fields
  if p_service is null or p_date is null or p_time is null or p_user_id is null then
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
    p_user_id,  -- profile_id é igual ao user_id
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