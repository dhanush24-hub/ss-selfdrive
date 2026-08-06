import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculatePrice } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customerName, phone, email, startDate, endDate, notes } = body

    if (!customerName || !phone || !email || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end   = new Date(endDate)
    start.setUTCHours(0, 0, 0, 0)
    end.setUTCHours(0, 0, 0, 0)

    // Server-side conflict guard
    const blockedInRange = await prisma.blockedDate.findFirst({
      where: { date: { gte: start, lt: end } },
    })
    if (blockedInRange) {
      return NextResponse.json(
        { error: 'Car is blocked on those dates.' },
        { status: 409 }
      )
    }

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
      return NextResponse.json(
        { error: 'Car is already booked for those dates.' },
        { status: 409 }
      )
    }

    // Check first ride
    const existing = await prisma.booking.findFirst({
      where: { phone, status: { not: 'CANCELLED' } },
    })
    const isFirstRide = !existing

    const pricing = calculatePrice(start, end, isFirstRide)

    const booking = await prisma.booking.create({
      data: {
        customerName,
        phone,
        email,
        startDate:       start,
        endDate:         end,
        totalDays:       pricing.totalDays,
        basePricePerDay: 999,
        discountAmount:  pricing.discountAmount,
        discountReason:  pricing.discountReason,
        finalAmount:     pricing.finalAmount,
        isFirstRide,
        notes:           notes || null,
        status:          'PENDING',
      },
    })

    return NextResponse.json({
      success:   true,
      bookingId: booking.id,
      pricing,
    })

  } catch (error) {
    console.error('[bookings/create] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    )
  }
}
