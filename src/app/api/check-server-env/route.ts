import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
    EMAILJS_USER_TEMPLATE_ID: process.env.EMAILJS_USER_TEMPLATE_ID,
    EMAILJS_ADMIN_TEMPLATE_ID: process.env.EMAILJS_ADMIN_TEMPLATE_ID,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  });
} 