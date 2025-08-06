import React from 'react';

interface BookingConfirmationProps {
  name: string;
  service: string;
  date: string;
  time: string;
}

export function BookingConfirmation({ name, service, date, time }: BookingConfirmationProps) {
  return (
    <div style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f5f5' }}>
        <tbody>
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <tbody>
                  {/* Header */}
                  <tr>
                    <td align="center" style={{ padding: '40px 20px', borderRadius: '8px 8px 0 0', backgroundColor: '#FFC0CB' }}>
                      <h1 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>Wir haben Ihre Anfrage erhalten!</h1>
                    </td>
                  </tr>

                  {/* Content */}
                  <tr>
                    <td style={{ padding: '30px 20px' }}>
                      <p style={{ fontSize: '18px', color: '#333333', margin: '0 0 20px 0' }}>Hallo {name},</p>
                      
                      <p style={{ fontSize: '16px', color: '#333333', lineHeight: 1.5, marginBottom: '25px' }}>
                        Vielen Dank für Ihr Interesse! Wir haben Ihre Terminanfrage erhalten und werden uns in Kürze mit Ihnen in Verbindung setzen, um die Details zu bestätigen.
                      </p>

                      {/* Appointment Details */}
                      <table width="100%" cellPadding="0" cellSpacing="0" style={{ border: '1px solid #eee', borderRadius: '8px', marginBottom: '25px' }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: '15px', backgroundColor: '#f8f9fa' }}>
                              <table width="100%" cellPadding="0" cellSpacing="0">
                                <tbody>
                                  <tr>
                                    <td style={{ padding: '8px 0' }}><strong style={{ color: '#333' }}>Dienstleistung:</strong> {service}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '8px 0' }}><strong style={{ color: '#333' }}>Datum:</strong> {date}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '8px 0' }}><strong style={{ color: '#333' }}>Uhrzeit:</strong> {time}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ padding: '12px 0', borderTop: '1px solid #eee' }}>
                                      <strong style={{ color: '#333' }}>Adresse:</strong><br/>
                                      <a 
                                        href="https://maps.app.goo.gl/amTiE5dBr3j7pDt36"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#FFC0CB', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
                                      >
                                        📍 Bei der Grodener Kirche 7<br/>
                                        <span style={{ paddingLeft: '20px' }}>27472 Cuxhaven, Alemanha</span>
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Contact Options */}
                      <table width="100%" cellPadding="0" cellSpacing="0" style={{ margin: '30px 0' }}>
                        <tbody>
                          <tr>
                            <td align="center">
                              <a 
                                href="mailto:bs.aestheticnails@gmail.com"
                                style={{
                                  display: 'inline-block',
                                  padding: '12px 24px',
                                  backgroundColor: '#FFC0CB',
                                  color: '#ffffff',
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontWeight: 'bold',
                                  marginBottom: '10px'
                                }}
                              >
                                ✉️ Per E-Mail kontaktieren
                              </a>
                              <br />
                              <a 
                                href="https://wa.me/4915208007814"
                                style={{
                                  display: 'inline-block',
                                  padding: '12px 24px',
                                  border: '2px solid #FFC0CB',
                                  color: '#FFC0CB',
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  fontWeight: 'bold'
                                }}
                              >
                                💬 Per WhatsApp schreiben
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <p style={{ color: '#666666', fontSize: '14px', textAlign: 'center' }}>
                        Wenn Sie Änderungen vornehmen möchten, kontaktieren Sie uns bitte.
                      </p>
                    </td>
                  </tr>

                  {/* Footer */}
                  <tr>
                    <td style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center', borderTop: '1px solid #eee', borderRadius: '0 0 8px 8px' }}>
                      <p style={{ margin: 0, color: '#666666', fontSize: '14px' }}>
                        BS Estética & Unhas<br />
                        Vielen Dank für Ihr Vertrauen 💖
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}