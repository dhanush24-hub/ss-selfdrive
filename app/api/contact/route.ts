import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, preferredDate, message } = await req.json()

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    await prisma.contactSubmission.create({
      data: {
        name,
        phone,
        email,
        message,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact POST] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to submit. Please try again.' },
      { status: 500 }
    )
  }
}

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
    const contacts = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('[contact GET] ERROR:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}
