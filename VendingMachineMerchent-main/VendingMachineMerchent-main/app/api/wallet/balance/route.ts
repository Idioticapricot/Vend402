import { NextRequest, NextResponse } from 'next/server'
import { Horizon } from '@stellar/stellar-sdk'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const server = new Horizon.Server(HORIZON_URL)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    try {
      const account = await server.loadAccount(address)
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native')

      return NextResponse.json({
        balance: nativeBalance ? parseFloat(nativeBalance.balance) : 0
      })
    } catch (e: any) {
      if (e.response && e.response.status === 404) {
        // Account valid but inactive (0 balance)
        return NextResponse.json({ balance: 0 })
      }
      throw e
    }

  } catch (error) {
    console.error('Balance fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
  }
}