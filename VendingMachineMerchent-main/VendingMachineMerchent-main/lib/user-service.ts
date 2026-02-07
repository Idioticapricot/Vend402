import { prisma } from './prisma'
import { Keypair } from '@stellar/stellar-sdk'
// import { generateStellarAccount } from './stellar'
import type { User } from '@supabase/supabase-js'

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function createOrGetUser(supabaseUser: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: supabaseUser.email! }
    })

    if (existingUser) {
      return existingUser
    }

    // Generate Stellar account
    const pair = Keypair.random()
    const privateKey = pair.secret() // 'S...'
    const address = pair.publicKey() // 'G...'

    return await prisma.user.create({
      data: {
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || null,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        private_key: privateKey,
        wallet_address: address
      }
    })
  } catch (error: any) {
    console.error('Error inside createOrGetUser:', error);
    // Handle prepared statement conflicts or unique constraint violations
    if (error.code === '42P05' || error.code === 'P2002') {
      console.log('Handling race condition/constraint violation...');
      // Try to find existing user again
      const existingUser = await prisma.user.findUnique({
        where: { email: supabaseUser.email! }
      })
      if (existingUser) {
        return existingUser
      }
    }
    throw error
  }
}