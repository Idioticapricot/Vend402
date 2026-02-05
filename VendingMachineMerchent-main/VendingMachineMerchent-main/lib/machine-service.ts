import { prisma } from './prisma'
import { randomBytes } from 'crypto'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { MachineContractFactory } from '../client/client'
import algosdk, { getApplicationAddress, OnApplicationComplete } from 'algosdk'
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'

export function generateApiKey(): string {
  return 'vm_' + randomBytes(32).toString('hex')
}

export async function deploySmartContract(privateKey: string, ownerAddress: string, price: number) {
  const algorand = AlgorandClient.testNet()
  const secretKey = Buffer.from(privateKey, 'base64')
  const mnemonics  = algosdk.secretKeyToMnemonic(secretKey)
  const deployer  = algosdk.mnemonicToSecretKey(mnemonics)

  const signer = algosdk.makeBasicAccountTransactionSigner(deployer)

  const appFactory = new MachineContractFactory({
    defaultSender: deployer.addr,
    defaultSigner: signer,
    algorand,
  })
  
  const { appClient } = await appFactory.send.create.createApplication({
    args: {
      ownerAddress: deployer.addr.toString(),
      fixedPricing: AlgoAmount.Algos(price).microAlgo,
    },
    sender: deployer.addr,
    signer: signer,
    onComplete: OnApplicationComplete.NoOpOC,
  })

  return appClient.appId.toString()
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

  // Deploy smart contract
  const contractAddress = await deploySmartContract(
    user.private_key, 
    user.wallet_address, 
    price
  )

  return await prisma.machine.create({
    data: {
      api_key: apiKey,
      owner_id: ownerId,
      machine_contract_address: contractAddress,
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