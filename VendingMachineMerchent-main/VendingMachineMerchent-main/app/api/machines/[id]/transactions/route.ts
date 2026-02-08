import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: 'Machine ID is required' }, { status: 400 });
    }

    try {
        // Fetch payments for this machine (device_id matches machine id)
        const transactions = await prisma.vend402Payment.findMany({
            where: {
                device_id: id
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 50 // Limit to last 50 transactions for now
        });

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}
