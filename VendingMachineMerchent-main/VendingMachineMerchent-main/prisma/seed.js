const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            id: 'owner-1',
            email: 'test@example.com',
            private_key: 'dummy_pk',
            wallet_address: 'G_DUMMY_WALLET',
        },
    })
    console.log('Upserted User:', user)

    const machine = await prisma.machine.upsert({
        where: { api_key: 'demo-key' },
        update: {},
        create: {
            id: 'machine-123',
            api_key: 'demo-key',
            owner_id: 'owner-1',
            machine_contract_address: 'C_DUMMY_CONTRACT',
            price: 0.5
        },
    })
    console.log('Upserted Machine:', machine)

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
