import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id }      = await params
    const { status }  = await req.json()
    const booking = await prisma.booking.update({
      where: { id },
      data:  { status },
    })
    return NextResponse.json(booking)
  } catch (error) {
    console.error('[bookings PATCH] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
