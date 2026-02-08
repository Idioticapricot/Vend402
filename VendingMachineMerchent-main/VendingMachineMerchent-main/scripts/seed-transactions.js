
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedTransactions() {
    const machineId = process.argv[2];
    if (!machineId) {
        console.error("Please provide a machine ID");
        process.exit(1);
    }

    console.log(`Seeding transactions for machine: ${machineId}`);

    // Create 10 dummy transactions over the last 7 days
    const now = new Date();
    const transactions = [];

    for (let i = 0; i < 10; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i % 7)); // Spread over last week

        transactions.push({
            challenge_id: `mock-challenge-${i}`,
            device_id: machineId,
            amount: "10.0",
            asset: "XLM",
            tx_hash: `mock-tx-hash-${Date.now()}-${i}`,
            status: i % 5 === 0 ? "failed" : "success", // Mostly success, some failed
            created_at: date,
        });
    }

    for (const tx of transactions) {
        await prisma.vend402Payment.create({
            data: tx
        });
    }

    console.log("Seeding complete!");
}

seedTransactions()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
