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

export async function GET() {
  try {
    const blocked = await prisma.blockedDate.findMany({
      orderBy: { date: 'asc' },
    })
    const dates = blocked.map(b => {
      const d = new Date(b.date)
      d.setUTCHours(0, 0, 0, 0)
      return d.toISOString()
    })
    return NextResponse.json({ dates, records: blocked })
  } catch (error) {
    console.error('[blocked-dates GET] ERROR:', error)
    return NextResponse.json({ dates: [], records: [] })
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { date, reason } = await req.json()

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    parsedDate.setUTCHours(0, 0, 0, 0)

    const blocked = await prisma.blockedDate.upsert({
      where:  { date: parsedDate },
      update: { reason: reason || null },
      create: { date: parsedDate, reason: reason || null },
    })

    return NextResponse.json({ success: true, blocked })

  } catch (error) {
    console.error('[blocked-dates POST] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to block date', details: String(error) },
      { status: 500 }
    )
  }
}
