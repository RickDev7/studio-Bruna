import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
    EMAIL_USER: process.env.EMAIL_USER ? '✅' : '❌',
    EMAIL_PASS: process.env.EMAIL_PASS ? '✅' : '❌',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅' : '❌',
  };

  return NextResponse.json(envVars);
} 