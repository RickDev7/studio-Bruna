import {
  Html,
  Text,
  Container,
  Heading,
  Section,
} from '@react-email/components';
import * as React from 'react';

interface AdminNotificationProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
}

export default function AdminNotification({
  clientName,
  clientEmail,
  clientPhone,
  service,
  date,
  time,
  message,
}: AdminNotificationProps) {
  return (
    <Html>
      <Container
        style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#fdf2f8',
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
            color: '#ec4899',
            textAlign: 'center' as const,
          }}>
            📬 Nova Solicitação de Agendamento
          </Heading>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px' }}>
            <tbody>
              <tr>
                <td style={labelStyle}>👤 Cliente:</td>
                <td style={valueStyle}>{clientName}</td>
              </tr>
              <tr>
                <td style={labelStyle}>📧 Email:</td>
                <td style={valueStyle}>
                  <a href={`mailto:${clientEmail}`} style={linkStyle}>
                    {clientEmail}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={labelStyle}>📱 WhatsApp:</td>
                <td style={valueStyle}>
                  <a href={`https://wa.me/${clientPhone.replace(/\D/g, '')}`} style={linkStyle}>
                    {clientPhone}
                  </a>
                </td>
              </tr>
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
              {message && (
                <tr>
                  <td style={labelStyle}>📝 Mensagem:</td>
                  <td style={valueStyle}>{message}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{
            padding: '15px',
            backgroundColor: '#fdf2f8',
            borderLeft: '4px solid #ec4899',
            marginBottom: '25px',
          }}>
            <Text style={{ margin: '0', color: '#333' }}>
              Por favor, entre em contato com o cliente para confirmar o agendamento.
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
              Ações rápidas:
              <br />
              <a href={`mailto:${clientEmail}`} style={actionLinkStyle}>
                ✉️ Responder por Email
              </a>
              {' • '}
              <a href={`https://wa.me/${clientPhone.replace(/\D/g, '')}`} style={actionLinkStyle}>
                💬 Enviar WhatsApp
              </a>
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

const linkStyle = {
  color: '#ec4899',
  textDecoration: 'none',
};

const actionLinkStyle = {
  color: '#ec4899',
  textDecoration: 'none',
  fontWeight: 600,
}; 