import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const auth   = req.headers.get('authorization')

  const validSecret = secret === process.env.ADMIN_PASSWORD
  const validToken  = auth?.startsWith('Bearer ') &&
    (() => {
      try {
        const decoded = Buffer.from(auth.slice(7), 'base64').toString()
        return decoded.includes(process.env.ADMIN_SESSION_SECRET || '')
      } catch { return false }
    })()

  if (!validSecret && !validToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('[bookings GET] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
