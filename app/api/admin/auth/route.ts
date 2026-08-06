import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUser   = process.env.ADMIN_USERNAME
    const validPass   = process.env.ADMIN_PASSWORD
    const secret      = process.env.ADMIN_SESSION_SECRET

    if (!validUser || !validPass || !secret) {
      console.error('[admin/auth] Missing env vars')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (username !== validUser || password !== validPass) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = Buffer.from(
      `${username}:${Date.now()}:${secret}`
    ).toString('base64')

    return NextResponse.json({ success: true, token })

  } catch (error) {
    console.error('[admin/auth] ERROR:', error)
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    )
  }
}
