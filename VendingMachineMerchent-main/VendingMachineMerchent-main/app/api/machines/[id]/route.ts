import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            wallet_address: true
          }
        }
      }
    })

    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 })
    }

    return NextResponse.json({ machine })
  } catch (error) {
    console.error('Machine fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch machine' }, { status: 500 })
  }
}