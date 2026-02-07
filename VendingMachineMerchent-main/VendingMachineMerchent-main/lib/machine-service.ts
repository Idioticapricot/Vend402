import { prisma } from './prisma'
import { randomBytes } from 'crypto'

export function generateApiKey(): string {
  return 'vm_' + randomBytes(32).toString('hex')
}



export async function createMachine(ownerId: string, price: number = 0.0) {
  const apiKey = generateApiKey()

  // Get user's private key from database
  const user = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { private_key: true, wallet_address: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // For Stellar Vend402, we don't deploy a smart contract per machine.
  // We use the merchant's wallet address + a MEMO to identify the machine.

  return await prisma.machine.create({
    data: {
      api_key: apiKey,
      owner_id: ownerId,
      machine_contract_address: user.wallet_address, // Store owner's wallet as payment destination
      price: price
    }
  })
}

export async function getUserMachines(ownerId: string) {
  return await prisma.machine.findMany({
    where: { owner_id: ownerId },
    orderBy: { created_at: 'desc' }
  })
}