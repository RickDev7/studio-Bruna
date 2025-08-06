import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'não definida',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'definida' : 'não definida',
    NODE_ENV: process.env.NODE_ENV,
    PWD: process.cwd(),
    ENV_FILES: process.env.ENV_FILES || 'não definido'
  };

  return NextResponse.json(envVars);
} 