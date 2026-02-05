import { NextRequest, NextResponse } from 'next/server'
import { createMachine, getUserMachines } from '@/lib/machine-service'

export async function POST(request: NextRequest) {
  try {
    const { ownerId, price } = await request.json()
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
    }

    const machine = await createMachine(ownerId, price || 0.0)
    return NextResponse.json({ machine })
  } catch (error) {
    console.error('Machine creation error:', error)
    return NextResponse.json({ error: 'Failed to create machine' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get('ownerId')
    
    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID required' }, { status: 400 })
    }

    const machines = await getUserMachines(ownerId)
    return NextResponse.json({ machines, count: machines.length })
  } catch (error) {
    console.error('Fetch machines error:', error)
    return NextResponse.json({ error: 'Failed to fetch machines' }, { status: 500 })
  }
}