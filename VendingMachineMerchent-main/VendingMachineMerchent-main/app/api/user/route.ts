import { NextRequest, NextResponse } from 'next/server'
import { createOrGetUser, getUserByEmail } from '@/lib/user-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ user: null })
    }

    const { private_key, ...safeUser } = user
    return NextResponse.json({
      user: {
        ...safeUser,
        is_custodial: !!private_key
      }
    })
  } catch (error) {
    console.error('User fetch error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: 'Failed to fetch user', details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user: supabaseUser } = await request.json()

    if (!supabaseUser) {
      return NextResponse.json({ error: 'User data required' }, { status: 400 })
    }

    const user = await createOrGetUser(supabaseUser)
    const { private_key, ...safeUser } = user
    return NextResponse.json({
      user: {
        ...safeUser,
        is_custodial: !!private_key
      }
    })
  } catch (error) {
    console.error('User creation error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: 'Failed to create user', details: String(error) }, { status: 500 })
  }
}