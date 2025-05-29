import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    console.log('Received webhook body:', body)
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 