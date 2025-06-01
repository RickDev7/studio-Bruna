import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    RESEND_API_KEY_EXISTS: !!process.env.RESEND_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    message: 'Verificação de variáveis de ambiente',
    environment: envVars,
  });
} 