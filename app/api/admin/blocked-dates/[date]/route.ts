import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function isAuthorized(req: NextRequest): boolean {
  const secret = req.headers.get('x-admin-secret')
  const auth   = req.headers.get('authorization')
  if (secret === process.env.ADMIN_PASSWORD) return true
  if (auth?.startsWith('Bearer ')) {
    try {
      const decoded = Buffer.from(auth.slice(7), 'base64').toString()
      return decoded.includes(process.env.ADMIN_SESSION_SECRET || '')
    } catch { return false }
  }
  return false
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { date } = await params
    const dateStr    = decodeURIComponent(date)
    const parsedDate = new Date(dateStr)
    parsedDate.setUTCHours(0, 0, 0, 0)

    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    await prisma.blockedDate.deleteMany({
      where: { date: parsedDate },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[blocked-dates DELETE] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to unblock date' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reason }  = await req.json()
    const { date }    = await params
    const dateStr     = decodeURIComponent(date)
    const parsedDate  = new Date(dateStr)
    parsedDate.setUTCHours(0, 0, 0, 0)

    const updated = await prisma.blockedDate.update({
      where: { date: parsedDate },
      data:  { reason: reason || null },
    })

    return NextResponse.json({ success: true, updated })
  } catch (error) {
    console.error('[blocked-dates PATCH] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to update reason' },
      { status: 500 }
    )
  }
}
