import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const address = searchParams.get('address')
    
    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    const response = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${address}`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
    }

    const data = await response.json()
    const balanceInAlgos = data.amount / 1000000 // Convert microAlgos to Algos
    
    return NextResponse.json({ 
      address: data.address,
      balance: balanceInAlgos,
      microAlgos: data.amount 
    })
  } catch (error) {
    console.error('Balance fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
  }
}