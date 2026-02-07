import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Keypair } from '@stellar/stellar-sdk'

export async function POST(request: NextRequest) {
    try {
        const { email, walletAddress } = await request.json()

        if (!email || !walletAddress) {
            return NextResponse.json({ error: 'Email and wallet address required' }, { status: 400 })
        }

        // Validate Stellar address
        try {
            Keypair.fromPublicKey(walletAddress)
        } catch (e) {
            return NextResponse.json({ error: 'Invalid Stellar address' }, { status: 400 })
        }

        // Check if wallet is already used by another user
        const existingUser = await prisma.user.findUnique({
            where: { wallet_address: walletAddress }
        })

        if (existingUser && existingUser.email !== email) {
            // "Steal" the wallet: Remove it from the old user
            // Since wallet_address is unique and required, we set it to a temporary unique value
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { wallet_address: `unlinked_${Date.now()}_${Math.floor(Math.random() * 1000)}` }
            })
        }

        // Update current user
        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                wallet_address: walletAddress,
                private_key: "" // Mark as non-custodial
            }
        })

        const { private_key, ...safeUser } = updatedUser
        return NextResponse.json({ user: safeUser })
    } catch (error: any) {
        console.error('Wallet update error:', error)
        return NextResponse.json({
            error: 'Failed to update wallet',
            details: error.message
        }, { status: 500 })
    }
}
