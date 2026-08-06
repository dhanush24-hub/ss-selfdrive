import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { startDate, endDate } = body

    if (!startDate || !endDate) {
      return NextResponse.json(
        { available: false, message: 'Start and end dates are required' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end   = new Date(endDate)
    start.setUTCHours(0, 0, 0, 0)
    end.setUTCHours(0, 0, 0, 0)

    // Check blocked dates
    const blockedInRange = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: start,
          lt:  end,
        },
      },
    })

    if (blockedInRange) {
      const d = new Date(blockedInRange.date)
      return NextResponse.json({
        available: false,
        message: `Car is not available on ${d.toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric'
        })}. Please choose different dates.`,
      }, { status: 409 })
    }

    // Check booking overlap
    const conflict = await prisma.booking.findFirst({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate:   { gt: start } },
        ],
      },
    })

    if (conflict) {
      return NextResponse.json({
        available: false,
        message: 'Car is already booked for those dates. Please choose different dates.',
      }, { status: 409 })
    }

    return NextResponse.json({ available: true })

  } catch (error) {
    console.error('[check-availability] ERROR:', error)
    return NextResponse.json(
      { available: false, message: 'Database connection error. Please try again.' },
      { status: 500 }
    )
  }
}
