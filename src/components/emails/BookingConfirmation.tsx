import {
  Html,
  Text,
  Container,
  Heading,
  Section,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface BookingConfirmationProps {
  userName: string;
  service: string;
  date: string;
  time: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export default function BookingConfirmation({
  userName,
  service,
  date,
  time,
  status = 'pending',
}: BookingConfirmationProps) {
  const statusMessages = {
    pending: {
      title: '🕒 Solicitação de Agendamento Recebida',
      message: 'Em breve entraremos em contato para confirmar seu agendamento.',
      color: '#f59e0b',
    },
    confirmed: {
      title: '✅ Agendamento Confirmado',
      message: 'Seu horário está confirmado! Aguardamos você.',
      color: '#10b981',
    },
    cancelled: {
      title: '❌ Agendamento Cancelado',
      message: 'Seu agendamento foi cancelado. Entre em contato caso deseje reagendar.',
      color: '#ef4444',
    },
  };

  return (
    <Html>
      <Container
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fdf2f8', // Rosa claro
          padding: '40px 0',
        }}
      >
        <Section style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}>
          <Heading style={{ 
            fontSize: '24px', 
            marginBottom: '20px',
            color: statusMessages[status].color,
            textAlign: 'center' as const,
          }}>
            {statusMessages[status].title}
          </Heading>

          <Text style={{ fontSize: '16px', marginBottom: '25px' }}>
            Olá {userName},
          </Text>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
            <tbody>
              <tr>
                <td style={labelStyle}>💅 Serviço:</td>
                <td style={valueStyle}>{service}</td>
              </tr>
              <tr>
                <td style={labelStyle}>📅 Data:</td>
                <td style={valueStyle}>{date}</td>
              </tr>
              <tr>
                <td style={labelStyle}>⏰ Horário:</td>
                <td style={valueStyle}>{time}</td>
              </tr>
            </tbody>
          </table>

          <div style={{
            padding: '15px',
            backgroundColor: '#fdf2f8',
            borderLeft: '4px solid #ec4899',
            marginBottom: '25px',
          }}>
            <Text style={{ margin: '0', color: '#333' }}>
              {statusMessages[status].message}
            </Text>
          </div>

          <Section style={{
            backgroundColor: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '30px',
          }}>
            <Text style={{ 
              fontSize: '14px', 
              color: '#666',
              textAlign: 'center' as const,
              margin: '0',
            }}>
              BS Aesthetic & Nails
              <br />
              Bei der Grodener Kirche 7
              <br />
              📞 +49 1520 8007814
              <br />
              📷 @bs.aesthetic.nails
            </Text>
          </Section>
        </Section>
      </Container>
    </Html>
  );
}

const labelStyle = {
  padding: '12px 15px',
  fontWeight: 600,
  backgroundColor: '#fdf2f8',
  width: '35%',
  verticalAlign: 'top' as const,
  borderBottom: '1px solid #f3f4f6',
};

const valueStyle = {
  padding: '12px 15px',
  backgroundColor: '#fff',
  color: '#333',
  borderBottom: '1px solid #f3f4f6',
}; 