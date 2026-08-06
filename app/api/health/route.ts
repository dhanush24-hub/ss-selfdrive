import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [bookings, contacts, blocked] = await Promise.all([
      prisma.booking.count(),
      prisma.contactSubmission.count(),
      prisma.blockedDate.count(),
    ])
    return NextResponse.json({
      status:    'connected',
      database:  'Supabase PostgreSQL',
      project:   'vsemabenavaoodhinwfo',
      tables: { bookings, contacts, blockedDates: blocked },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({
      status:  'error',
      message: String(error),
    }, { status: 500 })
  }
}
